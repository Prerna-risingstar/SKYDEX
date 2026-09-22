import numpy as np
from typing import List, Dict, Any

class OutlierDetector:
    """
    Statistical Outlier Detector for airfare observations.
    Ref: PRD Section 23.
    Uses Interquartile Range (IQR) and Median Absolute Deviation (MAD)
    to tag suspicious observations without deleting them.
    """
    @staticmethod
    def detect_outliers_iqr(prices: List[float], multiplier: float = 1.5) -> List[bool]:
        """
        Calculates IQR bounds:
        Q1 - 1.5 * IQR
        Q3 + 1.5 * IQR
        Returns boolean list where True indicates an outlier.
        """
        if len(prices) < 4:
            return [False] * len(prices)

        arr = np.array(prices, dtype=float)
        q25, q75 = np.percentile(arr, [25, 75])
        iqr = q75 - q25

        if iqr == 0:
            return [False] * len(prices)

        lower_bound = q25 - (multiplier * iqr)
        upper_bound = q75 + (multiplier * iqr)

        return [(p < lower_bound or p > upper_bound) for p in prices]

    @staticmethod
    def detect_outliers_mad(prices: List[float], threshold: float = 3.0) -> List[bool]:
        """
        Calculates MAD (Median Absolute Deviation) bounds:
        MAD = median(|p_i - median(P)|)
        Returns boolean list where True indicates an anomaly.
        """
        if len(prices) < 4:
            return [False] * len(prices)

        arr = np.array(prices, dtype=float)
        med = np.median(arr)
        mad = np.median(np.abs(arr - med))

        if mad == 0:
            return [False] * len(prices)

        modified_z_scores = 0.6745 * np.abs(arr - med) / mad
        return [(score > threshold) for score in modified_z_scores]

    @classmethod
    def flag_observations(cls, observations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Applies statistical outlier flagging per route-day group.
        """
        if not observations:
            return []

        prices = [obs["total_fare"] for obs in observations]
        iqr_flags = cls.detect_outliers_iqr(prices)

        flagged = []
        for obs, is_out in zip(observations, iqr_flags):
            item = dict(obs)
            item["is_outlier"] = is_out
            flagged.append(item)

        return flagged
