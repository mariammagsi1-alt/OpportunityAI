"""
Coordinator Agent Module.

This module defines the CoordinatorAgent, which acts as the central brain and
orchestrator of the OpportunityAI multi-agent team. It coordinates communication,
manages data flow, and handles requests across the Profile, Search, Match, Advisor,
and Report agents.
"""

import logging
from typing import Any, Dict, List, Optional, Tuple

# Import the core StudentProfile model for type safety and structure
from models.student_profile import StudentProfile

# Import the specialized agents
from agents.profile_agent import ProfileAgent
from agents.search_agent import SearchAgent
from agents.match_agent import MatchAgent
from agents.advisor_agent import AdvisorAgent
from agents.report_agent import ReportAgent

# Import core backend services
from services.search_service import SearchService
from services.scoring_service import ScoringService
from services.recommendation_service import RecommendationService

# Set up clean logging for beginner-friendly tracking
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CoordinatorAgent")


class CoordinatorAgent:
    """
    The central brain of OpportunityAI.
    
    Coordinates tasks, data flow, and error handling among all specialized AI agents.
    """

    def __init__(self, config: Any) -> None:
        """
        Initialize the CoordinatorAgent with app configuration settings.

        Args:
            config: An instance of AppConfig holding global system settings.
        """
        self.config: Any = config
        
        # References to the specialized team of agents
        self.profile_agent: Optional[ProfileAgent] = None
        self.search_agent: Optional[SearchAgent] = None
        self.match_agent: Optional[MatchAgent] = None
        self.advisor_agent: Optional[AdvisorAgent] = None
        self.report_agent: Optional[ReportAgent] = None

        # Automate the agent initialization during creation
        self.initialize_agents()

    def initialize_agents(self) -> None:
        """
        Instantiate and bind the specialized sub-agents.
        
        This establishes the communication channels for the coordinator.
        """
        logger.info("Initializing specialized sub-agents with production-ready services...")
        try:
            # 1. Instantiate the core services
            search_svc = SearchService(data_directory="data")
            scoring_svc = ScoringService()
            rec_svc = RecommendationService()

            # 2. Wire them directly into each corresponding agent
            self.profile_agent = ProfileAgent()
            self.search_agent = SearchAgent(search_service=search_svc)
            self.match_agent = MatchAgent(scoring_service=scoring_svc)
            self.advisor_agent = AdvisorAgent()
            self.report_agent = ReportAgent(recommendation_service=rec_svc)
            
            logger.info("All sub-agents successfully instantiated with production services wired.")
        except Exception as e:
            logger.error(f"Error during agent initialization: {str(e)}")
            # Raise exception so the developer knows initialization failed
            raise RuntimeError(f"Failed to boot up the OpportunityAI agents: {e}")

    def process_student_request(self, raw_input: str) -> Dict[str, Any]:
        """
        Main orchestration hub: takes a student's raw text query (such as a resume or message)
        and guides it sequentially through the entire multi-agent pipeline to produce matching results.

        Args:
            raw_input: Raw text representing a student's goals, skills, and GPA.

        Returns:
            Dict[str, Any]: A nested dictionary with student profile, matches, and personalized timeline.
        """
        logger.info("Starting multi-agent workflow coordination...")
        try:
            # Step 1: Parse and build the student profile from raw text input
            student_profile = self.build_student_profile(raw_input)
            if not student_profile:
                raise ValueError("Failed to create a valid StudentProfile from the provided input.")

            # Convert to dictionary for compatibility and serialization between agents
            profile_dict = student_profile.to_dict()

            # Step 2: Query and search for candidate opportunities matching basic eligibility criteria
            candidates = self.search_opportunities(profile_dict)
            logger.info(f"Retrieved {len(candidates)} candidate opportunities.")

            # Step-3: Run advanced AI compatibility matching and compute weights
            scored_matches = self.calculate_matches(profile_dict, candidates)

            # Step 4: Generate a high-level report, action plan, and gap analysis
            report = self.generate_personalized_report(profile_dict, scored_matches)

            # Step 5: Consolidate and return the complete payload
            return {
                "status": "success",
                "student_profile": profile_dict,
                "matches": scored_matches,
                "report": report
            }

        except ValueError as ve:
            logger.error(f"Validation or input error in pipeline: {str(ve)}")
            return {
                "status": "error",
                "message": f"Input validation failed: {str(ve)}",
                "stage": "profile_creation"
            }
        except Exception as e:
            logger.error(f"Fatal error executing coordinating pipeline: {str(e)}")
            return {
                "status": "error",
                "message": f"An unexpected system error occurred: {str(e)}",
                "stage": "system_pipeline"
            }

    def build_student_profile(self, raw_input: str) -> Optional[StudentProfile]:
        """
        Delegates text extraction to ProfileAgent to instantiate a validated StudentProfile.

        Args:
            raw_input: Raw text string (e.g., student resume, bio, or questionnaire).

        Returns:
            Optional[StudentProfile]: Validated profile object if successful, or None.
        """
        logger.info("Step 1: Handing off raw input to ProfileAgent...")
        try:
            # TODO: Integrate Gemini API parsing inside profile_agent.extract_profile_data()
            # For now, we interact with the ProfileAgent interface placeholder.
            if self.profile_agent is not None:
                # Mock or intermediate call to the profile agent's extract capability
                raw_extracted_data = self.profile_agent.extract_profile_data(raw_input)
                
                # If the placeholder returns None, we create a basic fallback profile for testing purposes
                if raw_extracted_data is None:
                    logger.warning("ProfileAgent returned empty. Creating fallback student profile.")
                    fallback_profile = StudentProfile(
                        name="Demo Student",
                        email="demo.student@university.edu",
                        country="United States",
                        education_level="Undergraduate",
                        gpa=3.5,
                        major="Computer Science",
                        skills=["Python", "Data Analysis"],
                        programming_languages=["Python", "C++"]
                    )
                    return fallback_profile
                
                # Ensure the extracted dictionary gets loaded into the formal StudentProfile type
                if isinstance(raw_extracted_data, dict):
                    return StudentProfile.from_dict(raw_extracted_data)
                
            return None
        except Exception as e:
            logger.error(f"Failed to build student profile in ProfileAgent: {str(e)}")
            raise RuntimeError(f"ProfileAgent parsing failed: {e}")

    def search_opportunities(self, student_profile: dict) -> List[dict]:
        """
        Delegates search and baseline eligibility queries to SearchAgent.

        Args:
            student_profile: Dictionary containing serialized student profile.

        Returns:
            List[dict]: Filtered candidate opportunities.
        """
        logger.info("Step 2: Handing off profile to SearchAgent for data retrieval...")
        try:
            # TODO: Connect SearchAgent to SearchService to read actual JSON catalogs
            if self.search_agent is not None:
                candidates = self.search_agent.find_opportunities(student_profile)
                
                # Fallback: if SearchAgent is still a mock stub and returns None/empty,
                # we provide mock opportunities for continuous development.
                if not candidates:
                    logger.warning("SearchAgent returned empty candidates. Providing basic skeleton matches.")
                    candidates = [
                        {
                            "id": "mock-sch-01",
                            "title": "AI Pioneers Fellowship",
                            "category": "Scholarships",
                            "organization": "AI Global Labs",
                            "minGpa": 3.0,
                            "requiredSkills": ["Python", "Machine Learning"]
                        }
                    ]
                return candidates
            return []
        except Exception as e:
            logger.error(f"Failed to retrieve opportunities in SearchAgent: {str(e)}")
            raise RuntimeError(f"SearchAgent filtering failed: {e}")

    def calculate_matches(self, student_profile: dict, opportunities: list) -> List[dict]:
        """
        Delegates AI score computing and fit summaries to MatchAgent.

        Args:
            student_profile: Dictionary containing serialized student profile.
            opportunities: List of candidate opportunities.

        Returns:
            List[dict]: Opportunities sorted by matchScore with explainers attached.
        """
        logger.info("Step 3: Handing off candidates to MatchAgent for scoring & evaluation...")
        try:
            # TODO: Integrate ScoringService weights and Gemini explanation prompts inside MatchAgent
            if self.match_agent is not None:
                matches = self.match_agent.compute_match_scores(student_profile, opportunities)
                
                # Fallback implementation if MatchAgent returns None due to placeholder status
                if not matches:
                    logger.warning("MatchAgent returned empty. Adding dummy matchScore (e.g. 85%) for development.")
                    matches = []
                    for opp in opportunities:
                        scored_opp = opp.copy()
                        scored_opp["matchScore"] = 85
                        scored_opp["matchReasons"] = ["Matches your Computer Science major", "Excellent GPA alignment"]
                        matches.append(scored_opp)
                return matches
            return []
        except Exception as e:
            logger.error(f"Failed to calculate match scores in MatchAgent: {str(e)}")
            raise RuntimeError(f"MatchAgent evaluation failed: {e}")

    def generate_personalized_report(self, student_profile: dict, matches: list) -> dict:
        """
        Delegates portfolio aggregation, action planning, and timeline milestones to ReportAgent.

        Args:
            student_profile: Dictionary containing student profile.
            matches: Scored opportunities.

        Returns:
            dict: Structured final PDF/Markdown report information.
        """
        logger.info("Step 4: Handing off top candidates to ReportAgent to generate a master action plan...")
        try:
            # TODO: Call RecommendationService inside ReportAgent to extract skill gap lists
            if self.report_agent is not None:
                report = self.report_agent.generate_action_report(student_profile, matches)
                
                # Fallback structure if ReportAgent is in mock/stub status
                if not report:
                    logger.warning("ReportAgent returned empty. Constructing mock report template.")
                    report = {
                        "executive_summary": "You are a strong fit for AI fellowships. Focus on learning Machine Learning to bridge remaining gaps.",
                        "recommended_timeline": [
                            {"date": "2026-10-15", "task": "Submit AI Pioneers Fellowship application"}
                        ],
                        "skill_gaps": ["Machine Learning", "Public Speaking"]
                    }
                return report
            return {}
        except Exception as e:
            logger.error(f"Failed to compile report in ReportAgent: {str(e)}")
            raise RuntimeError(f"ReportAgent compilation failed: {e}")

    def answer_follow_up_question(self, question: str, student_profile: dict) -> str:
        """
        Delegates active, continuous chat mentorship to AdvisorAgent.

        Args:
            question: Direct student question (e.g., 'Can you review my essay?').
            student_profile: Serialized student profile dict for contextualized answers.

        Returns:
            str: Empathetic mentoring response from AdvisorAgent.
        """
        logger.info("Handling follow-up student inquiry through AdvisorAgent...")
        try:
            # TODO: Wire conversational Gemini model session inside AdvisorAgent
            if self.advisor_agent is not None:
                response = self.advisor_agent.chat_with_student(question, active_context=student_profile)
                
                # Mock fallback answer
                if not response:
                    response = (
                        "That is an excellent question! Regarding your profile, I recommend highlighting your "
                        "Python programming languages experience and solid GPA. Let me know if you would like "
                        "me to analyze specific essays for you!"
                    )
                return response
            return "Advisor Agent is currently offline."
        except Exception as e:
            logger.error(f"Failed to resolve question in AdvisorAgent: {str(e)}")
            return f"The Advisor Agent encountered an issue answering that: {str(e)}"
