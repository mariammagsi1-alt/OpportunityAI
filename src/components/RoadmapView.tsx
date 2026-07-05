import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  GitBranch, 
  Award,
  Plus
} from 'lucide-react';

interface RoadmapViewProps {
  onNavigate: (view: any) => void;
  profile?: any;
}

export default function RoadmapView({ onNavigate, profile }: RoadmapViewProps) {
  
  const phases = [
    {
      phase: 1,
      title: 'Materials Gathering & Parsing Profile',
      status: 'Completed',
      timeframe: 'June 01 - June 15',
      items: [
        { name: 'Upload latest resume PDF to ParseAgent', completed: true },
        { name: `Verify academic major classification and current cumulative GPA (${profile?.gpa ?? 3.85})`, completed: true },
        { name: 'Index core skills metrics', completed: true },
      ]
    },
    {
      phase: 2,
      title: 'Profile Optimization & Portfolio Building',
      status: 'Completed',
      timeframe: 'June 16 - June 30',
      items: [
        { name: 'Integrate active GitHub repository portfolio', completed: true },
        { name: 'Polish PyTorch clinical trial outcome model documentation', completed: true },
        { name: 'Establish English writing benchmark credential', completed: true },
      ]
    },
    {
      phase: 3,
      title: 'Rhetorical Statements & Advisor Critique',
      status: 'In Progress',
      timeframe: 'July 01 - July 20',
      items: [
        { name: 'Draft 500-word statement connecting goals to DeepMind core scholarship parameters', completed: false, aiAdvice: 'Ensure you emphasize leadership impact metrics rather than dry technical terms.' },
        { name: 'Submit statement draft to AI Advisor Critique dashboard', completed: false },
        { name: 'Formulate team credentials for the Agentic Cloud Hackathon', completed: false },
      ]
    },
    {
      phase: 4,
      title: 'Dossier Validation & Pipeline Submission',
      status: 'Upcoming',
      timeframe: 'July 21 - August 15',
      items: [
        { name: 'Conduct high-fidelity practice mock interview simulations', completed: false },
        { name: 'Finalize Faculty Adviser referral letters', completed: false },
        { name: 'Submit completed package matching first cohort requirements', completed: false },
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans text-zinc-900 dark:text-[#F9FAFB] bg-transparent transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-100 via-zinc-200 to-indigo-50 dark:from-[#111827] dark:via-[#1F2937] dark:to-indigo-950/30 p-6 rounded-2xl text-zinc-800 dark:text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm dark:shadow-xl border border-zinc-200 dark:border-zinc-800/80 transition-colors">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-200 dark:bg-[#0B0F19] text-blue-750 dark:text-[#3B82F6] rounded-full text-xs font-mono font-bold border border-zinc-300 dark:border-zinc-800/80">
            <Rocket className="w-3.5 h-3.5 text-blue-600 dark:text-[#3B82F6]" />
            <span>Preparation Roadmap Active</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Your Career Milestone Schedule</h2>
          <p className="text-xs text-zinc-550 dark:text-[#9CA3AF] max-w-xl leading-relaxed">
            The multi-agent coordinator mapped out this step-by-step roadmap relative to your target closing deadlines. Keeping items checked maintains a healthy <strong>Readiness Score</strong>.
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('AI Advisor')}
          className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 dark:bg-[#3B82F6] dark:hover:bg-blue-600 rounded-xl font-bold text-xs shrink-0 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Formulate Custom Plan</span>
        </button>
      </div>

      {/* Progress metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Completed Milestones', val: '6 of 12', desc: '50% track completed' },
          { label: 'Active Phase', val: 'Phase 3', desc: 'Statement Formulation' },
          { label: 'Days to Next Closing', val: '5 Days', desc: 'AnitaB Achievers Grant' },
        ].map((met, i) => (
          <div key={i} className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-colors">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 dark:text-zinc-500 block">{met.label}</span>
            <span className="text-lg font-black font-mono text-zinc-900 dark:text-zinc-100 mt-1.5 block">{met.val}</span>
            <span className="text-xs text-zinc-500 dark:text-[#9CA3AF] mt-1 block">{met.desc}</span>
          </div>
        ))}
      </div>

      {/* Vertical connected timeline */}
      <div className="space-y-8 relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800/60 py-3 mt-4">
        
        {phases.map((ph) => {
          const isActive = ph.status === 'In Progress';
          const isDone = ph.status === 'Completed';

          return (
            <div key={ph.phase} className="relative">
              
              {/* Connected node dot */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-zinc-50 dark:border-[#0B0F19] shadow-sm transition-all ${
                isDone ? 'bg-[#10B981]' : isActive ? 'bg-blue-600 dark:bg-[#3B82F6] animate-pulse' : 'bg-zinc-300 dark:bg-zinc-800'
              }`} />

              <div className="space-y-3">
                {/* Title block */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 dark:text-zinc-500">
                      Phase {ph.phase} • {ph.timeframe}
                    </span>
                    <h3 className="text-sm md:text-base font-extrabold text-zinc-855 dark:text-zinc-100 mt-0.5">{ph.title}</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
                    isDone 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#10B981] border-emerald-500/25 dark:border-[#10B981]/25' 
                      : isActive 
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/25 dark:border-[#3B82F6]/25 animate-pulse' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700/60'
                  }`}>
                    {ph.status}
                  </span>
                </div>

                {/* Sub-items list */}
                <div className="grid grid-cols-1 gap-2.5">
                  {ph.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                        item.completed 
                          ? 'bg-zinc-100/40 dark:bg-[#1F2937]/40 border-zinc-200 dark:border-zinc-900/60 text-zinc-400 dark:text-zinc-500' 
                          : 'bg-white dark:bg-[#1F2937] border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:border-blue-500/30 dark:hover:border-[#3B82F6]/30 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 shrink-0 w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-colors ${
                          item.completed 
                            ? 'bg-[#10B981] border-[#10B981] text-white' 
                            : 'border-zinc-300 dark:border-zinc-700'
                        }`}>
                          {item.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white fill-[#10B981]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-semibold block leading-snug ${item.completed ? 'line-through text-zinc-400 dark:text-zinc-550' : 'text-zinc-800 dark:text-zinc-200'}`}>
                            {item.name}
                          </span>
                          
                          {/* AI guidance bubble */}
                          {item.aiAdvice && (
                            <div className="mt-2 text-[11px] bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 p-2.5 rounded-xl flex items-start gap-1.5 font-medium leading-normal">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-[#8B5CF6] mt-0.5 shrink-0" />
                              <p>Advisor Agent Note: {item.aiAdvice}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
