"""Volunteers router — volunteer management system."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
import uuid

from core.database import get_db
from core.dependencies import get_current_user, require_roles
from models.user import User
from models.volunteer import Volunteer
from models.delivery import Delivery, DeliveryStatus
from schemas.models import VolunteerCreateRequest, VolunteerResponse

router = APIRouter()


@router.post("/register", response_model=VolunteerResponse, status_code=201)
async def register_volunteer(
    request: VolunteerCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Register as a volunteer."""
    # Check if already registered
    result = await db.execute(select(Volunteer).where(Volunteer.user_id == current_user.id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already registered as volunteer")

    volunteer = Volunteer(
        id=uuid.uuid4(),
        user_id=current_user.id,
        vehicle_type=request.vehicle_type,
        license_plate=request.license_plate,
        current_lat=request.current_lat,
        current_lng=request.current_lng,
        service_radius_km=request.service_radius_km,
        availability=request.availability,
    )
    db.add(volunteer)
    await db.flush()

    return VolunteerResponse(
        id=volunteer.id, user_id=volunteer.user_id,
        vehicle_type=volunteer.vehicle_type, license_plate=volunteer.license_plate,
        current_lat=volunteer.current_lat, current_lng=volunteer.current_lng,
        service_radius_km=volunteer.service_radius_km,
        is_active=volunteer.is_active, is_available=volunteer.is_available,
        total_deliveries=volunteer.total_deliveries,
        total_distance_km=volunteer.total_distance_km,
        points=volunteer.points, rating=volunteer.rating,
        created_at=str(volunteer.created_at) if volunteer.created_at else None,
    )


@router.get("/me", response_model=VolunteerResponse)
async def get_my_volunteer_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get my volunteer profile."""
    result = await db.execute(select(Volunteer).where(Volunteer.user_id == current_user.id))
    volunteer = result.scalar_one_or_none()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Not registered as volunteer")

    return VolunteerResponse(
        id=volunteer.id, user_id=volunteer.user_id,
        vehicle_type=volunteer.vehicle_type, license_plate=volunteer.license_plate,
        current_lat=volunteer.current_lat, current_lng=volunteer.current_lng,
        service_radius_km=volunteer.service_radius_km,
        is_active=volunteer.is_active, is_available=volunteer.is_available,
        total_deliveries=volunteer.total_deliveries,
        total_distance_km=volunteer.total_distance_km,
        points=volunteer.points, rating=volunteer.rating,
        created_at=str(volunteer.created_at) if volunteer.created_at else None,
    )


@router.put("/location")
async def update_location(
    lat: float,
    lng: float,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update volunteer's current location."""
    result = await db.execute(select(Volunteer).where(Volunteer.user_id == current_user.id))
    volunteer = result.scalar_one_or_none()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Not registered as volunteer")

    volunteer.current_lat = lat
    volunteer.current_lng = lng
    volunteer.updated_at = datetime.now(timezone.utc)
    await db.flush()
    return {"message": "Location updated"}


@router.put("/availability")
async def toggle_availability(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Toggle volunteer availability."""
    result = await db.execute(select(Volunteer).where(Volunteer.user_id == current_user.id))
    volunteer = result.scalar_one_or_none()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Not registered as volunteer")

    volunteer.is_available = not volunteer.is_available
    await db.flush()
    return {"is_available": volunteer.is_available}


@router.post("/accept-delivery/{delivery_id}")
async def accept_delivery(
    delivery_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Accept a delivery assignment."""
    result = await db.execute(select(Volunteer).where(Volunteer.user_id == current_user.id))
    volunteer = result.scalar_one_or_none()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Not registered as volunteer")

    result = await db.execute(select(Delivery).where(Delivery.id == delivery_id))
    delivery = result.scalar_one_or_none()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")

    delivery.volunteer_id = volunteer.id
    delivery.status = DeliveryStatus.ACCEPTED
    volunteer.is_available = False
    await db.flush()

    return {"message": "Delivery accepted", "delivery_id": str(delivery.id)}


@router.post("/complete-delivery/{delivery_id}")
async def complete_delivery(
    delivery_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark a delivery as completed."""
    result = await db.execute(select(Volunteer).where(Volunteer.user_id == current_user.id))
    volunteer = result.scalar_one_or_none()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Not registered as volunteer")

    result = await db.execute(
        select(Delivery).where(Delivery.id == delivery_id, Delivery.volunteer_id == volunteer.id)
    )
    delivery = result.scalar_one_or_none()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")

    delivery.status = DeliveryStatus.DELIVERED
    delivery.delivery_time = datetime.now(timezone.utc)
    volunteer.total_deliveries += 1
    volunteer.points += 50  # Reward points
    if delivery.distance_km:
        volunteer.total_distance_km += delivery.distance_km
    volunteer.is_available = True
    await db.flush()

    return {
        "message": "Delivery completed!",
        "points_earned": 50,
        "total_points": volunteer.points,
    }


@router.get("/leaderboard")
async def get_leaderboard(
    db: AsyncSession = Depends(get_db),
):
    """Get volunteer leaderboard."""
    from sqlalchemy import desc
    result = await db.execute(
        select(Volunteer)
        .where(Volunteer.is_active == True)
        .order_by(desc(Volunteer.points))
        .limit(20)
    )
    volunteers = result.scalars().all()

    leaderboard = []
    for i, v in enumerate(volunteers, 1):
        # Get user name
        user_result = await db.execute(select(User).where(User.id == v.user_id))
        user = user_result.scalar_one_or_none()
        leaderboard.append({
            "rank": i,
            "name": user.name if user else "Unknown",
            "points": v.points,
            "deliveries": v.total_deliveries,
            "distance_km": round(v.total_distance_km, 1),
            "rating": v.rating,
        })

    return leaderboard
