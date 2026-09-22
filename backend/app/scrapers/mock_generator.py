import random
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.scrapers.base import BaseScraper

class RealisticMockScraper(BaseScraper):
    """
    Simulates high-fidelity Indian domestic airfare observations across routes,
    airlines, OTAs, and advance booking windows.
    Incorporates empirical price curves:
    - Distance scaling
    - Advance purchase lead time multiplier (T+45 baseline to T+1 last-minute premium)
    - Day-of-week seasonality (Friday/Sunday premium)
    - Carrier business model variance (FSC vs LCC)
    - Realistic fare itemization (Base Fare, Taxes, User Development Fees)
    - Synthetic anomaly injection for cleaning verification
    """
    def __init__(self):
        super().__init__(source_name="APIx Synthetic Generator", base_url="https://mock.apix.in", request_delay_sec=0.0)

    def fetch_flight_quotes(
        self,
        origin: str,
        destination: str,
        travel_date: str,
        advance_window: int,
        route_distance: float = 1150.0,
        airline_code: str = "6E",
        airline_type: str = "LCC",
        source_name: str = "IndiGo Direct"
    ) -> List[Dict[str, Any]]:
        
        self.enforce_rate_limit()

        # Parse date to evaluate day-of-week factor
        t_date = datetime.strptime(travel_date, "%Y-%m-%d")
        day_of_week = t_date.weekday() # 0 = Monday, 6 = Sunday
        
        # Day of week factor (Fri & Sun are ~12% more expensive)
        dow_factor = 1.12 if day_of_week in (4, 6) else (0.95 if day_of_week in (1, 2) else 1.0)

        # Advance Purchase Multiplier (Curve: T+45 cheapest, T+1 peak)
        window_multipliers = {
            45: 0.72,
            30: 0.85,
            15: 1.00,
             7: 1.25,
             1: 1.75
        }
        advance_factor = window_multipliers.get(advance_window, 1.0)

        # Carrier type factor (Full Service Carrier vs Low Cost Carrier)
        carrier_factor = 1.18 if airline_type == "FSC" else 1.0

        # Base price per km calculation with noise
        base_rate_per_km = 3.2 + random.uniform(-0.3, 0.4)
        raw_total_fare = route_distance * base_rate_per_km * advance_factor * dow_factor * carrier_factor

        # Round to standard airfare pricing (.00 or .99)
        raw_total_fare = max(1800.0, round(raw_total_fare / 50) * 50)

        # Generate 2 to 4 flights per query session
        results = []
        flight_times = [
            ("06:00", "08:15"),
            ("09:30", "11:45"),
            ("14:15", "16:30"),
            ("19:00", "21:15"),
            ("21:45", "23:55")
        ]

        # 2% chance of injecting an anomaly for quality testing
        inject_anomaly = random.random() < 0.02

        selected_times = random.sample(flight_times, k=min(3, len(flight_times)))
        for idx, (dep, arr) in enumerate(selected_times):
            flight_num = f"{airline_code}-{random.randint(100, 999)}"
            
            # Flight time prime slot factor (Morning/Evening peak +8%)
            time_factor = 1.08 if dep in ("06:00", "19:00") else 1.0
            
            flight_total = raw_total_fare * time_factor * random.uniform(0.96, 1.04)
            
            if inject_anomaly and idx == 0:
                # Inject anomalous low/high price
                flight_total = flight_total * 4.5 if random.random() > 0.5 else flight_total * 0.15

            flight_total = max(1500.0, round(flight_total, 2))

            # Fare component breakdown
            base_fare = round(flight_total * 0.76, 2)
            taxes = round(flight_total * 0.16, 2)
            fees = round(flight_total - (base_fare + taxes), 2)

            results.append({
                "source": source_name,
                "carrier": airline_code,
                "origin": origin,
                "destination": destination,
                "flight_number": flight_num,
                "travel_date": travel_date,
                "departure_time": dep,
                "arrival_time": arr,
                "advance_window": advance_window,
                "fare_class": "Economy",
                "base_fare": base_fare,
                "taxes": taxes,
                "fees": fees,
                "total_fare": flight_total,
                "currency": "INR",
                "availability_status": "AVAILABLE" if random.random() > 0.05 else "SOLD_OUT"
            })

        return results
