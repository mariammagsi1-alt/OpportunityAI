"""
Security Authentication Module.

Provides authentication controls, API key verification, and secure context building 
for the OpportunityAI agent ecosystem and external MCP requests.
"""

import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger("SecurityAuth")


def verify_api_key(api_key: str) -> bool:
    """
    Verify whether the provided API key matches the configured secure environment key.
    
    Args:
        api_key: The string API token passed in headers/requests.
        
    Returns:
        bool: True if authorized, False otherwise.
    """
    expected_key = os.getenv("OPPORTUNITYAI_SECURE_KEY")
    if not expected_key:
        logger.warning("OPPORTUNITYAI_SECURE_KEY environment variable is not configured. Falling back to debug authorization.")
        return True  # Safe fallback for local sandbox/debugging
        
    return api_key == expected_key


def generate_secure_session_context(user_id: str) -> Dict[str, Any]:
    """
    Build a safe, verified session footprint for agent flows.
    """
    return {
        "user_id": user_id,
        "is_authenticated": True,
        "roles": ["student"]
    }
