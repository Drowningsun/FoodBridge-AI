"""Donations router — CRUD endpoints for food donations."""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import Optional, List
from datetime import datetime, timezone
import uuid
import os
import aiofiles

from core.database import get_db
from core.dependencies import get_current_user, require_roles
from core.config import settings
from models.user import User
from models.donation import Donation, DonationStatus
from models.food_image import FoodImage
from schemas.donation import (
    DonationCreateRequest, DonationUpdateRequest, DonationResponse, DonationListResponse,
)

router = APIRouter()


def donation_to_response(d: Donation) -> DonationResponse:
    return DonationResponse(
        id=d.id,
        donor_id=d.donor_id,
        food_name=d.food_name,
        description=d.description,
        quantity=d.quantity,
        quantity_unit=d.quantity_unit,
        estimated_servings=d.estimated_servings,
        category=d.category.value if d.category else "other",
        is_veg=d.is_veg,
        allergens=d.allergens,
        cuisine_type=d.cuisine_type,
        preparation_time=str(d.preparation_time) if d.preparation_time else None,
        expiry_time=str(d.expiry_time),
        pickup_address=d.pickup_address,
        pickup_city=d.pickup_city,
        lat=d.lat,
        lng=d.lng,
        status=d.status.value if d.status else "pending",
        ai_freshness_score=d.ai_freshness_score,
        ai_spoilage_probability=d.ai_spoilage_probability,
        images=d.images,
        notes=d.notes,
        created_at=str(d.created_at) if d.created_at else None,
        updated_at=str(d.updated_at) if d.updated_at else None,
    )


@router.post("/", response_model=DonationResponse, status_code=201)
async def create_donation(
    request: DonationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new food donation listing."""
    donation = Donation(
        id=uuid.uuid4(),
        donor_id=current_user.id,
        food_name=request.food_name,
        description=request.description,
        quantity=request.quantity,
        quantity_unit=request.quantity_unit,
        estimated_servings=request.estimated_servings,
        category=request.category,
        is_veg=request.is_veg,
        allergens=request.allergens,
        cuisine_type=request.cuisine_type,
        preparation_time=request.preparation_time,
        expiry_time=request.expiry_time,
        pickup_address=request.pickup_address,
        pickup_city=request.pickup_city,
        lat=request.lat,
        lng=request.lng,
        images=request.images,
        notes=request.notes,
        status=DonationStatus.PENDING,
    )
    db.add(donation)
    await db.flush()
    return donation_to_response(donation)


@router.get("/", response_model=DonationListResponse)
async def list_donations(
    status: Optional[str] = None,
    category: Optional[str] = None,
    is_veg: Optional[bool] = None,
    city: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query(default="created_at", regex="^(created_at|expiry_time|quantity)$"),
    sort_order: str = Query(default="desc", regex="^(asc|desc)$"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List donations with filtering, sorting, and pagination."""
    query = select(Donation).where(Donation.deleted_at.is_(None))

    if status:
        query = query.where(Donation.status == status)
    if category:
        query = query.where(Donation.category == category)
    if is_veg is not None:
        query = query.where(Donation.is_veg == is_veg)
    if city:
        query = query.where(Donation.pickup_city.ilike(f"%{city}%"))
    if search:
        query = query.where(Donation.food_name.ilike(f"%{search}%"))

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Sort
    sort_col = getattr(Donation, sort_by)
    if sort_order == "desc":
        query = query.order_by(desc(sort_col))
    else:
        query = query.order_by(sort_col)

    # Paginate
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    donations = result.scalars().all()

    return DonationListResponse(
        items=[donation_to_response(d) for d in donations],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    )


@router.get("/my", response_model=list[DonationResponse])
async def get_my_donations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's donations."""
    result = await db.execute(
        select(Donation)
        .where(Donation.donor_id == current_user.id, Donation.deleted_at.is_(None))
        .order_by(desc(Donation.created_at))
    )
    donations = result.scalars().all()
    return [donation_to_response(d) for d in donations]


@router.get("/{donation_id}", response_model=DonationResponse)
async def get_donation(
    donation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific donation by ID."""
    result = await db.execute(
        select(Donation).where(Donation.id == donation_id, Donation.deleted_at.is_(None))
    )
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    return donation_to_response(donation)


@router.patch("/{donation_id}", response_model=DonationResponse)
async def update_donation(
    donation_id: str,
    request: DonationUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a donation."""
    result = await db.execute(
        select(Donation).where(Donation.id == donation_id, Donation.deleted_at.is_(None))
    )
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    # Only owner or admin can update
    if str(donation.donor_id) != str(current_user.id) and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this donation")

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(donation, field, value)
    donation.updated_at = datetime.now(timezone.utc)
    await db.flush()

    return donation_to_response(donation)


@router.delete("/{donation_id}")
async def delete_donation(
    donation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete a donation."""
    result = await db.execute(
        select(Donation).where(Donation.id == donation_id, Donation.deleted_at.is_(None))
    )
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    if str(donation.donor_id) != str(current_user.id) and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    donation.deleted_at = datetime.now(timezone.utc)
    donation.status = DonationStatus.CANCELLED
    await db.flush()

    return {"message": "Donation deleted successfully"}


@router.post("/{donation_id}/images")
async def upload_donation_image(
    donation_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload an image for a donation."""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPEG, PNG, WebP")

    # Validate file size (10MB)
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max: {settings.MAX_FILE_SIZE_MB}MB")

    # Save file
    filename = f"{uuid.uuid4()}_{file.filename}"
    upload_path = os.path.join(settings.UPLOAD_DIR, "donations", str(donation_id))
    os.makedirs(upload_path, exist_ok=True)
    filepath = os.path.join(upload_path, filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    # Save to database
    url = f"/uploads/donations/{donation_id}/{filename}"
    food_image = FoodImage(
        id=uuid.uuid4(),
        donation_id=donation_id,
        url=url,
        filename=filename,
    )
    db.add(food_image)

    # Update donation images list
    result = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = result.scalar_one_or_none()
    if donation:
        images = donation.images or []
        images.append(url)
        donation.images = images

    await db.flush()

    return {"url": url, "filename": filename}
