import csv
import io
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import FareObservation, Airline, Source, Route

router = APIRouter()

@router.get("/csv")
def export_observations_csv(
    route_id: int = Query(None),
    limit: int = Query(500, le=5000),
    db: Session = Depends(get_db)
):
    """
    Exports fare observations dataset in CSV format.
    """
    query = db.query(FareObservation)
    if route_id:
        query = query.filter(FareObservation.route_id == route_id)

    records = query.order_by(FareObservation.collected_at.desc()).limit(limit).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "observation_id", "route_id", "airline_id", "source_id", "flight_number",
        "travel_date", "advance_window", "base_fare", "taxes", "fees", "total_fare",
        "currency", "availability_status", "quality_score", "is_outlier", "collected_at"
    ])

    for r in records:
        writer.writerow([
            r.id, r.route_id, r.airline_id, r.source_id, r.flight_number,
            r.travel_date, r.advance_window, r.base_fare, r.taxes, r.fees, r.total_fare,
            r.currency, r.availability_status, r.quality_score, r.is_outlier, r.collected_at.isoformat() if r.collected_at else ""
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=apix_observations.csv"}
    )
