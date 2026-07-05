export interface PythonFileSpec {
  name: string;
  path: string;
  folder: string;
  purpose: string;
  contains: string[];
  connections: string[];
  codeSnippetPreview?: string;
}

export interface FolderNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  description?: string;
  children?: FolderNode[];
  spec?: PythonFileSpec;
}

export interface AgentSpec {
  id: string;
  name: string;
  role: string;
  iconName: string;
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
  collaboratesWith: string[];
  color: string;
  badgeBg: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  org: string;
  category: 'Scholarships' | 'Hackathons' | 'Competitions' | 'Leadership Programs' | 'Fellowships' | 'Internships';
  awardOrStipend: string;
  location: string;
  deadline: string;
  matchScore: number;
  matchReasons: string[];
  improvementTips: string[];
  eligibilityTags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modality: 'Remote' | 'On-site' | 'Hybrid';
  official_link?: string;
}

export interface StudentProfilePersona {
  id: string;
  name: string;
  avatarInitials: string;
  major: string;
  academicYear: string;
  gpa: string;
  interests: string[];
  skills: string[];
  preferredLocation: string;
  completionRate: number;
  savedCount: number;
  reportsCount: number;
}

export interface DevPhase {
  phase: number;
  title: string;
  subtitle: string;
  modules: string[];
  goals: string[];
  deliverable: string;
  estimatedTime: string;
}
