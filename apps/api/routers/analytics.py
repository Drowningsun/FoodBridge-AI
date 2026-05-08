"""Analytics router — dashboard data and metrics."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timezone, timedelta
from typing import Optional

from core.database import get_db
from core.dependencies import get_current_user, require_roles
from models.user import User
from models.donation import Donation, DonationStatus
from models.ngo import NGO
from models.volunteer import Volunteer
from models.delivery import Delivery, DeliveryStatus
from schemas.models import AnalyticsDashboard, AnalyticsOverview, DonationTrend

router = APIRouter()


@router.get("/overview")
async def get_overview(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get analytics overview for dashboard."""
    # Total donations
    total_donations_result = await db.execute(
        select(func.count()).select_from(Donation).where(Donation.deleted_at.is_(None))
    )
    total_donations = total_donations_result.scalar() or 0

    # Delivered donations
    delivered_result = await db.execute(
        select(func.count()).select_from(Donation).where(Donation.status == DonationStatus.DELIVERED)
    )
    total_delivered = delivered_result.scalar() or 0

    # Total food saved (kg)
    food_saved_result = await db.execute(
        select(func.coalesce(func.sum(Donation.quantity), 0)).where(Donation.status == DonationStatus.DELIVERED)
    )
    total_food_saved = float(food_saved_result.scalar() or 0)

    # Estimated meals (1 meal = ~0.5 kg)
    total_meals = int(total_food_saved * 2)

    # CO2 saved (~2.5 kg CO2 per kg food waste avoided)
    total_co2_saved = round(total_food_saved * 2.5, 1)

    # Active users
    donors_result = await db.execute(
        select(func.count()).select_from(User).where(User.role == "donor", User.deleted_at.is_(None))
    )
    active_donors = donors_result.scalar() or 0

    ngos_result = await db.execute(
        select(func.count()).select_from(NGO).where(NGO.is_active == True)
    )
    active_ngos = ngos_result.scalar() or 0

    volunteers_result = await db.execute(
        select(func.count()).select_from(Volunteer).where(Volunteer.is_active == True)
    )
    active_volunteers = volunteers_result.scalar() or 0

    # Avg delivery time
    avg_time_result = await db.execute(
        select(func.avg(Delivery.estimated_time_min)).where(Delivery.status == DeliveryStatus.DELIVERED)
    )
    avg_delivery_time = float(avg_time_result.scalar() or 0)

    return {
        "total_donations": total_donations,
        "total_delivered": total_delivered,
        "total_food_saved_kg": total_food_saved,
        "total_meals_served": total_meals,
        "total_co2_saved_kg": total_co2_saved,
        "active_donors": active_donors,
        "active_ngos": active_ngos,
        "active_volunteers": active_volunteers,
        "avg_delivery_time_min": round(avg_delivery_time, 1),
    }


@router.get("/trends")
async def get_trends(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get donation trends over time."""
    since = datetime.now(timezone.utc) - timedelta(days=days)

    result = await db.execute(
        select(
            func.date_trunc('day', Donation.created_at).label('date'),
            func.count().label('count'),
            func.coalesce(func.sum(Donation.quantity), 0).label('quantity'),
        )
        .where(Donation.created_at >= since, Donation.deleted_at.is_(None))
        .group_by(func.date_trunc('day', Donation.created_at))
        .order_by(func.date_trunc('day', Donation.created_at))
    )
    rows = result.all()

    return [
        {"date": str(row.date.date()) if row.date else "", "count": row.count, "quantity_kg": float(row.quantity)}
        for row in rows
    ]


@router.get("/category-distribution")
async def get_category_distribution(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get donation distribution by food category."""
    result = await db.execute(
        select(Donation.category, func.count().label('count'))
        .where(Donation.deleted_at.is_(None))
        .group_by(Donation.category)
    )
    rows = result.all()

    return {str(row.category.value if hasattr(row.category, 'value') else row.category): row.count for row in rows}


@router.get("/status-distribution")
async def get_status_distribution(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get donation distribution by status."""
    result = await db.execute(
        select(Donation.status, func.count().label('count'))
        .where(Donation.deleted_at.is_(None))
        .group_by(Donation.status)
    )
    rows = result.all()

    return {str(row.status.value if hasattr(row.status, 'value') else row.status): row.count for row in rows}


@router.get("/my-impact")
async def get_my_impact(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get personal impact metrics for the current user."""
    # Donations made
    donations_result = await db.execute(
        select(func.count()).select_from(Donation).where(
            Donation.donor_id == current_user.id,
            Donation.deleted_at.is_(None),
        )
    )
    total_donations = donations_result.scalar() or 0

    # Food saved
    food_result = await db.execute(
        select(func.coalesce(func.sum(Donation.quantity), 0)).where(
            Donation.donor_id == current_user.id,
            Donation.status == DonationStatus.DELIVERED,
        )
    )
    food_saved = float(food_result.scalar() or 0)

    return {
        "total_donations": total_donations,
        "food_saved_kg": food_saved,
        "meals_provided": int(food_saved * 2),
        "co2_saved_kg": round(food_saved * 2.5, 1),
        "impact_score": min(100, int(total_donations * 10 + food_saved * 5)),
    }
