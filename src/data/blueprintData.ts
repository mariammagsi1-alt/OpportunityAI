import { PythonFileSpec, FolderNode, AgentSpec, OpportunityItem, StudentProfilePersona, DevPhase } from '../types';

export const CURRENT_STUDENT_PROFILE: StudentProfilePersona = {
  id: 'alex-chen',
  name: 'Alex Chen',
  avatarInitials: 'AC',
  major: 'Computer Science & AI',
  academicYear: 'Junior (Class of 2027)',
  gpa: '3.85 / 4.0',
  interests: ['Machine Learning', 'AI Ethics', 'FinTech', 'Open Source', 'Computational Biology'],
  skills: ['Python', 'PyTorch', 'React', 'FastAPI', 'SQL', 'Streamlit', 'Docker'],
  preferredLocation: 'San Francisco / Remote',
  completionRate: 92,
  savedCount: 14,
  reportsCount: 3
};

export const MOCK_OPPORTUNITIES: OpportunityItem[] = [
  // Scholarships
  {
    id: 'sch-1',
    title: 'DeepMind AI Future Leaders Scholarship',
    org: 'Google DeepMind Foundation',
    category: 'Scholarships',
    awardOrStipend: '$15,000 + Mentorship',
    location: 'Global / Online',
    deadline: '2026-08-15',
    matchScore: 98,
    matchReasons: [
      '3.85 GPA exceeds the 3.50 minimum eligibility threshold',
      'Strong alignment with demonstrated PyTorch and Machine Learning coursework',
      'Matches career goal of ethical AI development'
    ],
    improvementTips: [
      'Publish at least one open-source AI project repository to GitHub before applying',
      'Highlight AI Ethics coursework in your personal statement essay'
    ],
    eligibilityTags: ['CS Major', 'Junior/Senior', 'GPA 3.5+'],
    difficulty: 'Advanced',
    modality: 'Remote'
  },
  {
    id: 'sch-2',
    title: 'Women & Underrepresented Tech Achievers Grant',
    org: 'AnitaB.org & IEEE',
    category: 'Scholarships',
    awardOrStipend: '$7,500 Tuition',
    location: 'United States',
    deadline: '2026-09-01',
    matchScore: 88,
    matchReasons: [
      'Enrolled in accredited 4-year Computer Science undergraduate degree',
      'Active leadership in campus tech clubs'
    ],
    improvementTips: [
      'Request a recommendation letter from your Algorithms professor early',
      'Emphasize community outreach activities in the supplemental questions'
    ],
    eligibilityTags: ['STEM Undergrad', 'All Years', 'Community Impact'],
    difficulty: 'Intermediate',
    modality: 'Remote'
  },
  {
    id: 'sch-3',
    title: 'Open Source Innovators Merit Award',
    org: 'Linux Foundation',
    category: 'Scholarships',
    awardOrStipend: '$5,000 + Conference Pass',
    location: 'Remote',
    deadline: '2026-10-12',
    matchScore: 92,
    matchReasons: [
      'Demonstrated Python and React skills match target open-source ecosystems',
      'Strong fit for students contributing to civic tech'
    ],
    improvementTips: [
      'Link your merged pull requests directly in the application summary field'
    ],
    eligibilityTags: ['Open Source Contributor', 'Global'],
    difficulty: 'Beginner',
    modality: 'Remote'
  },
  {
    id: 'sch-4',
    title: 'Silicon Valley Engineering Excellence Scholarship',
    org: 'Silicon Valley Leadership Group',
    category: 'Scholarships',
    awardOrStipend: '$12,000 Award',
    location: 'Remote',
    deadline: '2026-10-15',
    matchScore: 85,
    matchReasons: [
      'Academic GPA of 3.85 aligns with leadership group standards',
      'Matches accredited US computer science degree program prerequisite'
    ],
    improvementTips: [
      'Draft a detailed project statement highlighting your scalable systems project work'
    ],
    eligibilityTags: ['CS Major', 'STEM Undergrad', 'GPA 3.2+'],
    difficulty: 'Intermediate',
    modality: 'Remote'
  },
  {
    id: 'sch-5',
    title: 'National AI Ethics and Society Scholarship',
    org: 'Partnership on AI',
    category: 'Scholarships',
    awardOrStipend: '$8,000 Stipend',
    location: 'Remote',
    deadline: '2026-11-10',
    matchScore: 80,
    matchReasons: [
      'Expressed interest in AI ethics and societal impact aligns with policy goals',
      'Strong coding skills can support automated algorithmic fairness research'
    ],
    improvementTips: [
      'Refine essay to discuss regulatory sandboxes or bias auditing metrics'
    ],
    eligibilityTags: ['Ethics Focus', 'Cognitive Science', 'GPA 3.0+'],
    difficulty: 'Beginner',
    modality: 'Remote'
  },
  {
    id: 'sch-6',
    title: 'Quantum Computing Undergraduate Grant',
    org: 'Quantum Software Consortium',
    category: 'Scholarships',
    awardOrStipend: '$10,000 Grant',
    location: 'Hybrid',
    deadline: '2026-12-05',
    matchScore: 75,
    matchReasons: [
      'C++ proficiency is highly compatible with quantum emulator simulator development',
      'Strong mathematical and algorithmic fundamentals'
    ],
    improvementTips: [
      'Complete an introductory online course in Qiskit or quantum gates'
    ],
    eligibilityTags: ['Quantum Physics', 'CS & Math', 'GPA 3.5+'],
    difficulty: 'Advanced',
    modality: 'Hybrid'
  },

  // Hackathons
  {
    id: 'hack-1',
    title: 'Agentic AI Studio Global Hackathon',
    org: 'Google Cloud & DeepMind',
    category: 'Hackathons',
    awardOrStipend: '$50,000 Prize Pool',
    location: 'Hybrid (SF & Online)',
    deadline: '2026-07-20',
    matchScore: 96,
    matchReasons: [
      'Direct match with student skill stack: Python, Streamlit, and FastAPI',
      'Looking for multi-agent orchestration prototypes',
      'High success probability based on past academic projects'
    ],
    improvementTips: [
      'Form a 3-4 person balanced team with at least 1 frontend UI designer',
      'Prepare a clean 2-minute architectural demo video for the preliminary round'
    ],
    eligibilityTags: ['Students & Builders', 'AI/ML Focused', 'Free Entry'],
    difficulty: 'Intermediate',
    modality: 'Hybrid'
  },
  {
    id: 'hack-2',
    title: 'BioTech & HealthAI Innovation Jam',
    org: 'Genentech & Stanford Tech',
    category: 'Hackathons',
    awardOrStipend: '$25,000 + Incubation',
    location: 'On-site (Palo Alto, CA)',
    deadline: '2026-08-05',
    matchScore: 89,
    matchReasons: [
      'Student expressed interest in Computational Biology intersection',
      'Python data analysis skills match healthcare dataset challenges'
    ],
    improvementTips: [
      'Review standard FHIR medical data formats before the kickoff ceremony'
    ],
    eligibilityTags: ['Undergrad/Grad', 'HealthTech'],
    difficulty: 'Advanced',
    modality: 'On-site'
  },
  {
    id: 'hack-3',
    title: 'Smart Cities Sustainability Hackathon',
    org: 'EcoCompute Labs',
    category: 'Hackathons',
    awardOrStipend: '$10,000 Prize Pool',
    location: 'Online',
    deadline: '2026-09-12',
    matchScore: 84,
    matchReasons: [
      'Python and React skill set is perfect for building interactive solar panel grid maps',
      'High passion for eco-computing and sustainable cloud hosting solutions'
    ],
    improvementTips: [
      'Draft UI mockups for a live carbon intensity tracking dashboard using Tailwind CSS'
    ],
    eligibilityTags: ['Sustainability', 'IoT Devs', 'Green Tech'],
    difficulty: 'Beginner',
    modality: 'Remote'
  },
  {
    id: 'hack-4',
    title: 'FinTech Cryptography and DeFi Sprint',
    org: 'Stripe & Coinbase Collective',
    category: 'Hackathons',
    awardOrStipend: '$15,000 + Cloud Credits',
    location: 'Hybrid',
    deadline: '2026-10-22',
    matchScore: 91,
    matchReasons: [
      'Strong expertise in FastAPI, Python, and SQL matches transaction layer modeling goals',
      'Interest in ledger architecture matches sponsor focus'
    ],
    improvementTips: [
      'Study basic cryptographic signatures and automated stripe webhook integrations'
    ],
    eligibilityTags: ['Blockchain', 'FastAPI Devs', 'Undergrad/Grad'],
    difficulty: 'Advanced',
    modality: 'Hybrid'
  },
  {
    id: 'hack-5',
    title: 'Generative Agents AI Innovation Challenge',
    org: 'Antigravity Collective',
    category: 'Hackathons',
    awardOrStipend: '$30,000 Prize Pool',
    location: 'Hybrid',
    deadline: '2026-11-18',
    matchScore: 95,
    matchReasons: [
      'Direct relevance to your favorite topics: agentic orchestration and multi-agent loops',
      'TypeScript and React skills will make your frontend demo stand out from typical CLI scripts'
    ],
    improvementTips: [
      'Integrate simple, responsive visualization graphs representing active agent communications'
    ],
    eligibilityTags: ['LLM Orchestrators', 'TypeScript', 'Free Entry'],
    difficulty: 'Intermediate',
    modality: 'Hybrid'
  },
  {
    id: 'hack-6',
    title: 'CyberSecurity Defensive Agent Hackathon',
    org: 'Palo Alto Networks',
    category: 'Hackathons',
    awardOrStipend: '$20,000 + Interview',
    location: 'Online',
    deadline: '2026-12-15',
    matchScore: 78,
    matchReasons: [
      'Your C++ background is valuable for writing low-level socket-sniffing daemon filters',
      'Python knowledge supports rapid security log clustering scripts'
    ],
    improvementTips: [
      'Review fundamental cybersecurity protocols such as OWASP Top 10 and network intrusion indicators'
    ],
    eligibilityTags: ['Security', 'Python Scripting', 'C++ System'],
    difficulty: 'Advanced',
    modality: 'Remote'
  },

  // Competitions
  {
    id: 'comp-1',
    title: 'Kaggle Clinical Trial Outcome Prediction',
    org: 'Kaggle Research & Pfizer',
    category: 'Competitions',
    awardOrStipend: '$30,000 Solo/Team Prize',
    location: 'Remote / Async',
    deadline: '2026-09-30',
    matchScore: 94,
    matchReasons: [
      'PyTorch and tabular data modeling skills align perfectly with challenge metrics',
      'Excellent resume builder for target ML engineering internships'
    ],
    improvementTips: [
      'Implement automated cross-validation pipelines to prevent leaderboard overfitting',
      'Experiment with gradient boosted ensembles alongside deep neural nets'
    ],
    eligibilityTags: ['Data Scientists', 'Open Worldwide'],
    difficulty: 'Advanced',
    modality: 'Remote'
  },
  {
    id: 'comp-1b',
    title: 'ACM Collegiate Programming Regional Championship',
    org: 'ICPC Foundation',
    category: 'Competitions',
    awardOrStipend: 'Trophy + World Finals Bid',
    location: 'On-site (Berkeley, CA)',
    deadline: '2026-10-01',
    matchScore: 82,
    matchReasons: [
      'Strong Python foundations; good preparation for technical technical interviews'
    ],
    improvementTips: [
      'Practice dynamic programming and graph traversal algorithms on timed mock contests'
    ],
    eligibilityTags: ['University Teams', 'Algorithmic'],
    difficulty: 'Advanced',
    modality: 'On-site'
  },
  {
    id: 'comp-3',
    title: 'NeurIPS AI Agents Efficiency Challenge',
    org: 'NeurIPS Board & Hugging Face',
    category: 'Competitions',
    awardOrStipend: 'Medals & GPU Credits',
    location: 'Remote',
    deadline: '2026-09-15',
    matchScore: 90,
    matchReasons: [
      'High alignment with your skills in building agentic systems and optimized pipelines',
      'Demonstrated Python and machine learning knowledge is highly relevant'
    ],
    improvementTips: [
      'Read papers on model quantization (AWQ, GPTQ) and local caching strategies'
    ],
    eligibilityTags: ['ML Research', 'Hugging Face', 'Global'],
    difficulty: 'Advanced',
    modality: 'Remote'
  },
  {
    id: 'comp-4',
    title: 'Global Algorithmic Trading Tournament',
    org: 'Citadel Securities',
    category: 'Competitions',
    awardOrStipend: '$5,000 + Networking',
    location: 'Remote',
    deadline: '2026-10-28',
    matchScore: 86,
    matchReasons: [
      'Skills in SQL data parsing and Python mathematical analysis are fully utilized',
      'Interest in FinTech systems aligns with competitive quantitative frameworks'
    ],
    improvementTips: [
      'Refresh basic pandas-based moving averages and variance matrices algorithms'
    ],
    eligibilityTags: ['Quantitative', 'Python & SQL', 'Undergrad'],
    difficulty: 'Advanced',
    modality: 'Remote'
  },
  {
    id: 'comp-5',
    title: 'NASA Frontier Development Data Challenge',
    org: 'NASA FDL & SETI Institute',
    category: 'Competitions',
    awardOrStipend: 'NASA Center Visit',
    location: 'Online',
    deadline: '2026-11-20',
    matchScore: 88,
    matchReasons: [
      'Excellent application of satellite image processing using your deep learning interests',
      'Matches your Python and data analysis background'
    ],
    improvementTips: [
      'Become familiar with astronomical geospatial metadata and fits libraries'
    ],
    eligibilityTags: ['Aerospace ML', 'US Nationwide', 'Data Bowl'],
    difficulty: 'Intermediate',
    modality: 'Remote'
  },
  {
    id: 'comp-6',
    title: 'National Data Science Bowl',
    org: 'Booz Allen Hamilton',
    category: 'Competitions',
    awardOrStipend: '$12,000 Award Pool',
    location: 'Online',
    deadline: '2026-12-10',
    matchScore: 85,
    matchReasons: [
      'Matches core undergraduate data analytics student skill sets',
      'Python data analysis skills are highly applicable to predictive marine taxonomy'
    ],
    improvementTips: [
      'Utilize scikit-learn random forests and feature scaling methods to clean sparse datasets'
    ],
    eligibilityTags: ['Data Scientists', 'Undergrad Teams', 'Stat Modeling'],
    difficulty: 'Intermediate',
    modality: 'Remote'
  },

  // Leadership Programs
  {
    id: 'lead-1',
    title: 'Kleiner Perkins Campus Fellows Program',
    org: 'Kleiner Perkins Venture Capital',
    category: 'Leadership Programs',
    awardOrStipend: 'Silicon Valley Network + Summit',
    location: 'San Francisco, CA',
    deadline: '2026-07-31',
    matchScore: 95,
    matchReasons: [
      'Top-tier academic standing (3.85 GPA) at target university',
      'Demonstrated entrepreneurial mindset and AI engineering capabilities'
    ],
    improvementTips: [
      'In your video submission, articulate a clear thesis on where agentic AI is heading over the next 5 years',
      'Connect with former campus alumni fellows on LinkedIn for portfolio reviews'
    ],
    eligibilityTags: ['Top Tech Juniors', 'Product & Eng'],
    difficulty: 'Advanced',
    modality: 'Hybrid'
  },
  {
    id: 'lead-2',
    title: 'Tech for Social Good Student Ambassadors',
    org: 'United Nations Youth Envoy',
    category: 'Leadership Programs',
    awardOrStipend: '$2,000 Stipend + Travel',
    location: 'Remote & NYC',
    deadline: '2026-08-25',
    matchScore: 90,
    matchReasons: [
      'AI Ethics interest aligns with SDG 9 (Industry & Innovation)',
      'Leadership potential shown in university developer student clubs'
    ],
    improvementTips: [
      'Outline a concrete workshop proposal you could host on campus teaching basic AI literacy'
    ],
    eligibilityTags: ['Civic Leaders', 'Global Undergrad'],
    difficulty: 'Beginner',
    modality: 'Hybrid'
  },
  {
    id: 'lead-3',
    title: 'Google Developer Student Clubs Lead',
    org: 'Google Developers',
    category: 'Leadership Programs',
    awardOrStipend: 'Certificate + Summit',
    location: 'Global',
    deadline: '2026-08-10',
    matchScore: 89,
    matchReasons: [
      'Your active involvement in Python and developer ecosystems qualifies you as a strong technical mentor',
      'Strong public speaking potential and local community networking interest'
    ],
    improvementTips: [
      'Contact local faculty advisors to secure a campus meeting room and preliminary sponsor signoff'
    ],
    eligibilityTags: ['GDSC Lead', 'Community Organizers', 'STEM'],
    difficulty: 'Beginner',
    modality: 'Hybrid'
  },
  {
    id: 'lead-4',
    title: 'Venture Capital Innovation Fellows',
    org: 'Antigravity Ventures',
    category: 'Leadership Programs',
    awardOrStipend: 'Venture Stipend + Network',
    location: 'San Francisco, CA',
    deadline: '2026-09-18',
    matchScore: 87,
    matchReasons: [
      'Matches your Python/SQL coding foundations with technical portfolio evaluation skills',
      'Excellent opportunity to transition towards venture incubation or tech business development'
    ],
    improvementTips: [
      'Prepare a 1-page breakdown analyzing a newly launched open-source generative framework'
    ],
    eligibilityTags: ['Venture Scaling', 'Emergent AI', 'Junior/Senior'],
    difficulty: 'Intermediate',
    modality: 'Hybrid'
  },
  {
    id: 'lead-5',
    title: 'Responsible Tech Leadership Cohort',
    org: 'Mozilla & Partnership on AI',
    category: 'Leadership Programs',
    awardOrStipend: '$1,500 Honorarium',
    location: 'Remote',
    deadline: '2026-10-12',
    matchScore: 93,
    matchReasons: [
      'High alignment with your listed AI Ethics interest tag',
      'Collaborate with philosophy and legal students on policy blueprints'
    ],
    improvementTips: [
      'Highlight any past volunteer work or public policy debates you have participated in'
    ],
    eligibilityTags: ['Policy & Ethics', 'Global Cohort', 'Undergrad'],
    difficulty: 'Intermediate',
    modality: 'Remote'
  },
  {
    id: 'lead-6',
    title: 'Emerging CTO Undergraduate Bootcamp',
    org: 'Y Combinator Founder Network',
    category: 'Leadership Programs',
    awardOrStipend: 'Bootcamp & Flights',
    location: 'San Francisco, CA',
    deadline: '2026-11-25',
    matchScore: 94,
    matchReasons: [
      'Exceptional CS academic standing (3.85 GPA) matches strict selection benchmark',
      'Strong backend (FastAPI/SQL) and frontend (React) experience proves full-stack capability'
    ],
    improvementTips: [
      'Be prepared to describe a challenging technical architectural decision from your portfolio projects'
    ],
    eligibilityTags: ['CTO Track', 'YC Founders', 'CS Seniors'],
    difficulty: 'Advanced',
    modality: 'On-site'
  },

  // Fellowships
  {
    id: 'fell-1',
    title: 'Open AI Applied Research Residency Fellowship',
    org: 'OpenAI Academic Partnerships',
    category: 'Fellowships',
    awardOrStipend: '$10,000/mo + Compute',
    location: 'San Francisco, CA',
    deadline: '2026-11-01',
    matchScore: 91,
    matchReasons: [
      'PyTorch proficiency and ML research interests match residency track prerequisites',
      'Strong match for juniors looking to transition directly into frontier research teams'
    ],
    improvementTips: [
      'Contribute to open-source evaluation benchmarks (like HELM or lm-evaluation-harness)',
      'Prepare a 2-page research proposal on LLM reasoning efficiency'
    ],
    eligibilityTags: ['Pre-doctoral & Undergrad', 'Full-time Cohort'],
    difficulty: 'Advanced',
    modality: 'On-site'
  },
  {
    id: 'fell-2',
    title: 'Civic Digital Innovation Fellowship',
    org: 'Coding It Forward & US Digital Corps',
    category: 'Fellowships',
    awardOrStipend: '$8,500 Summer Stipend',
    location: 'Washington, D.C. / Hybrid',
    deadline: '2026-08-10',
    matchScore: 87,
    matchReasons: [
      'React and Python backend skills match federal agency modernization needs'
    ],
    improvementTips: [
      'Highlight accessibility (WCAG) compliance knowledge in frontend portfolio samples'
    ],
    eligibilityTags: ['US Citizens', 'Summer Cohort'],
    difficulty: 'Intermediate',
    modality: 'Hybrid'
  },
  {
    id: 'fell-3',
    title: 'Stanford Human-Centered AI Fellowship',
    org: 'Stanford University HAI',
    category: 'Fellowships',
    awardOrStipend: '$8,000 Stipend',
    location: 'Palo Alto, CA',
    deadline: '2026-09-05',
    matchScore: 88,
    matchReasons: [
      'Strong academic GPA (3.85) meets Stanford academic standing requirement',
      'Interest in AI Ethics aligns perfectly with human-centric system research goals'
    ],
    improvementTips: [
      'Draft a paragraph explaining how user interfaces can communicate model uncertainties'
    ],
    eligibilityTags: ['Stanford HAI', 'Ethics & AI', 'Undergrad Research'],
    difficulty: 'Advanced',
    modality: 'Hybrid'
  },
  {
    id: 'fell-4',
    title: 'Thiel Fellowship Alternative Cohort',
    org: 'Thiel Foundation Network',
    category: 'Fellowships',
    awardOrStipend: '$100,000 Grant',
    location: 'Global',
    deadline: '2026-10-30',
    matchScore: 83,
    matchReasons: [
      'Proven ability to build functional agentic systems and full-stack software',
      'Entrepreneurial interest matches the foundation focus on disruptive technologies'
    ],
    improvementTips: [
      'Define a highly specific, ambitious system roadmap demonstrating how you will acquire users'
    ],
    eligibilityTags: ['Founders', 'Disruptive Tech', 'Global Students'],
    difficulty: 'Advanced',
    modality: 'On-site'
  },
  {
    id: 'fell-5',
    title: 'Climate Tech AI Research Fellowship',
    org: 'ClimateChangeAI Foundation',
    category: 'Fellowships',
    awardOrStipend: '$12,000 Stipend',
    location: 'Remote',
    deadline: '2026-11-12',
    matchScore: 86,
    matchReasons: [
      'Python data analysis and machine learning interest tags fit predictive solar modeling challenges',
      'Demonstrated academic rigor supports complex scientific simulation tasks'
    ],
    improvementTips: [
      'Review fundamental atmospheric physics and raster data formats (NetCDF)'
    ],
    eligibilityTags: ['Climate Tech', 'ML Research', 'Undergrad/Grad'],
    difficulty: 'Intermediate',
    modality: 'Remote'
  },
  {
    id: 'fell-6',
    title: 'Mozilla Foundation Open Web Fellowship',
    org: 'Mozilla Corporation',
    category: 'Fellowships',
    awardOrStipend: '$15,000 Stipend',
    location: 'Remote',
    deadline: '2026-12-20',
    matchScore: 82,
    matchReasons: [
      'TypeScript and React skills support building privacy-focused browser addons',
      'Alignment with public interest technology goals'
    ],
    improvementTips: [
      'Read the Mozilla Manifesto on internet health and decentralization standards'
    ],
    eligibilityTags: ['Privacy', 'Open Source', 'Web Standards'],
    difficulty: 'Advanced',
    modality: 'Remote'
  },

  // Internships
  {
    id: 'int-1',
    title: 'AI/ML Software Engineer Internship (Summer 2027)',
    org: 'Anthropic Labs',
    category: 'Internships',
    awardOrStipend: '$65 / hr + Housing Stipend',
    location: 'San Francisco, CA',
    deadline: '2026-09-15',
    matchScore: 97,
    matchReasons: [
      'High academic excellence (3.85 GPA) in Computer Science',
      'Direct match with preferred location (San Francisco)',
      'Demonstrated expertise in Python, FastAPI, and containerized deployment'
    ],
    improvementTips: [
      'Complete 15-20 LeetCode Medium/Hard systems design and graph problems before September',
      'Prepare to discuss safety alignment trade-offs in technical interviews'
    ],
    eligibilityTags: ['CS Junior/Senior', 'Summer 2027', 'Paid'],
    difficulty: 'Advanced',
    modality: 'On-site'
  },
  {
    id: 'int-2',
    title: 'Backend Platform Engineer Intern',
    org: 'Stripe FinTech Core',
    category: 'Internships',
    awardOrStipend: '$58 / hr + Perks',
    location: 'Seattle, WA',
    deadline: '2026-10-01',
    matchScore: 93,
    matchReasons: [
      'FinTech interest tag matches Stripe core infrastructure team',
      'Strong SQL and API design capabilities match role requirements'
    ],
    improvementTips: [
      'Review distributed idempotency patterns and API rate limiting architectures'
    ],
    eligibilityTags: ['BS/MS CS', 'Remote Option'],
    difficulty: 'Intermediate',
    modality: 'Remote'
  },
  {
    id: 'int-3',
    title: 'NVIDIA Deep Learning Research Intern',
    org: 'NVIDIA Research',
    category: 'Internships',
    awardOrStipend: '$75 / hr + Relocation',
    location: 'Santa Clara, CA',
    deadline: '2026-09-01',
    matchScore: 92,
    matchReasons: [
      'Strong foundation in machine learning and Python scripting',
      'Your C++ skills align with low-level CUDA optimization and tensor compilers'
    ],
    improvementTips: [
      'Practice writing simple custom operations in PyTorch utilizing raw C++/CUDA'
    ],
    eligibilityTags: ['Deep Learning', 'GPU Compute', 'Paid Intern'],
    difficulty: 'Advanced',
    modality: 'On-site'
  },
  {
    id: 'int-4',
    title: 'Scale AI Data Operations Intern',
    org: 'Scale AI Labs',
    category: 'Internships',
    awardOrStipend: '$45 / hr + Perks',
    location: 'Remote',
    deadline: '2026-10-10',
    matchScore: 89,
    matchReasons: [
      'Python scripting and data analysis capability supports rapid automated logging',
      'Demonstrated meticulous focus on clean training set curation'
    ],
    improvementTips: [
      'Highlight any past data curation, scraping, or labeling automation scripts'
    ],
    eligibilityTags: ['Data Engineering', 'LLM Alignment', 'Beginner Friendly'],
    difficulty: 'Beginner',
    modality: 'Remote'
  },
  {
    id: 'int-5',
    title: 'Microsoft AI Platform Engineer Intern',
    org: 'Microsoft Azure AI',
    category: 'Internships',
    awardOrStipend: '$60 / hr + Housing',
    location: 'Redmond, WA',
    deadline: '2026-11-01',
    matchScore: 94,
    matchReasons: [
      'Strong full-stack (React + FastAPI) background is perfect for builder roles',
      'Outstanding academic performance (3.85 GPA) qualifies for leading engineering teams'
    ],
    improvementTips: [
      'Read Microsoft publications on decentralized identity and semantic kernel integrations'
    ],
    eligibilityTags: ['Full-Stack CS', 'Azure AI', 'Summer 2027'],
    difficulty: 'Intermediate',
    modality: 'Hybrid'
  },
  {
    id: 'int-6',
    title: 'Tesla Autopilot Vision Intern',
    org: 'Tesla Autopilot Team',
    category: 'Internships',
    awardOrStipend: '$70 / hr + Housing',
    location: 'Palo Alto, CA',
    deadline: '2026-12-02',
    matchScore: 91,
    matchReasons: [
      'Strong alignment with computer vision interests and neural network optimization',
      'Solid C++ and Python backgrounds match autopilot safety framework profiles'
    ],
    improvementTips: [
      'Study basic perspective projections, intrinsic camera matrices, and temporal modeling'
    ],
    eligibilityTags: ['Computer Vision', 'Robotics', 'C++ System'],
    difficulty: 'Advanced',
    modality: 'On-site'
  }
];

export const AGENTS_COLLABORATION_SPECS: AgentSpec[] = [
  {
    id: 'coordinator',
    name: 'Coordinator Agent',
    role: 'Central Conductor & Router',
    iconName: 'Cpu',
    responsibilities: [
      'Receives student prompt and active Streamlit session state',
      'Determines execution sequence across worker agents',
      'Validates Pydantic schemas between agent handoffs',
      'Ensures zero infinite reasoning loops or runaway API costs'
    ],
    inputs: ['User Natural Language Query', 'Session Persona State'],
    outputs: ['Orchestration Handoff Plan', 'Final Unified Response Context'],
    collaboratesWith: ['Profile Agent', 'Search Agent', 'Match Agent', 'Advisor Agent', 'Report Agent'],
    color: 'bg-blue-600 border-blue-500 text-white',
    badgeBg: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'profile',
    name: 'Profile Agent',
    role: 'Student Persona Analyzer',
    iconName: 'UserCheck',
    responsibilities: [
      'Parses student transcripts, resumes, and self-reported interests',
      'Extracts structured Pydantic StudentModel attributes (GPA, major, year)',
      'Identifies implicit strengths and career growth tags'
    ],
    inputs: ['Uploaded PDF Resume / Raw Form Inputs'],
    outputs: ['Validated Pydantic StudentModel instance'],
    collaboratesWith: ['Coordinator Agent'],
    color: 'bg-indigo-600 border-indigo-500 text-white',
    badgeBg: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'search',
    name: 'Search Agent',
    role: 'Opportunity Retriever',
    iconName: 'Search',
    responsibilities: [
      'Queries local static JSON database (opportunities_db.json)',
      'Performs semantic keyword filtering across 6 category silos',
      'Sorts candidate pools by deadline proximity and basic eligibility'
    ],
    inputs: ['StudentModel Search Parameters', 'Active Category Filter'],
    outputs: ['Filtered Candidate OpportunityPool'],
    collaboratesWith: ['Coordinator Agent', 'Match Agent'],
    color: 'bg-emerald-600 border-emerald-500 text-white',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'match',
    name: 'Match Agent',
    role: 'AI Eligibility & Scoring Engine',
    iconName: 'Sparkles',
    responsibilities: [
      'Computes 0–100% compatibility scores using Gemini 2.5 Flash reasoning',
      'Generates bulleted Explain Match reasons (why this fits the student)',
      'Synthesizes constructive Improvement Tips for missing prerequisites'
    ],
    inputs: ['Candidate OpportunityPool', 'StudentModel instance'],
    outputs: ['Ranked RecommendationList with Match Explanations'],
    collaboratesWith: ['Coordinator Agent', 'Advisor Agent'],
    color: 'bg-amber-600 border-amber-500 text-white',
    badgeBg: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'advisor',
    name: 'Advisor Agent',
    role: 'Interactive Mentorship Bot',
    iconName: 'Compass',
    responsibilities: [
      'Answers follow-up student questions about specific application essays',
      'Provides interview coaching and project portfolio strategy',
      'Maintains conversational context without modifying core DB state'
    ],
    inputs: ['Student Follow-up Prompt', 'Target Opportunity Card'],
    outputs: ['Tailored Mentorship Advice & Essay Outlines'],
    collaboratesWith: ['Coordinator Agent', 'Report Agent'],
    color: 'bg-purple-600 border-purple-500 text-white',
    badgeBg: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'report',
    name: 'Report Agent',
    role: 'Personalized Action Plan Generator',
    iconName: 'FileText',
    responsibilities: [
      'Compiles top matched opportunities into downloadable Markdown/PDF reports',
      'Generates weekly milestone action plans (e.g. Week 1: Resume prep, Week 2: Draft essay)',
      'Organizes application tracking checklists with automated reminder schedules'
    ],
    inputs: ['Saved Recommendations', 'Student Deadline Calendar'],
    outputs: ['Structured Personal Opportunity Dossier & Timeline'],
    collaboratesWith: ['Coordinator Agent', 'Advisor Agent'],
    color: 'bg-rose-600 border-rose-500 text-white',
    badgeBg: 'bg-rose-100 text-rose-800'
  }
];

export const ALL_FILES_SPECS: Record<string, PythonFileSpec> = {
  'app.py': {
    name: 'app.py',
    path: 'app.py',
    folder: 'root',
    purpose: 'Primary Streamlit application entry point. Handles multi-page navigation routing across all 12 views and initializes session state.',
    contains: ['main()', 'render_sidebar_navigation()', 'initialize_session_state()', 'route_current_page()'],
    connections: ['config.py', 'agents/coordinator_agent.py', 'models/student.py'],
    codeSnippetPreview: `import streamlit as st
from agents.coordinator_agent import CoordinatorAgent
from models.student import StudentProfile

st.set_page_config(page_title="OpportunityAI", layout="wide")

def main():
    if "coordinator" not in st.session_state:
        st.session_state.coordinator = CoordinatorAgent()
    
    # Render sidebar with 12 distinct views
    page = st.sidebar.radio("Navigation", [
        "Dashboard", "My Profile", "Scholarships", "Hackathons", 
        "Competitions", "Leadership Programs", "Fellowships", 
        "Internships", "Compare Opportunities", "AI Advisor", 
        "My Reports", "Settings"
    ])
    
    st.title(f"🚀 OpportunityAI — {page}")
    # Route view logic...

if __name__ == "__main__":
    main()`
  },
  'config.py': {
    name: 'config.py',
    path: 'config.py',
    folder: 'root',
    purpose: 'Centralized environment variables, Gemini model names, and Streamlit theme constants.',
    contains: ['GEMINI_MODEL_NAME = "gemini-2.5-flash"', 'MAX_SEARCH_RESULTS = 25', 'get_settings()'],
    connections: ['requirements.txt'],
    codeSnippetPreview: `import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    MODEL_REASONING: str = "gemini-2.5-flash"
    DATA_PATH: str = "./data/opportunities_db.json"

settings = Settings()`
  },
  'requirements.txt': {
    name: 'requirements.txt',
    path: 'requirements.txt',
    folder: 'root',
    purpose: 'Standard beginner-friendly Python dependency manifest.',
    contains: ['streamlit>=1.36.0', 'google-genai>=0.1.0', 'pydantic>=2.7.0', 'pandas>=2.2.0'],
    connections: []
  },
  'coordinator_agent.py': {
    name: 'coordinator_agent.py',
    path: 'agents/coordinator_agent.py',
    folder: 'agents',
    purpose: 'Conductor agent that orchestrates Profile, Search, Match, Advisor, and Report agents.',
    contains: ['class CoordinatorAgent', 'async orchestrate_discovery_flow()', 'dispatch_report_generation()'],
    connections: ['agents/base_agent.py', 'agents/report_agent.py', 'services/llm_service.py'],
    codeSnippetPreview: `from agents.base_agent import BaseAgent
from agents.report_agent import ReportAgent

class CoordinatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(role="Router")
        self.report_agent = ReportAgent()
        
    async def run_full_pipeline(self, student_prompt: str):
        # 1. Profile -> 2. Search -> 3. Match -> 4. Report
        pass`
  },
  'report_agent.py': {
    name: 'report_agent.py',
    path: 'agents/report_agent.py',
    folder: 'agents',
    purpose: 'Generates personalized action dossiers and milestone timelines.',
    contains: ['class ReportAgent', 'generate_action_plan_markdown()', 'export_weekly_checklist()'],
    connections: ['models/recommendation.py', 'services/llm_service.py'],
    codeSnippetPreview: `class ReportAgent:
    def generate_action_plan(self, matched_items, student):
        """Creates a step-by-step weekly preparation roadmap."""
        return f"# Personal Action Plan for {student.name}\\n..."`
  },
  'match_agent.py': {
    name: 'match_agent.py',
    path: 'agents/match_agent.py',
    folder: 'agents',
    purpose: 'Computes compatibility match scores and generates Explain Match breakdown bullet points.',
    contains: ['class MatchAgent', 'score_opportunity_fit()', 'build_explain_match_metrics()'],
    connections: ['models/opportunity.py', 'services/llm_service.py']
  },
  'student.py': {
    name: 'student.py',
    path: 'models/student.py',
    folder: 'models',
    purpose: 'Pydantic data validation model guaranteeing clean student profile fields.',
    contains: ['class StudentProfile(BaseModel)', 'gpa: float', 'major: str', 'academic_year: str'],
    connections: []
  },
  'opportunities_db.json': {
    name: 'opportunities_db.json',
    path: 'data/opportunities_db.json',
    folder: 'data',
    purpose: 'Static mock JSON database containing 100+ vetted opportunities across all 6 categories to guarantee demo stability.',
    contains: ['[{ "id": "sch-1", "category": "Scholarships", ... }]'],
    connections: ['services/search_service.py']
  }
};

export const PROJECT_FOLDER_TREE: FolderNode[] = [
  {
    name: 'app.py',
    type: 'file',
    path: 'app.py',
    description: 'Main Streamlit 12-page router',
    spec: ALL_FILES_SPECS['app.py']
  },
  {
    name: 'config.py',
    type: 'file',
    path: 'config.py',
    description: 'Env settings & constants',
    spec: ALL_FILES_SPECS['config.py']
  },
  {
    name: 'requirements.txt',
    type: 'file',
    path: 'requirements.txt',
    description: 'Streamlit, Pydantic, GenAI SDK',
    spec: ALL_FILES_SPECS['requirements.txt']
  },
  {
    name: 'agents',
    type: 'folder',
    path: 'agents',
    description: 'Multi-agent reasoning engine',
    children: [
      { name: 'base_agent.py', type: 'file', path: 'agents/base_agent.py' },
      { name: 'coordinator_agent.py', type: 'file', path: 'agents/coordinator_agent.py', spec: ALL_FILES_SPECS['coordinator_agent.py'] },
      { name: 'profile_agent.py', type: 'file', path: 'agents/profile_agent.py' },
      { name: 'search_agent.py', type: 'file', path: 'agents/search_agent.py' },
      { name: 'match_agent.py', type: 'file', path: 'agents/match_agent.py', spec: ALL_FILES_SPECS['match_agent.py'] },
      { name: 'advisor_agent.py', type: 'file', path: 'agents/advisor_agent.py' },
      { name: 'report_agent.py', type: 'file', path: 'agents/report_agent.py', spec: ALL_FILES_SPECS['report_agent.py'] }
    ]
  },
  {
    name: 'models',
    type: 'folder',
    path: 'models',
    description: 'Strict Pydantic data contracts',
    children: [
      { name: 'student.py', type: 'file', path: 'models/student.py', spec: ALL_FILES_SPECS['student.py'] },
      { name: 'opportunity.py', type: 'file', path: 'models/opportunity.py' },
      { name: 'recommendation.py', type: 'file', path: 'models/recommendation.py' }
    ]
  },
  {
    name: 'services',
    type: 'folder',
    path: 'services',
    description: 'LLM API wrappers & JSON DB loader',
    children: [
      { name: 'llm_service.py', type: 'file', path: 'services/llm_service.py' },
      { name: 'search_service.py', type: 'file', path: 'services/search_service.py' }
    ]
  },
  {
    name: 'data',
    type: 'folder',
    path: 'data',
    description: 'Demo static JSON datasets',
    children: [
      { name: 'opportunities_db.json', type: 'file', path: 'data/opportunities_db.json', spec: ALL_FILES_SPECS['opportunities_db.json'] }
    ]
  }
];

export const DEVELOPMENT_ROADMAP: DevPhase[] = [
  {
    phase: 1,
    title: 'Pydantic Models & Data Foundation',
    subtitle: 'Establish bulletproof data contracts before introducing LLMs.',
    modules: ['models/student.py', 'models/opportunity.py', 'data/opportunities_db.json'],
    goals: [
      'Define Pydantic schemas for StudentProfile and OpportunityItem',
      'Populate opportunities_db.json with 20 sample records across all 6 categories',
      'Write a simple validation unit test script'
    ],
    deliverable: 'python -c "from models.student import StudentProfile; print(\'Schema OK\')"',
    estimatedTime: '20 mins'
  },
  {
    phase: 2,
    title: 'Static Search Service & Streamlit Shell',
    subtitle: 'Build the 12-page navigation sidebar and wire up local JSON retrieval.',
    modules: ['app.py', 'config.py', 'services/search_service.py'],
    goals: [
      'Set up standard Streamlit multi-view radio navigation (Dashboard -> Settings)',
      'Implement keyword and category filter functions in search_service.py',
      'Verify instant rendering without external network requests'
    ],
    deliverable: 'streamlit run app.py (Confirm 12 views toggle cleanly)',
    estimatedTime: '30 mins'
  },
  {
    phase: 3,
    title: 'Coordinator & Profile Agents',
    subtitle: 'Initialize central routing and student resume parsing.',
    modules: ['agents/base_agent.py', 'agents/coordinator_agent.py', 'agents/profile_agent.py'],
    goals: [
      'Create BaseAgent with structured prompt formatting helpers',
      'Implement ProfileAgent to turn student self-reflections into StudentProfile Pydantic instances',
      'Wire up CoordinatorAgent central handoff queue'
    ],
    deliverable: 'python -m agents.coordinator_agent --test-profile',
    estimatedTime: '35 mins'
  },
  {
    phase: 4,
    title: 'Match Agent & "Explain Match" Engine',
    subtitle: 'Connect Gemini 2.5 Flash to compute match percentages and gap tips.',
    modules: ['agents/match_agent.py', 'services/llm_service.py'],
    goals: [
      'Integrate google-genai SDK inside llm_service.py',
      'Prompt MatchAgent to output JSON containing matchScore, matchReasons, and improvementTips',
      'Render the interactive "Explain Match" modal on Streamlit opportunity cards'
    ],
    deliverable: 'python -m agents.match_agent --score-sample',
    estimatedTime: '45 mins'
  },
  {
    phase: 5,
    title: 'Advisor Agent & Report Agent Integration',
    subtitle: 'Add interactive Q&A mentorship and personalized action plan generation.',
    modules: ['agents/advisor_agent.py', 'agents/report_agent.py'],
    goals: [
      'Create AdvisorAgent conversational chat interface for specific opportunity essay tips',
      'Build ReportAgent markdown dossier generator with weekly milestones',
      'Add "Generate My Action Plan" export button on the My Reports page'
    ],
    deliverable: 'python -m agents.report_agent --export-plan alex_chen',
    estimatedTime: '40 mins'
  },
  {
    phase: 6,
    title: 'UI Polish, Compare Matrix & Pitch Prep',
    subtitle: 'Finalize comparison tables, responsive styling, and judge demo script.',
    modules: ['app.py (Compare View)', 'docs/architecture.md'],
    goals: [
      'Build side-by-side comparison matrix for 2-3 selected opportunities',
      'Add bright beginner-friendly color coding and progress indicators',
      'Perform end-to-end 2-minute pitch rehearsal'
    ],
    deliverable: 'Hackathon Pitch Demo Ready ★',
    estimatedTime: '30 mins'
  }
];

// Dynamically enrich MOCK_OPPORTUNITIES with official links matching Python backend JSON datasets
const MOCK_LINKS_MAP: Record<string, string> = {
  'sch-1': 'https://deepmind.google/scholarships',
  'sch-2': 'https://anitab.org/awards',
  'sch-3': 'https://linuxfoundation.org/scholarships',
  'sch-4': 'https://svlg.org/excellence-scholarship',
  'sch-5': 'https://partnershiponai.org/student-scholarships',
  'sch-6': 'https://quantumsoft.org/undergraduate-grants',
  'hack-1': 'https://ai.google/hackathons/agentic',
  'hack-2': 'https://stanford.edu/health-ai-jam',
  'hack-3': 'https://ecocompute.io/sustainability-hack',
  'hack-4': 'https://stripe.com/fintech-sprint',
  'hack-5': 'https://antigravity.ai/challenge',
  'hack-6': 'https://paloaltonetworks.com/defensive-hack',
  'comp-1': 'https://kaggle.com/competitions/clinical-trials',
  'comp-1b': 'https://icpc.global',
  'comp-3': 'https://neurips.cc/challenges',
  'comp-4': 'https://citadelsecurities.com/trading-tournament',
  'comp-5': 'https://frontierdevelopmentlab.org',
  'comp-6': 'https://datasciencebowl.com',
  'lead-1': 'https://kleinerperkins.com/fellows',
  'lead-2': 'https://un.org/tech-ambassadors',
  'lead-3': 'https://developers.google.com/community/gdsc',
  'lead-4': 'https://antigravity.vc/fellows',
  'lead-5': 'https://partnershiponai.org/responsible-tech-leaders',
  'lead-6': 'https://ycombinator.com/cto-bootcamp',
  'fell-1': 'https://openai.com/careers',
  'fell-2': 'https://codingitforward.com/fellowship',
  'fell-3': 'https://hai.stanford.edu/undergrad-fellows',
  'fell-4': 'https://thielfellowship.org',
  'fell-5': 'https://climatechange.ai/fellowships',
  'fell-6': 'https://foundation.mozilla.org/fellowships',
  'int-1': 'https://anthropic.com/careers/intern',
  'int-2': 'https://stripe.com/careers/backend-intern',
  'int-3': 'https://nvidia.com/careers/research-intern',
  'int-4': 'https://scale.com/careers/data-ops-intern',
  'int-5': 'https://careers.microsoft.com/intern',
  'int-6': 'https://tesla.com/careers/autopilot-intern'
};

MOCK_OPPORTUNITIES.forEach(opp => {
  opp.official_link = MOCK_LINKS_MAP[opp.id] || "https://ai.google/research/";
});
