import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Grid, 
  List, 
  ChevronDown 
} from 'lucide-react';
import { OpportunityItem } from '../types';

interface SavedOpportunitiesViewProps {
  savedOpportunities: OpportunityItem[];
  onRemove: (id: string) => void;
  onSelect: (opp: OpportunityItem) => void;
  onNavigate: (view: any) => void;
}

type ApplicationStatus = 'Not Started' | 'In Progress' | 'Submitted';

export default function SavedOpportunitiesView({
  savedOpportunities,
  onRemove,
  onSelect,
  onNavigate
}: SavedOpportunitiesViewProps) {
  
  // Track status state in memory for each opportunity item
  const [statuses, setStatuses] = useState<Record<string, ApplicationStatus>>(() => {
    const initialStatuses: Record<string, ApplicationStatus> = {};
    savedOpportunities.forEach(opp => {
      // distribute statuses deterministically
      if (opp.id === 'sch-1' || opp.id === 'hack-1') {
        initialStatuses[opp.id] = 'In Progress';
      } else if (opp.id === 'sch-3') {
        initialStatuses[opp.id] = 'Submitted';
      } else {
        initialStatuses[opp.id] = 'Not Started';
      }
    });
    return initialStatuses;
  });

  const changeStatus = (id: string, newStatus: ApplicationStatus) => {
    setStatuses(prev => ({ ...prev, [id]: newStatus }));
  };

  const getStatusStyle = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-[#10B981] border-emerald-500/30 dark:border-[#10B981]/30';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30 dark:border-[#3B82F6]/30';
      default:
        return 'bg-zinc-100 dark:bg-[#0B0F19] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800';
    }
  };

  // calculate dummy countdowns
  const getCountdown = (deadline: string) => {
    const diffDays = Math.max(1, Math.round((new Date(deadline).getTime() - new Date('2026-06-30').getTime()) / (1000 * 3600 * 24)));
    if (diffDays <= 7) {
      return { text: `${diffDays} days left`, urgent: true };
    }
    return { text: `${diffDays} days remaining`, urgent: false };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans text-zinc-900 dark:text-[#F9FAFB] bg-transparent">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-850 pb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500/10" />
            <span>My Bookmarked Application Pipeline</span>
          </h2>
          <p className="text-xs text-zinc-550 dark:text-[#9CA3AF] mt-1">Track milestones and maintain status records for targeted scholarships and fellowships.</p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-zinc-100 dark:bg-[#111827] rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 self-start sm:self-auto">
          {savedOpportunities.length} Saved Programs
        </span>
      </div>

      {savedOpportunities.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#1F2937] border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl max-w-xl mx-auto space-y-4 shadow-sm transition-colors">
          <Bookmark className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-300">Your bookmark folder is empty</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-550 mt-1 max-w-md mx-auto">
              Browse through Scholarships, Hackathons, or Internships, and click the Save button to populate your application pipeline.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('Scholarships')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#3B82F6] dark:hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
          >
            Explore Directory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedOpportunities.map((opp, idx) => {
            const status = statuses[opp.id] || 'Not Started';
            const countdown = getCountdown(opp.deadline);
            const readiness = idx === 0 ? 88 : idx === 1 ? 75 : idx === 2 ? 60 : 45;

            return (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:border-blue-500/30 dark:hover:border-[#3B82F6]/30 hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
              >
                
                {/* Details Column */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-500/10 dark:bg-[#3B82F6]/10 text-blue-600 dark:text-blue-300 rounded border border-blue-500/25 dark:border-[#3B82F6]/25">
                      {opp.category}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                      • {opp.location}
                    </span>
                  </div>

                  <div>
                    <h3 
                      onClick={() => onSelect(opp)}
                      className="text-sm font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors leading-snug cursor-pointer"
                    >
                      {opp.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-[#9CA3AF] mt-0.5">{opp.org}</p>
                  </div>

                  {/* Countdown Warning */}
                  <div className="flex items-center gap-2 text-[11px] font-mono pt-1">
                    <Clock className={`w-3.5 h-3.5 ${countdown.urgent ? 'text-red-500 animate-pulse' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <span className={countdown.urgent ? 'text-red-600 dark:text-red-400 font-bold' : 'text-zinc-500 dark:text-[#9CA3AF] font-medium'}>
                      Deadline: {opp.deadline} ({countdown.text})
                    </span>
                  </div>
                </div>

                {/* Score indicators */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 min-w-[75px]">
                    <span className="text-[9px] text-emerald-600 dark:text-[#10B981] font-bold block uppercase tracking-wider leading-none">Match</span>
                    <span className="text-xs font-bold font-mono text-emerald-600 dark:text-[#10B981] mt-1.5 block">{opp.matchScore}%</span>
                  </div>
                  <div className="text-center px-3 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 min-w-[75px]">
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold block uppercase tracking-wider leading-none">Ready</span>
                    <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 mt-1.5 block">{readiness}%</span>
                  </div>
                </div>

                {/* Status custom selector */}
                <div className="shrink-0 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 dark:text-zinc-500 block">
                    Application Status
                  </span>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => changeStatus(opp.id, e.target.value as ApplicationStatus)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors outline-none cursor-pointer pr-8 appearance-none min-w-[130px] bg-white dark:bg-[#1F2937] ${getStatusStyle(status)}`}
                    >
                      <option value="Not Started" className="bg-white dark:bg-[#1F2937] text-zinc-800 dark:text-zinc-200">Not Started</option>
                      <option value="In Progress" className="bg-white dark:bg-[#1F2937] text-zinc-800 dark:text-zinc-200">In Progress</option>
                      <option value="Submitted" className="bg-white dark:bg-[#1F2937] text-zinc-800 dark:text-zinc-200">Submitted</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Quick actions panel */}
                <div className="flex items-center gap-2 shrink-0 border-t border-zinc-100 dark:border-zinc-800/80 md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => onSelect(opp)}
                    className="px-3 py-2 text-zinc-650 hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0B0F19] dark:hover:bg-[#111827] rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 shadow-xs"
                    title="Open details"
                  >
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => onNavigate('AI Advisor')}
                    className="p-2 text-purple-600 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-150 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/25 dark:border-[#8B5CF6]/25 transition-colors cursor-pointer"
                    title="Talk with AI Coach"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemove(opp.id)}
                    className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/25 dark:border-red-500/25 transition-colors cursor-pointer"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
}
