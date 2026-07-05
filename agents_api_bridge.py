"""
OpportunityAI Agents API Bridge.

This script acts as the lightweight execution bridge between the Node.js Express server
and the Python multi-agent reasoning system. It reads inputs from stdin in JSON format,
orchestrates the required agent execution path, and prints the result back as JSON to stdout.
"""

import sys
import json
import os
import logging

# Ensure local user-site packages directory is in python path to handle container environment paths cleanly
local_packages = os.path.expanduser("~/.local/lib/python3.10/site-packages")
if os.path.exists(local_packages):
    sys.path.insert(0, local_packages)
root_packages = "/root/.local/lib/python3.10/site-packages"
if os.path.exists(root_packages):
    sys.path.insert(0, root_packages)

# Ensure root directory is in python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Configure logging: redirect logs to stderr to keep stdout purely for the JSON output
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stderr)]
)
logger = logging.getLogger("AgentsAPIBridge")

# Load configuration settings and agents
try:
    from config import AppConfig
    from agents.coordinator_agent import CoordinatorAgent
    from models.student_profile import StudentProfile
except Exception as import_err:
    print(json.dumps({"error": f"Import error: {str(import_err)}"}))
    sys.exit(1)


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No action specified. Usage: python agents_api_bridge.py <action>"}))
        return

    action = sys.argv[1]
    
    # Read payload JSON from standard input
    try:
        payload_str = sys.stdin.read()
        payload = json.loads(payload_str) if payload_str.strip() else {}
    except Exception as parse_err:
        print(json.dumps({"error": f"Failed to parse stdin JSON: {str(parse_err)}"}))
        return

    # Load configuration settings
    try:
        config = AppConfig.load_from_env()
    except Exception as config_err:
        print(json.dumps({"error": f"Failed to load AppConfig: {str(config_err)}"}))
        return
    
    # Initialize the Central Coordinator Agent
    try:
        coordinator = CoordinatorAgent(config=config)
    except Exception as init_err:
        print(json.dumps({"error": f"Failed to initialize CoordinatorAgent: {str(init_err)}"}))
        return

    logger.info(f"API Bridge handling action: '{action}'")

    if action == "profile_extract":
        raw_text = payload.get("raw_text", "")
        if not raw_text:
            print(json.dumps({"error": "No raw_text provided for profile extraction"}))
            return
        
        try:
            profile_dict = coordinator.profile_agent.process_student_input(raw_text)
            is_fallback = coordinator.profile_agent.fallback_active if coordinator.profile_agent else True
            print(json.dumps({"status": "success", "profile": profile_dict, "fallback_active": is_fallback}))
        except Exception as e:
            print(json.dumps({"error": f"ProfileAgent processing failed: {str(e)}"}))

    elif action == "pipeline_run":
        profile_data = payload.get("profile")
        raw_text = payload.get("raw_text")

        try:
            if profile_data:
                # Run search and matching pipeline using direct StudentProfile payload
                candidates = coordinator.search_opportunities(profile_data)
                scored_matches = coordinator.calculate_matches(profile_data, candidates)
                report = coordinator.generate_personalized_report(profile_data, scored_matches)
                
                is_fallback = (
                    (coordinator.profile_agent and coordinator.profile_agent.fallback_active) or
                    (coordinator.match_agent and coordinator.match_agent.fallback_active) or
                    (coordinator.report_agent and coordinator.report_agent.fallback_active)
                )
                print(json.dumps({
                    "status": "success",
                    "student_profile": profile_data,
                    "matches": scored_matches,
                    "report": report,
                    "fallback_active": is_fallback
                }))
            elif raw_text:
                # Run full text-to-report pipeline
                res = coordinator.process_student_request(raw_text)
                is_fallback = (
                    (coordinator.profile_agent and coordinator.profile_agent.fallback_active) or
                    (coordinator.match_agent and coordinator.match_agent.fallback_active) or
                    (coordinator.report_agent and coordinator.report_agent.fallback_active)
                )
                res["fallback_active"] = is_fallback
                print(json.dumps(res))
            else:
                print(json.dumps({"error": "Neither profile nor raw_text provided for pipeline run"}))
        except Exception as e:
            print(json.dumps({"error": f"Pipeline run failed: {str(e)}"}))

    elif action == "advisor_chat":
        message = payload.get("message", "")
        profile_data = payload.get("profile", {})
        if not message:
            print(json.dumps({"error": "No message provided for advisor chat"}))
            return
        
        try:
            reply = coordinator.answer_follow_up_question(message, profile_data)
            is_fallback = coordinator.advisor_agent.fallback_active if coordinator.advisor_agent else True
            print(json.dumps({"status": "success", "reply": reply, "fallback_active": is_fallback}))
        except Exception as e:
            print(json.dumps({"error": f"AdvisorAgent chat failed: {str(e)}"}))

    elif action == "get_all_opportunities":
        try:
            all_opps = coordinator.search_agent.search_all()
            serialized_opps = [opp.to_dict() for opp in all_opps]
            print(json.dumps({"status": "success", "opportunities": serialized_opps}))
        except Exception as e:
            print(json.dumps({"error": f"Failed to retrieve all opportunities: {str(e)}"}))

    else:
        print(json.dumps({"error": f"Unknown action: {action}"}))


if __name__ == "__main__":
    main()
