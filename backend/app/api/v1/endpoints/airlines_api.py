from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.domain import Airline, FareObservation
from app.schemas.pydantic_models import AirlineRead

router = APIRouter()

@router.get("", response_model=List[AirlineRead])
def get_airlines(db: Session = Depends(get_db)):
    """
    Returns active domestic airlines monitored by APIx.
    """
    return db.query(Airline).filter(Airline.active == True).all()


@router.get("/comparison")
def get_airline_comparison(db: Session = Depends(get_db)):
    """
    Retrieves comparative price statistics across airlines (Median fare, Avg Base Fare, Avg Taxes, Volatility).
    """
    results = []
    airlines = db.query(Airline).filter(Airline.active == True).all()

    for airline in airlines:
        obs = db.query(
            func.avg(FareObservation.total_fare).label("avg_fare"),
            func.avg(FareObservation.base_fare).label("avg_base"),
            func.avg(FareObservation.taxes).label("avg_taxes"),
            func.avg(FareObservation.fees).label("avg_fees"),
            func.count(FareObservation.id).label("count")
        ).filter(
            FareObservation.airline_id == airline.id,
            FareObservation.is_outlier == False
        ).first()

        if obs and obs.count > 0:
            results.append({
                "airline_id": airline.id,
                "code": airline.code,
                "name": airline.name,
                "airline_type": airline.airline_type,
                "avg_total_fare": round(obs.avg_fare or 0.0, 2),
                "avg_base_fare": round(obs.avg_base or 0.0, 2),
                "avg_taxes": round(obs.avg_taxes or 0.0, 2),
                "avg_fees": round(obs.avg_fees or 0.0, 2),
                "observation_count": obs.count
            })

    return results
