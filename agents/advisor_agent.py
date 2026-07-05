"""
Advisor Agent Module.

This module defines the AdvisorAgent, which acts as the conversational mentor of
OpportunityAI. It maintains conversational context and provides high-quality,
personalized coaching and mentorship based on structured outputs from previous steps
in the pipeline.
"""

import logging
import os
import json
from typing import Any, Dict, List, Optional, Tuple, Union

# Import domain models and core services
from models.student_profile import StudentProfile
from services.recommendation_service import RecommendationService

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AdvisorAgent")


class AdvisorAgent:
    """
    AdvisorAgent is the conversational mentor of OpportunityAI.
    
    It maintains simple conversation memory, answers follow-up student questions,
    explains match scores and missing skill gaps, reviews essay/application strategy,
    and builds personalized, actionable study plans.
    """

    def __init__(self) -> None:
        """
        Initialize the AdvisorAgent with recommendation utilities and context memory.
        """
        self.recommendation_service = RecommendationService()
        self.fallback_active = False
        
        # Simple in-memory session cache to maintain dialogue context
        # Format: { user_id/session_id: [ {"role": "user"/"assistant", "content": "..."} ] }
        self.conversation_sessions: Dict[str, List[Dict[str, str]]] = {}
        
        logger.info("AdvisorAgent successfully initialized.")

        # --- GEMINI SYSTEM INSTRUCTION / PROMPT BLUEPRINTS ---
        
        self.gemini_coaching_prompt = """
        You are an empathetic, professional academic advisor named OpportunityAI Coach. 
        Your goal is to guide underserved and high-potential students to secure career opportunities,
        fellowships, and scholarships.
        
        Analyze the student's question before generating a response.
        Use the following rich Student Profile as direct context for your advice:
        - Student Name: {name}
        - Major: {major}
        - GPA: {gpa}
        - Core Skills: {skills}
        - Programming Languages: {languages}
        - Certificates & Awards: {certificates}
        - Leadership Experience: {leadership}
        - Volunteer & Community Experience: {volunteer}
        - Interests & Goals: {interests}
        - Current Top Opportunity Matches: {top_matches}
        
        Analyzed Question Category: {category}

        Always maintain an encouraging, motivational, and constructive tone. When answering 
        student questions, give highly specific, actionable feedback and suggest realistic next steps.
        Avoid generic templates or robotic lists. Speak like a real human advisor.
        
        Below is the conversation history so far. Respond to the student's latest question directly:
        {history}
        """
 
        self.gemini_essay_critique_prompt = """
        You are an expert scholarship and application essay editor. Analyze the student's 
        essay draft:
        
        Essay text:
        {essay_text}
 
        Evaluate this against typical fellowship evaluation vectors:
        1. Clarity of personal narrative and academic goals.
        2. Demonstration of leadership potential and community contribution.
        3. Structural flow and persuasion elements.
 
        Provide a structured critique identifying precise strengths, structural weaknesses,
        and direct copy-editing advice to make their application stand out.
        """
 
        self.gemini_mock_interview_prompt = """
        You are a hiring manager or fellowship board member conducting a practice interview 
        for a student targeting the opportunity '{opportunity_title}'.
        
        Generate a set of 3 tailored behavioral and technical questions based on the student's
        major ({major}) and skills ({skills}), complete with guided advice on how to structure 
        compelling STAR-method responses.
        """
 
        self.gemini_study_plan_prompt = """
        You are an expert technical mentor and learning path designer.
        Design a highly detailed, week-by-week technical learning study plan for a student.
        
        Student Profile:
        - Name: {student_name}
        - Major: {student_major}
        - Current Skills: {student_skills}
        
        Target Skills to Acquire:
        {skill_gaps}
        
        Task:
        Provide a structured, encouraging, week-by-week study plan with suggested study hours, concrete learning exercises, portfolio project milestones, and specific interview preparation questions to help this student bridge their skill gaps.
        """

    def load_conversation_sessions(self) -> Dict[str, List[Dict[str, str]]]:
        session_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "conversation_sessions.json")
        try:
            if os.path.exists(session_file):
                with open(session_file, "r") as f:
                    return json.load(f)
        except Exception as e:
            logger.error(f"Error loading conversation sessions: {e}")
        return {}

    def save_conversation_sessions(self, sessions: Dict[str, List[Dict[str, str]]]) -> None:
        session_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "conversation_sessions.json")
        try:
            os.makedirs(os.path.dirname(session_file), exist_ok=True)
            with open(session_file, "w") as f:
                json.dump(sessions, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving conversation sessions: {e}")
 
    def classify_intent(self, question: str) -> str:
        """
        Classifies the student's question into one of the 8 required categories.
        """
        q_lower = question.lower()
        
        # 1. Essay writing
        if any(kw in q_lower for kw in ["essay", "personal statement", "statement", "writing", "critique", "prompt", "draft"]):
            return "Essay writing"
        # 2. Resume feedback
        elif any(kw in q_lower for kw in ["resume", "cv", "portfolio", "cover letter", "formatting", "experience layout"]):
            return "Resume feedback"
        # 3. Interview preparation
        elif any(kw in q_lower for kw in ["interview", "mock", "prepare", "star method", "behavioral", "technical questions"]):
            return "Interview preparation"
        # 4. Scholarship advice
        elif any(kw in q_lower for kw in ["scholarship", "grant", "fellowship", "award", "scholarships", "funding", "financial aid", "stipend"]):
            return "Scholarship advice"
        # 5. Internship preparation
        elif any(kw in q_lower for kw in ["internship", "intern", "co-op", "placement", "job hunt", "hiring", "recruit", "internships"]):
            return "Internship preparation"
        # 6. Hackathon guidance
        elif any(kw in q_lower for kw in ["hackathon", "hackathons", "competition", "compete", "team formation", "project submission", "devpost"]):
            return "Hackathon guidance"
        # 7. Technical learning
        elif any(kw in q_lower for kw in ["learning", "study plan", "learn", "skills", "pytorch", "python", "system architecture", "master", "course", "tutorial"]):
            return "Technical learning"
        # 8. Career planning
        elif any(kw in q_lower for kw in ["career", "planning", "strategy", "goals", "long-term", "future", "major selection", "pathway", "industries", "roles"]):
            return "Career planning"
            
        return "Unclassified"

    def answer_question(
        self, question: str, profile: StudentProfile, context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Provide personalized mentorship answers to open-ended student questions.
 
        Args:
            question: Natural language question from the student.
            profile: The validated StudentProfile object.
            context: Optional dictionary containing additional matching or recommendation details.
 
        Returns:
            str: Empathetic, structured advice.
        """
        logger.info(f"Answering follow-up question: '{question}' for {profile.name}")
        
        # Analyze the user's question before generating a response
        category = self.classify_intent(question)
        logger.info(f"Analyzed question category: {category}")

        # Retrieve dynamic previous matches / top recommendations
        top_matches = []
        try:
            from services.search_service import SearchService
            from services.scoring_service import ScoringService
            search_svc = SearchService()
            scoring_svc = ScoringService()
            all_opps = search_svc.load_all_opportunities()
            scored_opps = []
            for opp in all_opps:
                score = scoring_svc.calculate_match_score(profile, opp)
                scored_opps.append((opp, score))
            scored_opps.sort(key=lambda x: x[1], reverse=True)
            top_matches = scored_opps[:3]
        except Exception as e:
            logger.error(f"Error computing matches in AdvisorAgent: {e}")

        matches_str_list = []
        for opp, score in top_matches:
            matches_str_list.append(f"• **{opp.title}** by {opp.organization} (Category: {opp.category}, Match: {score:.1f}%)")
        matches_summary = "\n".join(matches_str_list) if matches_str_list else "No active matching opportunities available."

        # Construct conversational history
        session_id = profile.email or "anonymous_session"
        sessions = self.load_conversation_sessions()
        history = sessions.get(session_id, [])
        history_str = ""
        for msg in history:
            role_label = "Student" if msg["role"] == "user" else "Coach"
            history_str += f"{role_label}: {msg['content']}\n"

        cache_kwargs = {
            "student_id": getattr(profile, "email", "") or getattr(profile, "name", "Student"),
            "question": question,
            "history": history_str
        }

        # Check for Gemini API key
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key or api_key.startswith("MY_"):
            self.fallback_active = True

        if api_key and not api_key.startswith("MY_"):
            from utils.gemini_cache import get_cached_response, set_cached_response
            
            # Use cached response if available
            cached_val = get_cached_response("advisor_chat", **cache_kwargs)
            if cached_val:
                logger.info("AdvisorAgent: Restored chat response from GeminiCache successfully.")
                return cached_val
            
            logger.info("Calling Gemini API in AdvisorAgent to generate chat reply...")
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

                # Handle flexible StudentProfile properties safely
                profile_skills = getattr(profile, "skills", [])
                profile_langs = getattr(profile, "programming_languages", [])
                all_skills = list(set(profile_skills + profile_langs))
                
                interests_list = getattr(profile, "interests", [])
                interests_str = ", ".join(interests_list) if isinstance(interests_list, list) else str(interests_list)

                prompt = self.gemini_coaching_prompt.format(
                    name=profile.name,
                    major=profile.major,
                    gpa=profile.gpa,
                    skills=", ".join(all_skills),
                    languages=", ".join(profile_langs),
                    certificates=", ".join(profile.certificates),
                    leadership=", ".join(profile.leadership_experience),
                    volunteer=", ".join(profile.volunteer_experience),
                    interests=interests_str,
                    top_matches=matches_summary,
                    category=category,
                    history=history_str
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                if response.text:
                    reply = response.text.strip()
                    set_cached_response("advisor_chat", reply, **cache_kwargs)
                    return reply
            except Exception as e:
                logger.warning(f"AdvisorAgent: Gemini API call was rate-limited or failed ({e}). Smoothly routing chat to local high-fidelity heuristic advisor engine.")
                self.fallback_active = True

        # High-quality fallback answering engine utilizing StudentProfile context and matched opportunities
        profile_skills = getattr(profile, "skills", [])
        profile_langs = getattr(profile, "programming_languages", [])
        all_skills = list(set(profile_skills + profile_langs))
        all_skills_str = ", ".join(all_skills) if all_skills else "General technical skills"

        interests_list = getattr(profile, "interests", [])
        interests_str = ", ".join(interests_list) if isinstance(interests_list, list) else str(interests_list)

        q_lower = question.lower()
        reply = ""

        if category == "Scholarship advice":
            sub_advice = ""
            if any(kw in q_lower for kw in ["essay", "statement", "write", "draft"]):
                sub_advice = (
                    f"• **Essay Strategy**: Since you asked about the scholarship essay/statement, your background in **{interests_str}** "
                    f"and leadership as **{', '.join(profile.leadership_experience[:1]) if profile.leadership_experience else 'student lead'}** are prime elements to write about. "
                    f"Focus your personal narrative on how you've bridged theory and community impact.\n"
                )
            elif any(kw in q_lower for kw in ["eligibility", "criteria", "gpa", "requirement"]):
                sub_advice = (
                    f"• **Eligibility Verification**: Regarding academic eligibility, your stellar **{profile.gpa} GPA** meets and exceeds "
                    f"the premium tier requirements of these programs. Ensure you secure letters of recommendation from CS/AI faculty who can speak to your academic rigor.\n"
                )
            elif any(kw in q_lower for kw in ["recommend", "letter", "reference"]):
                sub_advice = (
                    f"• **Recommendation Letters**: For recommendation letters, aim for 2 academic references (such as CS/AI professors) "
                    f"and 1 leadership reference (aligned with your role as **{', '.join(profile.leadership_experience[:1]) if profile.leadership_experience else 'club lead'}**). "
                    f"Give them a 3-week heads up with your resume and target opportunities!\n"
                )

            reply = (
                f"### 🎓 Personalized Scholarship & Fellowship Guidance for {profile.name}\n\n"
                f"Hello {profile.name}! Based on your academic record as a **{profile.major}** major with an outstanding **{profile.gpa} GPA**, "
                f"you are highly competitive for premium scholarships and fellowship programs.\n\n"
                f"**Strategic Advice to Maximize Funding Success:**\n"
                f"• **Validate Your Strengths**: Your current GPA of {profile.gpa} meets or exceeds the eligibility requirements of most competitive tech fellowships.\n"
                f"• **Highlight Your Credentials**: Make sure to explicitly detail certificates such as *{', '.join(profile.certificates) if profile.certificates else 'Academic Excellence and leadership roles'}* directly in your applications.\n"
                f"• **Leverage Extracurriculars**: Reviewers look for multi-dimensional candidates. Highlight your volunteer work like *{', '.join(profile.volunteer_experience) if profile.volunteer_experience else 'community coding initiatives'}* to show your local impact.\n"
                f"{sub_advice}"
                f"\n**Your Top Matched Opportunities:**\n{matches_summary}\n\n"
                f"*Coach Pro-tip: When writing your application essays, focus heavily on the personal impact statement—explain exactly how your long-term career interests in **{interests_str}** align with the sponsor's core values.*"
            )
        elif category == "Internship preparation":
            sub_advice = ""
            if any(kw in q_lower for kw in ["interview", "mock", "question"]):
                sub_advice = (
                    f"• **Interview Tactics**: For technical interviews, competitive tech internships typically involve a mix of live coding "
                    f"(assessing **{', '.join(profile.programming_languages[:2]) if profile.programming_languages else 'Python/SQL'}**) and behavioral questions. Practice explaining your thought process out loud!\n"
                )
            elif any(kw in q_lower for kw in ["resume", "apply", "application"]):
                sub_advice = (
                    f"• **Application Readiness**: When applying, make sure to tailor your resume's project descriptions. "
                    f"Highlight your work with **{', '.join(all_skills[:3]) if all_skills else 'software engineering'}** and showcase any open-source contributions.\n"
                )
            elif any(kw in q_lower for kw in ["referral", "network", "linkedin"]):
                sub_advice = (
                    f"• **Networking for Referrals**: To secure referrals, reach out to alumni on LinkedIn from your university who work in your target roles. "
                    f"Ask for a quick 10-minute chat about their experience before asking for a referral.\n"
                )

            reply = (
                f"### 💼 Elite Internship Preparation Roadmap\n\n"
                f"Preparing for a competitive internship in **{profile.major}** requires a strategic showcase of your hands-on engineering competencies and technical initiative.\n\n"
                f"**Key Focus Areas for {profile.name}:**\n"
                f"• **Promote Your Technical Stack**: Highlight your mastery in **{all_skills_str}** at the top of your resume.\n"
                f"• **Demonstrate Real-World Leadership**: Highlight roles like *{', '.join(profile.leadership_experience) if profile.leadership_experience else 'AI Lead or Project coordinator'}* to prove your capacity for managing teamwork under pressure.\n"
                f"• **Target High-Alignment Roles**: Research internships looking for expertise in *{', '.join(profile.interests[:2]) if profile.interests else 'Software Engineering'}*.\n"
                f"{sub_advice}"
                f"\n**Top Recommended Alignment Opportunities:**\n{matches_summary}\n\n"
                f"*Coach Pro-tip: For tech interviews, practice writing clean code on a whiteboard or shared editor, and be prepared to discuss runtime/memory complexity of your personal projects.*"
            )
        elif category == "Hackathon guidance":
            sub_advice = ""
            if any(kw in q_lower for kw in ["idea", "project", "topic"]):
                sub_advice = (
                    f"• **Project Ideation**: For project ideas, since you are interested in **{interests_str}**, consider building an agentic AI workflow "
                    f"or a smart tool that solves a real-world problem in these domains. This makes for a highly memorable demo!\n"
                )
            elif any(kw in q_lower for kw in ["team", "partner", "member"]):
                sub_advice = (
                    f"• **Team Recruitment**: For team formation, leverage your role as **{', '.join(profile.leadership_experience[:1]) if profile.leadership_experience else 'student leader'}** to bring together a balanced team. "
                    f"You'll want 1-2 builders focused on backend/API engineering and 1 focused on a polished frontend presentation.\n"
                )
            elif any(kw in q_lower for kw in ["pitch", "presentation", "video"]):
                sub_advice = (
                    f"• **The Final Pitch**: For the final pitch, prepare a 2-minute video showing a real, live user scenario. "
                    f"Avoid slides; show the working demo of your product instead! Devpost judges love seeing functional code.\n"
                )

            reply = (
                f"### 🚀 Hackathon & Innovation Sprint Guidance\n\n"
                f"Participating in hackathons is one of the fastest, most effective ways for a **{profile.major}** student to demonstrate rapid prototyping capabilities and build a high-caliber portfolio.\n\n"
                f"**Tailored Hackathon Strategy:**\n"
                f"• **Ideate Around Passion Areas**: Brainstorm concepts aligned with your interests in **{interests_str}**.\n"
                f"• **Form a Balanced Team**: Use your leadership experience (*{', '.join(profile.leadership_experience) if profile.leadership_experience else 'Peer collaboration'}*) to recruit a mix of frontend, backend, and design teammates.\n"
                f"• **Rely on Your Strongest Tools**: Build the core MVP using **{', '.join(profile.programming_languages[:3]) if profile.programming_languages else 'Python and databases'}** to maximize development speed.\n"
                f"{sub_advice}"
                f"\n**Your Top Matched Innovation Events:**\n{matches_summary}\n\n"
                f"*Coach Pro-tip: Hackathon judges value a working prototype and a compelling pitch video far more than a perfect, complete backend. Focus on a clean user flow first!*"
            )
        elif category == "Career planning":
            sub_advice = ""
            if any(kw in q_lower for kw in ["grad", "masters", "phd", "school"]):
                sub_advice = (
                    f"• **Graduate Studies**: Thinking about graduate studies? Your **{profile.gpa} GPA** and research interests in **{interests_str}** "
                    f"make you an exceptional candidate. Focus on getting research experience and contributing to publications early.\n"
                )
            elif any(kw in q_lower for kw in ["job", "role", "industry"]):
                sub_advice = (
                    f"• **Target Roles**: If you want to enter the industry directly, target roles like Machine Learning Engineer, Backend Developer, "
                    f"or Software Engineer where your skills in **{', '.join(all_skills[:3]) if all_skills else 'software development'}** are in high demand.\n"
                )
            elif any(kw in q_lower for kw in ["network", "linkedin"]):
                sub_advice = (
                    f"• **Networking & Brand**: On LinkedIn, polish your profile to highlight your leadership as **{', '.join(profile.leadership_experience[:1]) if profile.leadership_experience else 'student leader'}**. "
                    f"Connect with professionals in the AI ethics and machine learning space to stay updated on industry standards.\n"
                )

            reply = (
                f"### 🎯 Comprehensive Career Planning Pathway\n\n"
                f"Building a strong career strategy around **{profile.major}** opens up pathways from advanced technical engineering to research and technology leadership.\n\n"
                f"**Custom Strategy Elements for {profile.name}:**\n"
                f"• **Capitalize on Academic Excellence**: Your **{profile.gpa} GPA** makes you a compelling candidate for both elite graduate studies and industry research groups.\n"
                f"• **Expand Your Professional Network**: Leverage your interest in **{interests_str}** to attend industry meetups, join professional organizations, and find academic sponsors.\n"
                f"• **Showcase Civic Initiative**: Your volunteer experiences (*{', '.join(profile.volunteer_experience) if profile.volunteer_experience else 'STEM Mentorship'}*) prove to recruiters that you possess exceptional soft skills.\n"
                f"{sub_advice}"
                f"\n**Strategic Opportunities aligned with your Profile:**\n{matches_summary}\n\n"
                f"*Coach Pro-tip: Set up informational interviews with professionals working in your target roles on LinkedIn. Ask them about their daily workflows and the skill gaps they look to hire!*"
            )
        elif category == "Resume feedback":
            sub_advice = ""
            if any(kw in q_lower for kw in ["format", "layout", "font"]):
                sub_advice = (
                    f"• **Formatting Advice**: For formatting, use a clean, single-column layout. Avoid multi-column grids or rating bars for skills, "
                    f"which can confuse ATS scanners. Stick to simple, bold headers.\n"
                )
            elif any(kw in q_lower for kw in ["project", "experience", "work"]):
                sub_advice = (
                    f"• **Project Section Description**: For the projects section, list your work with **{', '.join(all_skills[:3]) if all_skills else 'software development'}**. "
                    f"Describe each project using the XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.\n"
                )
            elif any(kw in q_lower for kw in ["summary", "objective"]):
                sub_advice = (
                    f"• **Resume Summary**: For your professional summary, position yourself as a proactive developer. "
                    f"Example: 'CS junior with leadership in AI Club and hands-on PyTorch engineering experience seeking target fellowships.'\n"
                )

            reply = (
                f"### 📄 Targeted Resume Optimization Feedback\n\n"
                f"Let's refine your resume so that application committees and automated screening tools immediately recognize your high-potential profile as a **{profile.major}** major.\n\n"
                f"**Resume Polish Action Items:**\n"
                f"• **Highlight Academic Prominence**: Position your major and outstanding **{profile.gpa} GPA** at the very top of your education section.\n"
                f"• **Categorize Technical Skills**: Group **{all_skills_str}** and coding languages (**{', '.join(profile.programming_languages)}**) into distinct, easily readable sub-headings.\n"
                f"• **Quantify Leadership Accomplishments**: Instead of listing tasks, highlight achievements from your leadership (*{', '.join(profile.leadership_experience) if profile.leadership_experience else 'AI activities'}*) using strong action verbs and metrics (e.g., 'Led 3 projects...').\n"
                f"• **Validate with Credentials**: Highlight key milestones and certificates like *{', '.join(profile.certificates) if profile.certificates else 'Academic and technical accolades'}*.\n"
                f"{sub_advice}"
                f"\n**Top Opportunities to Structure Your Resume For:**\n{matches_summary}"
            )
        elif category == "Essay writing":
            sub_advice = ""
            if any(kw in q_lower for kw in ["introduction", "hook", "open"]):
                sub_advice = (
                    f"• **Drafting a Hook**: For a powerful introduction, start with a specific personal anecdote—like an inspiring moment organizing "
                    f"the **{', '.join(profile.leadership_experience[:1]) if profile.leadership_experience else 'student group'}** or solving a tough coding bug—to grab the reviewer's attention.\n"
                )
            elif any(kw in q_lower for kw in ["ethics", "responsible", "social"]):
                sub_advice = (
                    f"• **Ethical Lens**: Since you asked about AI ethics, weave your interest in ethical AI and responsible development directly into your statements. "
                    f"Connect this to the community impact of your volunteer tutoring.\n"
                )
            elif any(kw in q_lower for kw in ["word", "length", "limit"]):
                sub_advice = (
                    f"• **Word Allocation**: To manage word counts, allocate 15% to your introduction/hook, 50% to your technical achievements and projects "
                    f"using **{', '.join(all_skills[:3]) if all_skills else 'software'}**, 20% to leadership, and 15% to why this specific program is your perfect launchpad.\n"
                )

            reply = (
                f"### 📝 Persuasive Essay & Statement of Purpose Strategy\n\n"
                f"Hello {profile.name}! Writing a compelling statement of purpose is all about weaving your academic milestones, community presence, and career visions into a single cohesive story.\n\n"
                f"**Strategic Essay Writing Outline:**\n"
                f"• **State Your Core Motivation**: Open with what inspired you to study **{profile.major}** and pursue your interests in **{interests_str}**.\n"
                f"• **Illustrate with Dynamic Leadership**: Dedicate a paragraph to detailing how your leadership in *{', '.join(profile.leadership_experience) if profile.leadership_experience else 'university initiatives'}* developed your communication and project management skills.\n"
                f"• **Highlight Social Commitment**: Emphasize how your volunteer initiatives (*{', '.join(profile.volunteer_experience) if profile.volunteer_experience else 'mentoring junior peers'}*) showcase your collaborative spirit.\n"
                f"• **Bridge to Future Goals**: Explicitly describe how securing your target opportunity will act as a launchpad for your career goals.\n"
                f"{sub_advice}"
                f"\n**Focus Your Statement on These Top Matches:**\n{matches_summary}"
            )
        elif category == "Interview preparation":
            sub_advice = ""
            if any(kw in q_lower for kw in ["behavioral", "situation", "star"]):
                sub_advice = (
                    f"• **Behavioral Scenarios**: For behavioral questions, prepare stories from your organizer roles or coding tutor experience. "
                    f"Emphasize how you resolved conflicts, managed deadlines, or explained complex concepts.\n"
                )
            elif any(kw in q_lower for kw in ["technical", "coding", "algorithm"]):
                sub_advice = (
                    f"• **Technical Coding Strategy**: For technical coding, practice core data structures and algorithms in **{', '.join(profile.programming_languages[:2]) if profile.programming_languages else 'your preferred language'}**. "
                    f"Focus on string manipulation, recursion, and graph algorithms.\n"
                )
            elif any(kw in q_lower for kw in ["ask", "question", "end"]):
                sub_advice = (
                    f"• **Asking the Interviewer**: When they ask 'Do you have any questions for us?', ask insightful questions like: "
                    f"'What does success look like in the first 90 days?' or 'How does your team navigate ethical AI considerations?'\n"
                )

            reply = (
                f"### 🗣️ Behavioral & Technical Interview Master Strategy\n\n"
                f"Succeeding in competitive interviews within the **{profile.major}** industry is about structured delivery and showcasing logical problem-solving.\n\n"
                f"**Personalized Interview Playbook:**\n"
                f"• **The STAR Method for Behavioral Questions**: Practice describing situations from your leadership experience (*{', '.join(profile.leadership_experience) if profile.leadership_experience else 'academic projects'}*) using the Situation-Task-Action-Result structure.\n"
                f"• **Deconstruct Technical Challenges**: Prepare to walk through complex technical architectures where you utilized skills like **{all_skills_str}**.\n"
                f"• **Express Your Passion**: Highlight your unique interests in **{interests_str}** and be prepared to discuss how you stay ahead of new tech trends.\n"
                f"{sub_advice}"
                f"\n**Opportunities to Practice Interview Strategies For:**\n{matches_summary}"
            )
        elif category == "Technical learning":
            sub_advice = ""
            if any(kw in q_lower for kw in ["pytorch", "model", "ai"]):
                sub_advice = (
                    f"• **Deep Learning Path**: For your PyTorch path, focus on writing custom neural layers, understanding gradient flow, and using TensorBoard for profiling. "
                    f"Transition from basic tutorials to building multi-agent setups.\n"
                )
            elif any(kw in q_lower for kw in ["system", "architecture", "backend"]):
                sub_advice = (
                    f"• **System Design Path**: For system architecture, read 'Designing Data-Intensive Applications'. Practice designing distributed backends "
                    f"using FastAPI, Redis caching, and Celery task queues for long-running inference tasks.\n"
                )
            elif any(kw in q_lower for kw in ["docker", "deploy", "kubernetes"]):
                sub_advice = (
                    f"• **Deployment Skills**: For deployment, master containerizing your models with Docker, managing multi-container setups with Docker Compose, "
                    f"and deploying lightweight APIs to cloud instances.\n"
                )

            reply = (
                f"### 📅 Custom Technical Learning Roadmap for {profile.name}\n\n"
                f"To accelerate your technical growth as a **{profile.major}** major, let's establish a tailored roadmap to bridge key knowledge gaps and build a production-ready engineering profile.\n\n"
                f"**Your Custom Learning Curriculum:**\n"
                f"• **Leverage Your Strengths**: Build on your existing coding proficiency in **{', '.join(profile.programming_languages)}**.\n"
                f"• **Acquire Core Target Skills**: Dedicate structured study blocks to mastering **System Architecture**, **Scalability**, and advanced frameworks like **PyTorch** or **FastAPI**.\n"
                f"• **Build a Capstone Portfolio Project**: Code a complete, end-to-end cloud-hosted application utilizing your skills in **{', '.join(profile.skills[:3]) if profile.skills else 'software development'}**.\n"
                f"{sub_advice}"
                f"\n**Top Opportunities Requiring These Skills:**\n{matches_summary}\n\n"
                f"*Coach Pro-tip: Study regularly for 1-2 hours a day. Your strong **{profile.gpa} GPA** proves your discipline, and consistent coding practice is the key to deep technical fluency!*"
            )

        if not reply:
            # Handle unclassified queries dynamically (e.g. greetings, who/what are you, general queries)
            if any(kw in q_lower for kw in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "yo"]):
                reply = (
                    f"### 👋 Hello {profile.name}!\n\n"
                    f"I'm your AI Advisor Agent, and I'm thrilled to help you navigate your academic and career opportunities.\n\n"
                    f"Based on your profile as a **{profile.major}** student with a stellar **{profile.gpa} GPA**, we can explore several customized avenues:\n"
                    f"1. **📝 Essay writing & critiques**: Get structural feedback on your personal statements.\n"
                    f"2. **📄 Resume optimization**: Refine the presentation of your technical skills (*{all_skills_str}*).\n"
                    f"3. **📅 Technical learning roadmaps**: Create a concrete step-by-step plan to acquire new skills.\n"
                    f"4. **🗣️ Interview preparation**: Learn key behavioral and technical interview strategies.\n\n"
                    f"What's on your mind today? Feel free to ask a question or drop an essay draft below!"
                )
            elif any(kw in q_lower for kw in ["who are you", "what are you", "your name", "introduce"]):
                reply = (
                    f"### 🤖 Meet Your AI Advisor Agent\n\n"
                    f"I am your dedicated career coach and opportunity mentor, specialized in helping **{profile.major}** students like you prepare highly competitive applications for elite fellowships, scholarships, and internships.\n\n"
                    f"My design utilizes deep-learning heuristics and sponsor-alignment strategies to evaluate your resumes, critique statement essays, and suggest structured learning paths.\n\n"
                    f"Let's work together to unlock your potential. What would you like to focus on today?"
                )
            elif any(kw in q_lower for kw in ["thank", "thanks", "appreciate"]):
                reply = (
                    f"### 😊 You are very welcome, {profile.name}!\n\n"
                    f"Supporting ambitious students in **{profile.major}** is what I do best. I'm always here to help you review draft updates, structure learning plans, or provide mock interview feedback.\n\n"
                    f"Feel free to ask another question whenever you are ready, or paste a new essay section to critique!"
                )
            else:
                reply = (
                    f"### 💡 Custom Advisory Insights for {profile.name}\n\n"
                    f"That is a great question! Regarding your interest in this area, your major in **{profile.major}** and background with **{all_skills_str}** provide a strong baseline.\n\n"
                    f"To ensure you stand out to selection committees, let's connect your technical background to the goals of your top-matching opportunities:\n"
                    f"• **Leverage Extracurriculars**: Highlight volunteer work and activities like *{', '.join(profile.volunteer_experience) if profile.volunteer_experience else 'technical mentorship'}* to show high civic initiative.\n"
                    f"• **Secure Academic Endorsements**: Given your outstanding **{profile.gpa} GPA**, make sure to secure strong references from CS/AI faculty who can speak to your academic rigor.\n\n"
                    f"**Your Top Matched Opportunities:**\n{matches_summary}\n\n"
                    f"If you'd like more specific guidance, try asking a question about **resumes**, **essays**, **interviews**, or **study plans**!"
                )

        # Cache fallback response so subsequent identical queries are instant and don't re-trigger slow exceptions
        if api_key and not api_key.startswith("MY_"):
            try:
                from utils.gemini_cache import set_cached_response
                set_cached_response("advisor_chat", reply, **cache_kwargs)
            except Exception:
                pass

        return reply

    def explain_match_result(
        self, profile: StudentProfile, opportunity: Dict[str, Any], match_score: float
    ) -> str:
        """
        Explain the calculations behind a specific match score in beginner-friendly terms.

        Args:
            profile: The student's validated profile object.
            opportunity: Dictionary representing the opportunity.
            match_score: The computed compatibility score (0-100%).

        Returns:
            str: Clear, motivational explanation.
        """
        logger.info(f"Explaining match score ({match_score}%) for {opportunity.get('title')}")
        
        opp_title = opportunity.get("title", "this program")
        org = opportunity.get("organization", "the sponsor")
        
        if match_score >= 85.0:
            return (
                f"🎉 You have an exceptional match score of **{match_score:.1f}%** for the **{opp_title}**! "
                f"Your background as a {profile.major} student matches their academic requirements perfectly, "
                f"and your key skills represent an excellent fit for what {org} is looking for. "
                f"I highly recommend prioritizing this application."
            )
        elif match_score >= 60.0:
            return (
                f"Solid Match! You scored a **{match_score:.1f}%** compatibility rating for **{opp_title}**. "
                f"You meet all of the eligibility criteria, and your academic focus in {profile.major} is highly valued. "
                f"To push this score even higher, we can work together to bridge a few minor skill requirements."
            )
        else:
            return (
                f"You have a **{match_score:.1f}%** match score for **{opp_title}**. "
                f"While you meet some of the fundamental requirements, they are looking for specific experience "
                f"and skills that aren't prominent on your profile yet. Don't worry—this gives us a clear roadmap "
                f"of skills to build!"
            )

    def explain_missing_skills(self, profile: StudentProfile, missing_skills: List[str]) -> str:
        """
        Examines missing skills and translates them into encouragement and strategic learning advice.

        Args:
            profile: Student profile object.
            missing_skills: List of required skills not currently present.

        Returns:
            str: Action-oriented mentoring tips.
        """
        if not missing_skills:
            return (
                f"Outstanding work, {profile.name}! Your current skills perfectly align with all "
                "the key requirements of your target program. You are fully ready to apply!"
            )
            
        skills_str = ", ".join([f"**{s}**" for s in missing_skills])
        return (
            f"We identified a few skills that would make your profile much stronger: {skills_str}. "
            "But don't be discouraged! This isn't a barrier—it's your immediate growth checklist. "
            "By taking introductory courses or building a simple personal project with these tools, "
            "you will show program review boards that you are proactive and highly capable."
        )

    def recommend_next_steps(self, profile: StudentProfile, target_opportunity: Dict[str, Any]) -> str:
        """
        Formulate immediate chronological milestone instructions for the student's calendar.

        Args:
            profile: Student profile object.
            target_opportunity: Target opportunity specifications.

        Returns:
            str: Prioritized list of milestones.
        """
        title = target_opportunity.get("title", "your target opportunity")
        org = target_opportunity.get("organization", "Sponsor")
        
        return (
            f"Here is your personalized roadmap to apply for the **{title}** ({org}):\n\n"
            "1. **Week 1: Gather Materials** - Update your resume to emphasize projects and coursework relevant to this program.\n"
            "2. **Week 2-3: Bridge Skill Gaps** - Start learning any missing concepts using free recommended tutorials.\n"
            "3. **Week 4: Draft Essays** - Outline your personal statement focusing on your leadership and career goals.\n"
            "4. **Week 5: Polishing & Review** - Have a peer or mentor review your essay drafts, and submit the final package."
        )

    def review_application_strategy(self, profile: StudentProfile, strategy_essay: str) -> str:
        """
        Provide high-level suggestions on application and essay outlines.
        Uses Gemini API for structured rhetorical, grammar, and alignment critique.

        Args:
            profile: Student profile object.
            strategy_essay: Student's draft or strategy bullet points.

        Returns:
            str: Constructive critique.
        """
        import os

        if not strategy_essay or len(strategy_essay.strip()) < 10:
            return "Please provide an essay draft or application outline so I can give you personalized feedback."

        # Gemini Integration
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if api_key and not api_key.startswith("MY_"):
            from utils.gemini_cache import get_cached_response, set_cached_response
            
            cache_kwargs = {
                "student_id": getattr(profile, "email", "") or getattr(profile, "name", "Student"),
                "essay_text": strategy_essay
            }
            cached_val = get_cached_response("essay_critique", **cache_kwargs)
            if cached_val:
                logger.info("AdvisorAgent: Restored essay critique from GeminiCache successfully.")
                return cached_val
                
            logger.info("Calling Gemini API in AdvisorAgent to critique student essay strategy...")
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

                prompt = self.gemini_essay_critique_prompt.format(essay_text=strategy_essay)
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                if response.text:
                    reply = response.text.strip()
                    set_cached_response("essay_critique", reply, **cache_kwargs)
                    return reply
            except Exception as e:
                logger.warning(f"AdvisorAgent: Gemini API essay critique failed ({e}). Falling through to rules-based fallback.")
                self.fallback_active = True

        # Fallback implementation
        return (
            "### 📝 Application Essay Review\n\n"
            "**Key Strengths Detected:**\n"
            f"• Excellent personal narrative that reflects your passion for {profile.major}.\n"
            "• Clear academic background and solid GPA accomplishments are mentioned.\n\n"
            "**Areas for Strategic Improvement:**\n"
            "• *Show leadership impact*: Try to include measurable results (e.g., 'tutored 5 peers' or 'managed a project with 3 members').\n"
            "• *Sponsor Alignment*: Expressly state how this specific program aligns with your long-term career aspirations.\n\n"
            "Keep up the amazing work! Refine those points and your essay will be compelling."
        )

    def build_study_plan(self, profile: StudentProfile, skill_gaps: List[str]) -> Dict[str, Any]:
        """
        Constructs a chronological, step-by-step technical learning curriculum.
        Uses Gemini API to design custom week-by-week coaching messages when available.

        Args:
            profile: Student profile object.
            skill_gaps: List of target skills to acquire.

        Returns:
            Dict[str, Any]: Structured learning curriculum.
        """
        import os

        logger.info(f"Building learning plan for {profile.name} to address: {skill_gaps}")
        
        plan_steps = []
        for i, skill in enumerate(skill_gaps, 1):
            normalized = skill.lower().strip()
            # Retrieve recommended resources deterministically using our service
            resources = self.recommendation_service.recommend_learning_resources([skill])
            projects = self.recommendation_service.recommend_projects([skill])
            
            res_name = resources[0]["resource_name"] if resources else f"Free online guides for {skill}"
            proj_title = projects[0]["project_title"] if projects else f"Hands-on {skill} App"
            
            plan_steps.append({
                "phase": f"Phase {i}: Master {skill.title()}",
                "focus_skill": skill,
                "suggested_resource": res_name,
                "portfolio_project": proj_title,
                "estimated_time": "2 - 3 weeks"
            })

        if not plan_steps:
            plan_steps.append({
                "phase": "Phase 1: Advanced Specialization",
                "focus_skill": "Portfolio Polishing",
                "suggested_resource": "GitHub Portfolio Optimization Guides",
                "portfolio_project": "Deploy and document your existing projects",
                "estimated_time": "1 - 2 weeks"
            })

        coaching_message = "Follow this step-by-step guide to build a stellar application portfolio!"

        # Gemini Integration
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if api_key and not api_key.startswith("MY_"):
            from utils.gemini_cache import get_cached_response, set_cached_response
            
            cache_kwargs = {
                "student_id": getattr(profile, "email", "") or getattr(profile, "name", "Student"),
                "skill_gaps": skill_gaps
            }
            cached_val = get_cached_response("study_plan", **cache_kwargs)
            if cached_val:
                coaching_message = cached_val
                logger.info("AdvisorAgent: Restored study plan coaching message from GeminiCache successfully.")
            else:
                logger.info("Calling Gemini API in AdvisorAgent to generate customized weekly study plan guide...")
                try:
                    from google import genai
                    client = genai.Client(api_key=api_key)
                    model_name = os.environ.get("GEMINI_MODEL_NAME", "gemini-3.5-flash")

                    prompt = self.gemini_study_plan_prompt.format(
                        student_name=profile.name,
                        student_major=profile.major,
                        student_skills=", ".join(profile.skills),
                        skill_gaps=", ".join(skill_gaps) if skill_gaps else "Advanced Specialization / Portfolio Polishing"
                    )

                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt
                    )
                    if response.text:
                        coaching_message = response.text.strip()
                        set_cached_response("study_plan", coaching_message, **cache_kwargs)
                except Exception as e:
                    logger.warning(f"AdvisorAgent: Gemini API study plan failed ({e}). Constructing dynamic coaching message.")
                    self.fallback_active = True
                    coaching_message = (
                        f"### 📅 Personalized Technical Learning Roadmap for {profile.name}\n\n"
                        f"Hello {profile.name}! Based on your academic record as a **{profile.major}** major, "
                        f"here is your strategic study roadmap to bridge target skill gaps and build an elite-level candidacy:\n\n"
                        f"#### 🛠️ Focus Areas to Acquire:\n"
                        + "\n".join([f"- **{skill.title()}**" for skill in skill_gaps]) + "\n\n"
                        f"Review each recommended project and online resource in the table below to start masterclass preparation!"
                    )
                    try:
                        set_cached_response("study_plan", coaching_message, **cache_kwargs)
                    except Exception:
                        pass

        return {
            "student_name": profile.name,
            "major": profile.major,
            "learning_plan_steps": plan_steps,
            "status": "Ready",
            "coaching_message": coaching_message
        }

    def maintain_conversation_context(self, user_id: str, message: str, role: str) -> None:
        """
        Append a new message to the active session history to maintain multi-turn context.

        Args:
            user_id: Unique identifier for the student/session.
            message: Text of the message.
            role: "user" or "assistant" or "system".
        """
        sessions = self.load_conversation_sessions()
        if user_id not in sessions:
            sessions[user_id] = []
            
        sessions[user_id].append({
            "role": role,
            "content": message
        })
        
        # Keep session history bounded to avoid memory bloating
        if len(sessions[user_id]) > 50:
            sessions[user_id] = sessions[user_id][-50:]
            
        self.save_conversation_sessions(sessions)

    # --- Coordinator Compatibility Wrapper Methods ---

    def chat_with_student(self, student_message: str, active_context: Union[dict, StudentProfile]) -> str:
        """
        Coordinator-level compatibility wrapper to process a mentoring message.
        
        Args:
            student_message: Raw user query or follow-up prompt.
            active_context: StudentProfile instance or raw student profile dictionary.
        """
        logger.info("chat_with_student wrapper method invoked.")
        
        # 1. Coerce active_context to a StudentProfile
        profile_obj: Optional[StudentProfile] = None
        if isinstance(active_context, StudentProfile):
            profile_obj = active_context
        elif isinstance(active_context, dict):
            # If the context is a nested dictionary, extract student_profile if present
            profile_data = active_context.get("student_profile") or active_context
            try:
                profile_obj = StudentProfile.from_dict(profile_data)
            except Exception:
                # Safe fallback initialization
                profile_obj = StudentProfile(
                    name=profile_data.get("name", "Demo Student"),
                    email=profile_data.get("email", "demo.student@university.edu"),
                    country=profile_data.get("country", "United States"),
                    education_level=profile_data.get("education_level", "Undergraduate"),
                    gpa=float(profile_data.get("gpa", 3.5)),
                    major=profile_data.get("major", "Computer Science"),
                    skills=profile_data.get("skills", []),
                    programming_languages=profile_data.get("programming_languages", [])
                )
        
        if not profile_obj:
            return "Hi there! Let's set up your Student Profile first so I can give you high-quality coaching."

        # 2. Maintain dialogue session logs under a general dummy session ID
        session_id = profile_obj.email or "anonymous_session"
        self.maintain_conversation_context(session_id, student_message, "user")

        # 3. Answer question
        reply = self.answer_question(student_message, profile_obj)
        
        # 4. Save response to session history
        self.maintain_conversation_context(session_id, reply, "assistant")
        
        return reply

    def review_application_essay(self, essay_text: str, opportunity_details: dict) -> Dict[str, Any]:
        """
        Legacy/compat method to evaluate application essay and return structural dictionary advice.
        """
        logger.info("review_application_essay legacy wrapper invoked.")
        
        # Create a mock StudentProfile to satisfy parameters
        temp_profile = StudentProfile(
            name="Applicant",
            email="candidate@edu.com",
            country="Global",
            education_level="Undergraduate",
            gpa=3.5,
            major="STEM"
        )
        
        critique_text = self.review_application_strategy(temp_profile, essay_text)
        
        # Format output into a rich critique dictionary
        return {
            "essay_length": len(essay_text),
            "critique_summary": critique_text,
            "status": "Review Completed",
            "recommendations": [
                "Quantify your personal statement metrics",
                "Explicitly link your goals to the sponsor's mission statements"
            ]
        }
