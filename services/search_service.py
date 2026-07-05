"""
Search Service Module.

This module provides the SearchService class, responsible for loading opportunity
datasets from JSON files in the filesystem, converting them to structured
Opportunity objects, and performing fast rule-based filtering and substring keyword
searching before AI matchmaking takes place.
"""

import json
import os
import logging
from typing import List, Optional

# Import the shared Opportunity data model
from models.opportunity import Opportunity

# Setup clean, informative logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SearchService")


class SearchService:
    """
    Service responsible for loading, parsing, and filtering candidate opportunities.
    
    Acts as the main database query and filtering layer of the system.
    """

    def __init__(self, data_directory: str = "data") -> None:
        """
        Initialize the SearchService with a target directory for JSON datasets.

        Args:
            data_directory: Relative folder path containing opportunity JSON files.
        """
        self.data_directory = data_directory
        
        # Define the set of filenames we recognize as part of our database
        self.dataset_filenames = [
            "scholarships.json",
            "hackathons.json",
            "competitions.json",
            "fellowships.json",
            "internships.json",
            "leadership.json"
        ]

    def load_all_opportunities(self) -> List[Opportunity]:
        """
        Read all recognized opportunity JSON files, parse records, and instantiate
        Opportunity objects.

        Handles missing files and malformed JSON payloads gracefully.

        Returns:
            List[Opportunity]: Consolidated list of all loaded Opportunity objects.
        """
        all_opportunities: List[Opportunity] = []

        for filename in self.dataset_filenames:
            file_path = os.path.join(self.data_directory, filename)
            
            # Check if file exists before opening to prevent FileNotFoundError
            if not os.path.exists(file_path):
                logger.warning(f"Dataset file not found: {file_path}. Skipping.")
                continue

            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    
                # Ensure the loaded data is a list of records
                if isinstance(data, list):
                    for record in data:
                        try:
                            # Convert dict to Opportunity object
                            opportunity_obj = Opportunity.from_dict(record)
                            
                            # Validate the newly constructed object before listing
                            is_valid, errors = opportunity_obj.validate()
                            if is_valid:
                                all_opportunities.append(opportunity_obj)
                            else:
                                logger.warning(
                                    f"Skipping invalid opportunity record in {filename} with errors: {errors}"
                                )
                        except Exception as record_err:
                            logger.error(f"Error parsing record {record} in {filename}: {record_err}")
                else:
                    logger.warning(f"File {filename} did not contain a JSON array list. Skipping.")

            except json.JSONDecodeError as jde:
                logger.error(f"Malformed JSON syntax found in {filename}: {jde}. Skipping.")
            except Exception as e:
                logger.error(f"Unexpected error while reading {filename}: {e}. Skipping.")

        logger.info(f"Successfully loaded and validated {len(all_opportunities)} opportunities from local filesystem.")
        return all_opportunities

    def load_category(self, category: str) -> List[Opportunity]:
        """
        Retrieve opportunities belonging to a specific category.

        Args:
            category: Category name (e.g. 'Scholarships', 'Hackathons').

        Returns:
            List[Opportunity]: Filtered list of Opportunity objects belonging to the category.
        """
        all_opps = self.load_all_opportunities()
        category_clean = category.strip().lower()
        
        return [
            opp for opp in all_opps
            if opp.category.strip().lower() == category_clean
        ]

    def filter_by_country(self, opportunities: List[Opportunity], student_country: str) -> List[Opportunity]:
        """
        Filter opportunities based on geographic eligibility constraints.

        Args:
            opportunities: List of Opportunity objects to filter.
            student_country: The country where the student resides or holds citizenship.

        Returns:
            List[Opportunity]: Eligible opportunities matching geographic constraints.
        """
        return [
            opp for opp in opportunities
            if opp.matches_country(student_country)
        ]

    def filter_by_education_level(self, opportunities: List[Opportunity], education_level: str) -> List[Opportunity]:
        """
        Filter opportunities based on required academic standing.

        Args:
            opportunities: List of Opportunity objects to filter.
            education_level: The student's current academic level (e.g., 'Undergraduate').

        Returns:
            List[Opportunity]: Opportunities that accept the student's education level.
        """
        return [
            opp for opp in opportunities
            if opp.matches_education_level(education_level)
        ]

    def filter_by_major(self, opportunities: List[Opportunity], major: str) -> List[Opportunity]:
        """
        Filter opportunities based on academic field of study constraints.

        Args:
            opportunities: List of Opportunity objects to filter.
            major: The student's academic field (e.g., 'Computer Science').

        Returns:
            List[Opportunity]: Opportunities matching the student's major of study.
        """
        return [
            opp for opp in opportunities
            if opp.matches_major(major)
        ]

    def filter_by_deadline(self, opportunities: List[Opportunity], reference_date_str: Optional[str] = None) -> List[Opportunity]:
        """
        Filter out opportunities whose application deadlines have already passed.

        Args:
            opportunities: List of Opportunity objects to filter.
            reference_date_str: Optional date string (YYYY-MM-DD) representing the check date.
                               Defaults to current system date.

        Returns:
            List[Opportunity]: List of active, open opportunities.
        """
        return [
            opp for opp in opportunities
            if not opp.is_deadline_passed(reference_date_str)
        ]

    def filter_by_skills(self, opportunities: List[Opportunity], student_skills: List[str]) -> List[Opportunity]:
        """
        Filter opportunities based on technical skill compatibility overlap.

        Args:
            opportunities: List of Opportunity objects to filter.
            student_skills: List of skills possessed by the student.

        Returns:
            List[Opportunity]: Opportunities where the student has at least one matching skill,
                               or that require no skills.
        """
        return [
            opp for opp in opportunities
            if opp.matches_skills(student_skills)
        ]

    def search(self, opportunities: List[Opportunity], keyword: str) -> List[Opportunity]:
        """
        Perform a case-insensitive keyword/substring search across title, organization,
        and description fields.

        Args:
            opportunities: List of Opportunity objects to search through.
            keyword: Word or phrase to match (e.g., 'clean energy', 'DeepMind').

        Returns:
            List[Opportunity]: Sub-list of opportunities matching the query.
        """
        if not keyword or not keyword.strip():
            return opportunities

        keyword_clean = keyword.strip().lower()

        filtered: List[Opportunity] = []
        for opp in opportunities:
            # Gather descriptive text fields
            search_corpus = " ".join([
                opp.title,
                opp.organization,
                opp.category,
                opp.description
            ]).lower()

            if keyword_clean in search_corpus:
                filtered.append(opp)

        return filtered
