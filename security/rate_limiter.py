"""
Rate Limiter Module.

Enforces system usage controls, preventing rapid, repeated requests that might 
overload or abuse the matching and search agents.
"""

import time
import logging
from typing import Dict, Tuple

logger = logging.getLogger("RateLimiter")


class SimpleRateLimiter:
    """
    A simple in-memory rate limiter using the Token Bucket algorithm concept.
    """

    def __init__(self, requests_per_minute: int = 60) -> None:
        """
        Initialize rate limiter settings.
        """
        self.limit = requests_per_minute
        self.client_timestamps: Dict[str, list] = {}
        logger.info(f"Rate Limiter configured with a limit of {self.limit} requests/min.")

    def is_allowed(self, client_ip: str) -> bool:
        """
        Determine if the requesting client has exceeded their limit.
        
        Args:
            client_ip: Unique identifier (IP address or API client ID).
            
        Returns:
            bool: True if the request is permitted, False if rate limited.
        """
        now = time.time()
        one_minute_ago = now - 60.0

        if client_ip not in self.client_timestamps:
            self.client_timestamps[client_ip] = [now]
            return True

        # Filter out timestamps older than 1 minute
        history = [t for t in self.client_timestamps[client_ip] if t > one_minute_ago]
        self.client_timestamps[client_ip] = history

        if len(history) < self.limit:
            self.client_timestamps[client_ip].append(now)
            return True

        logger.warning(f"Rate limit exceeded for client: {client_ip}")
        return False
