from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import FareObservation, Airline, Source, Route
from app.schemas.pydantic_models import FareObservationRead

router = APIRouter()

@router.get("", response_model=List[FareObservationRead])
def get_observations(
    route_id: Optional[int] = Query(None),
    airline_id: Optional[int] = Query(None),
    source_id: Optional[int] = Query(None),
    advance_window: Optional[int] = Query(None),
    travel_date: Optional[str] = Query(None),
    is_outlier: Optional[bool] = Query(None),
    limit: int = Query(100, le=1000),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    """
    Paginated, filterable raw/cleaned fare observation explorer.
    """
    query = db.query(FareObservation)

    if route_id:
        query = query.filter(FareObservation.route_id == route_id)
    if airline_id:
        query = query.filter(FareObservation.airline_id == airline_id)
    if source_id:
        query = query.filter(FareObservation.source_id == source_id)
    if advance_window:
        query = query.filter(FareObservation.advance_window == advance_window)
    if travel_date:
        query = query.filter(FareObservation.travel_date == travel_date)
    if is_outlier is not None:
        query = query.filter(FareObservation.is_outlier == is_outlier)

    records = query.order_by(FareObservation.collected_at.desc()).offset(offset).limit(limit).all()

    # Pre-fetch maps for display
    airlines_map = {a.id: (a.code, a.name) for a in db.query(Airline).all()}
    sources_map = {s.id: s.name for s in db.query(Source).all()}
    routes_map = {r.id: f"{r.origin_code}-{r.destination_code}" for r in db.query(Route).all()}

    results = []
    for r in records:
        a_code, a_name = airlines_map.get(r.airline_id, ("UNK", "Unknown"))
        s_name = sources_map.get(r.source_id, "Unknown Source")
        r_name = routes_map.get(r.route_id, "Unknown Route")

        results.append(FareObservationRead(
            id=r.id,
            source_id=r.source_id,
            airline_id=r.airline_id,
            route_id=r.route_id,
            flight_number=r.flight_number,
            travel_date=r.travel_date,
            departure_time=r.departure_time,
            arrival_time=r.arrival_time,
            advance_window=r.advance_window,
            fare_class=r.fare_class,
            base_fare=r.base_fare,
            taxes=r.taxes,
            fees=r.fees,
            total_fare=r.total_fare,
            currency=r.currency,
            availability_status=r.availability_status,
            collected_at=r.collected_at,
            quality_score=r.quality_score,
            is_outlier=r.is_outlier,
            airline_code=a_code,
            airline_name=a_name,
            source_name=s_name,
            route_name=r_name
        ))

    return results
