import os
import json
import hashlib
import logging

logger = logging.getLogger("GeminiCache")

CACHE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "gemini_cache.json")

# In-memory cache fallback
_mem_cache = {}

FALLBACK_RESPONSES = {
    "branding_pitch": (
        "\"Hi, I'm Alex Chen, a Computer Science & AI major with a strong background in Machine Learning, PyTorch, and backend engineering. "
        "I am incredibly passionate about building ethically aligned agentic AI applications. My leadership organizing our campus AI Club and coding tutoring "
        "shows my deep dedication to community tech. I am eager to apply this blend of technical depth and leadership to drive real-world impact in this fellowship.\"\n\n"
        "**Resume Strategy**: Bold key experiences where you successfully utilized Python/PyTorch or led group initiatives. "
        "Make sure to emphasize your interest in the core mission of this opportunity."
    ),
    "executive_summary": (
        "### 📋 Executive Summary Report\n\n"
        "#### 1. Student Overview\n"
        "Alex Chen is an exceptionally qualified Junior majoring in **Computer Science & AI** with a **3.85 GPA**. "
        "Alex possesses a strong theoretical foundation paired with extensive practical expertise in **Python, PyTorch, FastAPI, SQL, and Docker**.\n\n"
        "#### 2. Key Compatibility Strengths\n"
        "- **Rigorous Academic Record**: A 3.85 GPA represents a very high standard of academic excellence and commitment.\n"
        "- **Modern Technical Stack**: Direct, hands-on experience with production-grade backend frameworks and deep learning libraries.\n"
        "- **Leadership & Community Drive**: Serving as an organizer for the AI Club and a coding tutor highlights strong communication, collaboration, and mentorship skills.\n\n"
        "#### 3. Strategic Development Plan\n"
        "To ensure absolute competitiveness for premier opportunities like the **DeepMind AI Future Leaders Scholarship** or **Google Cloud Agentic Hackathon**, Alex should focus on:\n"
        "- **Project Portfolios**: Building and publishing clean, well-documented multi-agent orchestration frameworks on GitHub.\n"
        "- **Advanced Mastery**: Transitioning from foundational PyTorch to advanced model optimization, and mastering CI/CD workflows with Docker.\n"
        "- **Specialized Certifications**: Completing certified courses in Deep Learning or Cloud System Architecture to validate expertise.\n\n"
        "#### 4. Execution Roadmap\n"
        "- **Weeks 1-2**: Deep dive into machine learning systems engineering. Standardize your repository architectures.\n"
        "- **Weeks 3-4**: Build and host a dynamic agentic AI prototype using FastAPI and Streamlit.\n"
        "- **Weeks 5-6**: Complete supplemental essay drafts, detailing how your leadership in the AI Club aligns with ethical technology development.\n\n"
        "#### 5. Application Strategy\n"
        "When applying to high-profile programs, emphasize how your background in computer science and your newfound skills directly contribute to their core mission. "
        "Highlight your proactive initiative in bridging skill gaps independently—selection committees value self-directed learning highly."
    ),
    "coaching_rewrite": (
        "### 🌟 Personalized Coaching Action Plan\n\n"
        "Hello, Alex! You have built an incredible foundation. Transitioning from a skilled student to a standout applicant is all about showcasing initiative and self-directed mastery.\n\n"
        "Here is your strategic roadmap:\n"
        "1. **Bridge Key Skill Gaps**: Focus on mastering **System Architecture** and **Advanced PyTorch**. These core skills will elevate your capability to design large-scale production models.\n"
        "2. **Launch a Capstone Project**: Build a comprehensive, self-contained multi-agent workflow. Highlight this on your GitHub and link it in your application.\n"
        "3. **Validate with Credentials**: Consider targeting advanced Deep Learning certifications to show formal dedication to the field.\n\n"
        "You have a clear, high-priority path ahead. Take it step-by-step, maintain your academic excellence, and continue leading with your community efforts in the AI Club. You're going to do amazing things!"
    ),
    "study_plan": (
        "### 📅 Personalized 6-Week Study & Preparation Plan\n\n"
        "Hello Alex! Based on your profile and target opportunities, here is your specialized study guide to build elite-level candidacy:\n\n"
        "#### 🛠️ Core Skill Gaps to Bridge:\n"
        "- **System Architecture / Scalability**\n"
        "- **Advanced PyTorch / Model Serving**\n\n"
        "---\n\n"
        "#### 🗓️ Week-by-Week Breakdown:\n\n"
        "##### **Week 1: Advanced PyTorch & Optimization**\n"
        "- **Objective**: Master distributed training and custom autograd functions.\n"
        "- **Action Items**:\n"
        "  - Review PyTorch documentation on `DistributedDataParallel` (DDP).\n"
        "  - Implement a custom neural network layer with specialized backward pass optimization.\n"
        "- **Recommended Resource**: PyTorch Intermediate Tutorials.\n\n"
        "##### **Week 2: Deep Learning Design Patterns**\n"
        "- **Objective**: Understand transformers, attention mechanisms, and sequence-to-sequence modeling.\n"
        "- **Action Items**:\n"
        "  - Implement a mini-GPT or self-attention module from scratch using pure PyTorch.\n"
        "  - Profile memory usage and optimize GPU tensors.\n"
        "- **Recommended Resource**: Stanford CS224N / Andrej Karpathy's Neural Networks Zero to Hero.\n\n"
        "##### **Week 3: Backend Systems & API Scaling**\n"
        "- **Objective**: Design scalable microservices to serve machine learning models.\n"
        "- **Action Items**:\n"
        "  - Build a FastAPI service to serve your custom models asynchronously.\n"
        "  - Containerize the model server using Docker, optimizing image layers for smaller footprints.\n"
        "- **Recommended Resource**: FastAPI documentation on Async & Concurrency.\n\n"
        "##### **Week 4: Architecture Design Patterns**\n"
        "- **Objective**: Study caching, queueing, and message-broker systems for distributed applications.\n"
        "- **Action Items**:\n"
        "  - Add Redis caching and Celery task queues to offload heavy inference tasks from your API.\n"
        "  - Draw a detailed system architecture diagram for your portfolio.\n"
        "- **Recommended Resource**: Designing Data-Intensive Applications (Kleppmann).\n\n"
        "##### **Week 5: Portfolio Project Implementation**\n"
        "- **Objective**: Complete a comprehensive agentic AI project demonstrating full-stack ML expertise.\n"
        "- **Action Items**:\n"
        "  - Integrate a multi-agent workflow (e.g. planner, researcher, executor) into a unified application.\n"
        "  - Host the application on a cloud provider or share a high-quality Streamlit/React dashboard demonstration.\n\n"
        "##### **Week 6: Strategy & Polish**\n"
        "- **Objective**: Package your achievements and polish your narrative.\n"
        "- **Action Items**:\n"
        "  - Polish your GitHub repository READMEs with architectural diagrams and clear install guides.\n"
        "  - Draft your application personal statements with the AI Advisor to ensure maximum alignment with sponsor values.\n\n"
        "---\n"
        "*💡 Remember: Consistency is key. Even spending 1 hour per day will lead to massive compounding growth over 6 weeks!*"
    ),
    "essay_critique": (
        "### 📝 AI Essay Strategy Evaluation & Feedback\n\n"
        "Thank you for sharing your application strategy outline! Here is a constructive critique to help you elevate your draft:\n\n"
        "#### 🌟 Strong Elements (What's working well)\n"
        "- **Authentic Connection**: Your narrative clearly connects your Computer Science major with your genuine interest in agentic AI.\n"
        "- **Leadership Reference**: Pointing to your organizer role in the AI Club immediately establishes you as a proactive community leader.\n"
        "- **Academic Baseline**: Mentions of your 3.85 GPA and PyTorch coursework back up your claims of technical competence.\n\n"
        "#### 🔧 Key Areas for Improvement & Action Items\n\n"
        "##### 1. **Quantify Your Impact (The \"Show, Don't Tell\" Rule)**\n"
        "- *Instead of*: \"I led the AI club and ran workshops.\"\n"
        "- *Try*: \"Co-organized and led 8 hands-on PyTorch workshops for a diverse cohort of 40+ student developers, increasing active club membership by 35%.\"\n"
        "- *Why*: Numbers provide concrete proof of scale and capability.\n\n"
        "##### 2. **Explicitly Align with the Sponsor's Vision**\n"
        "- *Action*: Read the opportunity details carefully. If applying for the **DeepMind AI Future Leaders Scholarship**, explicitly discuss your commitment to *diversity, ethics, and long-term research innovation*. If applying for **Google Cloud Hackathon**, focus on *rapid scaling, API efficiency, and productization*.\n\n"
        "##### 3. **Connect Projects to Future Goals**\n"
        "- *Action*: Briefy describe how the specific skill gaps you are bridging (e.g., System Architecture) will directly enable you to solve the problems the sponsor cares about.\n\n"
        "Keep revising! You have an incredibly compelling foundation. Refine these aspects to make your draft truly memorable."
    ),
    "advisor_chat": (
        "Hi! I'm your AI Advisor Agent. How can I help you today?\n\n"
        "Here are some areas we can explore based on your profile:\n"
        "- **Essay Critiques**: Paste a draft or paragraph of your personal statement, and I'll analyze its impact.\n"
        "- **Study Plans**: I can suggest customized courses or timelines to master skills like System Architecture or PyTorch.\n"
        "- **Interview Preparation**: We can run a simulated mock interview for the DeepMind AI Leaders Scholarship.\n"
        "- **Project Brainstorming**: I can help you conceptualize a unique multi-agent portfolio project.\n\n"
        "What would you like to focus on? Just paste your question or draft below, and let's get started!"
    ),
    "profile_extraction": (
        "{\n"
        '  "name": "Alex Chen",\n'
        '  "email": "alex.chen@university.edu",\n'
        '  "country": "United States",\n'
        '  "education_level": "Undergraduate",\n'
        '  "gpa": 3.85,\n'
        '  "major": "Computer Science & AI",\n'
        '  "skills": ["Python", "PyTorch", "React", "FastAPI", "SQL", "Streamlit", "Docker"],\n'
        '  "programming_languages": ["Python", "TypeScript", "C++", "SQL"],\n'
        '  "leadership_experience": ["AI Club Lead organizer", "Robotics Coordinator"],\n'
        '  "volunteer_experience": ["Coding tutor for local high schoolers"],\n'
        '  "english_proficiency": "Fluent",\n'
        '  "certificates": ["DeepMind Future Leaders Nominee"],\n'
        '  "interests": ["Machine Learning", "AI Ethics", "FinTech", "Open Source", "Computational Biology"]\n'
        "}"
    ),
    "match_evaluation": (
        "{\n"
        '  "ai_explanation": "Based on your strong academic profile, including a 3.85 GPA and Computer Science major, you have an exceptional compatibility score for this program. Your proficiency in Python, PyTorch, and databases perfectly aligns with the technical milestones, while your leadership organizing the AI Club proves your commitment.",\n'
        '  "improvement_suggestions": "To submit a highly competitive application, we recommend: 1) Highlighting your open-source AI projects on your resume. 2) Explicitly discussing your AI ethics perspective in your statement. 3) Practicing system design principles for the technical evaluation."\n'
        "}"
    )
}

def get_cache_key(prompt_type: str, *args, **kwargs) -> str:
    """
    Generate a unique md5 hash key from the prompt type and arguments.
    """
    # Normalize dictionary inputs to make them stable for serialization
    normalized_args = []
    for arg in args:
        if isinstance(arg, dict):
            normalized_args.append(sorted(arg.items()))
        else:
            normalized_args.append(arg)

    normalized_kwargs = {}
    for k, v in kwargs.items():
        if isinstance(v, dict):
            normalized_kwargs[k] = sorted(v.items())
        else:
            normalized_kwargs[k] = v

    serialized = json.dumps({
        "args": normalized_args,
        "kwargs": sorted(normalized_kwargs.items())
    }, default=str, sort_keys=True)
    
    raw_key = f"{prompt_type}:{serialized}"
    return hashlib.md5(raw_key.encode("utf-8")).hexdigest()

def read_cache() -> dict:
    global _mem_cache
    if _mem_cache:
        return _mem_cache
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                _mem_cache.update(data)
                return _mem_cache
    except Exception as e:
        logger.info(f"Failed to read Gemini cache file: {e}")
    return _mem_cache

def write_cache(cache_data: dict):
    global _mem_cache
    _mem_cache.update(cache_data)
    try:
        os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(_mem_cache, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.info(f"Failed to write Gemini cache file: {e}")

def get_cached_response(prompt_type: str, *args, **kwargs) -> str:
    """
    Retrieve cached response if it exists, otherwise return None.
    """
    key = get_cache_key(prompt_type, *args, **kwargs)
    cache = read_cache()
    if key in cache:
        logger.info(f"GeminiCache: Found hit for type '{prompt_type}' (key: {key})")
        return cache[key]
    
    # If API key is missing or is placeholder, return high-fidelity mock instantly
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key or api_key.startswith("MY_"):
        if prompt_type in FALLBACK_RESPONSES:
            logger.info(f"GeminiCache: Returning high-fidelity fallback for type '{prompt_type}'")
            return FALLBACK_RESPONSES[prompt_type]
            
    return None

def set_cached_response(prompt_type: str, response_text: str, *args, **kwargs):
    """
    Save a response to the cache.
    """
    key = get_cache_key(prompt_type, *args, **kwargs)
    cache = read_cache()
    cache[key] = response_text
    write_cache(cache)
    logger.info(f"GeminiCache: Saved response for type '{prompt_type}' (key: {key})")
