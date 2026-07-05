import React, { useState, useEffect } from 'react';
import { MOCK_OPPORTUNITIES, CURRENT_STUDENT_PROFILE } from '../data/blueprintData';
import { OpportunityItem } from '../types';
import { fetchOpportunities, extractProfile, runPipeline, chatWithAdvisor, StudentProfile, ActionReport } from '../lib/api';
import ComparisonTable from './ComparisonTable';
import DashboardView from './DashboardView';
import OpportunityDetailsView from './OpportunityDetailsView';
import SavedOpportunitiesView from './SavedOpportunitiesView';
import RoadmapView from './RoadmapView';
import NotificationsView from './NotificationsView';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  FileText, 
  Columns, 
  Download, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Award, 
  Clock, 
  ChevronRight, 
  Plus, 
  Check, 
  Settings as SettingsIcon,
  HelpCircle,
  TrendingUp,
  Bookmark,
  Share2,
  Bell
} from 'lucide-react';

type StreamlitPage = 
  | 'Dashboard' 
  | 'My Profile' 
  | 'Scholarships' 
  | 'Hackathons' 
  | 'Competitions' 
  | 'Leadership Programs' 
  | 'Fellowships' 
  | 'Internships' 
  | 'Compare Opportunities' 
  | 'AI Advisor' 
  | 'My Roadmap'
  | 'Saved Opportunities'
  | 'Notifications'
  | 'My Reports' 
  | 'Settings';

export default function DashboardSimulation() {
  const [activeView, setActiveView] = useState<StreamlitPage>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedModality, setSelectedModality] = useState<string>('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(70);
  
  // Real-time backend states
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem('opportunityai_profile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load profile from localStorage:", e);
    }
    return {
      name: CURRENT_STUDENT_PROFILE.name,
      email: 'alex.chen@university.edu',
      country: 'United States',
      education_level: 'Undergraduate',
      gpa: 3.85,
      major: CURRENT_STUDENT_PROFILE.major,
      skills: CURRENT_STUDENT_PROFILE.skills,
      programming_languages: ['Python', 'TypeScript', 'C++', 'SQL'],
      leadership_experience: ['AI Club Lead organizer', 'Robotics Coordinator'],
      volunteer_experience: ['Coding tutor for local high schoolers'],
      english_proficiency: 'Fluent',
      certificates: ['DeepMind Future Leaders Nominee'],
      interests: CURRENT_STUDENT_PROFILE.interests,
      academicYear: CURRENT_STUDENT_PROFILE.academicYear,
      avatarInitials: CURRENT_STUDENT_PROFILE.avatarInitials,
      completionRate: CURRENT_STUDENT_PROFILE.completionRate,
      savedCount: CURRENT_STUDENT_PROFILE.savedCount,
      reportsCount: CURRENT_STUDENT_PROFILE.reportsCount
    };
  });

  // Profile Editor state variables
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email || '');
  const [editMajor, setEditMajor] = useState(profile.major || '');
  const [editGPA, setEditGPA] = useState(profile.gpa || 3.85);
  const [editCountry, setEditCountry] = useState(profile.country || 'United States');
  const [editEduLevel, setEditEduLevel] = useState(profile.education_level || 'Undergraduate');
  const [editSkills, setEditSkills] = useState(profile.skills ? profile.skills.join(', ') : '');
  const [editLanguages, setEditLanguages] = useState(profile.programming_languages ? profile.programming_languages.join(', ') : '');
  const [editLeadership, setEditLeadership] = useState(profile.leadership_experience ? profile.leadership_experience.join(', ') : '');
  const [editVolunteer, setEditVolunteer] = useState(profile.volunteer_experience ? profile.volunteer_experience.join(', ') : '');
  const [editEnglish, setEditEnglish] = useState(profile.english_proficiency || 'Fluent');
  const [editCertificates, setEditCertificates] = useState(profile.certificates ? profile.certificates.join(', ') : '');
  const [editInterests, setEditInterests] = useState(profile.interests ? profile.interests.join(', ') : '');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Sync edit states when profile state changes (e.g. from AI extraction)
  useEffect(() => {
    setEditName(profile.name);
    setEditEmail(profile.email || '');
    setEditMajor(profile.major || '');
    setEditGPA(profile.gpa || 0);
    setEditCountry(profile.country || '');
    setEditEduLevel(profile.education_level || '');
    setEditSkills(profile.skills ? profile.skills.join(', ') : '');
    setEditLanguages(profile.programming_languages ? profile.programming_languages.join(', ') : '');
    setEditLeadership(profile.leadership_experience ? profile.leadership_experience.join(', ') : '');
    setEditVolunteer(profile.volunteer_experience ? profile.volunteer_experience.join(', ') : '');
    setEditEnglish(profile.english_proficiency || '');
    setEditCertificates(profile.certificates ? profile.certificates.join(', ') : '');
    setEditInterests(profile.interests ? profile.interests.join(', ') : '');
  }, [profile]);

  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(MOCK_OPPORTUNITIES);
  const [actionReport, setActionReport] = useState<ActionReport | null>({
    executive_summary: "You are a strong fit for AI fellowships. Focus on learning Machine Learning to bridge remaining gaps.",
    recommended_timeline: [
      { date: "2026-07-05", task: "Submit DeepMind AI Future Leaders Scholarship draft" },
      { date: "2026-07-15", task: "Prepare pitch outline for Agentic AI Hackathon" }
    ],
    skill_gaps: ["Advanced PyTorch", "System Architecture"]
  });

  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isFallbackActive, setIsFallbackActive] = useState(false);

  // High fidelity sub-view states
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(['sch-1', 'hack-1']);
  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', type: 'scholarship', text: 'AnitaB Tech Achievers Grant matches your Computer Science major!', time: '2 hours ago' },
    { id: '2', type: 'alert', text: 'Google Cloud Agentic Hackathon closing date in 19 days. Complete team formation.', time: '1 day ago' },
    { id: '3', type: 'milestone', text: 'Connected GitHub portfolio successfully with the Profile Agent pipeline.', time: '3 days ago' },
    { id: '4', type: 'action', text: 'DeepMind Future Leaders statement template generated. Open AI Advisor.', time: '5 days ago' }
  ]);

  // Explain Match Modal State
  const [explainingItem, setExplainingItem] = useState<OpportunityItem | null>(null);
  
  // Comparison State
  const [comparedIds, setComparedIds] = useState<string[]>(['sch-1', 'hack-1', 'sch-3']);
  
  // Advisor Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string; time: string }[]>(() => {
    let initialName = 'Alex';
    try {
      const stored = localStorage.getItem('opportunityai_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          initialName = parsed.name.split(' ')[0];
        }
      }
    } catch (_) {}
    return [
      {
        role: 'agent',
        text: `Hi ${initialName}! I'm your Advisor Agent. I noticed you have a 98% match for the DeepMind AI Leaders Scholarship and the Anthropic Internship. Would you like tips on drafting your AI Ethics statement?`,
        time: 'Just now'
      }
    ];
  });

  // Listen for global profile updates (from anywhere)
  useEffect(() => {
    const handleGlobalUpdate = () => {
      try {
        const stored = localStorage.getItem('opportunityai_profile');
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (_) {}
    };
    window.addEventListener('profile-updated', handleGlobalUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleGlobalUpdate);
    };
  }, []);

  // Fetch opportunities and run matching pipeline on mount
  useEffect(() => {
    async function initPipeline() {
      setIsLoading(true);
      setBackendError(null);
      try {
        const catalog = await fetchOpportunities();
        if (catalog && catalog.length > 0) {
          setOpportunities(catalog);
        }
        
        // Run full agent matching and explanation pipeline over the catalog
        const res = await runPipeline(profile);
        if (res.status === 'success') {
          if (res.matches && res.matches.length > 0) {
            setOpportunities(prev => {
              const matchesMap = new Map(res.matches.map(m => [m.id, m]));
              return prev.map(opp => {
                const matched = matchesMap.get(opp.id);
                if (matched) {
                  return {
                    ...opp,
                    matchScore: matched.matchScore,
                    matchReasons: matched.matchReasons && matched.matchReasons.length > 0 ? matched.matchReasons : opp.matchReasons,
                    improvementTips: matched.improvementTips && matched.improvementTips.length > 0 ? matched.improvementTips : opp.improvementTips,
                  };
                }
                return opp;
              });
            });
          }
          if (res.report) {
            setActionReport(res.report);
          }
          if (res.fallback_active) {
            setIsFallbackActive(true);
          }
        }
      } catch (err: any) {
        console.warn("Backend server not fully ready or returned an error. Using high-fidelity static fallback.", err);
        setBackendError(`Notice: Python agents are initializing/offline. Running on high-fidelity simulation.`);
      } finally {
        setIsLoading(false);
      }
    }
    initPipeline();
  }, []);

  const navPages: { page: StreamlitPage; icon: React.ReactNode; category?: string }[] = [
    { page: 'Dashboard', icon: <TrendingUp className="w-4 h-4" /> },
    { page: 'My Profile', icon: <User className="w-4 h-4" /> },
    { page: 'Scholarships', icon: <Award className="w-4 h-4" />, category: 'Scholarships' },
    { page: 'Hackathons', icon: <Sparkles className="w-4 h-4" />, category: 'Hackathons' },
    { page: 'Competitions', icon: <ShieldCheck className="w-4 h-4" />, category: 'Competitions' },
    { page: 'Leadership Programs', icon: <User className="w-4 h-4" />, category: 'Leadership Programs' },
    { page: 'Fellowships', icon: <FileText className="w-4 h-4" />, category: 'Fellowships' },
    { page: 'Internships', icon: <DollarSign className="w-4 h-4" />, category: 'Internships' },
    { page: 'Compare Opportunities', icon: <Columns className="w-4 h-4" /> },
    { page: 'AI Advisor', icon: <Sparkles className="w-4 h-4" /> },
    { page: 'My Roadmap', icon: <Calendar className="w-4 h-4" /> },
    { page: 'Saved Opportunities', icon: <Bookmark className="w-4 h-4" /> },
    { page: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { page: 'My Reports', icon: <FileText className="w-4 h-4" /> },
    { page: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  // Filter logic for opportunity category pages (uses current opportunities state)
  const currentCategory = navPages.find(p => p.page === activeView)?.category;
  const filteredOpportunities = opportunities.filter(item => {
    if (currentCategory && item.category !== currentCategory) return false;
    if (selectedDifficulty !== 'All' && item.difficulty !== selectedDifficulty) return false;
    if (selectedModality !== 'All' && item.modality !== selectedModality) return false;
    if (item.matchScore < minMatchScore) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.org.toLowerCase().includes(q) || item.eligibilityTags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const toggleCompare = (id: string) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter(i => i !== id));
    } else {
      if (comparedIds.length >= 3) {
        setComparedIds([...comparedIds.slice(1), id]);
      } else {
        setComparedIds([...comparedIds, id]);
      }
    }
  };

  const toggleSaveOpportunity = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter(i => i !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const savedOpportunities = opportunities.filter(opp => savedIds.includes(opp.id));

  // Chat with the real AdvisorAgent via Express / API Bridge
  const handleSendAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time: timestamp }]);
    
    setIsLoading(true);
    try {
      const replyText = await chatWithAdvisor(userMsg, profile);
      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.warn("Advisor chat backend error, falling back to smart simulation", err);
      // Fallback
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            role: 'agent', 
            text: `Received: "${userMsg}". (Simulation mode) - That's a strong question. The Coordinator Agent recommends reviewing your verified skills (${profile.skills.slice(0, 3).join(', ')}) and aligning your projects with the opportunity requirements.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 600);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract Student Profile from Raw Resume or Questionnaire Text using Gemini
  const handleExtractProfileAndMatch = async () => {
    if (!resumeText.trim()) return;
    setIsLoading(true);
    setBackendError(null);
    try {
      console.log("Extracting profile via ProfileAgent...");
      const extracted = await extractProfile(resumeText);
      
      const initials = extracted.name 
        ? extracted.name.split(" ").map(n => n[0]).join("").toUpperCase()
        : "ST";

      const updatedProfile: StudentProfile = {
        ...extracted,
        avatarInitials: initials,
        academicYear: extracted.education_level || "Undergraduate",
        completionRate: 100,
        savedCount: savedIds.length,
        reportsCount: (profile.reportsCount || 0) + 1
      };
      
      setProfile(updatedProfile);
      localStorage.setItem("opportunityai_profile", JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('profile-updated'));
      
      console.log("Running Multi-Agent orchestration pipeline on extracted profile...");
      const pipelineRes = await runPipeline(updatedProfile);
      if (pipelineRes.status === 'success') {
        if (pipelineRes.matches && pipelineRes.matches.length > 0) {
          setOpportunities(prev => {
            const matchesMap = new Map(pipelineRes.matches.map(m => [m.id, m]));
            return prev.map(opp => {
              const matched = matchesMap.get(opp.id);
              if (matched) {
                return {
                  ...opp,
                  matchScore: matched.matchScore,
                  matchReasons: matched.matchReasons && matched.matchReasons.length > 0 ? matched.matchReasons : opp.matchReasons,
                  improvementTips: matched.improvementTips && matched.improvementTips.length > 0 ? matched.improvementTips : opp.improvementTips,
                };
              }
              return opp;
            });
          });
        }
        if (pipelineRes.report) {
          setActionReport(pipelineRes.report);
        }
        if (pipelineRes.fallback_active) {
          setIsFallbackActive(true);
        }
      }
      
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          type: "milestone",
          text: `Success! ProfileAgent extracted credentials for ${updatedProfile.name}. CoordinatorAgent updated your match compatibility index!`,
          time: "Just now"
        },
        ...prev
      ]);
      
      setActiveView("Dashboard");
    } catch (err: any) {
      console.error("Profile Agent extraction failed:", err);
      setBackendError(`Extraction / Pipeline Error: ${err.message}. Using default mock profile context.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save profile manually and run matching pipeline
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setBackendError(null);
    setShowSaveSuccess(false);
    try {
      const initials = editName 
        ? editName.split(" ").map(n => n[0]).join("").toUpperCase()
        : "ST";

      const updatedProfile: StudentProfile = {
        name: editName,
        email: editEmail,
        country: editCountry,
        education_level: editEduLevel,
        gpa: Number(editGPA) || 0.0,
        major: editMajor,
        skills: editSkills.split(",").map(s => s.trim()).filter(Boolean),
        programming_languages: editLanguages.split(",").map(s => s.trim()).filter(Boolean),
        leadership_experience: editLeadership.split(",").map(s => s.trim()).filter(Boolean),
        volunteer_experience: editVolunteer.split(",").map(s => s.trim()).filter(Boolean),
        english_proficiency: editEnglish,
        certificates: editCertificates.split(",").map(s => s.trim()).filter(Boolean),
        interests: editInterests.split(",").map(s => s.trim()).filter(Boolean),
        avatarInitials: initials,
        academicYear: editEduLevel,
        completionRate: 100,
        savedCount: savedIds.length,
        reportsCount: profile.reportsCount || 1
      };

      setProfile(updatedProfile);
      localStorage.setItem("opportunityai_profile", JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('profile-updated'));

      console.log("Running Multi-Agent orchestration pipeline on manually saved profile...");
      const pipelineRes = await runPipeline(updatedProfile);
      if (pipelineRes.status === "success") {
        if (pipelineRes.matches && pipelineRes.matches.length > 0) {
          setOpportunities(prev => {
            const matchesMap = new Map(pipelineRes.matches.map(m => [m.id, m]));
            return prev.map(opp => {
              const matched = matchesMap.get(opp.id);
              if (matched) {
                return {
                  ...opp,
                  matchScore: matched.matchScore,
                  matchReasons: matched.matchReasons && matched.matchReasons.length > 0 ? matched.matchReasons : opp.matchReasons,
                  improvementTips: matched.improvementTips && matched.improvementTips.length > 0 ? matched.improvementTips : opp.improvementTips,
                };
              }
              return opp;
            });
          });
        }
        if (pipelineRes.report) {
          setActionReport(pipelineRes.report);
        }
        if (pipelineRes.fallback_active) {
          setIsFallbackActive(true);
        }
      }

      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 4000);

      setNotifications(prev => [
        {
          id: Date.now().toString(),
          type: "milestone",
          text: `Success! Profile for ${editName} saved manually and match compatibility index synchronized.`,
          time: "Just now"
        },
        ...prev
      ]);
    } catch (err: any) {
      console.error("Manual profile save or pipeline match syncing failed:", err);
      setBackendError(`Saved locally, but match synchronization error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-[680px] bg-zinc-50 dark:bg-[#0B0F19] rounded-2xl border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-2xl font-sans select-none text-zinc-950 dark:text-[#F9FAFB] transition-colors duration-200">
      
      {/* Streamlit Simulated Sidebar Navigation */}
      <div className="w-60 bg-white dark:bg-[#111827] border-r border-zinc-200 dark:border-zinc-800/80 p-4 flex flex-col justify-between shrink-0 transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-[#9CA3AF] font-bold tracking-wider">Streamlit Sidebar</span>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2.5 p-2.5 bg-blue-500/5 border border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-300">
              <div className="w-7 h-7 rounded-full bg-[#3B82F6] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-md">
                {profile.avatarInitials || 'AC'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{profile.name}</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate">GPA: {profile.gpa}</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-extrabold mb-2 px-2">
            App Views ({navPages.length} Pages)
          </div>

          <nav className="space-y-1 max-h-[440px] overflow-y-auto pr-1">
            {navPages.map(({ page, icon }) => {
              const isActive = activeView === page;
              return (
                <button
                  key={page}
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setActiveView(page);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                    isActive 
                      ? 'bg-zinc-200 dark:bg-[#1F2937] text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-800/60 font-bold shadow-md' 
                      : 'text-zinc-600 dark:text-[#9CA3AF] hover:bg-zinc-200/50 dark:hover:bg-[#1F2937]/55 hover:text-zinc-900 dark:hover:text-white font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-[#3B82F6]' : 'text-zinc-500'}>{icon}</span>
                  <span className="truncate">{page}</span>
                  {page === 'Compare Opportunities' && comparedIds.length > 0 && (
                    <span className={`ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-zinc-250 dark:bg-[#1F2937] text-blue-600 dark:text-[#3B82F6] border border-zinc-300 dark:border-zinc-800'
                    }`}>
                      {comparedIds.length}
                    </span>
                  )}
                  {page === 'Saved Opportunities' && savedIds.length > 0 && (
                    <span className={`ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {savedIds.length}
                    </span>
                  )}
                  {page === 'Notifications' && notifications.length > 0 && (
                    <span className={`ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-zinc-250 dark:bg-[#1F2937] text-blue-600 dark:text-[#3B82F6] border border-zinc-300 dark:border-zinc-800'
                    }`}>
                      {notifications.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/60">
          <div className="p-2.5 bg-zinc-100 dark:bg-[#0B0F19] rounded-xl text-[10px] text-zinc-500 dark:text-[#9CA3AF] font-mono space-y-1.5 border border-zinc-200 dark:border-zinc-800/80 shadow-inner">
            <div className="flex items-center justify-between text-zinc-800 dark:text-white font-bold">
              <span>DB Status: Loaded</span>
              <span className="text-[#10B981] font-black">● Static DB</span>
            </div>
            <p className="leading-relaxed text-zinc-400 dark:text-zinc-500">Judges experience instant 0ms latency.</p>
          </div>
        </div>
      </div>

      {/* Streamlit Simulated Main View Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0B0F19] overflow-hidden relative transition-colors duration-200">
        
        {/* Streamlit Top Title Bar */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50 dark:bg-[#111827] shrink-0 transition-colors duration-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#3B82F6] font-extrabold block">
              OpportunityAI Platform • Multi-Agent Pipeline Active
            </span>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{selectedOpportunity ? `Details: ${selectedOpportunity.title}` : activeView}</span>
              {currentCategory && !selectedOpportunity && (
                <span className="text-xs font-mono font-normal px-2.5 py-0.5 bg-zinc-200 dark:bg-[#1F2937] text-zinc-650 dark:text-[#9CA3AF] rounded-full border border-zinc-300 dark:border-zinc-850">
                  {filteredOpportunities.length} Available
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setSelectedOpportunity(null);
                setActiveView('AI Advisor');
              }}
              className="px-3.5 py-2 bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Dynamic Page Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Global Backend Error Notice */}
          {backendError && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-xl flex items-center justify-between gap-3 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                {backendError}
              </span>
              <button 
                onClick={() => setBackendError(null)} 
                className="text-amber-400 hover:text-amber-300 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Fallback Active Notice */}
          {isFallbackActive && (
            <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 text-blue-300 text-xs rounded-xl flex items-center justify-between gap-3 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>
                  <strong className="text-white font-semibold mr-1">AI Status:</strong> Heuristic and rule-based matching fallback activated. OpportunityAI remains fully functional and accessible!
                </span>
              </span>
              <button 
                onClick={() => setIsFallbackActive(false)} 
                className="text-blue-400 hover:text-blue-300 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Deep Details view overrides others if active */}
          {selectedOpportunity ? (
            <OpportunityDetailsView 
              opportunity={selectedOpportunity}
              onBack={() => setSelectedOpportunity(null)}
              onSave={toggleSaveOpportunity}
              isSaved={savedIds.includes(selectedOpportunity.id)}
              onToggleCompare={toggleCompare}
              isCompared={comparedIds.includes(selectedOpportunity.id)}
              onNavigate={(view) => {
                setSelectedOpportunity(null);
                setActiveView(view);
              }}
              profile={profile}
            />
          ) : (
            <>
              {/* VIEW 1: HIGH FIDELITY DASHBOARD VIEW */}
              {activeView === 'Dashboard' && (
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-zinc-950/80 z-50 flex flex-col items-center justify-center space-y-3 rounded-2xl">
                      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                      <p className="text-xs font-bold text-blue-400 font-mono">Syncing multi-agent matching engine...</p>
                    </div>
                  )}
                  <DashboardView 
                    opportunities={opportunities}
                    onNavigate={(view) => setActiveView(view)}
                    onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
                    onSaveOpportunity={toggleSaveOpportunity}
                    savedIds={savedIds}
                    comparedIds={comparedIds}
                    onToggleCompare={toggleCompare}
                    notifications={notifications}
                    onClearNotification={handleClearNotification}
                    profile={profile}
                  />
                </div>
              )}
            </>
          )}

          {/* VIEW 2: MY PROFILE */}
          {activeView === 'My Profile' && (
            <div className="max-w-4xl space-y-6 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/85 dark:bg-[#0B0F19]/80 z-50 flex flex-col items-center justify-center space-y-3 rounded-2xl">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">Analyzing with Google Gemini 2.5 Flash...</p>
                </div>
              )}

              <div className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 flex items-start gap-5 shadow-lg transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
                  {profile.avatarInitials}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">{profile.name}</h2>
                      <p className="text-xs text-zinc-500 dark:text-[#9CA3AF] mt-0.5">{profile.major} • {profile.academicYear || "Undergraduate"}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/25 font-mono text-xs font-bold rounded-xl shadow-inner">
                      Profile {profile.completionRate || 100}% Complete
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-zinc-50 dark:bg-[#0B0F19] p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/60 text-xs shadow-inner transition-colors">
                      <span className="text-zinc-400 dark:text-[#9CA3AF] block text-[10px] uppercase font-mono font-black">GPA</span>
                      <span className="font-bold font-mono text-blue-600 dark:text-[#3B82F6]">{profile.gpa}</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-[#0B0F19] p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/60 text-xs shadow-inner transition-colors">
                      <span className="text-zinc-400 dark:text-[#9CA3AF] block text-[10px] uppercase font-mono font-black">Country</span>
                      <span className="font-bold truncate block text-zinc-700 dark:text-zinc-300">{profile.country || "United States"}</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-[#0B0F19] p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/60 text-xs shadow-inner transition-colors">
                      <span className="text-zinc-400 dark:text-[#9CA3AF] block text-[10px] uppercase font-mono font-black">Saved Items</span>
                      <span className="font-bold font-mono text-emerald-600 dark:text-[#10B981]">{savedIds.length}</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-[#0B0F19] p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/60 text-xs shadow-inner transition-colors">
                      <span className="text-zinc-400 dark:text-[#9CA3AF] block text-[10px] uppercase font-mono font-black">Reports generated</span>
                      <span className="font-bold font-mono text-purple-600 dark:text-[#8B5CF6]">{profile.reportsCount || 1}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manual Profile Editor Form */}
              <div className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest font-mono text-blue-600 dark:text-[#3B82F6] flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>Manual Profile Settings & Background Details</span>
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-[#9CA3AF] mt-1">
                      Manually fine-tune your academic major, GPA, verified skills, and background credentials.
                    </p>
                  </div>
                  {showSaveSuccess && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/25 animate-fade-in">
                      ✓ Profile Saved Successfully
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="Jane Doe"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="jane.doe@university.edu"
                    />
                  </div>

                  {/* Major field */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Academic Major</label>
                    <input 
                      type="text" 
                      value={editMajor}
                      onChange={e => setEditMajor(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="Computer Science"
                    />
                  </div>

                  {/* GPA field */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">GPA (Out of 4.00)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.0"
                      max="4.0"
                      value={editGPA}
                      onChange={e => setEditGPA(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="3.85"
                    />
                  </div>

                  {/* Country field */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Country / Region</label>
                    <input 
                      type="text" 
                      value={editCountry}
                      onChange={e => setEditCountry(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="United States"
                    />
                  </div>

                  {/* Education Level */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Education Level / Year</label>
                    <input 
                      type="text" 
                      value={editEduLevel}
                      onChange={e => setEditEduLevel(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="Undergraduate / Junior"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Verified Skills */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Verified Technical Skills (Comma-separated)</label>
                    <textarea 
                      value={editSkills}
                      onChange={e => setEditSkills(e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner resize-none"
                      placeholder="Python, PyTorch, React, SQL"
                    />
                  </div>

                  {/* Research Interests */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Research Interests (Comma-separated)</label>
                    <textarea 
                      value={editInterests}
                      onChange={e => setEditInterests(e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner resize-none"
                      placeholder="Generative AI, Machine Learning, Computer Vision"
                    />
                  </div>

                  {/* Programming Languages */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Programming Languages (Comma-separated)</label>
                    <input 
                      type="text"
                      value={editLanguages}
                      onChange={e => setEditLanguages(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="Python, TypeScript, C++, SQL"
                    />
                  </div>

                  {/* English Proficiency */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">English Proficiency</label>
                    <input 
                      type="text"
                      value={editEnglish}
                      onChange={e => setEditEnglish(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="Fluent / Native"
                    />
                  </div>

                  {/* Leadership Experience */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Leadership Experience (Comma-separated)</label>
                    <textarea 
                      value={editLeadership}
                      onChange={e => setEditLeadership(e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner resize-none"
                      placeholder="AI Club Lead organizer, Robotics Coordinator"
                    />
                  </div>

                  {/* Volunteer Experience */}
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Volunteer Experience (Comma-separated)</label>
                    <textarea 
                      value={editVolunteer}
                      onChange={e => setEditVolunteer(e.target.value)}
                      rows={2}
                      className="w-full p-3 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner resize-none"
                      placeholder="Coding tutor, Community Outreach"
                    />
                  </div>

                  {/* Certificates */}
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1">Certifications & Awards (Comma-separated)</label>
                    <input 
                      type="text"
                      value={editCertificates}
                      onChange={e => setEditCertificates(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner"
                      placeholder="TensorFlow Certification, DeepMind Nominee"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading || !editName.trim()}
                    id="save-profile-btn"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Profile & Sync Matches</span>
                  </button>
                </div>
              </div>

              {/* Live Resume / CV Parser Form */}
              <div className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-lg transition-colors">
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-widest font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                    <span>Upload or Paste CV / Bio (AI ProfileAgent extraction)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-[#9CA3AF] mt-1 leading-relaxed">
                    Paste your current resume details, GPA, programming skills, or certifications. Google Gemini will extract structured attributes and run Coordinator matching.
                  </p>
                </div>

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Example: I am Jane Doe, an Honors Computer Science Junior student at UC Berkeley with a 3.92 GPA. My top skills are PyTorch, Python, React, and PostgreSQL. I lead the Open Source AI Club on campus and hold a Google TensorFlow Professional Certification. My goal is to work in Generative AI Research."
                  className="w-full h-28 p-3 text-xs bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 rounded-xl outline-none focus:border-purple-500/60 font-sans resize-none text-zinc-900 dark:text-[#F9FAFB] placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors shadow-inner"
                />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Structured extraction fields match StudentProfile schemas.
                  </span>
                  <button
                    onClick={handleExtractProfileAndMatch}
                    disabled={isLoading || !resumeText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Verify & Extract with Gemini</span>
                  </button>
                </div>
              </div>

              {/* Parsed Interests & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 space-y-3.5 shadow-lg transition-colors">
                  <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500 dark:text-zinc-400">AI Parsed Research Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests && profile.interests.length > 0 ? (
                      profile.interests.map((int, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-bold">
                          {int}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500 italic">No interests parsed yet. Use the extractor above!</span>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 space-y-3.5 shadow-lg transition-colors">
                  <h3 className="text-xs font-bold uppercase tracking-widest font-mono text-zinc-500 dark:text-zinc-400">Verified Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-zinc-50 dark:bg-[#0B0F19] text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800/85 rounded-xl text-xs font-mono font-bold transition-colors">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500 italic">No skills parsed yet. Use the extractor above!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEWS 3–8: CATEGORY SILO VIEWS (Scholarships, Hackathons, etc) */}
          {currentCategory && (
            <div className="space-y-6">
              {/* 2–3 Relevant Streamlit Filters */}
              <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 space-y-4 shadow-lg transition-colors">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Category Silo Filters ({currentCategory})</span>
                  </span>
                  <button 
                    onClick={() => { setSelectedDifficulty('All'); setSelectedModality('All'); setSearchQuery(''); setMinMatchScore(70); }}
                    className="text-[#3B82F6] hover:underline text-[11px] font-normal cursor-pointer transition-all"
                  >
                    Reset Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1.5">Search Keywords</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder={`Search ${currentCategory}...`}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner placeholder-zinc-400 dark:placeholder-zinc-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1.5">Modality</label>
                    <select 
                      value={selectedModality}
                      onChange={e => setSelectedModality(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="All">All Modalities</option>
                      <option value="Remote">Remote Only</option>
                      <option value="On-site">On-site Only</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1.5">Experience Level</label>
                    <select 
                      value={selectedDifficulty}
                      onChange={e => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#0B0F19] border border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-[#F9FAFB] rounded-xl text-xs focus:outline-none focus:border-[#3B82F6] transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Beginner">Beginner Friendly</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase font-bold block mb-1.5">Min Match: {minMatchScore}%</label>
                    <input 
                      type="range" 
                      min="70" 
                      max="98" 
                      value={minMatchScore}
                      onChange={e => setMinMatchScore(Number(e.target.value))}
                      className="w-full mt-2 accent-[#3B82F6] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Feed Grid */}
              {filteredOpportunities.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-[#1F2937] rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800/80 text-zinc-500 dark:text-[#9CA3AF] shadow-md transition-colors">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2.5 text-zinc-450 dark:text-zinc-500" />
                  <p className="text-sm font-bold text-zinc-850 dark:text-white">
                    {searchQuery.trim() || selectedModality !== 'All' || selectedDifficulty !== 'All' || minMatchScore > 70
                      ? "No matching opportunities found for your search or filters."
                      : "Connecting to OpportunityAI directory..."}
                  </p>
                  <p className="text-xs mt-1.5 text-zinc-455 dark:text-zinc-400 leading-relaxed">
                    {searchQuery.trim() || selectedModality !== 'All' || selectedDifficulty !== 'All' || minMatchScore > 70
                      ? "Try lowering the minimum match percentage slider or clearing search terms."
                      : "Please wait while the multi-agent coordinator synchronizes the opportunity index."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredOpportunities.map(item => (
                    <OpportunityCard 
                      key={item.id} 
                      item={item} 
                      onExplain={() => setExplainingItem(item)}
                      isCompared={comparedIds.includes(item.id)}
                      onToggleCompare={() => toggleCompare(item.id)}
                      onSelect={() => setSelectedOpportunity(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 9: COMPARE OPPORTUNITIES */}
          {activeView === 'Compare Opportunities' && (
            <ComparisonTable 
              comparedIds={comparedIds}
              onToggleCompare={toggleCompare}
              onExplain={(item) => {
                setExplainingItem(item);
                setActiveView('Competitions');
              }}
              onAddMore={() => setActiveView('Scholarships')}
            />
          )}

          {/* VIEW 10: AI ADVISOR */}
          {activeView === 'AI Advisor' && (
            <div className="max-w-4xl h-[520px] bg-white dark:bg-[#1F2937] rounded-2xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col shadow-xl overflow-hidden transition-colors duration-200">
              <div className="p-4 bg-zinc-100 dark:bg-[#111827] text-zinc-800 dark:text-white flex items-center justify-between shrink-0 border-b border-zinc-200 dark:border-zinc-800/60 transition-colors duration-200">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-bold leading-none">Advisor Agent Chat</h3>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">Powered by Gemini 2.5 Flash • Context: {profile.name}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] rounded-xl text-[10px] font-mono font-bold border border-[#10B981]/25">Online</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-[#0B0F19] transition-colors duration-200">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-tl-none transition-colors'
                    }`}>
                      <p>{m.text}</p>
                      <span className={`text-[9px] block mt-1 text-right font-mono ${m.role === 'user' ? 'text-blue-300' : 'text-zinc-500'}`}>
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendAdvisor} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask for essay tips, interview prep, or research proposal outlines..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-purple-500/60 text-zinc-100 placeholder-zinc-600"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* VIEW 11: MY REPORTS (REPORT AGENT DOSSIER) */}
          {activeView === 'My Reports' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-gradient-to-r from-rose-950 to-zinc-900 border border-rose-900/40 p-6 rounded-xl text-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-300 text-[10px] font-mono mb-2">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Report Agent Pipeline Output</span>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-100">Personalized Opportunity Action Dossier</h2>
                  <p className="text-xs text-zinc-300 mt-1 max-w-lg leading-relaxed">
                    Compiled automatically by the <strong>Report Agent</strong>. Contains your verified top matches, customized weekly prep milestones, and submission tracking checklists.
                  </p>
                </div>
                <button 
                  onClick={() => alert(`Simulated: Exporting ${(profile.name || "Alex Chen").replace(/\s+/g, "_")}_Opportunity_Dossier_2026.pdf`)}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download PDF Dossier</span>
                </button>
              </div>

              {/* Action Plan Timeline generated by Report Agent */}
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <span>Report Agent's 4-Week Execution Schedule</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-green-950 text-green-400 font-bold rounded border border-green-900/30">
                    On Track
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    { week: 'Week 1 (Current)', title: 'Open Source Repository Audit & GitHub Polish', task: 'Finalize PyTorch clinical trial repository README and merge pending PRs for Linux Foundation application.', status: 'Done' },
                    { week: 'Week 2 (July 5–12)', title: 'DeepMind Essay & AI Ethics Statement', task: 'Use Advisor Agent outlines to draft 500-word personal statement connecting 3.85 GPA coursework to ethical AI future.', status: 'In Progress' },
                    { week: 'Week 3 (July 13–20)', title: 'Agentic AI Studio Hackathon Pitch Video', task: 'Record 2-minute screen capture demo of multi-agent handoffs with team coordinator.', status: 'Upcoming' },
                    { week: 'Week 4 (July 21–31)', title: 'Kleiner Perkins Campus Fellows Video', task: 'Articulate 5-year thesis on autonomous software engineering agents.', status: 'Upcoming' }
                  ].map((w, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        w.status === 'Done' ? 'bg-emerald-500/20 text-emerald-400' : w.status === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {w.status === 'Done' ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{w.week}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            w.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : w.status === 'In Progress' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {w.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-150">{w.title}</h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{w.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 12: SETTINGS */}
          {activeView === 'Settings' && (
            <div className="max-w-2xl bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-6">
              <h2 className="text-base font-bold text-zinc-100 border-b border-zinc-800 pb-3">Platform & Agent Configuration</h2>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-850">
                  <div>
                    <span className="font-bold text-zinc-200 block">Gemini Reasoning Model</span>
                    <span className="text-zinc-500">Used by Match Agent and Advisor Agent</span>
                  </div>
                  <span className="font-mono bg-zinc-900 px-2.5 py-1 rounded border border-zinc-850 font-bold text-blue-400">gemini-3.5-flash</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-850">
                  <div>
                    <span className="font-bold text-zinc-200 block">Static Demo Dataset</span>
                    <span className="text-zinc-500">File path: ./data/opportunities_db.json</span>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">● Active (104 items)</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-850">
                  <div>
                    <span className="font-bold text-zinc-200 block">Auto-Generate Weekly Dossiers</span>
                    <span className="text-zinc-500">Dispatches Report Agent every Sunday night</span>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 13: MY ROADMAP */}
          {activeView === 'My Roadmap' && (
            <RoadmapView onNavigate={(view) => setActiveView(view)} profile={profile} />
          )}

          {/* VIEW 14: SAVED OPPORTUNITIES */}
          {activeView === 'Saved Opportunities' && (
            <SavedOpportunitiesView 
              savedOpportunities={savedOpportunities}
              onRemove={toggleSaveOpportunity}
              onSelect={(opp) => setSelectedOpportunity(opp)}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {/* VIEW 15: NOTIFICATIONS */}
          {activeView === 'Notifications' && (
            <NotificationsView 
              notifications={notifications}
              onClearNotification={handleClearNotification}
              onClearAll={handleClearAllNotifications}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

        </div>
      </div>

      {/* EXPLAIN MATCH INTERACTIVE DRAWER / MODAL */}
      {explainingItem && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-xl rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-zinc-100">
            
            {/* Header */}
            <div className="bg-zinc-950 p-5 border-b border-zinc-800 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded font-bold">
                  Match Agent Reasoning Engine
                </span>
                <h3 className="text-lg font-bold mt-1.5 leading-snug text-zinc-100">{explainingItem.title}</h3>
                <p className="text-xs text-zinc-400">{explainingItem.org}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-mono font-bold text-emerald-400 block leading-none">
                  {explainingItem.matchScore}%
                </span>
                <span className="text-[9px] uppercase font-mono text-zinc-500 font-bold">Compatibility Fit</span>
              </div>
            </div>

            {/* Content Breakdown */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              
              {/* Why AI Recommended This */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Why the AI Recommended This Opportunity</span>
                </h4>
                <ul className="space-y-2 pl-2">
                  {(explainingItem.matchReasons || []).map((reason, i) => (
                    <li key={i} className="text-xs text-emerald-200 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                      <span className="text-emerald-400 font-bold select-none">•</span>
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))}
                  {(!explainingItem.matchReasons || explainingItem.matchReasons.length === 0) && (
                    <li className="text-xs text-zinc-500 italic p-3">No specific strengths calculated.</li>
                  )}
                </ul>
              </div>

              {/* How Student Can Improve / Close Gaps */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase font-bold text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Actionable Improvement Tips (Report Agent Connection)</span>
                </h4>
                <ul className="space-y-2 pl-2">
                  {(explainingItem.improvementTips || []).map((tip, i) => (
                    <li key={i} className="text-xs text-blue-200 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 flex items-start gap-2.5">
                      <span className="text-blue-400 font-bold select-none">→</span>
                      <span className="leading-relaxed font-medium">{tip}</span>
                    </li>
                  ))}
                  {(!explainingItem.improvementTips || explainingItem.improvementTips.length === 0) && (
                    <li className="text-xs text-zinc-500 italic p-3">No actionable suggestions found. Your profile matches perfectly.</li>
                  )}
                </ul>
              </div>

              {/* Tags & Modality */}
              <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase mr-1">Eligibility Specs:</span>
                {(explainingItem.eligibilityTags || []).map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono bg-zinc-950 text-zinc-400 px-2 py-1 rounded-md border border-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => { toggleCompare(explainingItem.id); setExplainingItem(null); setActiveView('Compare Opportunities'); }}
                className="px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Columns className="w-3.5 h-3.5 text-blue-400" />
                <span>{comparedIds.includes(explainingItem.id) ? 'View in Compare Matrix' : '+ Add to Compare Matrix'}</span>
              </button>
              <button 
                onClick={() => setExplainingItem(null)}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs rounded-xl border border-zinc-700 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Opportunity Card Component with "Explain Match" Button
function OpportunityCard({ 
  item, 
  onExplain,
  isCompared,
  onToggleCompare,
  onSelect
}: { 
  key?: string;
  item: OpportunityItem; 
  onExplain: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  onSelect?: () => void;
}) {
  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-500/50 dark:hover:border-[#3B82F6]/55 p-5 shadow-sm hover:shadow-lg dark:shadow-md dark:hover:shadow-xl transition-all flex flex-col justify-between group space-y-4 transition-colors duration-200">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300 font-bold border border-blue-500/20 dark:border-[#3B82F6]/25">
            {item.category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#10B981] bg-emerald-500/10 dark:bg-[#10B981]/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 dark:border-[#10B981]/25">
              ★ {item.matchScore}% Match
            </span>
          </div>
        </div>

        <h3 
          onClick={onSelect}
          className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors mt-3 leading-snug cursor-pointer"
        >
          {item.title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-[#9CA3AF] mt-1">{item.org}</p>

        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500 dark:text-[#10B981] shrink-0" />
            <span className="truncate font-sans font-semibold text-zinc-700 dark:text-zinc-300">{item.awardOrStipend}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate text-rose-500 dark:text-rose-400">
            <Clock className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            <span className="truncate">Due: {item.deadline}</span>
          </div>
        </div>
      </div>

      <div className="pt-3.5 border-t border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between gap-2">
        <button
          onClick={onToggleCompare}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
            isCompared 
              ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white border-[#3B82F6]' 
              : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-[#0B0F19] dark:hover:bg-zinc-800 text-zinc-600 dark:text-[#9CA3AF] hover:text-zinc-900 dark:hover:text-white border-zinc-250 dark:border-zinc-800/80'
          }`}
        >
          <Plus className={`w-3 h-3 ${isCompared ? 'rotate-45 transition-transform' : ''}`} />
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>

        <button
          onClick={onExplain}
          className="px-3 py-1.5 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-purple-300 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/35 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Explain Match</span>
        </button>
      </div>
    </div>
  );
}
