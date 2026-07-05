"""
Scoring Service Module.

This module provides the ScoringService class, which calculates compatibility match scores
(0-100%) between student profiles and available opportunities. It uses a transparent,
weighted multi-category scoring system.
"""

import logging
from typing import Any, Dict, List, Tuple, Union

# Import the core models for type hints and conversion
from models.student_profile import StudentProfile
from models.opportunity import Opportunity

# Setup clean, informative logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ScoringService")


class ScoringService:
    """
    Deterministic scoring engine for OpportunityAI.

    Computes match compatibility using a transparent weighted scoring system:
    - GPA: 20%
    - Major: 20%
    - Skills: 25%
    - Leadership: 10%
    - Volunteer Experience: 10%
    - Projects/Certificates: 10%
    - English Proficiency: 5%
    """

    def __init__(self) -> None:
        """Initialize the ScoringService."""
        # Define category weight constants (totaling 1.0 or 100%)
        self.WEIGHT_GPA = 0.20
        self.WEIGHT_MAJOR = 0.20
        self.WEIGHT_SKILLS = 0.25
        self.WEIGHT_LEADERSHIP = 0.10
        self.WEIGHT_VOLUNTEER = 0.10
        self.WEIGHT_PROJECTS = 0.10
        self.WEIGHT_ENGLISH = 0.05

    def _ensure_objects(self, student_profile: Any, opportunity: Any) -> Tuple[StudentProfile, Opportunity]:
        """
        Helper method to guarantee that raw dictionaries are converted to standard
        domain model objects (StudentProfile & Opportunity) for type safety and method reuse.

        Args:
            student_profile: StudentProfile instance or a dictionary representing one.
            opportunity: Opportunity instance or a dictionary representing one.

        Returns:
            Tuple[StudentProfile, Opportunity]: Unpacked clean model instances.
        """
        # Parse student profile if it is a dictionary
        if isinstance(student_profile, dict):
            student_obj = StudentProfile.from_dict(student_profile)
        else:
            student_obj = student_profile

        # Parse opportunity if it is a dictionary
        if isinstance(opportunity, dict):
            opportunity_obj = Opportunity.from_dict(opportunity)
        else:
            opportunity_obj = opportunity

        return student_obj, opportunity_obj

    def calculate_match_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate the overall compatibility score (0 to 100) between a student and an opportunity.

        Args:
            student_profile: StudentProfile object or dict containing student credentials.
            opportunity: Opportunity object or dict containing opportunity requirements.

        Returns:
            float: Cumulative compatibility score rounded to 2 decimal places.
        """
        logger.info("Computing overall weighted compatibility score...")
        try:
            # Coerce input formats safely
            student, opp = self._ensure_objects(student_profile, opportunity)

            # Retrieve scores from individual categories
            gpa_score = self.calculate_gpa_score(student, opp)
            major_score = self.calculate_major_score(student, opp)
            skill_score = self.calculate_skill_score(student, opp)
            leadership_score = self.calculate_leadership_score(student, opp)
            volunteer_score = self.calculate_volunteer_score(student, opp)
            project_score = self.calculate_project_score(student, opp)
            english_score = self.calculate_english_score(student, opp)

            # Sum up category scores (the sub-scores already incorporate the category weights)
            total_score = (
                gpa_score +
                major_score +
                skill_score +
                leadership_score +
                volunteer_score +
                project_score +
                english_score
            )

            # Return rounded, clamped score (0.0 to 100.0)
            final_match_score = max(0.0, min(100.0, total_score))
            return round(final_match_score, 2)

        except Exception as e:
            logger.error(f"Error calculating overall match score: {e}")
            # Safe default fallback score in case of unexpected execution failures
            return 0.0

    def calculate_gpa_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate compatibility score for the GPA category (weighted max: 20 points).

        Linear scaling of student's GPA out of a perfect 4.0.
        
        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            float: GPA score out of 20.0 points.
        """
        try:
            student, opp = self._ensure_objects(student_profile, opportunity)
            student_gpa = float(student.gpa)

            # TODO: Integrate AI reasoning to evaluate foreign grading scales (e.g., ECTS, 10.0 scale)
            # For now, we scale linearly against the standard 4.0 GPA scale
            raw_ratio = student_gpa / 4.0
            score = raw_ratio * (self.WEIGHT_GPA * 100.0)

            # Clamp between 0.0 and the category weight cap
            return max(0.0, min(self.WEIGHT_GPA * 100.0, score))
        except Exception as e:
            logger.error(f"Error calculating GPA score: {e}")
            return 0.0

    def calculate_major_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate compatibility score for academic major alignment (weighted max: 20 points).

        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            float: Major score (20.0 if matched, 0.0 if mismatched).
        """
        try:
            student, opp = self._ensure_objects(student_profile, opportunity)

            # TODO: Integrate semantic AI embeddings or taxonomy lists to identify related majors
            # (e.g., matching 'Electrical Engineering' with 'Computer Engineering' or STEM)
            # For now, we rely on the Opportunity matches_major rule-based method
            if opp.matches_major(student.major):
                return self.WEIGHT_MAJOR * 100.0
            
            return 0.0
        except Exception as e:
            logger.error(f"Error calculating major score: {e}")
            return 0.0

    def calculate_skill_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate compatibility score based on technical and soft skills (weighted max: 25 points).

        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            float: Skill score out of 25.0 points.
        """
        try:
            student, opp = self._ensure_objects(student_profile, opportunity)

            # Combine core skills and coding/programming languages as the student's portfolio
            student_skills = [s.strip().lower() for s in student.skills]
            student_langs = [l.strip().lower() for l in student.programming_languages]
            full_portfolio = set(student_skills + student_langs)

            required_skills = [s.strip().lower() for s in opp.required_skills]

            # If no skills are recommended or required, give full marks
            if not required_skills:
                return self.WEIGHT_SKILLS * 100.0

            # Find matching/overlapping skills
            matches = sum(1 for skill in required_skills if skill in full_portfolio)

            # TODO: Integrate LLM mapping to detect skill equivalencies (e.g., matching 'React' to 'Vue' or 'Front-end Development')
            ratio = matches / len(required_skills)
            score = ratio * (self.WEIGHT_SKILLS * 100.0)

            return max(0.0, min(self.WEIGHT_SKILLS * 100.0, score))
        except Exception as e:
            logger.error(f"Error calculating skill score: {e}")
            return 0.0

    def calculate_leadership_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate score for leadership experience (weighted max: 10 points).

        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            float: Leadership score (0, 5, or 10 points).
        """
        try:
            student, _ = self._ensure_objects(student_profile, None)
            roles_count = len(student.leadership_experience)

            # TODO: Implement NLP entity extraction to evaluate the impact and quality of leadership roles
            if roles_count == 0:
                return 0.0
            elif roles_count == 1:
                return 0.5 * (self.WEIGHT_LEADERSHIP * 100.0)
            else:
                return self.WEIGHT_LEADERSHIP * 100.0
        except Exception as e:
            logger.error(f"Error calculating leadership score: {e}")
            return 0.0

    def calculate_volunteer_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate score for community and volunteer experience (weighted max: 10 points).

        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            float: Volunteer score (0, 5, or 10 points).
        """
        try:
            student, _ = self._ensure_objects(student_profile, None)
            volunteer_count = len(student.volunteer_experience)

            # TODO: Implement semantic analysis of volunteer role descriptions for alignment with social impact
            if volunteer_count == 0:
                return 0.0
            elif volunteer_count == 1:
                return 0.5 * (self.WEIGHT_VOLUNTEER * 100.0)
            else:
                return self.WEIGHT_VOLUNTEER * 100.0
        except Exception as e:
            logger.error(f"Error calculating volunteer score: {e}")
            return 0.0

    def calculate_project_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate score based on certificates, achievements, and projects (weighted max: 10 points).

        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            float: Projects/certificates score out of 10.0 points.
        """
        try:
            student, _ = self._ensure_objects(student_profile, None)
            cert_count = len(student.certificates)

            # TODO: Add specific parsing for project links (e.g. GitHub repos) and certificate validation
            # Reward 5 points per certificate up to a maximum of 10 points
            score = cert_count * 5.0
            return max(0.0, min(self.WEIGHT_PROJECTS * 100.0, score))
        except Exception as e:
            logger.error(f"Error calculating project/certificate score: {e}")
            return 0.0

    def calculate_english_score(self, student_profile: Any, opportunity: Any) -> float:
        """
        Calculate score based on English proficiency (weighted max: 5 points).

        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            float: English proficiency score out of 5.0 points.
        """
        try:
            student, _ = self._ensure_objects(student_profile, None)
            proficiency = student.english_proficiency.strip().lower()

            # TODO: Implement standardized test-score parsing (TOEFL, IELTS, Duolingo) for automated level mappings
            if "native" in proficiency or "fluent" in proficiency:
                return self.WEIGHT_ENGLISH * 100.0
            elif "intermediate" in proficiency:
                return 0.6 * (self.WEIGHT_ENGLISH * 100.0)
            elif "beginner" in proficiency or "basic" in proficiency:
                return 0.2 * (self.WEIGHT_ENGLISH * 100.0)
            else:
                return 0.4 * (self.WEIGHT_ENGLISH * 100.0)
        except Exception as e:
            logger.error(f"Error calculating English score: {e}")
            return 0.0

    def generate_score_breakdown(self, student_profile: Any, opportunity: Any) -> Dict[str, Any]:
        """
        Compile a complete score report showing the overall rating and breakdown.

        Args:
            student_profile: StudentProfile object or dict.
            opportunity: Opportunity object or dict.

        Returns:
            Dict[str, Any]: Nested dictionary describing weights, scores, and evaluation details.
        """
        try:
            student, opp = self._ensure_objects(student_profile, opportunity)

            # Calculate individual weighted scores
            gpa_score = self.calculate_gpa_score(student, opp)
            major_score = self.calculate_major_score(student, opp)
            skill_score = self.calculate_skill_score(student, opp)
            leadership_score = self.calculate_leadership_score(student, opp)
            volunteer_score = self.calculate_volunteer_score(student, opp)
            project_score = self.calculate_project_score(student, opp)
            english_score = self.calculate_english_score(student, opp)

            # Calculate total
            final_match_score = gpa_score + major_score + skill_score + leadership_score + volunteer_score + project_score + english_score
            final_match_score = round(max(0.0, min(100.0, final_match_score)), 2)

            # Compile structural breakdown
            return {
                "opportunity_id": opp.id,
                "opportunity_title": opp.title,
                "final_match_score": final_match_score,
                "categories": {
                    "gpa": {
                        "score": round(gpa_score, 2),
                        "max_points": self.WEIGHT_GPA * 100.0,
                        "weight": f"{int(self.WEIGHT_GPA * 100)}%"
                    },
                    "major": {
                        "score": round(major_score, 2),
                        "max_points": self.WEIGHT_MAJOR * 100.0,
                        "weight": f"{int(self.WEIGHT_MAJOR * 100)}%"
                    },
                    "skills": {
                        "score": round(skill_score, 2),
                        "max_points": self.WEIGHT_SKILLS * 100.0,
                        "weight": f"{int(self.WEIGHT_SKILLS * 100)}%"
                    },
                    "leadership": {
                        "score": round(leadership_score, 2),
                        "max_points": self.WEIGHT_LEADERSHIP * 100.0,
                        "weight": f"{int(self.WEIGHT_LEADERSHIP * 100)}%"
                    },
                    "volunteer": {
                        "score": round(volunteer_score, 2),
                        "max_points": self.WEIGHT_VOLUNTEER * 100.0,
                        "weight": f"{int(self.WEIGHT_VOLUNTEER * 100)}%"
                    },
                    "projects_certificates": {
                        "score": round(project_score, 2),
                        "max_points": self.WEIGHT_PROJECTS * 100.0,
                        "weight": f"{int(self.WEIGHT_PROJECTS * 100)}%"
                    },
                    "english": {
                        "score": round(english_score, 2),
                        "max_points": self.WEIGHT_ENGLISH * 100.0,
                        "weight": f"{int(self.WEIGHT_ENGLISH * 100)}%"
                    }
                }
            }
        except Exception as e:
            logger.error(f"Failed to generate score breakdown dictionary: {e}")
            return {
                "opportunity_id": getattr(opportunity, "id", "unknown") if not isinstance(opportunity, dict) else opportunity.get("id", "unknown"),
                "final_match_score": 0.0,
                "error": str(e)
            }
