import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Award, 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Bookmark, 
  Share2, 
  ExternalLink,
  MessageSquare,
  Check,
  Calendar,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { OpportunityItem } from '../types';

interface OpportunityDetailsViewProps {
  opportunity: OpportunityItem;
  onBack: () => void;
  onSave: (id: string) => void;
  isSaved: boolean;
  onToggleCompare: (id: string) => void;
  isCompared: boolean;
  onNavigate: (view: any) => void;
  profile?: any;
}

export default function OpportunityDetailsView({
  opportunity,
  onBack,
  onSave,
  isSaved,
  onToggleCompare,
  isCompared,
  onNavigate,
  profile
}: OpportunityDetailsViewProps) {
  
  // Calculate mock values based on opportunity properties
  const readiness = 78; // mock readiness
  const matchReasons = opportunity.matchReasons || [
    'Academic GPA aligns with threshold specs.',
    'Technical skillset overlaps with project descriptions.'
  ];
  const improvementTips = opportunity.improvementTips || [
    'Finalize portfolio project documentation on GitHub.',
    'Formulate leadership statements highlighting outreach.'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-sans text-[#F9FAFB] bg-[#0B0F19]">
      
      {/* Back navigation */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-100 transition-colors bg-[#1F2937] border border-zinc-800/80 px-3.5 py-2 rounded-xl cursor-pointer shadow-md"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#3B82F6]" />
        <span>Back to Directory</span>
      </button>

      {/* Main Hero Header Card */}
      <div className="bg-gradient-to-br from-[#111827] via-[#1F2937] to-indigo-950/30 text-white rounded-2xl p-6 md:p-8 border border-zinc-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3B82F6]/10 text-blue-300 rounded-full text-xs font-mono border border-[#3B82F6]/25">
              {opportunity.category}
            </div>
            
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-snug">
              {opportunity.title}
            </h1>
            <p className="text-[#9CA3AF] font-medium text-sm">{opportunity.org} • {opportunity.location}</p>

            <div className="flex flex-wrap gap-3 pt-3 text-xs font-mono text-zinc-350">
              <div className="flex items-center gap-1.5 bg-[#0B0F19]/65 border border-zinc-800 px-3 py-1 rounded-xl">
                <DollarSign className="w-4 h-4 text-[#10B981]" />
                <span>Value: {opportunity.awardOrStipend}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0B0F19]/65 border border-zinc-800 px-3 py-1 rounded-xl">
                <Calendar className="w-4 h-4 text-red-400" />
                <span>Deadline: {opportunity.deadline}</span>
              </div>
            </div>
          </div>

          {/* Double Scores */}
          <div className="flex gap-3 bg-[#0B0F19]/85 p-4 rounded-xl border border-zinc-800/85 shrink-0 self-start md:self-auto shadow-inner">
            <div className="text-center min-w-[76px]">
              <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider block">Match</span>
              <span className="text-xl font-bold font-mono text-[#10B981] mt-1 block">{opportunity.matchScore}%</span>
            </div>
            <div className="w-px bg-zinc-800" />
            <div className="text-center min-w-[76px]">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">Readiness</span>
              <span className="text-xl font-bold font-mono text-blue-400 mt-1 block">{readiness}%</span>
            </div>
          </div>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-zinc-800/60 relative z-10">
          <button
            onClick={() => onSave(opportunity.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isSaved 
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                : 'bg-[#0B0F19] text-zinc-100 hover:bg-zinc-800/60 border border-zinc-800/80'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-300' : ''}`} />
            <span>{isSaved ? 'Opportunity Saved' : 'Save Opportunity'}</span>
          </button>

          <button
            onClick={() => onToggleCompare(opportunity.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isCompared 
                ? 'bg-[#3B82F6] text-white' 
                : 'bg-[#0B0F19] text-zinc-150 hover:bg-zinc-800/60 border border-zinc-800/80'
            }`}
          >
            <Plus className={`w-4 h-4 ${isCompared ? 'rotate-45' : ''}`} />
            <span>{isCompared ? 'Comparing' : 'Compare Program'}</span>
          </button>

          <button
            onClick={() => onNavigate('AI Advisor')}
            className="px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ml-auto shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuss with AI Advisor</span>
          </button>
        </div>
      </div>

      {/* Grid Content Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Details, Requirements, Application Steps */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Overview */}
          <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md space-y-3">
            <h3 className="text-sm font-bold text-white">Program Overview & Benefits</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              This elite {opportunity.category.toLowerCase()} program is designed specifically to support high-potential students in the technical discipline. Beyond the financial award of <strong className="text-zinc-200">{opportunity.awardOrStipend}</strong>, recipients receive structured corporate mentorship, exclusive networking passes to global conferences, and priority placement pools for top industry roles.
            </p>
            <ul className="text-xs text-[#9CA3AF] space-y-2 pt-2 pl-4 list-disc">
              <li>Direct 1-on-1 mentorship sessions with Principal Engineers.</li>
              <li>Academic textbook stipends and professional cloud credits.</li>
              <li>Peer cohorts spanning 15 universities worldwide.</li>
            </ul>
          </div>

          {/* Eligibility Criteria Checklist */}
          <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              <span>Eligibility & Required Skills Checklist</span>
            </h3>
            
            <div className="space-y-3">
              {[
                { criterion: 'Currently enrolled in an accredited computer science or STEM undergraduate degree', met: true },
                { criterion: `Cumulative academic GPA of 3.50 or higher (Current: ${profile?.gpa ?? 3.85})`, met: (Number(profile?.gpa) || 3.85) >= 3.50 },
                { criterion: 'Proficient in Python and general backend web frameworks (met via technical profile)', met: true },
                { criterion: 'Demonstrated contribution to open-source software, technical writing, or community impact projects', met: false }
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3 bg-[#0B0F19]/60 rounded-xl border border-zinc-800/50">
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    c.met ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {c.met ? '✓' : '!'}
                  </div>
                  <div>
                    <span className="text-xs font-semibold block text-zinc-200">{c.met ? 'Requirement Met' : 'Action Required'}</span>
                    <p className="text-xs text-[#9CA3AF] leading-normal mt-0.5">{c.criterion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Steps Milestones */}
          <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8B5CF6]" />
              <span>Application Execution Steps</span>
            </h3>

            <div className="space-y-3">
              {[
                { step: 'Step 1: Document Upload', desc: 'Sync and update your parsed resume PDF with the ProfileAgent.', done: true },
                { step: 'Step 2: Essay Formulation', desc: 'Draft your personal goals and statement connecting Machine Learning projects.', done: false },
                { step: 'Step 3: Recommendation Requests', desc: 'Request referral letters from your major faculty advisers.', done: false },
                { step: 'Step 4: Final Quality Check', desc: 'Submit dossier and review metrics with OpportunityAI Coach before submitting.', done: false }
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    s.done ? 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/20' : 'bg-zinc-800/60 text-zinc-500 border border-zinc-700/60'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">{s.step}</span>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Coach Advice & Next Actions */}
        <div className="space-y-6">
          
          {/* Match Score Reason Breakdown */}
          <div className="bg-[#1F2937] p-5 rounded-2xl border border-zinc-800/80 shadow-md space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-[#10B981] flex items-center gap-1.5 border-b border-zinc-800/60 pb-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Match Agent Rationale</span>
            </h4>
            <div className="space-y-2">
              {matchReasons.map((reason, i) => (
                <div key={i} className="text-xs text-zinc-300 bg-[#10B981]/5 p-3 rounded-xl border border-[#10B981]/15 leading-relaxed font-medium">
                  {reason}
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Tips (Action Roadmap) */}
          <div className="bg-[#1F2937] p-5 rounded-2xl border border-zinc-800/80 shadow-md space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-purple-400 flex items-center gap-1.5 border-b border-zinc-800/60 pb-2.5">
              <Sparkles className="w-4 h-4 text-purple-450" />
              <span>Actionable AI Advice</span>
            </h4>
            <div className="space-y-2">
              {improvementTips.map((tip, i) => (
                <div key={i} className="text-xs text-zinc-300 bg-[#8B5CF6]/5 p-3 rounded-xl border border-[#8B5CF6]/15 leading-relaxed font-semibold flex items-start gap-2">
                  <span className="text-[#8B5CF6] font-bold">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick External Link */}
          <div className="bg-[#0B0F19] p-4 rounded-2xl border border-zinc-800/80 text-center space-y-2">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Official Application Ingress</span>
            <p className="text-xs text-zinc-400 leading-tight">Clicking the link opens the program sponsor application in a new browser tab.</p>
            <a 
              href={opportunity.official_link || "https://ai.google/research/"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md w-full justify-center mt-1"
            >
              <span>Visit Official Sponsor Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
