"""
Search Agent Module.

This module defines the SearchAgent, which serves as the interface between the
CoordinatorAgent and the SearchService. It delegates database loading and
filtering tasks to the SearchService and manages the flow of candidate
opportunity retrievals based on student credentials.
"""

import logging
from typing import List, Optional

# Import the shared Opportunity data model
from models.opportunity import Opportunity
# Import the backend SearchService to delegate business logic queries
from services.search_service import SearchService

# Setup clean, informative logging for tracking agent activity
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SearchAgent")


class SearchAgent:
    """
    AI Agent responsible for coordinating opportunity search requests.
    
    It delegates actual data queries and rule-based filter operations to
    SearchService, returning clean lists of structured Opportunity objects.
    """

    def __init__(self, search_service: Optional[SearchService] = None) -> None:
        """
        Initialize the SearchAgent with a SearchService instance.

        Args:
            search_service: An optional pre-configured SearchService. If None,
                            instantiates a default SearchService.
        """
        if search_service is not None:
            self.search_service: SearchService = search_service
        else:
            # Instantiate a default SearchService pointing to the standard 'data' directory
            self.search_service = SearchService(data_directory="data")
        
        logger.info("SearchAgent successfully initialized with SearchService.")

    def search_all(self) -> List[Opportunity]:
        """
        Retrieve all opportunities loaded by the SearchService.

        Returns:
            List[Opportunity]: Consolidated list of all opportunities.
        """
        logger.info("SearchAgent: Retrieving all opportunities...")
        try:
            return self.search_service.load_all_opportunities()
        except Exception as e:
            logger.error(f"SearchAgent: Failed to retrieve all opportunities: {e}")
            return []

    def search_by_category(self, category: str) -> List[Opportunity]:
        """
        Retrieve opportunities that match a specific category type.

        Args:
            category: Category name (e.g. 'Scholarships', 'Hackathons').

        Returns:
            List[Opportunity]: Opportunities belonging to the specified category.
        """
        logger.info(f"SearchAgent: Searching by category '{category}'...")
        try:
            return self.search_service.load_category(category)
        except Exception as e:
            logger.error(f"SearchAgent: Failed to search by category '{category}': {e}")
            return []

    def search_by_keyword(self, keyword: str) -> List[Opportunity]:
        """
        Retrieve opportunities that contain the keyword in title, org, or description.

        Args:
            keyword: Substring text to search.

        Returns:
            List[Opportunity]: Matches containing the keyword.
        """
        logger.info(f"SearchAgent: Searching by keyword '{keyword}'...")
        try:
            all_opps = self.search_service.load_all_opportunities()
            return self.search_service.search(all_opps, keyword)
        except Exception as e:
            logger.error(f"SearchAgent: Failed to search by keyword '{keyword}': {e}")
            return []

    def apply_filters(self, opportunities: List[Opportunity], student_profile_dict: dict) -> List[Opportunity]:
        """
        Coordinate pipeline filtering by invoking SearchService rules for:
        - Country matching
        - Education level matching
        - Major matching
        - Skills overlap
        - Deadline validity

        Args:
            opportunities: Raw list of Opportunity objects to filter down.
            student_profile_dict: Dictionary containing the student's credentials.

        Returns:
            List[Opportunity]: Fully filtered, eligible list of opportunities.
        """
        logger.info("SearchAgent: Coordinating eligibility filters...")
        try:
            filtered_opps = opportunities

            # 1. Filter by geographic country eligibility
            student_country = student_profile_dict.get("country", "Global")
            filtered_opps = self.search_service.filter_by_country(filtered_opps, student_country)

            # 2. Filter by academic level compatibility
            student_education = student_profile_dict.get("education_level", "All")
            filtered_opps = self.search_service.filter_by_education_level(filtered_opps, student_education)

            # 3. Filter by primary major alignment
            student_major = student_profile_dict.get("major", "Undeclared")
            filtered_opps = self.search_service.filter_by_major(filtered_opps, student_major)

            # 4. Filter out expired application deadlines
            filtered_opps = self.search_service.filter_by_deadline(filtered_opps)

            # 5. Filter by technical skills overlap
            # Combine 'skills' and 'programming_languages' as the student's skill portfolio
            student_skills = student_profile_dict.get("skills", []) + student_profile_dict.get("programming_languages", [])
            filtered_opps = self.search_service.filter_by_skills(filtered_opps, student_skills)

            logger.info(f"SearchAgent: Filtering complete. Remaining eligible: {len(filtered_opps)}")
            return filtered_opps

        except Exception as e:
            logger.error(f"SearchAgent: Error applying eligibility filters: {e}")
            return opportunities  # Fall back to returning original list to avoid breaking the UI/orchestrator

    def search_for_student(self, student_profile_dict: dict) -> List[Opportunity]:
        """
        Find all eligible opportunities for a specific student profile.
        This pulls all database opportunities and routes them through apply_filters.

        Args:
            student_profile_dict: Dictionary representing the student's profile.

        Returns:
            List[Opportunity]: Eligible and active opportunity matches for the student.
        """
        logger.info(f"SearchAgent: Retrieving matched opportunities for student '{student_profile_dict.get('name')}'...")
        try:
            # Load all available opportunities in the catalog
            all_opps = self.search_service.load_all_opportunities()
            
            # Apply all sequential database filters
            return self.apply_filters(all_opps, student_profile_dict)
        except Exception as e:
            logger.error(f"SearchAgent: Failed to search for student profile: {e}")
            return []

    def find_opportunities(self, student_profile_dict: dict, target_category: Optional[str] = None) -> List[dict]:
        """
        Orchestration interface for the CoordinatorAgent.
        Takes a profile dict, runs filters, and returns a list of serializable dictionaries.

        Args:
            student_profile_dict: Serialized student background credentials.
            target_category: Optional category filter restriction.

        Returns:
            List[dict]: Filtered opportunities in serializable dictionary form.
        """
        logger.info("SearchAgent: find_opportunities called by CoordinatorAgent.")
        try:
            # 1. Fetch relevant opportunities
            if target_category:
                candidates = self.search_by_category(target_category)
            else:
                candidates = self.search_all()

            # 2. Filter using student criteria
            eligible_candidates = self.apply_filters(candidates, student_profile_dict)

            # 3. Convert Opportunity objects back to serializable dictionaries for CoordinatorAgent
            return [opp.to_dict() for opp in eligible_candidates]

        except Exception as e:
            logger.error(f"SearchAgent: Error inside find_opportunities: {e}")
            # TODO: Add advanced AI heuristic or fallback logic to handle filtering exceptions gracefully
            return []
