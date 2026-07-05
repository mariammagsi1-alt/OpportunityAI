"""
Input Sanitization and Safety Module.

Provides sanitization utility functions to strip potential prompt injections, HTML tags,
and malicious scripts from student input profiles and goals prior to agent processing.
"""

import re
import logging
from typing import Any, Dict, Union

logger = logging.getLogger("SecuritySanitizer")


def sanitize_input_text(text: str) -> str:
    """
    Strip HTML tags, clean up special control characters, and mitigate simple injection attacks.
    
    Args:
        text: The raw user-supplied string.

    Returns:
        str: Cleaned, safe string.
    """
    if not text:
        return ""
        
    # Remove HTML markup if any
    clean_text = re.sub(r"<[^>]*>", "", text)
    
    # Strip dangerous payload headers or injection markers (e.g. system instruction overrides)
    clean_text = re.sub(r"(?i)ignore\s+all\s+previous\s+instructions", "[REDACTED INJECTION ATTEMPT]", clean_text)
    
    return clean_text.strip()


def sanitize_student_profile(raw_profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recursively sanitize text values within a raw student profile dictionary.
    """
    logger.info("Sanitizing student profile input fields...")
    sanitized = {}
    for key, value in raw_profile.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_input_text(value)
        elif isinstance(value, list):
            sanitized[key] = [sanitize_input_text(v) if isinstance(v, str) else v for v in value]
        elif isinstance(value, dict):
            sanitized[key] = sanitize_student_profile(value)
        else:
            sanitized[key] = value
    return sanitized
