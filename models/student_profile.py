"""
Student Profile Data Model.

This module defines the StudentProfile class, which encapsulates all academic,
extracurricular, technical, and demographic information for a student seeking
opportunities. It also integrates validation logic to ensure data integrity.
"""

from typing import Any, Dict, List, Optional, Tuple
from utils.validators import DataValidator


class StudentProfile:
    """
    Data entity representing a student user in the OpportunityAI platform.

    Stores comprehensive profile attributes ranging from GPA and academic major
    to programming skills and leadership roles. Includes beginner-friendly
    methods to convert to/from dictionaries and check validity.
    """

    def __init__(
        self,
        name: str,
        email: str,
        country: str,
        education_level: str,
        gpa: float,
        major: str,
        skills: Optional[List[str]] = None,
        programming_languages: Optional[List[str]] = None,
        leadership_experience: Optional[List[str]] = None,
        volunteer_experience: Optional[List[str]] = None,
        english_proficiency: str = "Fluent",
        certificates: Optional[List[str]] = None,
        interests: Optional[List[str]] = None,
    ) -> None:
        """
        Initialize a new StudentProfile with academic and personal details.

        Args:
            name: Full name of the student.
            email: Student contact email address.
            country: Country of residence or citizenship (e.g., 'United States').
            education_level: Current academic stage (e.g., 'Undergraduate', 'Graduate', 'High School').
            gpa: Cumulative Grade Point Average on a 4.0 scale.
            major: Primary academic major or domain of study.
            skills: General technical or soft skills (e.g., ['Data Analysis', 'Public Speaking']).
            programming_languages: Coding languages known (e.g., ['Python', 'TypeScript', 'C++']).
            leadership_experience: Summary list of leadership roles or achievements.
            volunteer_experience: Summary list of community service or volunteer work.
            english_proficiency: Level of English fluency ('Native', 'Fluent', 'Intermediate').
            certificates: Professional certifications or awards earned.
            interests: Topics or career sectors of interest (e.g., ['AI Ethics', 'Climate Tech']).
        """
        # Core Identity & Academic Standing
        self.name: str = name
        self.email: str = email
        self.country: str = country
        self.education_level: str = education_level
        self.gpa: float = float(gpa) if gpa is not None else 0.0
        self.major: str = major
        self.english_proficiency: str = english_proficiency

        # Extracurriculars & Technical Capabilities (defaulting to empty lists if None)
        self.skills: List[str] = skills if skills is not None else []
        self.programming_languages: List[str] = (
            programming_languages if programming_languages is not None else []
        )
        self.leadership_experience: List[str] = (
            leadership_experience if leadership_experience is not None else []
        )
        self.volunteer_experience: List[str] = (
            volunteer_experience if volunteer_experience is not None else []
        )
        self.certificates: List[str] = certificates if certificates is not None else []
        self.interests: List[str] = interests if interests is not None else []

    def validate_profile(self) -> Tuple[bool, List[str]]:
        """
        Validate the profile fields using DataValidator.

        Checks that mandatory fields (name, email, major, etc.) are present
        and confirms that GPA and email follow standard formatting.

        Returns:
            Tuple[bool, List[str]]: True if valid along with an empty list, or False with error descriptions.
        """
        validator = DataValidator()
        errors: List[str] = []

        # 1. Check Required Fields
        profile_dict = self.to_dict()
        required_keys = ["name", "email", "country", "education_level", "major"]
        is_complete, missing = validator.validate_required_fields(profile_dict, required_keys)
        if not is_complete:
            errors.append(f"Missing required profile fields: {', '.join(missing)}")

        # 2. Validate Email Format
        if self.email and not validator.validate_email(self.email):
            errors.append(f"Invalid email address format: '{self.email}'")

        # 3. Validate GPA Scale (0.0 - 4.0)
        if not validator.validate_gpa(self.gpa):
            errors.append(f"GPA value {self.gpa} is out of valid range (0.0 to 4.0)")

        is_valid = len(errors) == 0
        return is_valid, errors

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the StudentProfile instance into a clean Python dictionary.

        This is useful for saving profiles to JSON files or sending data between agents.

        Returns:
            Dict[str, Any]: Dictionary containing all profile attributes.
        """
        return {
            "name": self.name,
            "email": self.email,
            "country": self.country,
            "education_level": self.education_level,
            "gpa": self.gpa,
            "major": self.major,
            "skills": self.skills,
            "programming_languages": self.programming_languages,
            "leadership_experience": self.leadership_experience,
            "volunteer_experience": self.volunteer_experience,
            "english_proficiency": self.english_proficiency,
            "certificates": self.certificates,
            "interests": self.interests,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "StudentProfile":
        """
        Create a StudentProfile instance from a raw dictionary loaded from JSON or user input.

        Args:
            data: Dictionary containing profile key-value pairs.

        Returns:
            StudentProfile: Instantiated profile object.
        """
        return cls(
            name=data.get("name", ""),
            email=data.get("email", ""),
            country=data.get("country", "United States"),
            education_level=data.get("education_level", "Undergraduate"),
            gpa=data.get("gpa", 0.0),
            major=data.get("major", "Undeclared"),
            skills=data.get("skills", []),
            programming_languages=data.get("programming_languages", []),
            leadership_experience=data.get("leadership_experience", []),
            volunteer_experience=data.get("volunteer_experience", []),
            english_proficiency=data.get("english_proficiency", "Fluent"),
            certificates=data.get("certificates", []),
            interests=data.get("interests", []),
        )

    def get_eligibility_tags(self) -> List[str]:
        """
        Generate keyword tags from student attributes for fast matching.

        Aggregates major, education level, programming languages, and key skills
        into a single scannable list of tags.

        Returns:
            List[str]: List of keyword tags (e.g., ['Undergraduate', 'Computer Science', 'Python']).
        """
        tags: List[str] = [self.education_level, self.major]
        tags.extend(self.programming_languages)
        tags.extend(self.skills)
        tags.extend(self.interests)

        # Clean and deduplicate tags while preserving order
        unique_tags: List[str] = []
        for tag in tags:
            if isinstance(tag, str) and tag.strip() and tag.strip() not in unique_tags:
                unique_tags.append(tag.strip())

        return unique_tags
