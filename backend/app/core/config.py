import os
from typing import List, Dict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real-time Airfare Price Index for India (APIx)"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./apix.db"
    SECRET_KEY: str = "apix-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    BASE_PERIOD: str = "2026-01"
    DEFAULT_CURRENCY: str = "INR"
    ADVANCE_WINDOWS: List[int] = [1, 7, 15, 30, 45]
    
    # Representative Domestic Routes and Weights (Laspeyres basket weights)
    ROUTE_BASKET: List[Dict] = [
        {"origin": "DEL", "destination": "BOM", "origin_city": "Delhi", "destination_city": "Mumbai", "region": "North-West", "distance_km": 1150, "weight": 0.20},
        {"origin": "DEL", "destination": "BLR", "origin_city": "Delhi", "destination_city": "Bengaluru", "region": "North-South", "distance_km": 1740, "weight": 0.18},
        {"origin": "BOM", "destination": "BLR", "origin_city": "Mumbai", "destination_city": "Bengaluru", "region": "West-South", "distance_km": 840, "weight": 0.15},
        {"origin": "DEL", "destination": "CCU", "origin_city": "Delhi", "destination_city": "Kolkata", "region": "North-East", "distance_km": 1305, "weight": 0.12},
        {"origin": "BLR", "destination": "HYD", "origin_city": "Bengaluru", "destination_city": "Hyderabad", "region": "South-South", "distance_km": 500, "weight": 0.10},
        {"origin": "MAA", "destination": "DEL", "origin_city": "Chennai", "destination_city": "Delhi", "region": "South-North", "distance_km": 1760, "weight": 0.08},
        {"origin": "DEL", "destination": "HYD", "origin_city": "Delhi", "destination_city": "Hyderabad", "region": "North-South", "distance_km": 1260, "weight": 0.07},
        {"origin": "DEL", "destination": "GOI", "origin_city": "Delhi", "destination_city": "Goa", "region": "North-West", "distance_km": 1500, "weight": 0.05},
        {"origin": "BOM", "destination": "DEL", "origin_city": "Mumbai", "destination_city": "Delhi", "region": "West-North", "distance_km": 1150, "weight": 0.03},
        {"origin": "BLR", "destination": "MAA", "origin_city": "Bengaluru", "destination_city": "Chennai", "region": "South-South", "distance_km": 290, "weight": 0.02},
    ]

    AIRLINES: List[Dict] = [
        {"code": "6E", "name": "IndiGo", "type": "LCC"},
        {"code": "AI", "name": "Air India", "type": "FSC"},
        {"code": "IX", "name": "Air India Express", "type": "LCC"},
        {"code": "QP", "name": "Akasa Air", "type": "LCC"},
        {"code": "SG", "name": "SpiceJet", "type": "LCC"},
    ]

    SOURCES: List[Dict] = [
        {"name": "IndiGo Direct", "type": "AIRLINE", "url": "https://www.goindigo.in"},
        {"name": "Air India Direct", "type": "AIRLINE", "url": "https://www.airindia.com"},
        {"name": "Akasa Air Direct", "type": "AIRLINE", "url": "https://www.akasaair.com"},
        {"name": "MakeMyTrip", "type": "OTA", "url": "https://www.makemytrip.com"},
        {"name": "EaseMyTrip", "type": "OTA", "url": "https://www.easemytrip.com"},
        {"name": "Yatra", "type": "OTA", "url": "https://www.yatra.com"},
    ]

    class Config:
        case_sensitive = True

settings = Settings()
