from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from app.core.database import Base

class Airline(Base):
    __tablename__ = "airlines"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(5), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    airline_type = Column(String(20), default="LCC")  # LCC, FSC
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    observations = relationship("FareObservation", back_populates="airline")


class Airport(Base):
    __tablename__ = "airports"

    id = Column(Integer, primary_key=True, index=True)
    iata_code = Column(String(3), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=True)
    region = Column(String(50), nullable=True)
    active = Column(Boolean, default=True)


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    origin_code = Column(String(3), nullable=False, index=True)
    destination_code = Column(String(3), nullable=False, index=True)
    origin_city = Column(String(100), nullable=False)
    destination_city = Column(String(100), nullable=False)
    region = Column(String(50), nullable=True)
    distance_km = Column(Float, nullable=True)
    route_weight = Column(Float, default=0.1)
    active = Column(Boolean, default=True)

    observations = relationship("FareObservation", back_populates="route")
    index_values = relationship("IndexValue", back_populates="route")


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    source_type = Column(String(20), nullable=False)  # AIRLINE, OTA
    url = Column(String(255), nullable=True)
    active = Column(Boolean, default=True)
    health_status = Column(String(20), default="HEALTHY")  # HEALTHY, WARNING, FAILED, BLOCKED
    last_run_at = Column(DateTime, nullable=True)

    observations = relationship("FareObservation", back_populates="source")
    jobs = relationship("ScrapingJob", back_populates="source")


class FareObservation(Base):
    __tablename__ = "fare_observations"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    airline_id = Column(Integer, ForeignKey("airlines.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    
    flight_number = Column(String(20), nullable=False)
    travel_date = Column(String(10), nullable=False, index=True)  # YYYY-MM-DD
    departure_time = Column(String(8), nullable=True)             # HH:MM
    arrival_time = Column(String(8), nullable=True)               # HH:MM
    advance_window = Column(Integer, nullable=False, index=True)   # 1, 7, 15, 30, 45
    fare_class = Column(String(20), default="Economy")
    
    base_fare = Column(Float, nullable=True)
    taxes = Column(Float, nullable=True)
    fees = Column(Float, nullable=True)
    total_fare = Column(Float, nullable=False)
    currency = Column(String(3), default="INR")
    
    availability_status = Column(String(20), default="AVAILABLE") # AVAILABLE, SOLD_OUT
    collected_at = Column(DateTime, default=datetime.utcnow, index=True)
    quality_score = Column(Float, default=100.0)
    is_outlier = Column(Boolean, default=False)

    source = relationship("Source", back_populates="observations")
    airline = relationship("Airline", back_populates="observations")
    route = relationship("Route", back_populates="observations")

    __table_args__ = (
        Index("idx_obs_route_date_window", "route_id", "travel_date", "advance_window"),
    )


class ScrapingJob(Base):
    __tablename__ = "scraping_jobs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(20), default="RUNNING") # RUNNING, SUCCESS, FAILED, BLOCKED
    records_found = Column(Integer, default=0)
    records_valid = Column(Integer, default=0)
    records_rejected = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)

    source = relationship("Source", back_populates="jobs")


class IndexValue(Base):
    __tablename__ = "index_values"

    id = Column(Integer, primary_key=True, index=True)
    index_date = Column(String(10), nullable=False, index=True) # YYYY-MM-DD
    frequency = Column(String(10), default="daily")               # daily, weekly, monthly
    booking_window = Column(String(10), default="T+7")            # T+1, T+7, T+15, T+30, T+45, COMPOSITE
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True) # Null for National Composite Index
    
    index_value = Column(Float, nullable=False)
    median_price = Column(Float, nullable=True)
    base_period_price = Column(Float, nullable=True)
    weight = Column(Float, default=1.0)
    
    methodology_version = Column(String(10), default="v1.0")
    revision_status = Column(String(15), default="FINAL")          # PRELIMINARY, REVISED, FINAL
    created_at = Column(DateTime, default=datetime.utcnow)

    route = relationship("Route", back_populates="index_values")

    __table_args__ = (
        Index("idx_index_date_freq_win", "index_date", "frequency", "booking_window", "route_id"),
    )
