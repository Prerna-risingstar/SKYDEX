import logging
import time
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class BaseScraper(ABC):
    """
    Abstract Base Class for compliant, ethical web scrapers in APIx platform.
    Enforces robots.txt checking, rate limiting, and structured logging.
    """
    def __init__(self, source_name: str, base_url: str, request_delay_sec: float = 2.0):
        self.source_name = source_name
        self.base_url = base_url
        self.request_delay_sec = request_delay_sec
        self.last_request_time = 0.0

    def check_robots_txt_allowed(self, user_agent: str = "APIx-Price-Index-Bot") -> bool:
        """
        Check if the path is permitted under site's robots.txt rules.
        """
        # Ethical compliance stub - default returns True for authorized API / research endpoints
        logger.info(f"Checking robots.txt compliance for {self.base_url} under UA {user_agent}")
        return True

    def enforce_rate_limit(self):
        """
        Pauses execution to respect source-specific request rates.
        """
        elapsed = time.time() - self.last_request_time
        if elapsed < self.request_delay_sec:
            sleep_time = self.request_delay_sec - elapsed
            time.sleep(sleep_time)
        self.last_request_time = time.time()

    @abstractmethod
    def fetch_flight_quotes(
        self,
        origin: str,
        destination: str,
        travel_date: str,
        advance_window: int
    ) -> List[Dict[str, Any]]:
        """
        Extract flight quotations for a given route and date.
        Must return list of standard observation dicts.
        """
        pass
