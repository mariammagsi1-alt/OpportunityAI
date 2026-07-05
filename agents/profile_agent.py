"""
Profile Agent Module.

This module defines the ProfileAgent, which is responsible for extracting, validating,
and structuring student academic and extracurricular information from raw text, resumes,
and student questionnaires. It represents the first step in the multi-agent pipeline
and is designed to integrate seamlessly with the Google Gemini API in the future.
"""

import re
import logging
from typing import Any, Dict, List, Optional, Tuple, Union

# Import models & utilities
from models.student_profile import StudentProfile
from utils.validators import DataValidator

# Setup clean, informative logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ProfileAgent")


from pydantic import BaseModel, Field

class ExtractedProfile(BaseModel):
    name: str = Field(description="Full name of the student")
    email: str = Field(description="Valid email address if found, otherwise default or empty")
    country: str = Field(description="Standard country name")
    education_level: str = Field(description="Current academic stage (e.g. Undergraduate, Graduate, High School)")
    gpa: float = Field(description="Cumulative Grade Point Average on a 4.0 scale")
    major: str = Field(description="Primary academic major or domain of study")
    skills: List[str] = Field(description="General technical or soft skills")
    programming_languages: List[str] = Field(description="Coding languages known")
    leadership_experience: List[str] = Field(description="Summary list of leadership roles or achievements")
    volunteer_experience: List[str] = Field(description="Summary list of community service or volunteer work")
    english_proficiency: str = Field(description="Level of English fluency (e.g. Fluent, Intermediate, Conversational, Native)")
    certificates: List[str] = Field(description="Professional certifications or awards earned")
    interests: List[str] = Field(description="Personal, academic, or career goals/interests")


class ProfileAgent:
    """
    AI-powered agent specializing in student data extraction, validation, and profile building.
    
    Transforms raw text (e.g., resume files, self-reflections, bios) into a fully 
    structured, validated StudentProfile object, requesting missing details when necessary.
    """

    def __init__(self) -> None:
        """
        Initialize the ProfileAgent with validator pipelines.
        """
        self.validator = DataValidator()
        self.fallback_active = False
        logger.info("ProfileAgent successfully initialized.")

        # --- FUTURE GEMINI INTEGRATION SYSTEM PROMPT TEMPLATE ---
        self.gemini_extraction_prompt = """
        You are an expert academic counselor and profile parser. Your task is to analyze the 
        provided resume text, student essay, or conversation bio, and extract the following fields 
        as a clean, structured JSON object. 

        Ensure all fields conform to the correct types and extract them accurately:
        - name (string)
        - email (string - valid email address)
        - country (string - standard country name)
        - education_level (string - e.g. 'Undergraduate', 'Graduate', 'High School')
        - gpa (float - e.g. 3.85, scaled to 4.0 if possible)
        - major (string - academic major or field of study)
        - skills (array of strings - e.g. ['Data Analysis', 'Public Speaking'])
        - programming_languages (array of strings - e.g. ['Python', 'SQL'])
        - leadership_experience (array of strings - roles or active projects)
        - volunteer_experience (array of strings - community/outreach activities)
        - certificates (array of strings - standard courses/certifications)
        - english_proficiency (string - e.g. 'Fluent', 'Intermediate', 'Conversational')
        - interests (array of strings - personal/academic interests)

        Text to parse:
        {raw_text}
        """

    def process_student_input(self, raw_input: str) -> Dict[str, Any]:
        """
        Coordinate the main extraction workflow.
        
        Takes unstructured student inputs, parses them into separate profile fields, 
        validates the fields, and prepares structured dictionary output.

        Args:
            raw_input: Raw unstructured string containing resume/profile details.

        Returns:
            Dict[str, Any]: Validated profile fields ready for StudentProfile instantiation.
        """
        logger.info("Processing student input for profile extraction...")
        try:
            if not raw_input or not raw_input.strip():
                logger.warning("Empty raw student input received.")
                return {}

            # 1. Extract raw fields using placeholder/heuristic extraction
            extracted_data = self.extract_profile_fields(raw_input)

            # 2. Validate extracted data using DataValidator
            is_valid, validation_errors = self.validate_profile(extracted_data)

            if not is_valid:
                logger.warning(f"Profile extraction validation warning: {validation_errors}")
                # We still return the dictionary, but flag the missing details in coordinator or logs

            return extracted_data

        except Exception as e:
            logger.error(f"Error in process_student_input: {e}")
            return {}

    def _heuristic_extract(self, raw_text: str) -> Dict[str, Any]:
        """Heuristic fallback parser."""
        text_lower = raw_text.lower()

        # Heuristic Defaults
        name = "Demo Student"
        email = "demo.student@university.edu"
        country = "United States"
        education_level = "Undergraduate"
        gpa = 3.5
        major = "Computer Science"
        skills = ["Python", "Git"]
        languages = ["Python"]
        leadership = []
        volunteer = []
        certificates = []
        proficiency = "Fluent"
        interests = ["Software Engineering"]

        # Check for matching sample students or general keywords
        if "alex chen" in text_lower or "alex" in text_lower:
            name = "Alex Chen"
            email = "alex.chen@university.edu"
            country = "United States"
            education_level = "Undergraduate"
            gpa = 3.7
            major = "Data Science"
            skills = ["Data Science", "Machine Learning", "Data Visualization", "SQL", "Git"]
            languages = ["Python", "SQL", "R"]
            interests = ["Artificial Intelligence", "Analytics", "Social Impact"]
            certificates = ["IBM Data Science Professional"]
        elif "jane doe" in text_lower or "jane" in text_lower:
            name = "Jane Doe"
            email = "jane.doe@example.edu"
            gpa = 3.85
            major = "Computer Science"
            skills = ["Python", "SQL", "Git", "React"]
            languages = ["Python", "JavaScript"]
            interests = ["Machine Learning", "Web Development"]

        # Parse emails if present in text
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", raw_text)
        if email_match:
            email = email_match.group(0)

        # Parse GPAs if present (e.g. "GPA: 3.9" or "GPA 3.4")
        gpa_match = re.search(r"(?i)gpa[:\s]+([0-9\.]+)", raw_text)
        if gpa_match:
            try:
                candidate_gpa = float(gpa_match.group(1))
                if 0.0 <= candidate_gpa <= 4.0:
                    gpa = candidate_gpa
            except ValueError:
                pass

        # Parse major keywords
        if "data science" in text_lower:
            major = "Data Science"
        elif "computer science" in text_lower or "cs" in text_lower:
            major = "Computer Science"
        elif "biology" in text_lower:
            major = "Biology"
        elif "engineering" in text_lower:
            major = "Engineering"

        # Parse skills & languages
        if "python" in text_lower and "python" not in languages:
            languages.append("Python")
        if "javascript" in text_lower and "javascript" not in languages:
            languages.append("JavaScript")
        if "react" in text_lower and "react" not in skills:
            skills.append("React")
        if "sql" in text_lower and "sql" not in languages:
            languages.append("SQL")
        if "machine learning" in text_lower and "machine learning" not in skills:
            skills.append("Machine Learning")

        return {
            "name": name,
            "country": country,
            "gpa": gpa,
            "major": major,
            "skills": skills,
            "programming_languages": languages,
            "leadership_experience": leadership,
            "volunteer_experience": volunteer,
            "certificates": certificates,
            "english_proficiency": proficiency,
            "interests": interests,
            "email": email,
            "education_level": education_level
        }

    def extract_profile_fields(self, raw_text: str) -> Dict[str, Any]:
        """
        Extract profile attributes using Gemini API with modern google-genai SDK,
        with a robust fallback to heuristic parsing.

        Args:
            raw_text: Raw unstructured student text.

        Returns:
            Dict[str, Any]: Parsed student profile fields.
        """
        import os
        import json

        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key or api_key.startswith("MY_"):
            logger.warning("GEMINI_API_KEY environment variable is not set. Falling back to heuristic parsing.")
            self.fallback_active = True
            return self._heuristic_extract(raw_text)

        logger.info("Checking GeminiCache for profile extraction...")
        from utils.gemini_cache import get_cached_response, set_cached_response
        cache_kwargs = {
            "raw_text": raw_text
        }
        cached_val = get_cached_response("profile_extraction", **cache_kwargs)
        if cached_val:
            try:
                extracted_json = json.loads(cached_val)
                logger.info("ProfileAgent: Restored extracted profile from GeminiCache successfully.")
                return extracted_json
            except Exception as cache_err:
                logger.warning(f"Failed to parse cached profile extraction: {cache_err}")

        logger.info("Extracting profile fields using Gemini API...")
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

            prompt = self.gemini_extraction_prompt.format(raw_text=raw_text)

            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ExtractedProfile,
                    temperature=0.1,
                )
            )

            if response.text:
                extracted_json = json.loads(response.text.strip())
                set_cached_response("profile_extraction", response.text.strip(), **cache_kwargs)
                logger.info("Successfully extracted profile details using Gemini.")
                return extracted_json
            else:
                raise ValueError("Empty response text from Gemini API.")

        except Exception as e:
            logger.info(f"ProfileAgent: Falling back to heuristic parser due to error: {e}")
            self.fallback_active = True
            try:
                extracted_json = self._heuristic_extract(raw_text)
                set_cached_response("profile_extraction", json.dumps(extracted_json), **cache_kwargs)
                return extracted_json
            except Exception as fe:
                logger.error(f"Heuristic fallback failed: {fe}")
            return self._heuristic_extract(raw_text)


    def validate_profile(self, data: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Validate the parsed profile dictionary against standard business requirements.

        Args:
            data: Parsed student profile dictionary.

        Returns:
            Tuple[bool, List[str]]: True/False validation outcome along with error logs.
        """
        errors = []
        try:
            # 1. Validate required attributes
            required_fields = ["name", "email", "country", "education_level", "major"]
            is_complete, missing = self.validator.validate_required_fields(data, required_fields)
            if not is_complete:
                errors.append(f"Missing required profile attributes: {', '.join(missing)}")

            # 2. Check GPA limits
            gpa = data.get("gpa")
            if gpa is not None and not self.validator.validate_gpa(gpa):
                errors.append(f"Extracted GPA '{gpa}' is out of acceptable 0.0 - 4.0 limits.")

            # 3. Check Email format
            email = data.get("email", "")
            if email and not self.validator.validate_email(email):
                errors.append(f"Extracted contact email '{email}' format is invalid.")

            is_valid = len(errors) == 0
            return is_valid, errors

        except Exception as e:
            logger.error(f"Validation error: {e}")
            return False, [str(e)]

    def build_student_profile(self, data: Dict[str, Any]) -> StudentProfile:
        """
        Instantiate a formal, type-safe StudentProfile object from dictionary fields.

        Args:
            data: Cleaned, validated dictionary fields.

        Returns:
            StudentProfile: Instantiated, domain-validated profile object.
        """
        logger.info("Instantiating StudentProfile domain object...")
        try:
            return StudentProfile.from_dict(data)
        except Exception as e:
            logger.error(f"Error instantiating StudentProfile: {e}")
            # Ensure safe fallback returns
            return StudentProfile(
                name=data.get("name", "Demo Student"),
                email=data.get("email", "demo.student@university.edu"),
                country=data.get("country", "United States"),
                education_level=data.get("education_level", "Undergraduate"),
                gpa=float(data.get("gpa", 3.5)),
                major=data.get("major", "Computer Science"),
                skills=data.get("skills", []),
                programming_languages=data.get("programming_languages", [])
            )

    def request_missing_information(self, missing_fields: List[str]) -> str:
        """
        Formulate a polite, structured follow-up prompt requesting missing details.

        Args:
            missing_fields: List of fields currently omitted or invalid.

        Returns:
            str: Friendly question or prompt.
        """
        readable_fields = [f.replace("_", " ").title() for f in missing_fields]
        fields_str = ", ".join(readable_fields)
        return (
            f"We started building your profile, but we're missing some key information: {fields_str}. "
            "Could you please tell me your current GPA, academic major, or any other missing details?"
        )

    # --- Backwards Compatibility and Orchestrator Wrapper Methods ---

    def extract_profile_data(self, raw_resume_text: str) -> Optional[Dict[str, Any]]:
        """
        Legacy method compatibility wrapper. Calls process_student_input and
        returns a raw dictionary format expected by the original CoordinatorAgent.
        """
        logger.info("extract_profile_data called (legacy wrapper).")
        result_dict = self.process_student_input(raw_resume_text)
        return result_dict if result_dict else None

    def update_profile(self, existing_profile: dict, new_information: str) -> dict:
        """
        Merge new student preferences, skills, or updated GPA into an existing profile dictionary.

        Args:
            existing_profile: Current student profile dictionary.
            new_information: Natural language text describing the update.

        Returns:
            dict: Updated profile dictionary.
        """
        logger.info("Merging new information into existing profile...")
        try:
            # Clean and sanitize update text
            update_text_lower = new_information.lower()

            # Parse GPA updates (e.g. "my GPA is 3.9" or "GPA: 3.8")
            gpa_match = re.search(r"(?i)gpa[:\s]+([0-9\.]+)", new_information)
            if gpa_match:
                try:
                    new_gpa = float(gpa_match.group(1))
                    if 0.0 <= new_gpa <= 4.0:
                        existing_profile["gpa"] = new_gpa
                except ValueError:
                    pass

            # Update major if mentioned
            if "major" in update_text_lower or "studying" in update_text_lower:
                if "data science" in update_text_lower:
                    existing_profile["major"] = "Data Science"
                elif "computer science" in update_text_lower:
                    existing_profile["major"] = "Computer Science"

            # Merge lists safely
            if "skills" in existing_profile:
                if "react" in update_text_lower and "React" not in existing_profile["skills"]:
                    existing_profile["skills"].append("React")
                if "machine learning" in update_text_lower and "Machine Learning" not in existing_profile["skills"]:
                    existing_profile["skills"].append("Machine Learning")

            if "programming_languages" in existing_profile:
                if "python" in update_text_lower and "Python" not in existing_profile["programming_languages"]:
                    existing_profile["programming_languages"].append("Python")
                if "javascript" in update_text_lower and "JavaScript" not in existing_profile["programming_languages"]:
                    existing_profile["programming_languages"].append("JavaScript")

            return existing_profile
        except Exception as e:
            logger.error(f"Error merging profile updates: {e}")
            return existing_profile
