import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  FolderTree, 
  Cpu, 
  Rocket, 
  Sparkles, 
  FileCode, 
  BookOpen, 
  ExternalLink,
  Github,
  Terminal,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

// Components
import DashboardSimulation from './components/DashboardSimulation';
import ArchitectureOverview from './components/ArchitectureOverview';
import FolderTreeExplorer from './components/FolderTreeExplorer';
import FileSpecViewer from './components/FileSpecViewer';
import AgentFlowDiagram from './components/AgentFlowDiagram';
import DevelopmentRoadmap from './components/DevelopmentRoadmap';

// Data
import { PROJECT_FOLDER_TREE, ALL_FILES_SPECS } from './data/blueprintData';
import { PythonFileSpec } from './types';

type TabId = 'simulation' | 'architecture' | 'files' | 'workflow' | 'roadmap';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');
  const [selectedFileSpec, setSelectedFileSpec] = useState<PythonFileSpec | null>(
    ALL_FILES_SPECS['app.py'] || Object.values(ALL_FILES_SPECS)[0] || null
  );

  const [isFullscreen, setIsFullscreen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.has('standalone') || searchParams.has('fullscreen');
      }
    } catch (_) {}
    return false;
  });

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('opportunityai_profile');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    return {
      name: 'Alex Chen',
      avatarInitials: 'AC',
      major: 'Computer Science',
      education_level: 'Undergraduate'
    };
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('opportunityai_profile');
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (_) {}
    };
    window.addEventListener('profile-updated', handleUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleUpdate);
    };
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navItems: NavItem[] = [
    {
      id: 'simulation',
      label: 'Streamlit UI Preview',
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: 'Live Demo'
    },
    {
      id: 'architecture',
      label: 'System Blueprint',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'files',
      label: 'Python Folder Tree',
      icon: <FolderTree className="w-5 h-5" />,
      badge: '22 Files'
    },
    {
      id: 'workflow',
      label: 'Agent Collaboration',
      icon: <Cpu className="w-5 h-5" />
    },
    {
      id: 'roadmap',
      label: 'Development Roadmap',
      icon: <Rocket className="w-5 h-5" />,
      badge: '6 Phases'
    }
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden antialiased select-none transition-colors duration-200">
      
      {/* Sidebar (Adaptive theme) */}
      {!isFullscreen && (
      <aside className="w-64 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-[#9CA3AF] flex flex-col shrink-0 border-r border-zinc-200 dark:border-zinc-800/60 z-20 transition-colors duration-200">
        
        {/* Logo Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] via-blue-500 to-[#10B981] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/10 border border-blue-400/20">
            O
          </div>
          <div>
            <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight block leading-none font-sans">
              OpportunityAI
            </span>
            <span className="text-[10px] font-mono text-[#10B981] tracking-wider uppercase font-semibold mt-1 block">
              Multi-Agent Platform
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-5 py-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold">
          Architecture Workbench
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-zinc-200 text-zinc-900 border-zinc-300 shadow-sm dark:bg-[#1F2937]/85 dark:text-white dark:border-zinc-700/50 dark:shadow-md dark:shadow-black/20 font-semibold'
                    : 'text-zinc-600 dark:text-[#9CA3AF] hover:bg-zinc-200/50 dark:hover:bg-[#1F2937]/30 hover:text-zinc-900 dark:hover:text-zinc-250 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className={isActive ? 'text-blue-600 dark:text-[#3B82F6]' : 'text-zinc-400 dark:text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 dark:border-[#3B82F6]/25' 
                      : 'bg-zinc-200 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Hackathon Scope Callout */}
        <div className="mx-3 mb-3 p-4 bg-zinc-200/40 dark:bg-[#1F2937]/40 rounded-2xl border border-zinc-250 dark:border-zinc-800/60 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-[#3B82F6] font-semibold text-[11px] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#10B981]" />
            <span>Scope Mandate Notice</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-[#9CA3AF] leading-relaxed">
            This workbench designs the beginner-friendly Python architecture. Implementation code generation is deferred to development phase.
          </p>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-5 border-t border-zinc-200 dark:border-zinc-850 bg-zinc-200/20 dark:bg-[#0B0F19]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#10B981] border border-blue-400/20 flex items-center justify-center text-white font-bold shadow-md shrink-0">
              {profile.avatarInitials || 'AC'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-850 dark:text-white truncate">{profile.name}</p>
              <p className="text-xs text-zinc-500 dark:text-[#9CA3AF] truncate">
                {profile.major || 'Computer Science'} • {profile.academicYear || profile.education_level || 'Undergraduate'}
              </p>
            </div>
          </div>
        </div>

      </aside>
      )}

      {/* Main Content Shell */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
        
        {/* Top Header */}
        {!isFullscreen && (
        <header className="h-16 bg-white dark:bg-[#111827]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between px-6 md:px-8 shrink-0 z-10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-3">
            <h1 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{navItems.find(i => i.id === activeTab)?.label}</span>
            </h1>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline font-mono">
              opportunity_ai/
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Standalone Demo Toggle */}
            <button
              onClick={() => {
                setActiveTab('simulation');
                setIsFullscreen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title="Hide all sidebar navigation and show ONLY the standalone app for clean fullscreen video recording"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Fullscreen App</span>
            </button>

            {/* Theme Toggle Switch */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-[#1F2937]/80 dark:hover:bg-[#1F2937] text-zinc-700 dark:text-zinc-300 border border-zinc-250 dark:border-zinc-750 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">☀️ Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                  <span className="hidden sm:inline">🌙 Dark</span>
                </>
              )}
            </button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-[#1F2937]/50 border border-zinc-250 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl text-xs font-mono">
              <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-[#3B82F6]" />
              <span>python 3.11+ (Streamlit + Pydantic + Gemini SDK)</span>
            </div>

            <div className="flex items-center gap-2 text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-[#10B981] border border-emerald-500/20 dark:border-[#10B981]/20 rounded-full font-mono font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#10B981] animate-pulse" />
              <span>Architecture Online</span>
            </div>
          </div>
        </header>
        )}

        {/* Dynamic View Body */}
        <div className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8 bg-zinc-50 dark:bg-zinc-950 flex flex-col transition-colors duration-200">
          
          {activeTab === 'simulation' && (
            <div className="h-full overflow-y-auto pr-1">
              <DashboardSimulation />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="h-full overflow-y-auto pr-1">
              <ArchitectureOverview />
            </div>
          )}

          {activeTab === 'files' && (
            <div className="h-full flex flex-col lg:flex-row gap-6 overflow-hidden max-w-7xl mx-auto w-full">
              {/* Left Column: Folder Tree */}
              <div className="w-full lg:w-96 shrink-0 h-1/2 lg:h-full">
                <FolderTreeExplorer
                  tree={PROJECT_FOLDER_TREE}
                  selectedFile={selectedFileSpec}
                  onSelectFile={(spec) => setSelectedFileSpec(spec)}
                />
              </div>

              {/* Right Column: File Specification Inspector */}
              <div className="flex-1 min-w-0 h-1/2 lg:h-full">
                <FileSpecViewer spec={selectedFileSpec} />
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="h-full overflow-y-auto pr-1">
              <AgentFlowDiagram />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="h-full overflow-y-auto pr-1">
              <DevelopmentRoadmap />
            </div>
          )}

        </div>

        {/* Global Footer Bar */}
        {!isFullscreen && (
        <footer className="h-10 bg-white dark:bg-[#111827] border-t border-zinc-200 dark:border-zinc-800/60 text-zinc-500 px-6 flex items-center justify-between text-[11px] font-mono shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-[#3B82F6]" />
              <span>Modular Separation of Concerns Validated</span>
            </span>
            <span className="hidden md:inline text-zinc-300 dark:text-zinc-800">|</span>
            <span className="hidden md:inline text-zinc-500">Opportunities: Scholarships, Hackathons, Fellowships, Internships</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
            <span>Hackathon Demo Blueprint v1.0</span>
          </div>
        </footer>
        )}

        {/* Floating exit fullscreen button for demo recording */}
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow-2xl transition-all cursor-pointer opacity-30 hover:opacity-100"
            title="Exit standalone mode to view system blueprint"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Show Blueprint</span>
          </button>
        )}

      </main>

    </div>
  );
}
