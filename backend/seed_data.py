import sys
import os
from datetime import datetime, timedelta

# Add backend root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import SessionLocal, Base, engine
from app.models.domain import Airline, Airport, Route, Source, FareObservation, IndexValue
from app.scrapers.mock_generator import RealisticMockScraper
from app.data_pipeline.cleaner import DataCleaner
from app.data_pipeline.deduplicator import DataDeduplicator
from app.data_pipeline.outlier_detector import OutlierDetector
from app.data_pipeline.quality_scorer import QualityScorer
from app.index_engine.calculator import IndexCalculatorEngine

def seed():
    print("Initializing Database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding Airlines...")
        airlines_map = {}
        for a_data in settings.AIRLINES:
            airline = Airline(
                code=a_data["code"],
                name=a_data["name"],
                airline_type=a_data["type"]
            )
            db.add(airline)
            db.commit()
            db.refresh(airline)
            airlines_map[a_data["code"]] = airline.id

        print("Seeding Sources...")
        sources_map = {}
        for s_data in settings.SOURCES:
            source = Source(
                name=s_data["name"],
                source_type=s_data["type"],
                url=s_data["url"],
                health_status="HEALTHY",
                last_run_at=datetime.utcnow()
            )
            db.add(source)
            db.commit()
            db.refresh(source)
            sources_map[s_data["name"]] = source.id

        print("Seeding Routes...")
        routes_list = []
        for r_data in settings.ROUTE_BASKET:
            route = Route(
                origin_code=r_data["origin"],
                destination_code=r_data["destination"],
                origin_city=r_data["origin_city"],
                destination_city=r_data["destination_city"],
                region=r_data["region"],
                distance_km=r_data["distance_km"],
                route_weight=r_data["weight"],
                active=True
            )
            db.add(route)
            db.commit()
            db.refresh(route)
            routes_list.append(route)

        print("Generating 60-day historical airfare observations & computing APIx indices...")
        mock_scraper = RealisticMockScraper()
        
        # Start date: 60 days before 2026-09-01
        start_date = datetime(2026, 7, 3)
        num_days = 60
        windows = settings.ADVANCE_WINDOWS # [1, 7, 15, 30, 45]

        total_obs_count = 0

        for d_offset in range(num_days):
            current_date_dt = start_date + timedelta(days=d_offset)
            current_date_str = current_date_dt.strftime("%Y-%m-%d")

            day_observations = []

            for route in routes_list:
                for window in windows:
                    # Target travel date is current_date + window
                    travel_dt = current_date_dt + timedelta(days=window)
                    travel_date_str = travel_dt.strftime("%Y-%m-%d")

                    for code, airline_id in airlines_map.items():
                        a_type = "FSC" if code == "AI" else "LCC"
                        s_name = f"{code} Direct" if f"{code} Direct" in sources_map else "MakeMyTrip"
                        source_id = sources_map.get(s_name, 1)

                        raw_quotes = mock_scraper.fetch_flight_quotes(
                            origin=route.origin_code,
                            destination=route.destination_code,
                            travel_date=travel_date_str,
                            advance_window=window,
                            route_distance=route.distance_km,
                            airline_code=code,
                            airline_type=a_type,
                            source_name=s_name
                        )

                        for quote in raw_quotes:
                            quote["source_id"] = source_id
                            quote["airline_id"] = airline_id
                            quote["route_id"] = route.id
                            day_observations.append(quote)

            # Clean and deduplicate day observations
            cleaned_list = []
            for obs in day_observations:
                is_val, reason, cln = DataCleaner.validate_and_clean(obs)
                if is_val:
                    cleaned_list.append(cln)

            deduped = DataDeduplicator.deduplicate(cleaned_list)
            flagged = OutlierDetector.flag_observations(deduped)

            db_obs_objects = []
            for item in flagged:
                q_score = QualityScorer.calculate_score(item)
                rec = FareObservation(
                    source_id=item["source_id"],
                    airline_id=item["airline_id"],
                    route_id=item["route_id"],
                    flight_number=item["flight_number"],
                    travel_date=item["travel_date"],
                    departure_time=item["departure_time"],
                    arrival_time=item["arrival_time"],
                    advance_window=item["advance_window"],
                    fare_class=item["fare_class"],
                    base_fare=item["base_fare"],
                    taxes=item["taxes"],
                    fees=item["fees"],
                    total_fare=item["total_fare"],
                    currency=item["currency"],
                    availability_status=item["availability_status"],
                    collected_at=current_date_dt,
                    quality_score=q_score,
                    is_outlier=item["is_outlier"]
                )
                db_obs_objects.append(rec)

            db.bulk_save_objects(db_obs_objects)
            db.commit()
            total_obs_count += len(db_obs_objects)

            # Compute daily indices for all windows
            engine_calc = IndexCalculatorEngine(db)
            for w in windows:
                engine_calc.compute_daily_index(index_date=current_date_str, booking_window=f"T+{w}")

            if (d_offset + 1) % 15 == 0:
                print(f"Processed {d_offset + 1}/{num_days} days of historical fare data...")

        print(f"Seeding completed successfully! Created {total_obs_count} fare observations and indices.")

    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
