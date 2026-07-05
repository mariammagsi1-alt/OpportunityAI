"""
Application Configuration and Environment Settings.

This module centralizes all system configurations, file directory paths,
model selection names, and API credentials needed across OpportunityAI.
"""

import os
try:
    from dotenv import load_dotenv
    _has_dotenv = True
except ImportError:
    _has_dotenv = False


class AppConfig:
    """
    Configuration manager for the OpportunityAI platform.
    
    Stores settings like data folder locations, default LLM model parameters,
    and scoring weights used by the AI engines.
    """

    def __init__(self):
        """Initialize default system settings."""
        # Directory path where opportunity JSON files are stored
        self.data_directory = "data"
        # Directory path where system prompt templates are stored
        self.prompts_directory = "prompts"
        # Gemini model name to use for reasoning agents
        self.gemini_model_name = "gemini-3.5-flash"
        # Minimum GPA required for standard filtering
        self.min_gpa_threshold = 2.0
        # Gemini API Key loaded from environment
        self.gemini_api_key = os.environ.get("GEMINI_API_KEY", "")

    @classmethod
    def load_from_env(cls):
        """
        Load sensitive credentials (like GEMINI_API_KEY) from environment variables.
        """
        # Load dotenv to read .env file if it exists
        if _has_dotenv:
            load_dotenv()
        
        config_inst = cls()
        config_inst.gemini_api_key = os.environ.get("GEMINI_API_KEY", "")
        # Also let users override model name via env if desired
        config_inst.gemini_model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")
        
        return config_inst

    def get_data_path(self, filename: str) -> str:
        """
        Construct a full file path for a dataset inside the data directory.
        
        Args:
            filename: Name of the JSON file (e.g., 'scholarships.json').
        """
        return os.path.join(self.data_directory, filename)
