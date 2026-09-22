from typing import Dict, Any

class QualityScorer:
    """
    Computes a data quality score (0-100) for each observation.
    Ref: PRD Section 24.
    """
    @staticmethod
    def calculate_score(obs: Dict[str, Any]) -> float:
        score = 0.0

        # 1. Source Reliability (25%)
        source_type = obs.get("source_type", "AIRLINE")
        if source_type == "AIRLINE":
            score += 25.0  # Direct airline quotes have highest reliability
        else:
            score += 20.0  # OTA quotes

        # 2. Completeness (25%)
        # Check base_fare, taxes, fees presence
        components_present = 0
        if obs.get("base_fare") is not None:
            components_present += 1
        if obs.get("taxes") is not None:
            components_present += 1
        if obs.get("fees") is not None:
            components_present += 1
        
        score += (components_present / 3.0) * 25.0

        # 3. Price Consistency (20%)
        if not obs.get("is_outlier", False):
            score += 20.0
        else:
            score += 5.0

        # 4. Metadata Completeness (15%)
        meta_count = 0
        if obs.get("flight_number"):
            meta_count += 1
        if obs.get("departure_time"):
            meta_count += 1
        if obs.get("arrival_time"):
            meta_count += 1
        score += (meta_count / 3.0) * 15.0

        # 5. Timestamp & Currency Validity (15%)
        if obs.get("currency") == "INR" and obs.get("travel_date"):
            score += 15.0

        return round(score, 1)
