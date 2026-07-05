"""
Recommendation Service Module.

This module provides the RecommendationService class, which calculates personalized
recommendations, identifies skill gaps, and suggests actionable learning resources,
certifications, personal projects, leadership development, and volunteer activities.
"""

import logging
from typing import Any, Dict, List, Optional, Tuple, Union

# Import domain models
from models.student_profile import StudentProfile
from models.opportunity import Opportunity

# Setup clean, informative logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RecommendationService")


class RecommendationService:
    """
    Deterministic recommendation engine for OpportunityAI.
    
    Generates tailored, structured recommendations to help students improve
    their eligibility and readiness for target opportunities without using AI or LLMs.
    """

    def __init__(self) -> None:
        """
        Initialize the RecommendationService with a pre-defined catalog of
        technical and soft skills maps for learning resources, certifications,
        and projects.
        """
        # Dictionary map matching skills to standard resources, certifications, and portfolio projects
        self.skill_catalog: Dict[str, Dict[str, List[Any]]] = {
            "python": {
                "resources": [
                    {"name": "Coursera: Python for Everybody Specialization", "url": "https://www.coursera.org/specializations/python", "type": "Course"},
                    {"name": "Official Python Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "Documentation"}
                ],
                "certifications": [
                    {"name": "PCAP – Certified Associate in Python Programming", "provider": "Python Institute", "difficulty": "Beginner"},
                    {"name": "Python Data Science Professional Certificate", "provider": "IBM", "difficulty": "Intermediate"}
                ],
                "projects": [
                    {"title": "Automated Web Scraper", "description": "Create a command-line script to crawl and parse jobs or news data using BeautifulSoup.", "estimated_hours": 15},
                    {"title": "Personal Budget Tracker", "description": "Build a desktop GUI or console-based database app to log expenses and visualize monthly patterns.", "estimated_hours": 20}
                ]
            },
            "react": {
                "resources": [
                    {"name": "React Dev: Official Documentation", "url": "https://react.dev", "type": "Documentation"},
                    {"name": "Scrimba: Learn React for Free", "url": "https://scrimba.com/learn/learnreact", "type": "Course"}
                ],
                "certifications": [
                    {"name": "Meta Front-End Developer Professional Certificate", "provider": "Meta / Coursera", "difficulty": "Beginner"},
                    {"name": "Frontend Masters React Path Certification", "provider": "Frontend Masters", "difficulty": "Intermediate"}
                ],
                "projects": [
                    {"title": "Interactive Habit Tracker Dashboard", "description": "Build a responsive dashboard using Tailwind and React to track daily and weekly goals with local storage.", "estimated_hours": 25},
                    {"title": "Collab-Board Realtime Canvas", "description": "A collaborative design canvas where users can draw on a shared digital space.", "estimated_hours": 40}
                ]
            },
            "machine learning": {
                "resources": [
                    {"name": "Coursera: Machine Learning Specialization", "url": "https://www.coursera.org/specializations/machine-learning-introduction", "type": "Course"},
                    {"name": "Kaggle Learn: Introduction to Machine Learning", "url": "https://www.kaggle.com/learn/intro-to-machine-learning", "type": "Tutorial"}
                ],
                "certifications": [
                    {"name": "Google Cloud Professional Machine Learning Engineer", "provider": "Google Cloud", "difficulty": "Advanced"},
                    {"name": "AWS Certified Machine Learning – Specialty", "provider": "Amazon Web Services", "difficulty": "Advanced"}
                ],
                "projects": [
                    {"title": "Real Estate Valuation Predictor", "description": "Train and validate a regression model using scikit-learn on a public housing dataset.", "estimated_hours": 30},
                    {"title": "Handwritten Digit Classifier", "description": "Implement a simple convolutional neural network (CNN) in TensorFlow or PyTorch to recognize MNIST digits.", "estimated_hours": 25}
                ]
            },
            "sql": {
                "resources": [
                    {"name": "Khan Academy: Intro to SQL", "url": "https://www.khanacademy.org/computing/computer-programming/sql", "type": "Tutorial"},
                    {"name": "Mode Analytics SQL Tutorial", "url": "https://mode.com/sql-tutorial/", "type": "Course"}
                ],
                "certifications": [
                    {"name": "Oracle Database SQL Certified Associate", "provider": "Oracle", "difficulty": "Intermediate"},
                    {"name": "Microsoft Certified: Azure Database Administrator", "provider": "Microsoft", "difficulty": "Intermediate"}
                ],
                "projects": [
                    {"title": "E-Commerce Database Schema Design", "description": "Design a relational database with normalized tables (users, orders, products, reviews) and write complex reporting queries.", "estimated_hours": 15},
                    {"title": "SQL Analytics Dashboard", "description": "Create a Python-Streamlit analytics dashboard backed by custom SQLite analytical queries.", "estimated_hours": 20}
                ]
            },
            "git": {
                "resources": [
                    {"name": "GitHub Skills Interactive Tutorials", "url": "https://skills.github.com", "type": "Tutorial"},
                    {"name": "Atlassian Git Tutorial Guides", "url": "https://www.atlassian.com/git", "type": "Documentation"}
                ],
                "certifications": [
                    {"name": "GitHub Foundations Certification", "provider": "GitHub", "difficulty": "Beginner"},
                    {"name": "Linux Foundation Git Certification", "provider": "The Linux Foundation", "difficulty": "Beginner"}
                ],
                "projects": [
                    {"title": "Multi-Branch Collaboration Simulation", "description": "Configure branch protections, pull request templates, and a GitHub Actions workflow that runs automatic checks on code commit.", "estimated_hours": 10}
                ]
            },
            "data science": {
                "resources": [
                    {"name": "IBM Data Science Professional Certificate", "url": "https://www.coursera.org/professional-certificates/ibm-data-science", "type": "Course"},
                    {"name": "Python for Data Analysis Book by Wes McKinney", "url": "https://wesmckinney.com/book/", "type": "Documentation"}
                ],
                "certifications": [
                    {"name": "Google Data Analytics Professional Certificate", "provider": "Google / Coursera", "difficulty": "Beginner"},
                    {"name": "Certified Analytics Professional (CAP)", "provider": "INFORMS", "difficulty": "Advanced"}
                ],
                "projects": [
                    {"title": "COVID-19 Trend Exploration", "description": "Perform exploratory data analysis (EDA) using Pandas and Seaborn on global health datasets.", "estimated_hours": 20}
                ]
            },
            "typescript": {
                "resources": [
                    {"name": "TypeScript Deep Dive Guide", "url": "https://basarat.gitbook.io/typescript", "type": "Documentation"},
                    {"name": "TypeScript Handbook", "url": "https://www.typescriptlang.org/docs/", "type": "Documentation"}
                ],
                "certifications": [
                    {"name": "W3Schools TypeScript Certification", "provider": "W3Schools", "difficulty": "Beginner"}
                ],
                "projects": [
                    {"title": "Type-Safe Express Server", "description": "Migrate a raw JavaScript Express REST API server to TypeScript, fully implementing strong interfaces and error boundaries.", "estimated_hours": 20}
                ]
            }
        }

        # Prompt to rewrite deterministic recommendations into supportive mentoring language
        self.gemini_coaching_rewrite_prompt = """
        You are a supportive, expert student success coach.
        Your task is to take a set of structured, deterministic career recommendations and rewrite them into an extremely warm, friendly, inspiring coaching message.
        
        Deterministic Recommendations:
        - Missing Skills: {missing_skills}
        - Suggested Learning Resources: {suggested_resources}
        - Suggested Certifications: {suggested_certifications}
        - Suggested Portfolio Projects: {suggested_projects}
        - Suggested Leadership Improvements: {suggested_leadership}
        - Suggested Volunteer Improvements: {suggested_volunteer}
        - Estimated Preparation Timeline: {timeline}
        - Action Plan Priority Level: {priority}
        
        Task:
        Rewrite these recommendations into a beautifully written coaching statement (2-3 paragraphs in markdown format) addressed to the student. Speak directly, encourage them, and explain in friendly terms how these exact steps will help them successfully apply for their target opportunity.
        """

        logger.info("RecommendationService initialized with skill catalog mappings.")

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
        if isinstance(student_profile, dict):
            student_obj = StudentProfile.from_dict(student_profile)
        else:
            student_obj = student_profile

        if isinstance(opportunity, dict):
            opportunity_obj = Opportunity.from_dict(opportunity)
        else:
            opportunity_obj = opportunity

        return student_obj, opportunity_obj

    def rank_top_picks(self, scored_opportunities: List[Dict[str, Any]], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Sort opportunities by match score and return the top K candidates.
        Keeps support for legacy keys used across the code ('matchScore' or 'overall_score').
        
        Args:
            scored_opportunities: List of opportunity dicts with score keys.
            top_k: Number of recommendations to return.
        """
        logger.info(f"Ranking top {top_k} scored opportunities...")
        try:
            # Sort by match score descending
            sorted_opps = sorted(
                scored_opportunities,
                key=lambda x: float(x.get("matchScore") or x.get("overall_score") or x.get("final_match_score") or 0.0),
                reverse=True
            )
            return sorted_opps[:top_k]
        except Exception as e:
            logger.error(f"Error ranking top picks: {e}")
            return scored_opportunities[:top_k]

    def identify_profile_gaps(self, student_profile: dict, target_opportunity: dict) -> List[str]:
        """
        Compare student skills against award requirements to find missing qualifications.
        Generates simple advice strings for each missing skill (legacy method compatibility).
        
        Args:
            student_profile: Student data dictionary.
            target_opportunity: Target award dictionary.

        Returns:
            List[str]: List of actionable tip strings.
        """
        try:
            student, opp = self._ensure_objects(student_profile, target_opportunity)
            missing = self.analyze_missing_skills(student, opp)
            
            tips = []
            for skill in missing:
                tips.append(f"Consider acquiring skills in '{skill}' to improve eligibility for this program.")
            
            if not tips:
                tips.append("Your skills align perfectly with this opportunity's requirements!")
            
            return tips
        except Exception as e:
            logger.error(f"Error in identify_profile_gaps: {e}")
            return []

    def analyze_missing_skills(
        self, student_profile: Any, opportunity: Any, match_result: Optional[dict] = None
    ) -> List[str]:
        """
        Compare the student's background skills with the opportunity's required/recommended skills.

        Args:
            student_profile: StudentProfile model instance or dictionary.
            opportunity: Opportunity model instance or dictionary.
            match_result: Optional match result dictionary containing pre-computed details.

        Returns:
            List[str]: Clean list of missing skills.
        """
        try:
            # 1. Check if match_result already has computed missing skills
            if match_result and isinstance(match_result, dict):
                # Look for typical keys
                missing = match_result.get("missing_skills") or match_result.get("missingSkills")
                if missing is not None:
                    return [str(s) for s in missing]

            # 2. Coerce objects and calculate set difference on-the-fly
            student, opp = self._ensure_objects(student_profile, opportunity)
            
            if not opp.required_skills:
                return []

            # Aggregate all student skills
            student_skills = [s.strip().lower() for s in student.skills]
            student_langs = [l.strip().lower() for l in student.programming_languages]
            student_portfolio = set(student_skills + student_langs)

            # Match case-insensitively
            missing_skills = []
            for req in opp.required_skills:
                cleaned_req = req.strip()
                if cleaned_req.lower() not in student_portfolio:
                    missing_skills.append(cleaned_req)

            return missing_skills

        except Exception as e:
            logger.error(f"Error analyzing missing skills: {e}")
            return []

    def recommend_learning_resources(self, missing_skills: List[str]) -> List[dict]:
        """
        Suggest courses, documentation, and guides to bridge skill gaps.

        Args:
            missing_skills: List of missing skills.

        Returns:
            List[dict]: Formatted resource suggestions.
        """
        resources = []
        try:
            for skill in missing_skills:
                normalized = skill.lower().strip()
                if normalized in self.skill_catalog:
                    catalog_items = self.skill_catalog[normalized]["resources"]
                    for item in catalog_items:
                        resources.append({
                            "skill": skill,
                            "resource_name": item["name"],
                            "url": item["url"],
                            "type": item["type"]
                        })
                else:
                    # Provide an elegant, customized fallback resource suggestion
                    resources.append({
                        "skill": skill,
                        "resource_name": f"Introductory Tutorial for {skill}",
                        "url": f"https://www.google.com/search?q={skill}+tutorial+documentation",
                        "type": "Tutorial"
                    })
            return resources
        except Exception as e:
            logger.error(f"Error recommending learning resources: {e}")
            return []

    def recommend_certifications(self, missing_skills: List[str]) -> List[dict]:
        """
        Suggest industry-recognized certifications for the missing skills.

        Args:
            missing_skills: List of missing skills.

        Returns:
            List[dict]: Formatted certification suggestions.
        """
        certs = []
        try:
            for skill in missing_skills:
                normalized = skill.lower().strip()
                if normalized in self.skill_catalog:
                    catalog_items = self.skill_catalog[normalized]["certifications"]
                    for item in catalog_items:
                        certs.append({
                            "skill": skill,
                            "certification_name": item["name"],
                            "provider": item["provider"],
                            "difficulty": item["difficulty"]
                        })
                else:
                    # Fallback certification
                    certs.append({
                        "skill": skill,
                        "certification_name": f"{skill} Certified Professional",
                        "provider": "Various Industry Providers",
                        "difficulty": "Intermediate"
                    })
            return certs
        except Exception as e:
            logger.error(f"Error recommending certifications: {e}")
            return []

    def recommend_projects(self, missing_skills: List[str]) -> List[dict]:
        """
        Suggest hands-on portfolio projects to build and demonstrate missing skills.

        Args:
            missing_skills: List of missing skills.

        Returns:
            List[dict]: Formatted project suggestion dictionaries.
        """
        projects = []
        try:
            for skill in missing_skills:
                normalized = skill.lower().strip()
                if normalized in self.skill_catalog:
                    catalog_items = self.skill_catalog[normalized]["projects"]
                    for item in catalog_items:
                        projects.append({
                            "skill": skill,
                            "project_title": item["title"],
                            "description": item["description"],
                            "estimated_hours": item["estimated_hours"]
                        })
                else:
                    # Fallback custom project suggestion
                    projects.append({
                        "skill": skill,
                        "project_title": f"Hands-on {skill} Portfolio Application",
                        "description": f"Create an open-source project integrating '{skill}' functionality. Host it on GitHub with a comprehensive README document.",
                        "estimated_hours": 20
                    })
            return projects
        except Exception as e:
            logger.error(f"Error recommending projects: {e}")
            return []

    def recommend_leadership_opportunities(self, student_profile: Any, opportunity: Any) -> List[dict]:
        """
        Analyze current leadership standing and provide actionable improvement steps.

        Args:
            student_profile: StudentProfile instance or dict.
            opportunity: Opportunity instance or dict.

        Returns:
            List[dict]: Actionable leadership tasks.
        """
        try:
            student, opp = self._ensure_objects(student_profile, opportunity)
            experience_count = len(student.leadership_experience)

            recommendations = []
            if experience_count == 0:
                # Basic starting steps
                recommendations.append({
                    "activity": "Apply for Student Government or Club Leadership",
                    "description": "Take on an officer role (treasurer, secretary, webmaster) in a university organization related to your major.",
                    "difficulty": "Medium",
                    "impact_area": "Campus"
                })
                recommendations.append({
                    "activity": "Initiate a Tech/Academic Workshop",
                    "description": "Host a weekend tutoring workshop or study group. Leading peers demonstrates strong proactive leadership.",
                    "difficulty": "Easy",
                    "impact_area": "Campus"
                })
            else:
                # Advanced expansion steps
                recommendations.append({
                    "activity": "Organize a Local Hackathon or Event",
                    "description": f"Lead a volunteer committee to organize a regional student meet-up, hackathon, or code drive aligning with {opp.title}.",
                    "difficulty": "Hard",
                    "impact_area": "Community"
                })
                recommendations.append({
                    "activity": "Mentor Junior Students",
                    "description": "Serve as a formal peer mentor or research assistant under a professor's guidance.",
                    "difficulty": "Medium",
                    "impact_area": "Professional"
                })
            return recommendations
        except Exception as e:
            logger.error(f"Error recommending leadership: {e}")
            return []

    def recommend_volunteer_activities(self, student_profile: Any, opportunity: Any) -> List[dict]:
        """
        Suggest volunteer activities to broaden community contribution records.

        Args:
            student_profile: StudentProfile instance or dict.
            opportunity: Opportunity instance or dict.

        Returns:
            List[dict]: Recommended volunteer activities.
        """
        try:
            student, opp = self._ensure_objects(student_profile, opportunity)
            experience_count = len(student.volunteer_experience)

            recommendations = []
            if experience_count == 0:
                recommendations.append({
                    "activity": "Provide Free Peer Tutoring",
                    "description": f"Offer free tutoring in {student.major} topics or coding to local high school or early undergrad students.",
                    "hours_suggested": 15,
                    "alignment": "Education"
                })
                recommendations.append({
                    "activity": "Contribute to Open-Source Public Projects",
                    "description": f"Contribute code, documentation, or design files to civic technology initiatives or public repositories.",
                    "hours_suggested": 20,
                    "alignment": "Social Impact"
                })
            else:
                recommendations.append({
                    "activity": "Lead a Non-Profit Technical Initiative",
                    "description": "Design a simple landing page or database solution for a local charity or community food kitchen.",
                    "hours_suggested": 30,
                    "alignment": "STEM Outreach"
                })
            return recommendations
        except Exception as e:
            logger.error(f"Error recommending volunteer activities: {e}")
            return []

    def build_action_plan(self, student_profile: Any, opportunity: Any, match_result: Optional[dict] = None) -> dict:
        """
        Generate a fully unified, structured chronological action report for the student.

        Args:
            student_profile: Student profile data.
            opportunity: Target opportunity data.
            match_result: Optional prior match result dict.

        Returns:
            dict: Complete action plan detailing priority, timeline, and suggestions.
        """
        logger.info("Assembling full deterministic action plan report...")
        try:
            # Coerce model objects
            student, opp = self._ensure_objects(student_profile, opportunity)

            # 1. Analyze and compile missing skill list
            missing_skills = self.analyze_missing_skills(student, opp, match_result)

            # 2. Get resources, certs, and projects for missing skills
            suggested_resources = self.recommend_learning_resources(missing_skills)
            suggested_certifications = self.recommend_certifications(missing_skills)
            suggested_personal_projects = self.recommend_projects(missing_skills)

            # 3. Analyze extracurricular/soft improvements
            leadership_improvements = self.recommend_leadership_opportunities(student, opp)
            volunteer_improvements = self.recommend_volunteer_activities(student, opp)

            # 4. Determine Urgency/Priority level based on match score if present
            # Default priority mapping
            match_score = 0.0
            if match_result and isinstance(match_result, dict):
                match_score = float(match_result.get("overall_score") or match_result.get("matchScore") or 0.0)
            
            if match_score >= 80.0:
                priority_level = "High"
            elif match_score >= 50.0:
                priority_level = "Medium"
            else:
                priority_level = "Low"

            # 5. Programmatically estimate timeline based on skill gap size
            gap_size = len(missing_skills)
            if gap_size == 0:
                estimated_timeline = "1 - 2 weeks (Polishing & Review)"
            elif gap_size <= 2:
                estimated_timeline = "3 - 6 weeks (Focused Training)"
            else:
                estimated_timeline = "2 - 3 months (Deep Portfolio Building)"

            # Programmatically construct an incredibly rich, warm coaching fallback
            missing_skills_str = ", ".join(missing_skills) if missing_skills else "none (you're already well-aligned!)"
            resources_str = ", ".join([r.get("resource_name", "") for r in suggested_resources]) if suggested_resources else "foundational self-study guides"
            projects_str = ", ".join([p.get("project_title", "") for p in suggested_personal_projects]) if suggested_personal_projects else "some hands-on practice projects"
            
            coaching_advice = (
                f"### You're on an exciting path toward this opportunity!\n\n"
                f"To position yourself as a stellar candidate, focusing on bridging key areas is a great next step. "
                f"We recommend prioritizing your focus on developing expertise in **{missing_skills_str}**. "
                f"By engaging with learning materials like **{resources_str}** and diving into hands-on work like **{projects_str}**, "
                f"you'll build the critical expertise and confidence needed to stand out.\n\n"
                f"Your estimated preparation timeline is **{estimated_timeline}** with a **{priority_level} Priority** level of action. "
                f"Remember, every master began as a beginner—tackling these structured steps will elevate both your resume and your practical competence. "
                f"Keep pushing, and let's get ready to submit a highly competitive application!"
            )

            # Gemini Rewrite Integration
            import os
            api_key = os.environ.get("GEMINI_API_KEY", "")
            if api_key and not api_key.startswith("MY_"):
                from utils.gemini_cache import get_cached_response, set_cached_response
                
                cache_kwargs = {
                    "missing_skills": missing_skills,
                    "suggested_resources": [r.get("resource_name", "") for r in suggested_resources],
                    "suggested_certifications": [c.get("certification_name", "") for c in suggested_certifications],
                    "suggested_projects": [p.get("project_title", "") for p in suggested_personal_projects],
                    "timeline": estimated_timeline,
                    "priority": priority_level
                }
                
                cached_val = get_cached_response("coaching_rewrite", **cache_kwargs)
                if cached_val:
                    coaching_advice = cached_val
                    logger.info("RecommendationService: Restored coaching advice from GeminiCache successfully.")
                else:
                    logger.info("Calling Gemini API in RecommendationService to rewrite recommendations into warm coaching language...")
                    try:
                        from google import genai
                        client = genai.Client(api_key=api_key)
                        model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

                        prompt = self.gemini_coaching_rewrite_prompt.format(
                            missing_skills=", ".join(missing_skills) if missing_skills else "None (Profile aligns perfectly)",
                            suggested_resources=", ".join([r.get("resource_name", "") for r in suggested_resources]),
                            suggested_certifications=", ".join([c.get("certification_name", "") for c in suggested_certifications]),
                            suggested_projects=", ".join([p.get("project_title", "") for p in suggested_personal_projects]),
                            suggested_leadership=", ".join([l.get("activity", "") for l in leadership_improvements]),
                            suggested_volunteer=", ".join([v.get("activity", "") for v in volunteer_improvements]),
                            timeline=estimated_timeline,
                            priority=priority_level
                        )

                        response = client.models.generate_content(
                            model=model_name,
                            contents=prompt
                        )
                        if response.text:
                            coaching_advice = response.text.strip()
                            set_cached_response("coaching_rewrite", coaching_advice, **cache_kwargs)
                    except Exception as e:
                        logger.info("RecommendationService: Falling back to rules-based or cached coaching narrative.")
                        try:
                            from utils.gemini_cache import FALLBACK_RESPONSES
                            coaching_advice = FALLBACK_RESPONSES.get("coaching_rewrite", coaching_advice)
                            set_cached_response("coaching_rewrite", coaching_advice, **cache_kwargs)
                        except Exception:
                            pass

            # Return the clean structured summary report
            return {
                "missing_skills": missing_skills,
                "suggested_resources": suggested_resources,
                "suggested_certifications": suggested_certifications,
                "suggested_personal_projects": suggested_personal_projects,
                "leadership_improvements": leadership_improvements,
                "volunteer_improvements": volunteer_improvements,
                "estimated_preparation_timeline": estimated_timeline,
                "priority_level": priority_level,
                "coaching_advice": coaching_advice
            }

        except Exception as e:
            logger.error(f"Error building unified action plan: {e}")
            # Fallback minimum valid structure to avoid downstream errors
            return {
                "missing_skills": [],
                "suggested_resources": [],
                "suggested_certifications": [],
                "suggested_personal_projects": [],
                "leadership_improvements": [],
                "volunteer_improvements": [],
                "estimated_preparation_timeline": "N/A",
                "priority_level": "Medium"
            }
