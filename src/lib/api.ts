/**
 * OpportunityAI Frontend API Client.
 *
 * Connects the React application with our server.ts backend endpoints
 * which invoke the Python Multi-Agent systems under the hood.
 */

export interface StudentProfile {
  name: string;
  email: string;
  country: string;
  education_level: string;
  gpa: number;
  major: string;
  skills: string[];
  programming_languages: string[];
  leadership_experience: string[];
  volunteer_experience: string[];
  english_proficiency: string;
  certificates: string[];
  interests: string[];
  academicYear?: string;
  avatarInitials?: string;
  completionRate?: number;
  savedCount?: number;
  reportsCount?: number;
}

export interface OpportunityItem {
  id: string;
  title: string;
  org: string;
  category: string;
  awardOrStipend: string;
  location: string;
  deadline: string;
  matchScore: number;
  matchReasons: string[];
  improvementTips: string[];
  eligibilityTags: string[];
  difficulty: string;
  modality: string;
  official_link?: string;
}

export interface ActionTimelineItem {
  date: string;
  task: string;
}

export interface ActionReport {
  executive_summary: string;
  recommended_timeline: ActionTimelineItem[];
  skill_gaps: string[];
}

export interface PipelineResult {
  status: string;
  student_profile: StudentProfile;
  matches: OpportunityItem[];
  report: ActionReport;
  fallback_active?: boolean;
}

/**
 * Clean up, map, and default-value populate raw API opportunity data to fit React schema.
 */
export function normalizeOpportunity(opp: any): OpportunityItem {
  if (!opp) {
    return {
      id: "unknown",
      title: "Untitled Opportunity",
      org: "Unknown",
      category: "Scholarships",
      awardOrStipend: "N/A",
      location: "Global",
      deadline: "TBD",
      matchScore: 70,
      matchReasons: [],
      improvementTips: [],
      eligibilityTags: [],
      difficulty: "Intermediate",
      modality: "Remote"
    };
  }

  const org = opp.org || opp.organization || "Unknown Sponsoring Foundation";
  const category = opp.category || "Scholarships";
  const awardOrStipend = opp.awardOrStipend || opp.stipend || "N/A";
  const location = opp.location || opp.country || "Global";
  const deadline = opp.deadline || opp.application_deadline || "TBD";
  
  const rawScore = typeof opp.matchScore === 'number' ? opp.matchScore : opp.overall_score;
  const matchScore = typeof rawScore === 'number' ? Math.round(rawScore) : 75;

  let matchReasons: string[] = [];
  if (Array.isArray(opp.matchReasons)) {
    matchReasons = opp.matchReasons;
  } else if (Array.isArray(opp.match_strengths)) {
    matchReasons = opp.match_strengths;
  } else if (Array.isArray(opp.strengths)) {
    matchReasons = opp.strengths;
  } else if (opp.aiExplanation && typeof opp.aiExplanation === 'string') {
    matchReasons = [opp.aiExplanation];
  } else if (opp.ai_explanation && typeof opp.ai_explanation === 'string') {
    matchReasons = [opp.ai_explanation];
  } else {
    matchReasons = ["Profile matching criteria satisfied."];
  }

  let improvementTips: string[] = [];
  if (Array.isArray(opp.improvementTips)) {
    improvementTips = opp.improvementTips;
  } else if (Array.isArray(opp.improvementSuggestions)) {
    improvementTips = opp.improvementSuggestions;
  } else if (Array.isArray(opp.improvement_suggestions)) {
    improvementTips = opp.improvement_suggestions;
  } else if (opp.improvement_suggestions && typeof opp.improvement_suggestions === 'string') {
    improvementTips = [opp.improvement_suggestions];
  } else if (opp.improvementSuggestions && typeof opp.improvementSuggestions === 'string') {
    improvementTips = [opp.improvementSuggestions];
  } else {
    improvementTips = ["Tailor your resume statement for this specific application."];
  }

  let eligibilityTags: string[] = [];
  if (Array.isArray(opp.eligibilityTags)) {
    eligibilityTags = opp.eligibilityTags;
  } else if (Array.isArray(opp.eligibility_requirements)) {
    eligibilityTags = opp.eligibility_requirements;
  } else if (opp.education_level) {
    eligibilityTags = [opp.education_level];
  } else {
    eligibilityTags = ["Eligible"];
  }

  const rawDifficulty = opp.difficulty || opp.education_level || "Intermediate";
  const difficulty = (rawDifficulty === 'Undergraduate' || rawDifficulty === 'All' || rawDifficulty === 'Graduate') ? 'Intermediate' : rawDifficulty;

  const rawModality = opp.modality || opp.application_mode || "Remote";
  const modality = (rawModality === 'Online') ? 'Remote' : rawModality;

  return {
    id: opp.id || "unknown",
    title: opp.title || "Untitled Program",
    org,
    category,
    awardOrStipend,
    location,
    deadline,
    matchScore,
    matchReasons,
    improvementTips,
    eligibilityTags,
    difficulty,
    modality,
    official_link: opp.official_link || opp.officialLink || "https://ai.google/research/"
  };
}

/**
 * Fetch all opportunities from the catalog.
 */
export async function fetchOpportunities(): Promise<OpportunityItem[]> {
  const response = await fetch("/api/opportunities");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }
  const data = await response.json();
  const rawList = data.opportunities || [];
  return rawList.map(normalizeOpportunity);
}

/**
 * Extract a structured student profile from raw input text (resume text / questionnaire).
 */
export async function extractProfile(rawText: string): Promise<StudentProfile> {
  const response = await fetch("/api/profile/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw_text: rawText }),
  });
  
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }
  
  const data = await response.json();
  return data.profile;
}

/**
 * Run the search, matching, and timeline report agents on a Student Profile.
 */
export async function runPipeline(profile: StudentProfile): Promise<PipelineResult> {
  const response = await fetch("/api/pipeline/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  if (data.matches) {
    data.matches = data.matches.map(normalizeOpportunity);
  }
  return data;
}

/**
 * Chat with the AI Advisor Agent.
 */
export async function chatWithAdvisor(
  message: string,
  profile: StudentProfile
): Promise<string> {
  const response = await fetch("/api/advisor/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, profile }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
}
