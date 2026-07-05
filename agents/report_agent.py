"""
Report Agent Module.

This module defines the ReportAgent, which is responsible for assembling, structuring,
and formatting the final action report presented to the student. It aggregates data
from the StudentProfile, Ranked Match Results, and Recommendation Results into a clean,
transparent dictionary.
"""

import logging
from typing import Any, Dict, List, Optional, Union

# Import domain models
from models.student_profile import StudentProfile
from models.opportunity import Opportunity

# Import services
from services.recommendation_service import RecommendationService

# Setup clean, informative logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ReportAgent")


class ReportAgent:
    """
    Agent responsible for formatting and compiling student action reports.

    ReportAgent does not run searches, compute match scores, or calculate skill gaps.
    Instead, it orchestrates and formats outputs from other agents and services
    to build a unified, human-readable action plan.
    """

    def __init__(self, recommendation_service: Optional[RecommendationService] = None) -> None:
        """
        Initialize the ReportAgent with a RecommendationService instance.

        Args:
            recommendation_service: Instance of RecommendationService. If None,
                                    instantiates a default service.
        """
        if recommendation_service is not None:
            self.recommendation_service: RecommendationService = recommendation_service
        else:
            self.recommendation_service = RecommendationService()

        self.fallback_active = False

        # Prompt for Gemini executive summary
        self.gemini_report_prompt = """
        You are a senior academic counselor and executive director of a fellowship matching foundation.
        Your task is to generate a comprehensive, highly inspiring, professional executive summary report for a student.
        
        Student Overview:
        - Name: {student_name}
        - Major: {student_major}
        - GPA: {student_gpa}
        - Skills: {student_skills}
        - Programming Languages: {student_languages}
        - Leadership Experience: {student_leadership}
        - Volunteer Experience: {student_volunteer}
        
        Top Recommended Opportunity:
        - Title: {opp_title}
        - Organization: {opp_org}
        - Category: {opp_category}
        - Compatibility Score: {overall_score}%
        
        Action Plan Recommendations:
        - Missing Skills: {missing_skills}
        - Recommended Projects: {recommended_projects}
        - Suggested Certifications: {recommended_certifications}
        
        Task:
        Generate a detailed Executive Summary Report formatted in clean markdown. It MUST include:
        1. **Student Overview**: A personalized profile assessment.
        2. **Top Strengths**: Precise areas where the student shines.
        3. **Improvement Areas**: Constructive highlights of gaps (academic, skills, or extracurricular).
        4. **Recommended Timeline**: Priority milestones to achieve success.
        5. **Application Strategy**: Strategic tactical advice on how to stand out in essays and interviews for '{opp_title}'.
        
        Maintain an encouraging, executive, and highly strategic tone.
        """

        # Prompt for customized resume/interview pitch strategy
        self.gemini_pitch_prompt = """
        You are an expert career branding coach. Generate a highly customized, 1-paragraph elevator pitch and resume/interview branding strategy for a student based on their profile and their top matched opportunity '{opp_title}'.
        
        Student Name: {student_name}
        Student Major: {student_major}
        Student Skills: {student_skills}
        Top Opportunity: {opp_title}
        """

        logger.info("ReportAgent successfully initialized.")

    def _coerce_student(self, student_profile: Union[StudentProfile, dict]) -> StudentProfile:
        """
        Helper to convert dictionary student profile inputs into StudentProfile objects.
        """
        if isinstance(student_profile, dict):
            return StudentProfile.from_dict(student_profile)
        return student_profile

    def build_student_summary(self, student_profile: Union[StudentProfile, dict]) -> dict:
        """
        Convert student profile information into a clean, presentation-ready summary dictionary.

        Args:
            student_profile: StudentProfile object or dict.

        Returns:
            dict: Structured dictionary containing clean student profile data.
        """
        logger.info("ReportAgent: Building student profile summary...")
        try:
            student = self._coerce_student(student_profile)
            return {
                "name": student.name,
                "email": student.email,
                "country": student.country,
                "education_level": student.education_level,
                "gpa": student.gpa,
                "major": student.major,
                "skills": student.skills,
                "programming_languages": student.programming_languages,
                "leadership_count": len(student.leadership_experience),
                "volunteer_count": len(student.volunteer_experience),
                "english_proficiency": student.english_proficiency,
                "certificates": student.certificates,
                "interests": student.interests
            }
        except Exception as e:
            logger.error(f"ReportAgent: Failed to build student summary: {e}")
            return {}

    def build_match_summary(self, ranked_matches: List[dict]) -> List[dict]:
        """
        Clean, extract, and format match information from the Ranked Match Results list.

        Args:
            ranked_matches: Scored and sorted list of match result dictionaries from MatchAgent.

        Returns:
            List[dict]: Presentation-ready list of opportunity match summaries.
        """
        logger.info("ReportAgent: Building opportunity match summary...")
        summaries: List[dict] = []
        try:
            for match in ranked_matches:
                # Support both a flat decorated opportunity dictionary and a nested MatchResult dictionary
                opp_dict = match.get("opportunity") if "opportunity" in match else match

                overall_score = (
                    match.get("overall_score") or 
                    match.get("matchScore") or 
                    match.get("final_match_score") or 
                    0.0
                )

                strengths = (
                    match.get("match_strengths") or 
                    match.get("matchReasons") or 
                    []
                )

                missing_skills = (
                    match.get("missing_skills") or 
                    match.get("missingSkills") or 
                    []
                )

                ai_explanation = (
                    match.get("ai_explanation") or 
                    match.get("aiExplanation") or 
                    f"You have a {overall_score}% compatibility match for this program."
                )

                # Safe access to sub-opportunity fields
                opp_id = opp_dict.get("id") if isinstance(opp_dict, dict) else getattr(opp_dict, "id", "Unknown")
                title = opp_dict.get("title") if isinstance(opp_dict, dict) else getattr(opp_dict, "title", "Unknown")
                category = opp_dict.get("category") if isinstance(opp_dict, dict) else getattr(opp_dict, "category", "Unknown")
                deadline = opp_dict.get("deadline") if isinstance(opp_dict, dict) else getattr(opp_dict, "deadline", "TBD")

                summaries.append({
                    "opportunity_id": opp_id,
                    "opportunity_title": title,
                    "category": category,
                    "overall_score": overall_score,
                    "deadline": deadline,
                    "strengths": strengths,
                    "missing_skills": missing_skills,
                    "ai_explanation": ai_explanation
                })
            return summaries
        except Exception as e:
            logger.error(f"ReportAgent: Error building match summary: {e}")
            return []

    def build_recommendation_summary(self, recommendation_results: dict, student_profile: Optional[dict] = None, top_opportunity: Optional[dict] = None) -> dict:
        """
        Format structured recommendation details for presentation.
        Uses Gemini API to generate tailored interview and resume pitch plans when available.

        Args:
            recommendation_results: Action plan dictionary generated by RecommendationService.
            student_profile: Optional student profile dictionary context.
            top_opportunity: Optional top opportunity dictionary context.

        Returns:
            dict: Structured recommendation dictionary with human-friendly labels.
        """
        import os
        logger.info("ReportAgent: Building recommendations summary...")
        
        student_name = "Demo Student"
        student_major = "Computer Science"
        skills_str = "analytical problem solving"
        opp_title_val = "this program"
        
        if student_profile:
            student_name = student_profile.get("name", "Demo Student") if isinstance(student_profile, dict) else getattr(student_profile, "name", "Demo Student")
            student_major = student_profile.get("major", "Computer Science") if isinstance(student_profile, dict) else getattr(student_profile, "major", "Computer Science")
            skills = student_profile.get("skills", []) if isinstance(student_profile, dict) else getattr(student_profile, "skills", [])
            skills_str = ", ".join(skills[:3]) if skills else "analytical problem solving"
            
        if top_opportunity:
            opp_title_val = top_opportunity.get("title", "this program") if isinstance(top_opportunity, dict) else getattr(top_opportunity, "title", "this program")

        pitch_strategy = (
            f"\"Hi, I'm {student_name}, a {student_major} major with a strong background in {skills_str}. "
            f"I am incredibly passionate about the intersecting fields of technology and social impact, which is why I'm "
            f"excited to apply for the {opp_title_val} program. I am eager to leverage my skills and collaborate with "
            f"like-minded peers to build real-world solutions that can drive meaningful change.\"\n\n"
            f"**Resume Strategy**: Bold key experiences where you successfully utilized {skills_str} or led group initiatives. "
            f"Make sure to emphasize your interest in the core mission of this opportunity."
        )

        # Gemini Integration for Branding Pitch
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key or api_key.startswith("MY_"):
            self.fallback_active = True

        if api_key and not api_key.startswith("MY_") and student_profile and top_opportunity:
            from utils.gemini_cache import get_cached_response, set_cached_response
            
            cache_kwargs = {
                "student_name": student_profile.get("name", "Demo Student"),
                "student_major": student_profile.get("major", "Computer Science"),
                "student_skills": sorted(student_profile.get("skills", [])),
                "opp_title": top_opportunity.get("title", "this program")
            }
            cached_val = get_cached_response("branding_pitch", **cache_kwargs)
            if cached_val:
                pitch_strategy = cached_val
                logger.info("ReportAgent: Restored branding pitch from GeminiCache successfully.")
            else:
                try:
                    from google import genai
                    client = genai.Client(api_key=api_key)
                    model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

                    opp_title = top_opportunity.get("title", "this program")

                    prompt = self.gemini_pitch_prompt.format(
                        student_name=student_profile.get("name", "Demo Student"),
                        student_major=student_profile.get("major", "Computer Science"),
                        student_skills=", ".join(student_profile.get("skills", [])),
                        opp_title=opp_title
                    )

                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    if response.text:
                        pitch_strategy = response.text.strip()
                        set_cached_response("branding_pitch", pitch_strategy, **cache_kwargs)
                except Exception as e:
                    logger.info("ReportAgent: Using rules-based branding pitch template fallback.")
                    self.fallback_active = True
                    try:
                        from utils.gemini_cache import FALLBACK_RESPONSES
                        pitch_strategy = FALLBACK_RESPONSES.get("branding_pitch", pitch_strategy)
                        set_cached_response("branding_pitch", pitch_strategy, **cache_kwargs)
                    except Exception:
                        pass

        try:
            return {
                "missing_skills": recommendation_results.get("missing_skills", []),
                "suggested_resources": recommendation_results.get("suggested_resources", []),
                "recommended_certifications": recommendation_results.get("suggested_certifications", []),
                "recommended_projects": recommendation_results.get("suggested_personal_projects", []),
                "leadership_improvements": recommendation_results.get("leadership_improvements", []),
                "volunteer_suggestions": recommendation_results.get("volunteer_improvements", []),
                "priority_level": recommendation_results.get("priority_level", "Medium"),
                "estimated_preparation_timeline": recommendation_results.get("estimated_preparation_timeline", "N/A"),
                "branding_pitch_strategy": pitch_strategy
            }
        except Exception as e:
            logger.error(f"ReportAgent: Error building recommendation summary: {e}")
            return {}


    def build_action_timeline(self, ranked_matches: List[dict], recommendation_results: dict) -> List[dict]:
        """
        Construct a chronological preparation schedule listing milestones leading up to deadlines.

        Args:
            ranked_matches: Ranked match dictionaries from MatchAgent.
            recommendation_results: Action plan dictionary from RecommendationService.

        Returns:
            List[dict]: List of ordered milestone dictionaries.
        """
        logger.info("ReportAgent: Structuring chronological action timeline...")
        timeline: List[dict] = []
        try:
            if not ranked_matches:
                # Return standard developmental stages if no specific opportunities are matched
                return [
                    {
                        "stage": "Stage 1: Foundation Building",
                        "timeframe": "Immediate (Weeks 1-4)",
                        "task": "Review suggested learning resources and enroll in target courses."
                    },
                    {
                        "stage": "Stage 2: Portfolio Enhancement",
                        "timeframe": "Mid-term (Weeks 5-8)",
                        "task": "Build and showcase recommended personal projects on GitHub."
                    }
                ]

            # Compile milestones based on the top 2 matched programs
            for match in ranked_matches[:2]:
                opp_dict = match.get("opportunity") if "opportunity" in match else match
                title = opp_dict.get("title", "Target Program") if isinstance(opp_dict, dict) else getattr(opp_dict, "title", "Target Program")
                deadline = opp_dict.get("deadline", "TBD") if isinstance(opp_dict, dict) else getattr(opp_dict, "deadline", "TBD")

                timeline.append({
                    "stage": f"Phase 1: Skill Bridging ({title})",
                    "timeframe": "Immediate - 6 Weeks Prior",
                    "task": f"Obtain target certifications and study core skills required for {title}."
                })
                timeline.append({
                    "stage": f"Phase 2: Portfolio Building ({title})",
                    "timeframe": "4 Weeks Prior",
                    "task": f"Develop a personal project demonstrating hands-on experience suited for {title}."
                })
                timeline.append({
                    "stage": f"Phase 3: Material Assembly ({title})",
                    "timeframe": "2 Weeks Prior",
                    "task": f"Draft application essays, polish your resume, and collect reference letters."
                })
                timeline.append({
                    "stage": f"Phase 4: Submission ({title})",
                    "timeframe": f"By {deadline}",
                    "task": f"Submit your completed application ahead of the final deadline."
                })

            return timeline
        except Exception as e:
            logger.error(f"ReportAgent: Error building action timeline: {e}")
            return []

    def build_final_report(
        self,
        student_profile: Union[StudentProfile, dict],
        ranked_matches: List[dict],
        recommendation_results: dict
    ) -> dict:
        """
        Aggregate and coordinate all summary pieces into a structured final master report.

        Args:
            student_profile: Student profile information.
            ranked_matches: Ranked match dictionaries.
            recommendation_results: Structured action plan recommendations.

        Returns:
            dict: Consolidated final action report dictionary.
        """
        logger.info("ReportAgent: Assembling final comprehensive action report...")
        try:
            student_summary = self.build_student_summary(student_profile)
            match_summary = self.build_match_summary(ranked_matches)

            # Pass student profile dict and top match to build_recommendation_summary for Gemini pitch branding
            top_match = ranked_matches[0] if ranked_matches else {}
            opp_dict = top_match.get("opportunity") if isinstance(top_match, dict) and "opportunity" in top_match else top_match
            opp_info = opp_dict if isinstance(opp_dict, dict) else (opp_dict.__dict__ if opp_dict else {})

            recommendation_summary = self.build_recommendation_summary(
                recommendation_results,
                student_profile=student_summary,
                top_opportunity=opp_info
            )
            action_timeline = self.build_action_timeline(ranked_matches, recommendation_results)

            return {
                "student_information": student_summary,
                "top_opportunities": match_summary,
                "recommendations": recommendation_summary,
                "action_timeline": action_timeline,
                "metadata": {
                    "generator": "ReportAgent Engine",
                    "status": "Ready",
                    "format_version": "1.0"
                }
            }
        except Exception as e:
            logger.error(f"ReportAgent: Error building final master report: {e}")
            return {}

    def export_dictionary(self, final_report: dict) -> dict:
        """
        Return the final report dictionary. Serves as the clean output boundary.

        Args:
            final_report: The aggregated report dictionary.

        Returns:
            dict: Cleaned final report output dictionary.
        """
        return final_report

    # --- Backwards Compatibility and Orchestrator Wrapper Methods ---

    def generate_action_report(self, student_profile: dict, top_matches: list) -> dict:
        """
        Create a personalized summary report with portfolio improvement advice.
        Acts as the primary orchestrator entry point called by CoordinatorAgent.

        Args:
            student_profile: Student profile dictionary.
            top_matches: List of highest-scoring opportunity dictionaries.

        Returns:
            dict: Combined action plan report with support for new structures and legacy fields.
        """
        import os
        logger.info("ReportAgent: generate_action_report entry point invoked.")
        try:
            # 1. Take the top/best opportunity to center our recommendations on
            top_match = top_matches[0] if top_matches else {}
            
            # 2. Call RecommendationService to generate structured recommendations
            recommendation_results = self.recommendation_service.build_action_plan(
                student_profile, top_match, match_result=top_match
            )

            # 3. Compile the comprehensive multi-agent report
            final_report = self.build_final_report(student_profile, top_matches, recommendation_results)

            # 4. Inject legacy top-level keys into final report to prevent any breaking changes 
            # with frontends or tests expecting specific backward-compatible properties
            opp_dict = top_match.get("opportunity") if isinstance(top_match, dict) and "opportunity" in top_match else top_match
            opp_title = opp_dict.get("title", "Target Program") if isinstance(opp_dict, dict) else getattr(opp_dict, "title", "Target Program")
            
            # Formulate helpful executive summary using Gemini when available
            api_key = os.environ.get("GEMINI_API_KEY", "")
            executive_summary = ""
            if not api_key or api_key.startswith("MY_"):
                self.fallback_active = True

            if api_key and not api_key.startswith("MY_"):
                from utils.gemini_cache import get_cached_response, set_cached_response
                
                cache_kwargs = {
                    "student_name": student_profile.get("name", "Student"),
                    "student_major": student_profile.get("major", "STEM"),
                    "student_gpa": student_profile.get("gpa", 0.0),
                    "opp_title": opp_title,
                    "overall_score": top_match.get("overall_score") or top_match.get("matchScore") or 0.0,
                    "missing_skills": recommendation_results.get("missing_skills", [])
                }
                cached_val = get_cached_response("executive_summary", **cache_kwargs)
                if cached_val:
                    executive_summary = cached_val
                    logger.info("ReportAgent: Restored executive summary from GeminiCache successfully.")
                else:
                    logger.info("Calling Gemini API in ReportAgent to generate personalized Executive Summary Report...")
                    try:
                        from google import genai
                        client = genai.Client(api_key=api_key)
                        model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

                        opp_org = opp_dict.get("organization", "Sponsor") if isinstance(opp_dict, dict) else getattr(opp_dict, "organization", "Sponsor")
                        opp_category = opp_dict.get("category", "Fellowship") if isinstance(opp_dict, dict) else getattr(opp_dict, "category", "Fellowship")
                        overall_score = top_match.get("overall_score") or top_match.get("matchScore") or 0.0

                        prompt = self.gemini_report_prompt.format(
                            student_name=student_profile.get("name", "Student"),
                            student_major=student_profile.get("major", "STEM"),
                            student_gpa=student_profile.get("gpa", 0.0),
                            student_skills=", ".join(student_profile.get("skills", [])),
                            student_languages=", ".join(student_profile.get("programming_languages", [])),
                            student_leadership=len(student_profile.get("leadership_experience", [])),
                            student_volunteer=len(student_profile.get("volunteer_experience", [])),
                            opp_title=opp_title,
                            opp_org=opp_org,
                            opp_category=opp_category,
                            overall_score=overall_score,
                            missing_skills=", ".join(recommendation_results.get("missing_skills", [])),
                            recommended_projects=", ".join([p.get("project_title", "") if isinstance(p, dict) else str(p) for p in recommendation_results.get("suggested_personal_projects", [])]),
                            recommended_certifications=", ".join([c.get("certification_name", "") if isinstance(c, dict) else str(c) for c in recommendation_results.get("suggested_certifications", [])])
                        )

                        response = client.models.generate_content(
                            model=model_name,
                            contents=prompt
                        )
                        if response.text:
                            executive_summary = response.text.strip()
                            set_cached_response("executive_summary", executive_summary, **cache_kwargs)
                    except Exception as e:
                        logger.info("ReportAgent: Using rules-based default academic executive summary template.")
                        self.fallback_active = True
                        try:
                            from utils.gemini_cache import FALLBACK_RESPONSES
                            executive_summary = FALLBACK_RESPONSES.get("executive_summary", executive_summary)
                            set_cached_response("executive_summary", executive_summary, **cache_kwargs)
                        except Exception:
                            pass

            if not executive_summary:
                gpa = student_profile.get("gpa", 0.0)
                name = student_profile.get("name", "Student")
                major = student_profile.get("major", "STEM")
                skills = student_profile.get("skills", [])
                skills_str = ", ".join(skills[:4]) if skills else "analytical and technical skills"
                missing = recommendation_results.get("missing_skills", [])
                missing_str = ", ".join(missing) if missing else "None (Exceptional Alignment)"
                
                opp_org = opp_dict.get("organization", "Sponsor") if isinstance(opp_dict, dict) else getattr(opp_dict, "organization", "Sponsor")
                opp_category = opp_dict.get("category", "Fellowship") if isinstance(opp_dict, dict) else getattr(opp_dict, "category", "Fellowship")
                overall_score = top_match.get("overall_score") or top_match.get("matchScore") or 0.0
                
                projects = [p.get("project_title", "") if isinstance(p, dict) else str(p) for p in recommendation_results.get("suggested_personal_projects", [])]
                projects_str = ", ".join(projects) if projects else "Relevant personal projects"
                
                certs = [c.get("certification_name", "") if isinstance(c, dict) else str(c) for c in recommendation_results.get("suggested_certifications", [])]
                certs_str = ", ".join(certs) if certs else "Industry-standard certifications"

                executive_summary = (
                    f"### 📋 Executive Summary Report for {name}\n\n"
                    f"#### 1. Student Overview\n"
                    f"As a high-achieving **{major}** student (GPA: **{gpa}**), you possess a strong academic foundation. "
                    f"Your technical toolkit, including proficiency in **{skills_str}**, sets a solid baseline for challenging assignments.\n\n"
                    f"#### 2. Top Strengths\n"
                    f"- **Solid Academic Profile**: A **{gpa} GPA** reflects dedication, self-discipline, and strong cognitive abilities.\n"
                    f"- **Technical Alignment**: Your experience matches several key focus areas of the **{opp_title}** program.\n"
                    f"- **Extracurricular Readiness**: Your leadership and volunteer experiences show a well-rounded and community-oriented mindset.\n\n"
                    f"#### 3. Improvement Areas\n"
                    f"To elevate your candidacy for **{opp_title}**, we recommend targeting the following skill gaps:\n"
                    f"- **Skill Focus**: *{missing_str}*\n"
                    f"- **Recommended Projects**: *{projects_str}*\n"
                    f"- **Suggested Certifications**: *{certs_str}*\n\n"
                    f"#### 4. Recommended Timeline\n"
                    f"- **Weeks 1-2**: Complete foundational courses and learning materials in missing skill areas.\n"
                    f"- **Weeks 3-4**: Initiate a capstone personal portfolio project (**{projects_str}**) to demonstrate practical mastery.\n"
                    f"- **Weeks 5-6**: Complete certifications and begin drafting your application essay/personal statement.\n\n"
                    f"#### 5. Application Strategy\n"
                    f"When applying to **{opp_title}** by **{opp_org}**, emphasize how your background in **{major}** and your newfound skills directly contribute to their core mission. "
                    f"Highlight your proactive initiative in bridging skill gaps independently—selection committees value self-directed learning highly."
                )

            final_report["executive_summary"] = executive_summary
            
            # Format flat recommended timeline for simple lists
            timeline_list = []
            for milestone in final_report["action_timeline"]:
                timeline_list.append({
                    "date": milestone.get("timeframe", "TBD"),
                    "task": f"{milestone.get('stage', 'Milestone')}: {milestone.get('task', '')}"
                })
            final_report["recommended_timeline"] = timeline_list

            # Map skill gaps directly
            final_report["skill_gaps"] = recommendation_results.get("missing_skills", [])

            return self.export_dictionary(final_report)

        except Exception as e:
            logger.error(f"ReportAgent: generate_action_report failed: {e}")
            # Safe basic return structure in case of crash
            return {
                "executive_summary": "Error generating action plan. Please check system logs.",
                "recommended_timeline": [],
                "skill_gaps": []
            }

    def create_timeline(self, opportunity_list: list) -> List[dict]:
        """
        Build a chronological submission schedule based on application deadlines.

        Args:
            opportunity_list: List of selected opportunities.

        Returns:
            List[dict]: Sorted timeline schedule.
        """
        logger.info("ReportAgent: create_timeline compatibility wrapper called.")
        timeline = []
        try:
            for opp in opportunity_list:
                opp_dict = opp.get("opportunity") if isinstance(opp, dict) and "opportunity" in opp else opp
                title = opp_dict.get("title", "Program") if isinstance(opp_dict, dict) else getattr(opp_dict, "title", "Program")
                deadline = opp_dict.get("deadline", "TBD") if isinstance(opp_dict, dict) else getattr(opp_dict, "deadline", "TBD")
                
                timeline.append({
                    "opportunity": title,
                    "deadline": deadline,
                    "recommended_milestone_dates": {
                        "certifications_complete": "6 weeks prior",
                        "portfolio_project_ready": "4 weeks prior",
                        "request_rec_letters": "3 weeks prior",
                        "final_review": "1 week prior"
                    }
                })
            return timeline
        except Exception as e:
            logger.error(f"ReportAgent: Failed inside create_timeline: {e}")
            return []
