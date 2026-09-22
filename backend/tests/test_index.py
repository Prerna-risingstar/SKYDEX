import pytest
from app.core.database import SessionLocal, Base, engine
from app.models.domain import Route, FareObservation, Airline, Source
from app.index_engine.calculator import IndexCalculatorEngine

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_index_calculator_engine(db):
    engine_calc = IndexCalculatorEngine(db, base_period="2026-01")
    
    # Run daily index calculation test
    res = engine_calc.compute_daily_index(index_date="2026-09-01", booking_window="T+7")
    assert res["date"] == "2026-09-01"
    assert res["booking_window"] == "T+7"
    assert "composite_index" in res
    assert res["composite_index"] > 0
