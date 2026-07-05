"""
Main Entry Point for the OpportunityAI Multi-Agent System.

This module initializes the application configuration, boots up the core
services, instantiates the multi-agent team, and provides an interactive
interface (CLI or server) for students to find matching opportunities.
"""

from config import AppConfig
from agents.coordinator_agent import CoordinatorAgent


class OpportunityAIApplication:
    """
    Main application class responsible for managing the system lifecycle.
    
    This class brings together the configuration, database services, and the
    CoordinatorAgent to run the OpportunityAI platform.
    """

    def __init__(self):
        """Initialize the application container with default configurations."""
        # TODO: Load configuration settings from AppConfig
        self.config = None
        # TODO: Initialize the CoordinatorAgent instance
        self.coordinator = None

    def initialize_system(self):
        """
        Set up databases, load opportunity data, and verify API connections.
        """
        # TODO: Initialize search services and load JSON opportunity datasets
        # TODO: Connect to Gemini API client for agent reasoning
        pass

    def run_interactive_cli(self):
        """
        Start a beginner-friendly command-line interface for testing agents.
        """
        # TODO: Print welcome banner to the terminal
        # TODO: Prompt student for their major, GPA, and career goals
        # TODO: Pass inputs to coordinator.process_user_request() and display results
        pass


def main():
    """Application main execution helper."""
    app = OpportunityAIApplication()
    app.initialize_system()
    app.run_interactive_cli()


if __name__ == "__main__":
    main()
