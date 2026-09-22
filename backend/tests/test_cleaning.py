import pytest
from app.data_pipeline.cleaner import DataCleaner
from app.data_pipeline.deduplicator import DataDeduplicator
from app.data_pipeline.outlier_detector import OutlierDetector
from app.data_pipeline.quality_scorer import QualityScorer

def test_cleaner_validation():
    valid_obs = {
        "origin": "DEL",
        "destination": "BOM",
        "travel_date": "2026-09-15",
        "carrier": "6E",
        "total_fare": 4500.0,
        "currency": "INR"
    }
    is_valid, reason, cleaned = DataCleaner.validate_and_clean(valid_obs)
    assert is_valid is True
    assert reason == ""
    assert cleaned["total_fare"] == 4500.0

def test_cleaner_rejects_negative_fare():
    invalid_obs = {
        "origin": "DEL",
        "destination": "BOM",
        "travel_date": "2026-09-15",
        "carrier": "6E",
        "total_fare": -150.0,
        "currency": "INR"
    }
    is_valid, reason, _ = DataCleaner.validate_and_clean(invalid_obs)
    assert is_valid is False
    assert reason == "NON_POSITIVE_FARE"

def test_deduplicator():
    raw = [
        {"source": "IndiGo Direct", "carrier": "6E", "flight_number": "6E-101", "travel_date": "2026-09-15", "departure_time": "06:00", "advance_window": 7, "total_fare": 5000.0},
        {"source": "IndiGo Direct", "carrier": "6E", "flight_number": "6E-101", "travel_date": "2026-09-15", "departure_time": "06:00", "advance_window": 7, "total_fare": 5000.0},
        {"source": "MakeMyTrip", "carrier": "6E", "flight_number": "6E-101", "travel_date": "2026-09-15", "departure_time": "06:00", "advance_window": 7, "total_fare": 5000.0}
    ]
    deduped = DataDeduplicator.deduplicate(raw)
    assert len(deduped) == 2  # Keeps different sources

def test_outlier_detector_iqr():
    prices = [4500.0, 4600.0, 4550.0, 4700.0, 4650.0, 25000.0]  # 25000 is an anomaly
    flags = OutlierDetector.detect_outliers_iqr(prices)
    assert bool(flags[-1]) is True
    assert bool(flags[0]) is False

def test_quality_scorer():
    obs = {
        "source_type": "AIRLINE",
        "base_fare": 3800.0,
        "taxes": 700.0,
        "fees": 200.0,
        "is_outlier": False,
        "flight_number": "6E-502",
        "departure_time": "08:00",
        "arrival_time": "10:15",
        "currency": "INR",
        "travel_date": "2026-09-15"
    }
    score = QualityScorer.calculate_score(obs)
    assert score >= 90.0
