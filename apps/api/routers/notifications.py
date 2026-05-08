"""Notifications router."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, update
from typing import List

from core.database import get_db
from core.dependencies import get_current_user
from models.user import User
from models.notification import Notification
from schemas.models import NotificationResponse

router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    page: int = 1,
    page_size: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's notifications."""
    query = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        query = query.where(Notification.is_read == False)
    query = query.order_by(desc(Notification.created_at)).offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    notifications = result.scalars().all()

    return [
        NotificationResponse(
            id=n.id, title=n.title, body=n.body,
            type=n.type.value if n.type else "system",
            is_read=n.is_read, action_url=n.action_url,
            created_at=str(n.created_at) if n.created_at else None,
        )
        for n in notifications
    ]


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get unread notification count."""
    from sqlalchemy import func
    result = await db.execute(
        select(func.count()).select_from(Notification).where(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        )
    )
    count = result.scalar() or 0
    return {"unread_count": count}


@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark a notification as read."""
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notif = result.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")

    notif.is_read = True
    await db.flush()
    return {"message": "Marked as read"}


@router.put("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark all notifications as read."""
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read == False)
        .values(is_read=True)
    )
    await db.flush()
    return {"message": "All notifications marked as read"}
