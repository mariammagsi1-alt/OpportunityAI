"""
Opportunity Data Model.

This module defines the Opportunity class, which represents a single record of
an educational or career offering (Scholarships, Hackathons, Competitions, etc.)
within the OpportunityAI system. It includes helper methods for validation,
filtering eligibility criteria (like country, major, and skills), and date parsing.
"""

from datetime import datetime, date
from typing import Any, Dict, List, Optional, Tuple


class Opportunity:
    """
    Data entity representing an educational, funding, or career opportunity.

    Unified model used for Scholarships, Hackathons, Competitions, Leadership,
    Fellowships, and Internships. Provides utility methods to evaluate eligibility.
    """

    def __init__(
        self,
        id: str,
        title: str,
        category: str,
        organization: str,
        country: str = "Global",
        application_mode: str = "Online",
        education_level: str = "All",
        eligible_majors: Optional[List[str]] = None,
        required_skills: Optional[List[str]] = None,
        funding_type: str = "Other",
        stipend: str = "N/A",
        application_deadline: str = "2026-12-31",
        duration: str = "N/A",
        eligibility_requirements: Optional[List[str]] = None,
        description: str = "",
        official_link: str = "",
    ) -> None:
        """
        Initialize an Opportunity record.

        Args:
            id: Unique identifier for the opportunity (e.g., 'sch-01', 'hack-05').
            title: Title of the program, award, or position.
            category: Type of opportunity (Scholarship, Hackathon, Fellowship, etc.).
            organization: Sponsoring company, foundation, or organization.
            country: Allowed country or 'Global' if open to anyone.
            application_mode: Location format ('Online', 'Offline', 'Hybrid').
            education_level: Required education level (e.g., 'Undergraduate', 'Graduate', 'All').
            eligible_majors: List of academic majors allowed (e.g., ['Computer Science', 'Data Science']).
            required_skills: List of technical or general skills recommended (e.g., ['Python', 'React']).
            funding_type: Funding tier (e.g., 'Fully Funded', 'Partially Funded', 'Unpaid').
            stipend: Details of cash award or pay scale (e.g., '$10,000', '$45/hr').
            application_deadline: ISO date string format (YYYY-MM-DD).
            duration: Program duration (e.g., '12 weeks', '6 months').
            eligibility_requirements: List of hard prerequisite criteria text.
            description: Concise descriptive text of the offering.
            official_link: URL to apply or learn more.
        """
        self.id: str = id
        self.title: str = title
        self.category: str = category
        self.organization: str = organization
        self.country: str = country
        self.application_mode: str = application_mode  # Online / Offline / Hybrid
        self.education_level: str = education_level
        self.eligible_majors: List[str] = eligible_majors if eligible_majors is not None else []
        self.required_skills: List[str] = required_skills if required_skills is not None else []
        self.funding_type: str = funding_type
        self.stipend: str = stipend
        self.application_deadline: str = application_deadline  # YYYY-MM-DD
        self.duration: str = duration
        self.eligibility_requirements: List[str] = (
            eligibility_requirements if eligibility_requirements is not None else []
        )
        self.description: str = description
        self.official_link: str = official_link

    def validate(self) -> Tuple[bool, List[str]]:
        """
        Check that all critical fields are correctly filled and valid.

        Ensures id, title, category, organization, and application_deadline are present,
        and verifies that application_deadline is formatted as YYYY-MM-DD.

        Returns:
            Tuple[bool, List[str]]: (is_valid, list of error messages)
        """
        errors: List[str] = []

        # Validate mandatory string attributes are filled
        if not self.id or not self.id.strip():
            errors.append("Opportunity 'id' cannot be empty.")
        if not self.title or not self.title.strip():
            errors.append("Opportunity 'title' cannot be empty.")
        if not self.category or not self.category.strip():
            errors.append("Opportunity 'category' cannot be empty.")
        if not self.organization or not self.organization.strip():
            errors.append("Opportunity 'organization' cannot be empty.")

        # Validate date format for application_deadline
        try:
            datetime.strptime(self.application_deadline, "%Y-%m-%d")
        except ValueError:
            errors.append(f"Application deadline '{self.application_deadline}' must be in YYYY-MM-DD format.")

        is_valid = len(errors) == 0
        return is_valid, errors

    def is_deadline_passed(self, reference_date_str: Optional[str] = None) -> bool:
        """
        Determine if the application deadline has already passed.

        Args:
            reference_date_str: Optional reference date to compare against (YYYY-MM-DD).
                               Defaults to today's date if not specified.

        Returns:
            bool: True if the deadline date is strictly before the reference date, False otherwise.
        """
        try:
            deadline_date = datetime.strptime(self.application_deadline, "%Y-%m-%d").date()
            
            if reference_date_str:
                ref_date = datetime.strptime(reference_date_str, "%Y-%m-%d").date()
            else:
                ref_date = date.today()

            return deadline_date < ref_date
        except ValueError:
            # TODO: Add advanced AI natural language date parsing support later.
            # In case of malformed dates, safely assume deadline is not passed.
            return False

    def matches_country(self, student_country: str) -> bool:
        """
        Determine if the student's country meets the opportunity's geographic restriction.

        Args:
            student_country: Country where the student resides or holds citizenship.

        Returns:
            bool: True if the opportunity is open globally or matches student_country.
        """
        opp_country_clean = self.country.strip().lower()
        student_country_clean = student_country.strip().lower()

        # "global" or "any" means open to all countries
        if opp_country_clean in ["global", "any", "worldwide", "all"]:
            return True

        return opp_country_clean == student_country_clean

    def matches_education_level(self, student_level: str) -> bool:
        """
        Determine if the opportunity accepts the student's current education level.

        Args:
            student_level: Student's education level (e.g., 'Undergraduate', 'High School').

        Returns:
            bool: True if the educational levels align or if open to all.
        """
        opp_level_clean = self.education_level.strip().lower()
        student_level_clean = student_level.strip().lower()

        if opp_level_clean in ["all", "any", "none", "flexible"]:
            return True

        return opp_level_clean == student_level_clean

    def matches_major(self, student_major: str) -> bool:
        """
        Evaluate if the opportunity aligns with the student's field of study.

        Args:
            student_major: The student's primary academic major (e.g., 'Computer Science').

        Returns:
            bool: True if eligible_majors is empty (open to all majors), matches exactly,
                  or is related.
        """
        if not self.eligible_majors:
            # If no majors are listed, it's open to all majors
            return True

        student_major_clean = student_major.strip().lower()

        # Check for direct or substring match
        for major in self.eligible_majors:
            major_clean = major.strip().lower()
            if major_clean in ["any", "all", "undeclared"]:
                return True
            if major_clean == student_major_clean or major_clean in student_major_clean or student_major_clean in major_clean:
                return True

        return False

    def matches_skills(self, student_skills: List[str]) -> bool:
        """
        Check if the student has skills matching the opportunity's recommendations.

        Args:
            student_skills: List of skills possessed by the student.

        Returns:
            bool: True if there is at least one overlapping skill, or if no skills are required.
        """
        if not self.required_skills:
            # If there are no required skills, it's a match
            return True

        # Clean and lower-case the lists for accurate comparison
        opp_skills_set = {s.strip().lower() for s in self.required_skills}
        student_skills_set = {s.strip().lower() for s in student_skills}

        # Check if there is any intersection (common elements)
        overlap = opp_skills_set.intersection(student_skills_set)
        
        # TODO: Implement advanced semantic embeddings or fuzzy match comparison for skills
        return len(overlap) > 0

    def to_dict(self) -> Dict[str, Any]:
        """
        Serialize the Opportunity instance into a standard Python dictionary.

        Returns:
            Dict[str, Any]: A dictionary representation of all opportunity fields.
        """
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "organization": self.organization,
            "country": self.country,
            "application_mode": self.application_mode,
            "education_level": self.education_level,
            "eligible_majors": self.eligible_majors,
            "required_skills": self.required_skills,
            "funding_type": self.funding_type,
            "stipend": self.stipend,
            "application_deadline": self.application_deadline,
            "duration": self.duration,
            "eligibility_requirements": self.eligibility_requirements,
            "description": self.description,
            "official_link": self.official_link,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Opportunity":
        """
        Instantiate an Opportunity object from a standard dictionary representation.

        Handles potential variations in dictionary keys (e.g. mapping legacy 'opp_id' to 'id',
        or 'awardOrStipend' to 'stipend') to ensure broad compatibility.

        Args:
            data: Raw dictionary containing opportunity details.

        Returns:
            Opportunity: Instantiated opportunity object.
        """
        # Resolve potentially dynamic keys for broad compatibility across schemas
        opp_id = data.get("id") or data.get("opp_id") or "unknown"
        stipend_val = data.get("stipend") or data.get("awardOrStipend") or "N/A"
        deadline_val = data.get("application_deadline") or data.get("deadline") or "2026-12-31"
        required_skills_val = data.get("required_skills") or data.get("requiredSkills") or []
        application_mode_val = data.get("application_mode") or data.get("modality") or "Online"
        
        # Build list from incoming data parameters
        return cls(
            id=opp_id,
            title=data.get("title", ""),
            category=data.get("category", ""),
            organization=data.get("organization", ""),
            country=data.get("country", "Global"),
            application_mode=application_mode_val,
            education_level=data.get("education_level") or data.get("difficulty") or "All",
            eligible_majors=data.get("eligible_majors", []),
            required_skills=required_skills_val,
            funding_type=data.get("funding_type", "Other"),
            stipend=stipend_val,
            application_deadline=deadline_val,
            duration=data.get("duration", "N/A"),
            eligibility_requirements=data.get("eligibility_requirements", []),
            description=data.get("description", ""),
            official_link=data.get("official_link", ""),
        )
