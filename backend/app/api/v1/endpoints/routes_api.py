from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.domain import Route, FareObservation, IndexValue
from app.schemas.pydantic_models import RouteRead

router = APIRouter()

@router.get("", response_model=List[RouteRead])
def get_routes(db: Session = Depends(get_db)):
    """
    Returns representative basket of domestic routes and CPI weights.
    """
    return db.query(Route).filter(Route.active == True).all()


@router.get("/{route_id}/prices")
def get_route_prices(
    route_id: int,
    advance_window: Optional[int] = Query(None, description="1, 7, 15, 30, 45"),
    db: Session = Depends(get_db)
):
    """
    Retrieves historical median price series and latest observation statistics for a specific route.
    """
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    query = db.query(IndexValue).filter(
        IndexValue.route_id == route_id,
        IndexValue.frequency == "daily"
    )
    if advance_window:
        query = query.filter(IndexValue.booking_window == f"T+{advance_window}")

    indices = query.order_by(IndexValue.index_date.asc()).all()

    # Aggregate recent prices by airline
    airline_stats = db.query(
        FareObservation.airline_id,
        func.avg(FareObservation.total_fare).label("avg_fare"),
        func.min(FareObservation.total_fare).label("min_fare"),
        func.max(FareObservation.total_fare).label("max_fare"),
        func.count(FareObservation.id).label("obs_count")
    ).filter(
        FareObservation.route_id == route_id,
        FareObservation.is_outlier == False
    ).group_by(FareObservation.airline_id).all()

    return {
        "route_id": route.id,
        "route_name": f"{route.origin_code}-{route.destination_code}",
        "origin_city": route.origin_city,
        "destination_city": route.destination_city,
        "region": route.region,
        "distance_km": route.distance_km,
        "route_weight": route.route_weight,
        "price_history": [
            {
                "date": idx.index_date,
                "window": idx.booking_window,
                "index_value": idx.index_value,
                "median_price": idx.median_price
            }
            for idx in indices
        ]
    }
