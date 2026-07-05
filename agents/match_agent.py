"""
Match Agent Module.

This module defines the MatchAgent, which is responsible for evaluating all opportunities 
returned by the SearchAgent. It coordinates deterministic scoring by delegating to 
ScoringService and structures complete match results with strengths, missing skills, 
and placeholders for future Gemini AI narrative explanations and improvement suggestions.
"""

import logging
from typing import Any, Dict, List, Optional, Union

# Import the core domain models
from models.student_profile import StudentProfile
from models.opportunity import Opportunity

# Import backend ScoringService to delegate mathematical weights
from services.scoring_service import ScoringService

# Setup clean, informative logging for tracking agent activity
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MatchAgent")


from pydantic import BaseModel, Field

class MatchFeedback(BaseModel):
    ai_explanation: str = Field(description="An encouraging, detailed, human-like narrative explanation of WHY this opportunity matches the student's profile.")
    improvement_suggestions: str = Field(description="Concrete, highly actionable improvement suggestions to help this student prepare for and successfully apply to this opportunity.")


class MatchAgent:
    """
    Agent responsible for evaluating, ranking, and organizing opportunity matches.

    Rather than calculating scores directly, it delegates deterministic scoring to 
    the ScoringService, identifies skill gaps and match strengths, and builds 
    rich, structured feedback results.
    """

    def __init__(self, scoring_service: Optional[ScoringService] = None) -> None:
        """
        Initialize the MatchAgent with a ScoringService instance.

        Args:
            scoring_service: An optional pre-configured ScoringService. If None,
                            instantiates a default ScoringService.
        """
        if scoring_service is not None:
            self.scoring_service: ScoringService = scoring_service
        else:
            self.scoring_service = ScoringService()

        self.fallback_active = False

        # Prompt for Gemini to generate tailored match explanation
        self.gemini_match_explanation_prompt = """
        You are an expert career advisor and fellowship coach.
        You are analyzing the compatibility between a student and an opportunity.
        
        Student Profile:
        - Name: {student_name}
        - Major: {student_major}
        - GPA: {student_gpa}
        - Skills: {student_skills}
        - Programming Languages: {student_languages}
        - Leadership Experience: {student_leadership}
        - Volunteer Experience: {student_volunteer}
        
        Opportunity:
        - Title: {opp_title}
        - Organization: {opp_org}
        - Category: {opp_category}
        - Required Skills: {opp_req_skills}
        - Description: {opp_description}
        
        Evaluation Metrics:
        - Compatibility Score: {overall_score}%
        - Key Strengths: {strengths}
        - Missing Skills: {missing_skills}
        
        Task:
        Provide an encouraging, detailed, human-like narrative explanation of WHY this opportunity matches the student's profile. Highlight their key alignments (e.g. major, gpa, existing skills) and explain how this opportunity fits into their academic/career path.
        """

        # Prompt for Gemini to generate actionable improvement/preparation steps
        self.gemini_match_suggestions_prompt = """
        You are an expert career advisor and fellowship coach.
        You are analyzing the compatibility between a student and an opportunity.
        
        Student Profile:
        - Name: {student_name}
        - Major: {student_major}
        - GPA: {student_gpa}
        - Skills: {student_skills}
        - Programming Languages: {student_languages}
        - Leadership Experience: {student_leadership}
        - Volunteer Experience: {student_volunteer}
        
        Opportunity:
        - Title: {opp_title}
        - Organization: {opp_org}
        - Category: {opp_category}
        - Required Skills: {opp_req_skills}
        - Description: {opp_description}
        
        Evaluation Metrics:
        - Compatibility Score: {overall_score}%
        - Key Strengths: {strengths}
        - Missing Skills: {missing_skills}
        
        Task:
        Provide concrete, highly actionable improvement suggestions to help this student prepare for and successfully apply to this opportunity. If they have missing skills, suggest specific learning strategies, online courses, projects, or certifications they can pursue. If they are already a strong match, provide advanced advice for their essay structure or interview strategy.
        """

        logger.info("MatchAgent successfully initialized with ScoringService.")

    def _coerce_student(self, student_profile: Union[StudentProfile, dict]) -> StudentProfile:
        """
        Helper to ensure we have a StudentProfile object representation.
        Converts dictionaries on-the-fly to a StudentProfile model if needed.
        """
        if isinstance(student_profile, dict):
            return StudentProfile.from_dict(student_profile)
        return student_profile

    def _coerce_opportunity(self, opportunity: Union[Opportunity, dict]) -> Opportunity:
        """
        Helper to ensure we have an Opportunity object representation.
        Converts dictionaries on-the-fly to an Opportunity model if needed.
        """
        if isinstance(opportunity, dict):
            return Opportunity.from_dict(opportunity)
        return opportunity

    def evaluate_opportunities(
        self, student_profile: Union[StudentProfile, dict], opportunities: List[Union[Opportunity, dict]]
    ) -> List[dict]:
        """
        Evaluate a list of opportunities for a given student profile.
        Computes scores, builds structured match results, and ranks them.

        Args:
            student_profile: StudentProfile object or dict containing student details.
            opportunities: List of Opportunity objects or dictionaries to evaluate.

        Returns:
            List[dict]: Sorted list of rich match result dictionaries.
        """
        logger.info(f"Evaluating {len(opportunities)} opportunities for student...")
        try:
            student_obj = self._coerce_student(student_profile)

            match_results = []
            for opp in opportunities:
                opp_obj = self._coerce_opportunity(opp)
                # First run WITHOUT AI feedback to get scores quickly and sort/rank
                result = self.evaluate_single_opportunity(student_obj, opp_obj, generate_ai_feedback=False)
                match_results.append(result)

            # Rank results descending by score
            ranked_results = self.rank_results(match_results)

            # Only generate Gemini AI feedback for the top 3 ranked opportunities
            for i, result in enumerate(ranked_results):
                if i < 3:
                    opp_obj = self._coerce_opportunity(result["opportunity"])
                    # Generate AI feedback for this top match
                    ai_result = self.evaluate_single_opportunity(student_obj, opp_obj, generate_ai_feedback=True)
                    # Merge/Update the result with AI feedback
                    result["ai_explanation"] = ai_result["ai_explanation"]
                    result["improvement_suggestions"] = ai_result["improvement_suggestions"]

            return ranked_results

        except Exception as e:
            logger.error(f"Error evaluating opportunities: {e}")
            return []

    def evaluate_single_opportunity(
        self, student_profile: Union[StudentProfile, dict], opportunity: Union[Opportunity, dict], generate_ai_feedback: bool = False
    ) -> dict:
        """
        Evaluate compatibility for a single student-opportunity pair.
        Delegates scoring to ScoringService, calculates strengths/gaps,
        and constructs a detailed match report.

        Args:
            student_profile: StudentProfile instance or dict.
            opportunity: Opportunity instance or dict.
            generate_ai_feedback: If True, calls the Gemini API for customized narrative explanation and suggestions.

        Returns:
            dict: Structured match result dictionary.
        """
        try:
            student = self._coerce_student(student_profile)
            opp = self._coerce_opportunity(opportunity)

            # 1. Delegate deterministic score and breakdown calculation to ScoringService
            score_report = self.scoring_service.generate_score_breakdown(student, opp)
            overall_score = score_report.get("final_match_score", 0.0)
            breakdown = score_report.get("categories", {})

            # 2. Identify match strengths based on alignment
            match_strengths = self._identify_strengths(student, opp, breakdown)

            # 3. Identify skill gaps (missing skills)
            missing_skills = self._calculate_missing_skills(student, opp)

            # 4. Compile the unified structured match dictionary
            match_result = self.build_match_result(
                opportunity=opp,
                overall_score=overall_score,
                breakdown=breakdown,
                strengths=match_strengths,
                missing_skills=missing_skills,
                student_profile=student,
                generate_ai_feedback=generate_ai_feedback
            )

            return match_result

        except Exception as e:
            logger.error(f"Error evaluating single opportunity: {e}")
            # Fallback minimum valid structure
            opp_obj = self._coerce_opportunity(opportunity)
            return {
                "opportunity": opp_obj.to_dict(),
                "overall_score": 0.0,
                "breakdown": {},
                "match_strengths": [],
                "missing_skills": [],
                "ai_explanation": f"Evaluation error: {str(e)}",
                "improvement_suggestions": "Check system logs for details."
            }


    def _identify_strengths(self, student: StudentProfile, opp: Opportunity, breakdown: dict) -> List[str]:
        """
        Internal helper to identify key match strengths based on high-scoring categories.
        """
        strengths: List[str] = []

        # Check Academic Major
        major_score_info = breakdown.get("major", {})
        if major_score_info.get("score", 0.0) > 0:
            strengths.append(f"Field of study aligns perfectly with your major: {student.major}.")

        # Check Academic GPA
        if student.gpa >= 3.5:
            strengths.append(f"Outstanding academic standing (GPA: {student.gpa}) exceeds typical requirements.")
        elif student.gpa >= 3.0:
            strengths.append(f"Solid academic record (GPA: {student.gpa}) meets target standards.")

        # Check Skills Overlap
        student_skills_all = {s.lower().strip() for s in student.skills + student.programming_languages}
        matching_skills = [s for s in opp.required_skills if s.lower().strip() in student_skills_all]
        if matching_skills:
            strengths.append(f"Matching technical skills: {', '.join(matching_skills)}.")

        # Check Leadership
        if len(student.leadership_experience) >= 1:
            strengths.append("Demonstrated leadership experience is highly valued for this role.")

        # Check Volunteer
        if len(student.volunteer_experience) >= 1:
            strengths.append("Community involvement and volunteer work support your application.")

        # Check English
        if student.english_proficiency.lower() in ["fluent", "native"]:
            strengths.append("Strong English proficiency meets professional communication requirements.")

        if not strengths:
            strengths.append("Meets minimum baseline criteria for geographic and level eligibility.")

        return strengths

    def _calculate_missing_skills(self, student: StudentProfile, opp: Opportunity) -> List[str]:
        """
        Internal helper to identify skills required by the opportunity but not in the student's profile.
        """
        if not opp.required_skills:
            return []

        # Coerce student's skills and programming languages to a lowercase set
        student_skills_set = {s.lower().strip() for s in student.skills + student.programming_languages}

        # Keep only required skills that do not exist in student skills (case-insensitive)
        missing = [
            skill for skill in opp.required_skills
            if skill.lower().strip() not in student_skills_set
        ]
        return missing

    def build_match_result(
        self,
        opportunity: Opportunity,
        overall_score: float,
        breakdown: dict,
        strengths: List[str],
        missing_skills: List[str],
        student_profile: Optional[StudentProfile] = None,
        generate_ai_feedback: bool = False
    ) -> dict:
        """
        Construct a structured dictionary representing the match result.
        Uses the Gemini API to generate personalized explanations and suggestions when available.

        Args:
            opportunity: The Opportunity object under evaluation.
            overall_score: Combined compatibility score (0-100%).
            breakdown: Detailed category-by-category score breakdown.
            strengths: List of qualitative strengths.
            missing_skills: List of recommended/required skills the student lacks.
            student_profile: Optional StudentProfile instance for personalization.
            generate_ai_feedback: If True, calls the Gemini API to generate a narrative evaluation.

        Returns:
            dict: Structured feedback payload.
        """
        import os
        
        # Heuristic fallbacks (enriched dynamically for a premium feel even without Gemini API)
        strengths_bullet = "\n".join([f"- **{s}**" for s in strengths]) if strengths else "- Strong alignment with the program goals."
        missing_bullet = "\n".join([f"- **{m}**" for m in missing_skills]) if missing_skills else "- Alignment is already exceptionally high!"
        
        student_name = student_profile.name if student_profile else "student"
        opp_title = opportunity.title
        opp_org = opportunity.organization
        
        ai_explanation = (
            f"Hello {student_name}! We are excited to present your personalized evaluation for the **{opp_title}** program at **{opp_org}**.\n\n"
            f"You have an outstanding compatibility score of **{overall_score}%**! Here is why this opportunity is a fantastic match for you:\n\n"
            f"{strengths_bullet}\n\n"
            f"Your background, academic credentials, and proactive participation in extracurricular areas demonstrate that you possess a strong baseline for this program's requirements."
        )

        if missing_skills:
            improvement_suggestions = (
                f"To elevate your candidacy and prepare a highly competitive application, we recommend dedicating some time to develop these critical competencies:\n\n"
                f"{missing_bullet}\n\n"
                f"Focus on self-paced learning resources, target certifications, or practical projects specifically covering these skills. Demonstrating self-motivation in bridging these skill gaps is highly respected by selection committees!"
            )
        else:
            improvement_suggestions = (
                f"You have a highly complete skill match for **{opp_title}**!\n\n"
                f"**Key Recommendations:**\n"
                f"- **Tailor Your Resume**: Emphasize your experiences in {', '.join(strengths[:3]) if strengths else 'relevant areas'}.\n"
                f"- **Highlight Your Projects**: Detail your personal projects in your portfolio.\n"
                f"- **Draft a Persuasive Statement**: Clearly articulate your passion for {opp_org}."
            )

        # Gemini Integration
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key or api_key.startswith("MY_"):
            self.fallback_active = True
        
        if generate_ai_feedback and api_key and not api_key.startswith("MY_") and student_profile:
            from utils.gemini_cache import get_cached_response, set_cached_response
            
            # Use cached response if available
            cache_kwargs = {
                "student_id": getattr(student_profile, "email", "") or getattr(student_profile, "name", "Student"),
                "opp_id": getattr(opportunity, "id", "Unknown"),
                "overall_score": overall_score,
                "strengths": strengths,
                "missing_skills": missing_skills
            }
            cached_val = get_cached_response("match_evaluation", **cache_kwargs)
            if cached_val:
                try:
                    import json
                    feedback_json = json.loads(cached_val)
                    ai_explanation = feedback_json.get("ai_explanation", ai_explanation)
                    improvement_suggestions = feedback_json.get("improvement_suggestions", improvement_suggestions)
                    logger.info("MatchAgent: Restored evaluation from GeminiCache successfully.")
                except Exception as cache_err:
                    logger.warning(f"Failed to parse cached value: {cache_err}")
            else:
                logger.info("Calling Gemini API in MatchAgent for custom match evaluation and recommendations...")
                try:
                    from google import genai
                    from google.genai import types
                    import json
                    client = genai.Client(api_key=api_key)
                    model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

                    # Combine the prompts for a single structured response
                    prompt = f"""
                    You are an expert career advisor and fellowship coach.
                    Analyze the compatibility between the student and this opportunity.

                    Student Profile:
                    - Name: {student_profile.name}
                    - Major: {student_profile.major}
                    - GPA: {student_profile.gpa}
                    - Skills: {", ".join(student_profile.skills)}
                    - Programming Languages: {", ".join(student_profile.programming_languages)}
                    - Leadership Experience: {", ".join(student_profile.leadership_experience)}
                    - Volunteer Experience: {", ".join(student_profile.volunteer_experience)}

                    Opportunity:
                    - Title: {opportunity.title}
                    - Organization: {opportunity.organization}
                    - Category: {opportunity.category}
                    - Required Skills: {", ".join(opportunity.required_skills)}
                    - Description: {opportunity.description or "No description provided."}

                    Evaluation Metrics:
                    - Compatibility Score: {overall_score}%
                    - Key Strengths: {", ".join(strengths)}
                    - Missing Skills: {", ".join(missing_skills)}

                    Task:
                    Generate custom structured feedback containing an AI explanation and concrete improvement recommendations.
                    """

                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=MatchFeedback,
                            temperature=0.2,
                        )
                    )

                    if response.text:
                        feedback_json = json.loads(response.text.strip())
                        ai_explanation = feedback_json.get("ai_explanation", ai_explanation)
                        improvement_suggestions = feedback_json.get("improvement_suggestions", improvement_suggestions)
                        set_cached_response("match_evaluation", response.text.strip(), **cache_kwargs)
                        logger.info("Successfully generated Gemini-enhanced explanations and recommendations (unified).")

                except Exception as e:
                    logger.info(f"MatchAgent: Gemini API call failed with error: {e}. Falling back to dynamic heuristic evaluation.")
                    self.fallback_active = True
                    try:
                        fallback_json = {
                            "ai_explanation": ai_explanation,
                            "improvement_suggestions": improvement_suggestions
                        }
                        set_cached_response("match_evaluation", json.dumps(fallback_json), **cache_kwargs)
                    except Exception:
                        pass

        return {
            "opportunity": opportunity.to_dict(),
            "overall_score": overall_score,
            "breakdown": breakdown,
            "match_strengths": strengths,
            "missing_skills": missing_skills,
            "ai_explanation": ai_explanation,
            "improvement_suggestions": improvement_suggestions
        }

    def rank_results(self, match_results: List[dict]) -> List[dict]:
        """
        Sort opportunities descending by their overall compatibility match score.

        Args:
            match_results: List of unsorted match dictionaries.

        Returns:
            List[dict]: Match dictionaries sorted descending by 'overall_score'.
        """
        try:
            return sorted(match_results, key=lambda x: x.get("overall_score", 0.0), reverse=True)
        except Exception as e:
            logger.error(f"Error sorting match results: {e}")
            return match_results

    def get_top_matches(self, match_results: List[dict], limit: int = 5) -> List[dict]:
        """
        Slice and retrieve the top-performing opportunity matches.

        Args:
            match_results: List of match dictionaries.
            limit: Maximum number of opportunities to return.

        Returns:
            List[dict]: Sliced subset of top matches.
        """
        ranked = self.rank_results(match_results)
        return ranked[:limit]

    def compute_match_scores(self, student_profile: dict, candidate_opportunities: list) -> List[dict]:
        """
        Compatibility wrapper for the CoordinatorAgent orchestrator interface.
        Takes serialized inputs, routes them through the evaluation pipeline, and returns 
        the sorted list of opportunities updated with compatibility metrics.

        Args:
            student_profile: Structured student profile dictionary.
            candidate_opportunities: List of candidate opportunity dictionaries.

        Returns:
            List[dict]: Opportunities sorted descending by score, decorated with 'matchScore' 
                        and 'matchReasons' keys for backward compatibility.
        """
        logger.info("MatchAgent: compute_match_scores called by CoordinatorAgent.")
        try:
            # 1. Run full structured evaluation
            ranked_results = self.evaluate_opportunities(student_profile, candidate_opportunities)

            # 2. Adapt the structured results back into the simple schema CoordinatorAgent expects
            flat_matches = []
            for result in ranked_results:
                opp_dict = result["opportunity"]
                
                # Attach backwards-compatible keys directly onto the opportunity dictionary
                opp_dict["matchScore"] = result["overall_score"]
                opp_dict["matchReasons"] = result["match_strengths"]
                opp_dict["missingSkills"] = result["missing_skills"]
                opp_dict["aiExplanation"] = result["ai_explanation"]
                opp_dict["improvementSuggestions"] = result["improvement_suggestions"]
                opp_dict["scoreBreakdown"] = result["breakdown"]
                
                flat_matches.append(opp_dict)

            return flat_matches

        except Exception as e:
            logger.error(f"MatchAgent: Error in compute_match_scores: {e}")
            return candidate_opportunities
