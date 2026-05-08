"""Various schemas for other modules."""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


# === NGO Schemas ===

class NGOCreateRequest(BaseModel):
    org_name: str = Field(..., min_length=2, max_length=255)
    registration_number: Optional[str] = None
    description: Optional[str] = None
    capacity: int = Field(default=100, ge=1)
    food_preferences: Optional[List[str]] = None
    accepts_non_veg: bool = True
    area_served: Optional[str] = None
    service_radius_km: float = Field(default=15.0, ge=1)
    lat: float
    lng: float
    operating_hours: Optional[Dict[str, Any]] = None


class NGOResponse(BaseModel):
    id: UUID
    user_id: UUID
    org_name: str
    registration_number: Optional[str] = None
    description: Optional[str] = None
    capacity: int
    current_load: int
    food_preferences: Optional[List[str]] = None
    accepts_non_veg: bool
    area_served: Optional[str] = None
    service_radius_km: float
    lat: float
    lng: float
    is_verified: bool
    total_received: int
    rating: float
    is_active: bool
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


# === Volunteer Schemas ===

class VolunteerCreateRequest(BaseModel):
    vehicle_type: str = Field(default="bike")
    license_plate: Optional[str] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    service_radius_km: float = Field(default=10.0, ge=1)
    availability: Optional[Dict[str, Any]] = None


class VolunteerResponse(BaseModel):
    id: UUID
    user_id: UUID
    vehicle_type: str
    license_plate: Optional[str] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    service_radius_km: float
    is_active: bool
    is_available: bool
    total_deliveries: int
    total_distance_km: float
    points: int
    rating: float
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


# === Delivery Schemas ===

class DeliveryResponse(BaseModel):
    id: UUID
    donation_id: UUID
    ngo_id: UUID
    volunteer_id: Optional[UUID] = None
    status: str
    route_data: Optional[Dict[str, Any]] = None
    distance_km: Optional[float] = None
    estimated_time_min: Optional[float] = None
    pickup_time: Optional[str] = None
    delivery_time: Optional[str] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


# === AI Prediction Schemas ===

class PredictionRequest(BaseModel):
    event_type: str = Field(..., description="wedding, corporate, birthday, buffet, etc.")
    guest_count: int = Field(..., ge=1)
    menu_type: str = Field(default="mixed", description="veg, non_veg, mixed")
    cuisine_type: Optional[str] = Field(default="indian")
    weather: Optional[str] = Field(default="clear")
    day_of_week: Optional[int] = Field(default=0, ge=0, le=6)
    hour: Optional[int] = Field(default=12, ge=0, le=23)


class PredictionResponse(BaseModel):
    predicted_quantity_kg: float
    confidence_score: float
    estimated_servings: int
    recommendations: List[str]
    model_version: str


# === Matching Schemas ===

class MatchRequest(BaseModel):
    donation_id: UUID


class MatchResult(BaseModel):
    ngo_id: UUID
    ngo_name: str
    distance_km: float
    score: float
    capacity_available: int
    food_preference_match: bool
    estimated_time_min: float


class MatchResponse(BaseModel):
    donation_id: UUID
    matches: List[MatchResult]
    best_match: Optional[MatchResult] = None


# === Route Schemas ===

class RouteOptimizeRequest(BaseModel):
    origin: Dict[str, float]  # {lat, lng}
    destination: Dict[str, float]  # {lat, lng}
    waypoints: Optional[List[Dict[str, float]]] = None


class RouteResponse(BaseModel):
    total_distance_km: float
    estimated_time_min: float
    optimized_waypoints: List[Dict[str, float]]
    route_polyline: List[List[float]]


# === Chatbot Schemas ===

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    intent: str
    confidence: str
    suggestions: Optional[List[str]] = None
    session_id: str


# === Notification Schemas ===

class NotificationResponse(BaseModel):
    id: UUID
    title: str
    body: str
    type: str
    is_read: bool
    action_url: Optional[str] = None
    created_at: Optional[str] = None

    model_config = {"from_attributes": True}


# === Analytics Schemas ===

class AnalyticsOverview(BaseModel):
    total_donations: int
    total_delivered: int
    total_food_saved_kg: float
    total_meals_served: int
    total_co2_saved_kg: float
    active_donors: int
    active_ngos: int
    active_volunteers: int
    avg_delivery_time_min: float


class DonationTrend(BaseModel):
    date: str
    count: int
    quantity_kg: float


class AnalyticsDashboard(BaseModel):
    overview: AnalyticsOverview
    trends: List[DonationTrend]
    category_distribution: Dict[str, int]
    status_distribution: Dict[str, int]
    top_donors: List[Dict[str, Any]]
    top_ngos: List[Dict[str, Any]]
