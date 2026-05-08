"""NGO Matching router — intelligent donation-to-NGO matching engine."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import math
from typing import List

from core.database import get_db
from core.dependencies import get_current_user
from models.user import User
from models.donation import Donation
from models.ngo import NGO
from models.delivery import Delivery, DeliveryStatus
from schemas.models import MatchRequest, MatchResult, MatchResponse

router = APIRouter()


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points using Haversine formula (km)."""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def calculate_match_score(
    donation: Donation,
    ngo: NGO,
    distance_km: float,
) -> float:
    """
    Calculate a weighted matching score between a donation and an NGO.

    Weights:
    - Distance (40%): closer = better
    - Capacity match (20%): more available capacity = better
    - Food preference match (15%): matching food preferences
    - Urgency (15%): closer to expiry = higher urgency priority
    - NGO rating (10%): higher rated NGOs preferred
    """
    # Distance score (0-1, closer = better)
    max_distance = ngo.service_radius_km or 15.0
    distance_score = max(0, 1 - (distance_km / max_distance)) if distance_km <= max_distance else 0

    # Capacity score (0-1)
    available_capacity = max(0, ngo.capacity - ngo.current_load)
    capacity_score = min(1.0, available_capacity / max(1, donation.estimated_servings or 10))

    # Food preference match (0 or 1)
    pref_score = 1.0
    if ngo.food_preferences:
        cat_value = donation.category.value if hasattr(donation.category, 'value') else str(donation.category)
        if cat_value not in ngo.food_preferences:
            pref_score = 0.5
    if not ngo.accepts_non_veg and not donation.is_veg:
        pref_score = 0.0

    # Urgency score (0-1, more urgent = higher score)
    from datetime import datetime, timezone
    if donation.expiry_time:
        now = datetime.now(timezone.utc)
        expiry = donation.expiry_time if donation.expiry_time.tzinfo else donation.expiry_time.replace(tzinfo=timezone.utc)
        hours_left = max(0, (expiry - now).total_seconds() / 3600)
        urgency_score = max(0, 1 - (hours_left / 24))  # Urgent if < 24h
    else:
        urgency_score = 0.5

    # Rating score (0-1)
    rating_score = ngo.rating / 5.0 if ngo.rating else 0.5

    # Weighted total
    total = (
        0.40 * distance_score +
        0.20 * capacity_score +
        0.15 * pref_score +
        0.15 * urgency_score +
        0.10 * rating_score
    )

    return round(total, 4)


@router.post("/find-ngo", response_model=MatchResponse)
async def find_matching_ngos(
    request: MatchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Find best matching NGOs for a donation."""
    # Get donation
    result = await db.execute(select(Donation).where(Donation.id == request.donation_id))
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    # Get all active NGOs
    result = await db.execute(select(NGO).where(NGO.is_active == True, NGO.is_verified == True))
    ngos = result.scalars().all()

    # If no verified NGOs, also consider unverified ones
    if not ngos:
        result = await db.execute(select(NGO).where(NGO.is_active == True))
        ngos = result.scalars().all()

    matches: List[MatchResult] = []

    for ngo in ngos:
        distance = haversine_distance(donation.lat, donation.lng, ngo.lat, ngo.lng)

        # Skip if too far
        if distance > (ngo.service_radius_km or 15.0) * 1.5:
            continue

        score = calculate_match_score(donation, ngo, distance)

        if score > 0.1:  # Minimum threshold
            available = max(0, ngo.capacity - ngo.current_load)
            pref_match = True
            if ngo.food_preferences:
                cat_value = donation.category.value if hasattr(donation.category, 'value') else str(donation.category)
                pref_match = cat_value in ngo.food_preferences

            matches.append(MatchResult(
                ngo_id=ngo.id,
                ngo_name=ngo.org_name,
                distance_km=round(distance, 2),
                score=score,
                capacity_available=available,
                food_preference_match=pref_match,
                estimated_time_min=round(distance * 3, 1),  # ~20km/h avg speed
            ))

    # Sort by score descending
    matches.sort(key=lambda m: m.score, reverse=True)

    best_match = matches[0] if matches else None

    return MatchResponse(
        donation_id=donation.id,
        matches=matches[:10],  # Top 10
        best_match=best_match,
    )


@router.post("/auto-match/{donation_id}")
async def auto_match_donation(
    donation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Automatically match a donation to the best NGO and create a delivery."""
    import uuid

    # Get donation
    result = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    # Find best match
    result = await db.execute(select(NGO).where(NGO.is_active == True))
    ngos = result.scalars().all()

    best_ngo = None
    best_score = 0

    for ngo in ngos:
        distance = haversine_distance(donation.lat, donation.lng, ngo.lat, ngo.lng)
        score = calculate_match_score(donation, ngo, distance)
        if score > best_score:
            best_score = score
            best_ngo = ngo

    if not best_ngo:
        raise HTTPException(status_code=404, detail="No suitable NGO found")

    # Create delivery
    distance = haversine_distance(donation.lat, donation.lng, best_ngo.lat, best_ngo.lng)
    delivery = Delivery(
        id=uuid.uuid4(),
        donation_id=donation.id,
        ngo_id=best_ngo.id,
        status=DeliveryStatus.PENDING,
        distance_km=round(distance, 2),
        estimated_time_min=round(distance * 3, 1),
    )
    db.add(delivery)

    # Update donation status
    donation.status = "ngo_matched"
    await db.flush()

    return {
        "message": "Donation matched successfully",
        "ngo_name": best_ngo.org_name,
        "distance_km": round(distance, 2),
        "score": best_score,
        "delivery_id": str(delivery.id),
    }
