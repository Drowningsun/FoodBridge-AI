"""Donation schemas."""

from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class DonationCreateRequest(BaseModel):
    food_name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    quantity: float = Field(..., gt=0)
    quantity_unit: str = Field(default="kg")
    estimated_servings: Optional[int] = Field(None, ge=1)
    category: str = Field(default="cooked_meal")
    is_veg: bool = True
    allergens: Optional[List[str]] = None
    cuisine_type: Optional[str] = None
    preparation_time: Optional[datetime] = None
    expiry_time: datetime
    pickup_address: str = Field(..., min_length=5)
    pickup_city: Optional[str] = None
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    notes: Optional[str] = None
    images: Optional[List[str]] = None


class DonationUpdateRequest(BaseModel):
    food_name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = Field(None, gt=0)
    estimated_servings: Optional[int] = None
    category: Optional[str] = None
    is_veg: Optional[bool] = None
    allergens: Optional[List[str]] = None
    expiry_time: Optional[datetime] = None
    pickup_address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class DonationResponse(BaseModel):
    id: UUID
    donor_id: UUID
    food_name: str
    description: Optional[str] = None
    quantity: float
    quantity_unit: str
    estimated_servings: Optional[int] = None
    category: str
    is_veg: bool
    allergens: Optional[List[str]] = None
    cuisine_type: Optional[str] = None
    preparation_time: Optional[str] = None
    expiry_time: str
    pickup_address: str
    pickup_city: Optional[str] = None
    lat: float
    lng: float
    status: str
    ai_freshness_score: Optional[float] = None
    ai_spoilage_probability: Optional[float] = None
    images: Optional[List[str]] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class DonationListResponse(BaseModel):
    items: List[DonationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
