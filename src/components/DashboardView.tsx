import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Award, 
  Clock, 
  Plus, 
  Check, 
  ChevronRight, 
  Bookmark, 
  Share2, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  User, 
  MessageSquare, 
  Flame, 
  CheckSquare, 
  FileText, 
  Activity, 
  FileCode, 
  ChevronDown, 
  Lightbulb,
  ShieldCheck,
  Zap,
  Bell,
  ArrowRight,
  Sparkle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';
import { OpportunityItem } from '../types';

interface DashboardViewProps {
  opportunities: OpportunityItem[];
  onNavigate: (view: any) => void;
  onSelectOpportunity: (opp: OpportunityItem) => void;
  onSaveOpportunity: (id: string) => void;
  savedIds: string[];
  comparedIds: string[];
  onToggleCompare: (id: string) => void;
  notifications: any[];
  onClearNotification: (id: string) => void;
  profile?: any;
}

// Predictor skill item type
interface PredictorSkill {
  id: string;
  name: string;
  boost: number;
  category: string;
  checked: boolean;
}

export default function DashboardView({
  opportunities,
  onNavigate,
  onSelectOpportunity,
  onSaveOpportunity,
  savedIds,
  comparedIds,
  onToggleCompare,
  notifications,
  onClearNotification,
  profile
}: DashboardViewProps) {
  // Simulator state
  const [skills, setSkills] = useState<PredictorSkill[]>([
    { id: 'react', name: 'Learn React & Vite', boost: 6, category: 'Frontend', checked: false },
    { id: 'portfolio', name: 'Build 2 Full-Stack Projects', boost: 8, category: 'Engineering', checked: false },
    { id: 'english', name: 'Polish English Statement', boost: 4, category: 'Communication', checked: false },
    { id: 'aws', name: 'Earn AWS Cloud Certificate', boost: 9, category: 'DevOps', checked: false },
    { id: 'github', name: 'Publish & Document Repos', boost: 5, category: 'Open Source', checked: false },
  ]);

  const baseMatch = 72;
  const currentBoost = skills.filter(s => s.checked).reduce((acc, curr) => acc + curr.boost, 0);
  const predictedMatch = baseMatch + currentBoost;

  // Radar chart data for student competencies
  const skillsData = [
    { subject: 'AI Models', A: 85, B: 95, fullMark: 100 },
    { subject: 'Data Science', A: 78, B: 90, fullMark: 100 },
    { subject: 'React Frontend', A: 60, B: 95, fullMark: 100 },
    { subject: 'System Architecture', A: 70, B: 85, fullMark: 100 },
    { subject: 'API Engineering', A: 88, B: 92, fullMark: 100 },
    { subject: 'Tech Writing', A: 65, B: 85, fullMark: 100 },
  ];

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  // Static deadlines list (mocked from upcoming closing dates)
  const deadlines = [
    { id: 'sch-2', name: 'Women Tech Achievers Grant', org: 'AnitaB.org', days: 5, priority: 'high', date: 'Jul 05' },
    { id: 'hack-1', name: 'Agentic AI Studio Hackathon', org: 'Google Cloud & DeepMind', days: 19, priority: 'medium', date: 'Jul 20' },
    { id: 'sch-1', name: 'DeepMind Future Leaders', org: 'Google DeepMind Foundation', days: 45, priority: 'low', date: 'Aug 15' },
  ];

  // Roadmap phases (mock summary)
  const roadmapSteps = [
    { id: 1, title: 'Materials Collection', completed: true, desc: 'GPA verification and transcript loading.' },
    { id: 2, title: 'Skills Validation', completed: true, desc: 'GitHub sync and technical quiz passing.' },
    { id: 3, title: 'Advisor Consultation', completed: true, desc: 'Completed initial mentoring overview.' },
    { id: 4, title: 'Essay Formulation', completed: false, desc: 'Draft personal statements and critiques.' },
    { id: 5, title: 'Submit First Application', completed: false, desc: 'Verify eligibility checklist with sponsor.' },
  ];

  const totalSteps = roadmapSteps.length;
  const completedSteps = roadmapSteps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  // Animated counters simulation
  const [matchCounter, setMatchCounter] = useState(0);
  const [readinessCounter, setReadinessCounter] = useState(0);
  const [resumeCounter, setResumeCounter] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setMatchCounter(94), 200);
    const timer2 = setTimeout(() => setReadinessCounter(78), 300);
    const timer3 = setTimeout(() => setResumeCounter(85), 400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans text-zinc-900 dark:text-[#F9FAFB] bg-transparent transition-colors duration-200">
      
      {/* 1. Welcome Header (Aesthetic and Spacious) */}
      <div className="bg-gradient-to-br from-zinc-100 via-zinc-200 to-blue-100/10 dark:from-[#111827] dark:via-[#1F2937] dark:to-blue-950/20 text-zinc-900 dark:text-white rounded-2xl p-6 relative overflow-hidden border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-xl transition-colors duration-200">
        {/* Subtle decorative background gradient sparks */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-10 left-20 w-60 h-60 bg-[#10B981]/10 rounded-full blur-2xl -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 dark:bg-[#3B82F6]/10 text-blue-600 dark:text-blue-300 rounded-full text-xs font-mono border border-blue-500/20">
              <Sparkle className="w-3 h-3 text-blue-600 dark:text-[#3B82F6] animate-pulse" />
              <span>Multi-Agent System Synced</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Hello, {profile?.name || "Alex Chen"}! 👋
            </h1>
            <p className="text-zinc-650 dark:text-[#9CA3AF] text-sm leading-relaxed">
              Your primary career path is aligned with <span className="text-blue-600 dark:text-[#3B82F6] font-semibold">{profile?.major || "Machine Learning & AI Engineering"}</span>.
              Today, you have <span className="text-zinc-900 dark:text-white font-bold underline decoration-[#3B82F6]">5 high-fit opportunities</span> with closing deadlines. Use the simulator below to boost your scores!
            </p>
          </div>
          
          {/* AI Advisor Tip Widget */}
          <div className="bg-white/80 dark:bg-[#0B0F19]/80 p-4.5 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 max-w-md shrink-0 flex items-start gap-3 shadow-sm dark:shadow-md transition-colors duration-200">
            <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-[#8B5CF6] rounded-xl border border-purple-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-purple-600 dark:text-[#8B5CF6] block mb-0.5">
                Today's Advisor Tip of the Day
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                "Adding a robust README to your PyTorch trial repository can increase your <strong>Readiness Score</strong> by up to <strong>15%</strong> for elite fellowships."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Statistics Bento Grid (Visually Consistent/Uniform) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { 
            label: 'Match Score', 
            val: `${matchCounter}%`, 
            sub: 'Ideal Academic Fit', 
            icon: <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-[#10B981]" />
          },
          { 
            label: 'Readiness Score', 
            val: `${readinessCounter}%`, 
            sub: 'Materials Completed', 
            icon: <ShieldCheck className="w-5 h-5 text-blue-500 dark:text-[#3B82F6]" />
          },
          { 
            label: 'Resume Score', 
            val: `${resumeCounter}/100`, 
            sub: 'AI Parser Rating', 
            icon: <FileText className="w-5 h-5 text-purple-500 dark:text-[#8B5CF6]" />
          },
          { 
            label: 'Profile Comp.', 
            val: `${profile?.completionRate || 100}%`, 
            sub: 'Data Authenticated', 
            icon: <User className="w-5 h-5 text-amber-500" />
          },
          { 
            label: 'Saved Programs', 
            val: `${savedIds.length}`, 
            sub: 'Active Pipeline', 
            icon: <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500/10" />
          },
          { 
            label: 'Deadlines (30d)', 
            val: '2', 
            sub: 'Critical Warnings', 
            icon: <Clock className="w-5 h-5 text-red-500" />
          },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4.5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between h-32 bg-white dark:bg-[#1F2937]/90 hover:scale-[1.02] hover:bg-zinc-100 dark:hover:bg-[#1F2937] hover:border-zinc-300 dark:hover:border-zinc-750 transition-all duration-200 shadow-sm dark:shadow-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 dark:text-[#9CA3AF] font-bold uppercase font-mono">{stat.label}</span>
              <div className="p-1.5 rounded-xl bg-zinc-50 dark:bg-[#0B0F19]/60 border border-zinc-200 dark:border-zinc-800/50">
                {stat.icon}
              </div>
            </div>
            <div className="space-y-0.5 mt-2">
              <span className="text-2xl font-bold font-mono tracking-tight block text-zinc-900 dark:text-[#F9FAFB]">{stat.val}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-medium truncate">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2): Top Recommendations & Interactive Predictor */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3. Top Recommended Opportunities (5 high-fit cards) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>Top Recommended Programs for You</span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-[#9CA3AF]">Ranked dynamically by the Match and Profile analysis agents.</p>
              </div>
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 font-bold bg-zinc-100 dark:bg-[#1F2937] border border-zinc-200 dark:border-zinc-850 px-3 py-1 rounded-full shadow-sm">5 Matched</span>
            </div>

            <div className="space-y-3">
              {opportunities.slice(0, 5).map((opp, idx) => {
                const isSaved = savedIds.includes(opp.id);
                const isCompared = comparedIds.includes(opp.id);
                // Assign a dummy mock readiness score based on indexing
                const readiness = idx === 0 ? 88 : idx === 1 ? 75 : idx === 2 ? 60 : idx === 3 ? 45 : 30;

                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-4.5 bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-500/50 dark:hover:border-[#3B82F6]/60 rounded-2xl transition-all duration-200 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                  >
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-blue-500/10 dark:bg-[#3B82F6]/10 text-blue-600 dark:text-blue-300 font-bold rounded-full border border-blue-500/20 dark:border-blue-500/20">
                          {opp.category}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-zinc-450 dark:text-zinc-500 flex items-center gap-1">
                          • {opp.location}
                        </span>
                      </div>
                      
                      <div>
                        <h3 
                          onClick={() => onSelectOpportunity(opp)}
                          className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors leading-snug cursor-pointer"
                        >
                          {opp.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-[#9CA3AF] font-medium">{opp.org}</p>
                      </div>

                      {/* Display deadlines and stipend */}
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-[#9CA3AF] font-mono">
                        <span className="text-emerald-600 dark:text-[#10B981] font-semibold">{opp.awardOrStipend}</span>
                        <span>•</span>
                        <span className="text-rose-500 dark:text-red-400 font-semibold">Due: {opp.deadline}</span>
                      </div>
                    </div>

                    {/* Score Badges - Visual Difference Explanation */}
                    <div className="flex items-center gap-3 shrink-0">
                      
                      {/* Match Score */}
                      <div className="text-center px-3 py-1.5 bg-emerald-500/10 dark:bg-[#10B981]/10 rounded-xl border border-emerald-500/20 dark:border-[#10B981]/20 min-w-[75px] shadow-sm">
                        <span className="text-[9px] text-emerald-600 dark:text-[#10B981] font-bold block uppercase tracking-wider leading-none">Match</span>
                        <span className="text-sm font-bold font-mono text-emerald-600 dark:text-[#10B981] mt-1 block">{opp.matchScore}%</span>
                      </div>

                      {/* Readiness Score */}
                      <div className="text-center px-3 py-1.5 bg-blue-500/10 dark:bg-[#3B82F6]/10 rounded-xl border border-blue-500/20 dark:border-[#3B82F6]/20 min-w-[75px] shadow-sm">
                        <span className="text-[9px] text-blue-600 dark:text-[#3B82F6] font-bold block uppercase tracking-wider leading-none">Ready</span>
                        <span className="text-sm font-bold font-mono text-blue-600 dark:text-[#3B82F6] mt-1 block">{readiness}%</span>
                      </div>

                    </div>

                    {/* Small Quick Action Panel */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => onSaveOpportunity(opp.id)}
                        className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSaved 
                            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/35' 
                            : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0B0F19] text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-750 dark:hover:text-zinc-200 dark:hover:border-zinc-700'
                        }`}
                        title={isSaved ? "Remove from Saved" : "Save Opportunity"}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => onToggleCompare(opp.id)}
                        className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isCompared 
                            ? 'bg-[#3B82F6] text-white border-blue-400 shadow-md shadow-blue-500/20' 
                            : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0B0F19] text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-750 dark:hover:text-zinc-200 dark:hover:border-zinc-700'
                        }`}
                        title={isCompared ? "Compared" : "Add to Compare"}
                      >
                        <Plus className={`w-4 h-4 ${isCompared ? 'rotate-45' : ''}`} />
                      </button>

                      <button
                        onClick={() => onNavigate('AI Advisor')}
                        className="p-2 bg-purple-500/10 text-purple-600 dark:text-[#8B5CF6] hover:bg-purple-500/20 dark:hover:bg-[#8B5CF6]/20 border border-purple-500/20 dark:border-[#8B5CF6]/20 rounded-xl transition-all duration-200 cursor-pointer"
                        title="Discuss with AI Advisor"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 4. AI Opportunity Predictor (Interactive Sandbox Simulation) */}
          <div className="bg-gradient-to-br from-zinc-50 via-zinc-100 to-indigo-100/10 dark:from-[#111827] dark:via-[#1F2937] dark:to-indigo-950/30 text-zinc-900 dark:text-white p-6 rounded-2xl border border-zinc-200 dark:border-indigo-900/40 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors duration-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl -z-10" />
            
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
              
              {/* Controls and description */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-semibold">
                    <Zap className="w-3 h-3 text-[#3B82F6] fill-[#3B82F6]" />
                    <span>Score Impact Simulation Sandbox</span>
                  </div>
                  <h3 className="text-lg font-bold mt-1.5">AI Opportunity Predictor</h3>
                  <p className="text-xs text-zinc-500 dark:text-[#9CA3AF] mt-1 leading-relaxed">
                    Check potential milestones or credentials below to simulate how adding these capabilities would boost your eligibility match scores instantly!
                  </p>
                </div>

                {/* Checklist options */}
                <div className="space-y-2 pt-1">
                  {skills.map((skill) => (
                    <div 
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer select-none transition-all duration-200 ${
                        skill.checked 
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-900 dark:text-white font-medium shadow-xs' 
                          : 'bg-zinc-100/60 dark:bg-[#0B0F19]/60 border-zinc-200 dark:border-zinc-800/80 text-zinc-600 dark:text-[#9CA3AF] hover:bg-zinc-200/50 dark:hover:bg-[#0B0F19] hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          skill.checked 
                            ? 'bg-indigo-500 border-indigo-400 text-white' 
                            : 'border-zinc-300 dark:border-zinc-700'
                        }`}>
                          {skill.checked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-xs leading-none">{skill.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300 font-bold">
                        +{skill.boost}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualized Score Change Indicator */}
              <div className="w-full md:w-64 shrink-0 bg-zinc-100/80 dark:bg-[#0B0F19]/80 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 flex flex-col items-center justify-center text-center space-y-5 shadow-inner transition-colors">
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-700 dark:text-indigo-300 font-bold">
                  Simulated Outcome
                </span>

                <div className="relative w-32 h-32 flex items-center justify-center">
                  
                  {/* Overlapping progress arcs */}
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background ring */}
                    <circle cx="64" cy="64" r="54" stroke="rgba(0,0,0,0.03)" strokeWidth="8" fill="transparent" className="dark:stroke-white/5" />
                    
                    {/* Current base Match */}
                    <circle 
                      cx="64" cy="64" r="54" 
                      stroke="#3B82F6" strokeWidth="8" fill="transparent" 
                      strokeDasharray="339.29" 
                      strokeDashoffset={339.29 - (339.29 * baseMatch) / 100}
                    />
                    
                    {/* Simulated addition */}
                    <circle 
                      cx="64" cy="64" r="54" 
                      stroke="#10B981" strokeWidth="8" fill="transparent" 
                      strokeDasharray="339.29" 
                      strokeDashoffset={339.29 - (339.29 * Math.min(predictedMatch, 100)) / 100}
                      className="transition-all duration-300"
                    />
                  </svg>
                  
                  {/* Inner Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-mono tracking-tight text-zinc-900 dark:text-white leading-none">
                      {predictedMatch}%
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-wide text-indigo-700 dark:text-indigo-200 mt-1 font-semibold">
                      Predicted
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-500 dark:text-[#9CA3AF]">
                    <span>Current Fit Level:</span>
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{baseMatch}%</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-[#10B981] font-semibold">
                    <span>Net Improvement:</span>
                    <span className="font-mono">+{currentBoost}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('AI Advisor')}
                  className="w-full py-2 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                >
                  <span>Build Structured Study Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (Span 1): Deadlines, Roadmap, Alerts, AI Coach */}
        <div className="space-y-6">

          {/* 7. Notification Center Popover Summary */}
          <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-lg space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/60 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600 dark:text-[#3B82F6]" />
                <span>Recent Career Notifications</span>
              </h3>
              <span className="text-[10px] font-mono bg-blue-500/10 dark:bg-[#3B82F6]/10 text-blue-600 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/20 dark:border-[#3B82F6]/20">
                {notifications.length} Unread
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <AnimatePresence>
                {notifications.slice(0, 4).map((notif) => (
                  <motion.div
                    key={notif.id}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-zinc-50 dark:bg-[#0B0F19]/80 rounded-xl border border-zinc-200 dark:border-zinc-800/60 flex items-start gap-2.5 relative group hover:border-blue-500/50 dark:hover:border-[#3B82F6]/40 transition-all duration-200"
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.type === 'alert' && <AlertCircle className="w-3.5 h-3.5 text-red-555" />}
                      {notif.type === 'scholarship' && <Award className="w-3.5 h-3.5 text-amber-500" />}
                      {notif.type === 'milestone' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#10B981]" />}
                      {notif.type === 'action' && <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-[#8B5CF6]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-normal">{notif.text}</p>
                      <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 block mt-1">{notif.time}</span>
                    </div>
                    <button
                      onClick={() => onClearNotification(notif.id)}
                      className="absolute right-1 top-1 p-1 text-zinc-450 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300 hidden group-hover:block transition-colors"
                      title="Clear notification"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 5. Upcoming Deadlines Timeline */}
          <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-lg space-y-4 transition-colors duration-200">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500 dark:text-red-400" />
                <span>Upcoming Critical Deadlines</span>
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-[#9CA3AF] font-medium">Milestone timeline mapped relative to today.</p>
            </div>

            <div className="space-y-4 relative pl-3.5 border-l-2 border-zinc-200 dark:border-zinc-800/80 py-1.5">
              {deadlines.map((dl) => (
                <div key={dl.id} className="relative">
                  {/* Timeline point indicator */}
                  <div className={`absolute -left-[21.5px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1F2937] ${
                    dl.priority === 'high' ? 'bg-red-500' : dl.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500 dark:bg-[#3B82F6]'
                  }`} />
                  
                  <div className="flex items-start justify-between gap-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-snug">{dl.name}</h4>
                      <p className="text-[10px] text-zinc-500 dark:text-[#9CA3AF]">{dl.org}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                        dl.priority === 'high' ? 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20' : dl.priority === 'medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20 dark:border-[#3B82F6]/20'
                      }`}>
                        In {dl.days} days
                      </span>
                      <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block mt-1">{dl.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Roadmap Progress */}
          <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-lg space-y-4 transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500 dark:text-[#10B981]" />
                  <span>Your Readiness Roadmap</span>
                </h3>
                <p className="text-[11px] text-zinc-550 dark:text-[#9CA3AF] font-medium">Phase 1 & 2 Completed Successfully</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#10B981]">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-zinc-100 dark:bg-[#0B0F19] h-2 rounded-full overflow-hidden border border-zinc-250 dark:border-zinc-800/40">
                <div 
                  className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span>{completedSteps} / {totalSteps} Milestones</span>
                <span>Next up: Draft statements</span>
              </div>
            </div>

            {/* Current/Next steps summary */}
            <div className="space-y-2">
              {roadmapSteps.slice(2, 5).map((step) => (
                <div key={step.id} className="flex items-start gap-2.5 text-xs">
                  <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border ${
                    step.completed ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#10B981] border-emerald-500/20 dark:border-[#10B981]/25' : 'bg-zinc-150/40 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700/60'
                  }`}>
                    {step.completed ? '✓' : step.id}
                  </div>
                  <div>
                    <span className={`font-bold block ${step.completed ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      {step.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-[#9CA3AF] leading-tight block">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('My Roadmap')}
              className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0B0F19] dark:hover:bg-[#0B0F19]/60 text-zinc-700 dark:text-zinc-200 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Explore My Full Timeline</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 8. AI Coach Card (Large Motivational Panel with Optional Highlight Purple) */}
          <div className="bg-gradient-to-br from-purple-600/85 via-indigo-950 to-[#0B0F19]/40 dark:from-[#8B5CF6]/85 dark:via-indigo-950 dark:to-[#0B0F19]/40 text-white p-5 rounded-2xl border border-purple-300/25 dark:border-purple-800/40 shadow-xl relative overflow-hidden transition-all duration-200">
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#8B5CF6]/15 rounded-full blur-2xl" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-550/20 flex items-center justify-center text-purple-300 border border-purple-400/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold tracking-tight text-white">AI Advisor Coach</span>
                    <span className="text-[9px] font-mono text-purple-300 block">Dossier Recommendation</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] text-[10px] font-mono font-bold rounded border border-[#10B981]/20">
                  Ready
                </span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">Today's Directive</span>
                  <p className="text-xs font-semibold leading-relaxed mt-0.5 text-zinc-100">
                    "Leverage your PyTorch clinical trial repository as your primary showcase."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-800/40">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-purple-400 font-bold">Estimated Boost</span>
                    <span className="text-xs font-bold font-mono text-[#10B981] block mt-0.5">+15% Readiness</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono text-purple-400 font-bold">Suggested Action</span>
                    <span className="text-xs font-bold text-zinc-200 block mt-0.5 truncate">Draft Personal statement</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('AI Advisor')}
                className="w-full py-2.5 bg-[#8B5CF6] hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-200" />
                <span>Open AI Advisor Mentorship Chat</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Skills Radar Graph section for visual fidelity in bento styling */}
      <div className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-lg transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/60 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-[#3B82F6]" />
              <span>Skill Competency vs. Prerequisite Gap Analysis</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-[#9CA3AF]">Evaluates current validated capabilities vs standard criteria for advanced scholarship cohorts.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-300">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#3B82F6]" /> Your Level</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#10B981]" /> Targeted Cohort</span>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
              <PolarGrid stroke="#71717a" strokeWidth={0.5} opacity={0.3} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 11, fontWeight: 500 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} />
              <Radar name={profile?.name || "Alex Chen"} dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2.5} />
              <Radar name="Target Prerequisite" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={1.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
