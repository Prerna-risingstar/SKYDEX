from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# Route Schemas
class RouteBase(BaseModel):
    origin_code: str
    destination_code: str
    origin_city: str
    destination_city: str
    region: Optional[str] = None
    distance_km: Optional[float] = None
    route_weight: float = 0.1
    active: bool = True

class RouteRead(RouteBase):
    id: int

    class Config:
        from_attributes = True

# Airline Schemas
class AirlineRead(BaseModel):
    id: int
    code: str
    name: str
    airline_type: str
    active: bool

    class Config:
        from_attributes = True

# Source Schemas
class SourceRead(BaseModel):
    id: int
    name: str
    source_type: str
    url: Optional[str] = None
    health_status: str
    last_run_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Fare Observation Schemas
class FareObservationCreate(BaseModel):
    source_id: int
    airline_id: int
    route_id: int
    flight_number: str
    travel_date: str
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    advance_window: int
    fare_class: str = "Economy"
    base_fare: Optional[float] = None
    taxes: Optional[float] = None
    fees: Optional[float] = None
    total_fare: float
    currency: str = "INR"
    availability_status: str = "AVAILABLE"

class FareObservationRead(BaseModel):
    id: int
    source_id: int
    airline_id: int
    route_id: int
    flight_number: str
    travel_date: str
    departure_time: Optional[str]
    arrival_time: Optional[str]
    advance_window: int
    fare_class: str
    base_fare: Optional[float]
    taxes: Optional[float]
    fees: Optional[float]
    total_fare: float
    currency: str
    availability_status: str
    collected_at: datetime
    quality_score: float
    is_outlier: bool

    airline_code: Optional[str] = None
    airline_name: Optional[str] = None
    source_name: Optional[str] = None
    route_name: Optional[str] = None

    class Config:
        from_attributes = True

# Index Value Schemas
class IndexValueRead(BaseModel):
    id: int
    index_date: str
    frequency: str
    booking_window: str
    route_id: Optional[int] = None
    route_name: Optional[str] = None
    index_value: float
    median_price: Optional[float] = None
    base_period_price: Optional[float] = None
    weight: float
    methodology_version: str
    revision_status: str

    class Config:
        from_attributes = True

# Summary & Quality Analytics Schemas
class HeadlineIndexSummary(BaseModel):
    current_index: float
    index_date: str
    base_period: str
    mom_change_pct: float
    yoy_change_pct: float
    wow_change_pct: float
    total_observations: int
    quality_score_avg: float
    route_coverage_pct: float
    source_coverage_pct: float

class QualityMetricsResponse(BaseModel):
    total_observations: int
    valid_observations: int
    rejected_observations: int
    outlier_count: int
    avg_quality_score: float
    routes_active: int
    sources_active: int
    last_collection_time: Optional[datetime] = None
    health_by_source: List[dict]
