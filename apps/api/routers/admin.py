"""Admin router — admin panel endpoints and fraud detection."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timezone, timedelta
from typing import List

from core.database import get_db
from core.dependencies import require_roles
from models.user import User
from models.donation import Donation
from models.ngo import NGO
from models.volunteer import Volunteer
from models.delivery import Delivery
from models.audit_log import AuditLog

router = APIRouter()


@router.get("/dashboard")
async def admin_dashboard(
    current_user: User = Depends(require_roles(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    """Get admin dashboard data."""
    # User counts by role
    user_counts = {}
    for role in ["donor", "ngo", "volunteer", "admin"]:
        result = await db.execute(
            select(func.count()).select_from(User).where(User.role == role, User.deleted_at.is_(None))
        )
        user_counts[role] = result.scalar() or 0

    # Recent activity
    recent_donations = await db.execute(
        select(Donation).order_by(desc(Donation.created_at)).limit(5)
    )
    recent = recent_donations.scalars().all()

    # Fraud alerts
    fraud_alerts = await detect_fraud(db)

    return {
        "user_counts": user_counts,
        "total_users": sum(user_counts.values()),
        "recent_donations": [
            {"id": str(d.id), "food_name": d.food_name, "status": d.status.value if d.status else "pending", "created_at": str(d.created_at)}
            for d in recent
        ],
        "fraud_alerts": fraud_alerts,
        "system_health": {
            "api": "healthy",
            "database": "connected",
            "ml_service": "active",
        },
    }


async def detect_fraud(db: AsyncSession) -> List[dict]:
    """Detect suspicious activity using heuristic scoring."""
    alerts = []

    # 1. New accounts with high donation volume (possible spam)
    one_day_ago = datetime.now(timezone.utc) - timedelta(days=1)
    result = await db.execute(
        select(User.id, User.email, func.count(Donation.id).label('count'))
        .join(Donation, Donation.donor_id == User.id)
        .where(User.created_at >= one_day_ago)
        .group_by(User.id, User.email)
        .having(func.count(Donation.id) > 10)
    )
    spam_users = result.all()
    for row in spam_users:
        alerts.append({
            "type": "spam_donations",
            "severity": "high",
            "message": f"New user {row.email} created {row.count} donations in 24h",
            "user_id": str(row.id),
        })

    # 2. Donations with very short expiry (possible test/fake)
    result = await db.execute(
        select(func.count()).select_from(Donation).where(
            Donation.created_at >= one_day_ago,
            Donation.expiry_time <= datetime.now(timezone.utc),
        )
    )
    expired_count = result.scalar() or 0
    if expired_count > 5:
        alerts.append({
            "type": "expired_listings",
            "severity": "medium",
            "message": f"{expired_count} donations listed already expired in the last 24h",
        })

    # 3. Unverified NGOs with high acceptance
    result = await db.execute(
        select(NGO).where(NGO.is_verified == False, NGO.total_received > 5)
    )
    unverified = result.scalars().all()
    for ngo in unverified:
        alerts.append({
            "type": "unverified_ngo",
            "severity": "medium",
            "message": f"Unverified NGO '{ngo.org_name}' has received {ngo.total_received} donations",
            "ngo_id": str(ngo.id),
        })

    return alerts


@router.put("/verify-ngo/{ngo_id}")
async def verify_ngo(
    ngo_id: str,
    current_user: User = Depends(require_roles(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    """Verify an NGO."""
    result = await db.execute(select(NGO).where(NGO.id == ngo_id))
    ngo = result.scalar_one_or_none()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")

    ngo.is_verified = True
    ngo.verified_at = datetime.now(timezone.utc)
    await db.flush()

    return {"message": f"NGO '{ngo.org_name}' verified successfully"}


@router.get("/audit-logs")
async def get_audit_logs(
    page: int = 1,
    page_size: int = 50,
    current_user: User = Depends(require_roles(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    """Get system audit logs."""
    result = await db.execute(
        select(AuditLog)
        .order_by(desc(AuditLog.created_at))
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    logs = result.scalars().all()

    return [
        {
            "id": str(log.id),
            "user_id": str(log.user_id) if log.user_id else None,
            "action": log.action,
            "entity": log.entity,
            "entity_id": log.entity_id,
            "details": log.details,
            "created_at": str(log.created_at) if log.created_at else None,
        }
        for log in logs
    ]


@router.delete("/users/{user_id}")
async def deactivate_user(
    user_id: str,
    current_user: User = Depends(require_roles(["admin"])),
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete/deactivate a user."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.deleted_at = datetime.now(timezone.utc)
    await db.flush()
    return {"message": f"User {user.email} deactivated"}
