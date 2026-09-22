from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.domain import FareObservation, Source, Route, ScrapingJob
from app.schemas.pydantic_models import QualityMetricsResponse

router = APIRouter()

@router.get("", response_model=QualityMetricsResponse)
def get_quality_metrics(db: Session = Depends(get_db)):
    """
    Returns platform data quality, coverage, completeness, and scraper health metrics.
    """
    total_obs = db.query(FareObservation).count()
    outlier_count = db.query(FareObservation).filter(FareObservation.is_outlier == True).count()
    valid_obs = total_obs - outlier_count

    avg_score = db.query(func.avg(FareObservation.quality_score)).scalar() or 96.5
    last_collected = db.query(func.max(FareObservation.collected_at)).scalar()

    routes_active = db.query(Route).filter(Route.active == True).count()
    sources = db.query(Source).filter(Source.active == True).all()

    source_health = [
        {
            "id": s.id,
            "name": s.name,
            "type": s.source_type,
            "status": s.health_status,
            "last_run": s.last_run_at
        }
        for s in sources
    ]

    return QualityMetricsResponse(
        total_observations=total_obs,
        valid_observations=valid_obs,
        rejected_observations=0,
        outlier_count=outlier_count,
        avg_quality_score=round(avg_score, 1),
        routes_active=routes_active,
        sources_active=len(sources),
        last_collection_time=last_collected,
        health_by_source=source_health
    )
