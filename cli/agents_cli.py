"""
OpportunityAI Agent CLI.

A command-line interface demonstrating OpportunityAI's multi-agent system workflow, 
allowing prospective students to run profiles, match opportunities, and output 
actionable timelines directly inside the terminal.
"""

import sys
import json
import logging
from typing import Any, Dict, List

# Setup robust logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")
logger = logging.getLogger("AgentsCLI")


class AgentsCLI:
    """
    Terminal CLI demonstrating agent skills and coordination workflows.
    """

    def __init__(self) -> None:
        """
        Initialize the CLI application.
        """
        logger.info("Initializing OpportunityAI CLI Environment...")

    def display_banner(self) -> None:
        """
        Print a beautiful ASCII banner for the CLI tool.
        """
        print("=" * 70)
        print("                   🌟 OpportunityAI Agent CLI 🌟")
        print("        Empowering Students with Agentic Match & Career Plans")
        print("=" * 70)

    def run_demo_workflow(self) -> None:
        """
        Executes a complete simulated workflow through the CLI:
        1. Input/Load Student Profile.
        2. Match against indexed fellowships.
        3. Print custom Action Reports and Milestone Timelines.
        """
        print("\n[+] Starting Agentic Simulation workflow...")
        
        # Simulated profile payload
        sample_student = {
            "name": "Jane Doe",
            "major": "Computer Science",
            "gpa": 3.85,
            "skills": ["Python", "SQL", "Git"],
            "programming_languages": ["Python", "JavaScript"],
            "education_level": "Undergraduate",
            "country": "United States",
            "email": "jane.doe@example.edu",
            "leadership_experience": [],
            "volunteer_experience": [],
            "certificates": [],
            "interests": ["Machine Learning", "Social Impact"],
            "english_proficiency": "Fluent"
        }
        
        print(f"\n[1/3] Loaded Student Profile: {sample_student['name']} ({sample_student['major']})")
        print(f"      Skills: {', '.join(sample_student['skills'])}")
        
        print("\n[2/3] Calling CoordinatorAgent to orchestrate search and match...")
        print("      - ProfileAgent parses student parameters...")
        print("      - SearchAgent retrieves matching opportunities...")
        print("      - MatchAgent calculates alignment and scores...")
        
        print("\n[3/3] Generating Personalized Action Report via ReportAgent...")
        print("      - RecommendationService analyzes skill gaps (e.g., missing 'React' or 'TypeScript')...")
        print("      - Formulating custom chronological timelines and milestones...")
        
        print("\n" + "-" * 50)
        print("🎉 Simulation Successful! Run the main application to interact with live data.")
        print("-" * 50)


def main() -> None:
    """
    CLI Entry point.
    """
    cli = AgentsCLI()
    cli.display_banner()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--demo":
        cli.run_demo_workflow()
    else:
        print("\nUsage:")
        print("  python -m cli.agents_cli --demo")
        print("\nFeatures:")
        print("  * Run interactive student profile evaluation")
        print("  * Search available fellowships, scholarships & internships")
        print("  * View tailored deterministic career recommendation plans")
        print("-" * 70)


if __name__ == "__main__":
    main()
