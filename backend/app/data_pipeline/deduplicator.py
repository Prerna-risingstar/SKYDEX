from typing import List, Dict, Any, Set

class DataDeduplicator:
    """
    Identifies duplicate flight quotes extracted during search retries or multi-page crawling,
    while preserving source-level price variation.
    Ref: PRD Section 22.
    """
    @staticmethod
    def deduplicate(observations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        seen_keys: Set[str] = set()
        unique_observations = []

        for obs in observations:
            # Deduplication key includes source, flight_number, travel_date, departure_time, total_fare
            source = obs.get("source", "")
            carrier = obs.get("carrier", "")
            flight_num = obs.get("flight_number", "")
            travel_date = obs.get("travel_date", "")
            dep_time = obs.get("departure_time", "")
            advance = obs.get("advance_window", "")
            total_fare = obs.get("total_fare", 0.0)

            key = f"{source}|{carrier}|{flight_num}|{travel_date}|{dep_time}|{advance}|{total_fare}"

            if key in seen_keys:
                continue

            seen_keys.add(key)
            unique_observations.append(obs)

        return unique_observations
