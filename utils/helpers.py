"""
Helper Utilities Module.

This module defines FormatHelper, containing beginner-friendly helper methods
for formatting currency strings, calculating deadline countdowns, and text cleaning.
"""

from datetime import datetime


class FormatHelper:
    """
    Formatting and calculation utility helper class.
    """

    def __init__(self):
        """Initialize helper defaults."""
        pass

    def format_currency(self, numeric_amount: float) -> str:
        """
        Format a raw float into a clean US Dollar string (e.g., '$5,000').
        
        Args:
            numeric_amount: Number to format.
        """
        if numeric_amount is None:
            return "$0"
        try:
            return f"${float(numeric_amount):,.0f}"
        except (ValueError, TypeError):
            return str(numeric_amount)

    def days_until_deadline(self, deadline_str: str) -> int:
        """
        Calculate the number of remaining days between today and a due date.
        
        Args:
            deadline_str: Due date string in YYYY-MM-DD format.
        """
        if not deadline_str:
            return 30
        try:
            # Try parsing YYYY-MM-DD
            deadline_date = datetime.strptime(deadline_str.strip(), "%Y-%m-%d")
            delta = deadline_date - datetime.now()
            return max(0, delta.days)
        except Exception:
            return 30  # Default fallback if parsing fails

    def clean_text(self, raw_text: str) -> str:
        """
        Strip excessive whitespace and unwanted special characters from user input.
        
        Args:
            raw_text: Unprocessed string text.
        """
        if not raw_text:
            return ""
        import re
        # Strip excessive whitespace
        cleaned = re.sub(r'\s+', ' ', raw_text).strip()
        return cleaned
