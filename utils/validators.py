"""
Data Validators Module.

This module provides the DataValidator class, which contains beginner-friendly
validation checks for student profiles and application data. It ensures that
critical inputs like email addresses, GPA scores, and mandatory fields are
valid before processing.
"""

import re
from typing import Any, Dict, List, Tuple


class DataValidator:
    """
    Input validation utility class for OpportunityAI.

    This class groups simple validation functions together so any agent or
    service can easily check if student data is clean and correctly formatted.
    """

    def __init__(self) -> None:
        """Initialize regular expression patterns for validation."""
        # A simple beginner-friendly regex pattern for matching standard email addresses
        self.email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

    def validate_gpa(self, gpa_value: Any) -> bool:
        """
        Verify that a GPA value is a number falling within the standard 0.0 to 4.0 scale.

        Args:
            gpa_value: The grade point average to check (can be float, int, or str).

        Returns:
            bool: True if valid (between 0.0 and 4.0), False otherwise.
        """
        try:
            # Convert string input to float if needed
            numeric_gpa = float(gpa_value)
            return 0.0 <= numeric_gpa <= 4.0
        except (ValueError, TypeError):
            # If conversion fails, it's not a valid GPA number
            return False

    def validate_email(self, email_string: str) -> bool:
        """
        Check if an email string has a valid format (e.g., student@university.edu).

        Args:
            email_string: Raw email address string.

        Returns:
            bool: True if the email matches standard format, False otherwise.
        """
        if not isinstance(email_string, str) or not email_string.strip():
            return False

        # Use regex match to confirm user@domain.extension structure
        return bool(re.match(self.email_regex, email_string.strip()))

    def validate_required_fields(
        self, data_dict: Dict[str, Any], required_keys: List[str]
    ) -> Tuple[bool, List[str]]:
        """
        Check if a dictionary contains all mandatory fields and that they are not empty.

        Args:
            data_dict: Dictionary containing raw student profile or form input.
            required_keys: List of key names that must be present and non-empty.

        Returns:
            Tuple[bool, List[str]]: A pair containing True/False status and a list of any missing field names.
        """
        missing_fields: List[str] = []

        if not isinstance(data_dict, dict):
            return False, required_keys

        for key in required_keys:
            # Check if key is missing or if its value is None or an empty string/list
            if key not in data_dict or data_dict[key] is None:
                missing_fields.append(key)
            elif isinstance(data_dict[key], str) and not data_dict[key].strip():
                missing_fields.append(key)
            elif isinstance(data_dict[key], (list, dict)) and len(data_dict[key]) == 0:
                missing_fields.append(key)

        is_valid = len(missing_fields) == 0
        return is_valid, missing_fields
