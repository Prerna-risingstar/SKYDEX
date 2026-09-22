from typing import Dict, Any, Tuple

class DataCleaner:
    """
    Validates, standardizes, and cleans raw airfare observations.
    Ref: PRD Section 19, 20, 21.
    """
    @staticmethod
    def validate_and_clean(obs: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Validates raw observation dict against criteria:
        - Origin, destination, travel_date, airline, total_fare must be present.
        - Total fare must be strictly positive.
        - Currency must be valid ('INR').
        - Preserves NULL for missing components (missing tax != 0 tax).
        - Correctly flags SOLD_OUT flights without zeroing total fare.
        
        Returns: (is_valid, rejection_reason, cleaned_observation)
        """
        origin = obs.get("origin")
        destination = obs.get("destination")
        travel_date = obs.get("travel_date")
        carrier = obs.get("carrier")
        total_fare = obs.get("total_fare")
        currency = obs.get("currency", "INR")

        if not origin or len(origin) != 3:
            return False, "INVALID_ORIGIN", obs
        if not destination or len(destination) != 3:
            return False, "INVALID_DESTINATION", obs
        if not travel_date:
            return False, "MISSING_TRAVEL_DATE", obs
        if not carrier:
            return False, "MISSING_CARRIER", obs
        if total_fare is None or not isinstance(total_fare, (int, float)):
            return False, "MISSING_TOTAL_FARE", obs
        if total_fare <= 0:
            return False, "NON_POSITIVE_FARE", obs
        if currency != "INR":
            return False, "INVALID_CURRENCY", obs

        cleaned = dict(obs)

        # Distinguish missing tax vs zero tax
        if cleaned.get("taxes") is None:
            cleaned["taxes"] = None

        if cleaned.get("base_fare") is None:
            cleaned["base_fare"] = None

        if cleaned.get("fees") is None:
            cleaned["fees"] = None

        # Ensure availability status is correctly preserved
        if cleaned.get("availability_status") not in ("AVAILABLE", "SOLD_OUT"):
            cleaned["availability_status"] = "AVAILABLE"

        return True, "", cleaned
