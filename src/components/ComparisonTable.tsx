import React from 'react';
import { MOCK_OPPORTUNITIES } from '../data/blueprintData';
import { OpportunityItem } from '../types';
import { Columns, Calendar, DollarSign, Clock, Sparkles, CheckCircle2, X, Plus, MapPin, Award } from 'lucide-react';

interface ComparisonTableProps {
  comparedIds: string[];
  onToggleCompare: (id: string) => void;
  onExplain?: (item: OpportunityItem) => void;
  onAddMore?: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparedIds,
  onToggleCompare,
  onExplain,
  onAddMore
}) => {
  const comparedOpportunities = comparedIds
    .map(id => MOCK_OPPORTUNITIES.find(o => o.id === id))
    .filter((o): o is OpportunityItem => Boolean(o));

  return (
    <div className="space-y-6 font-sans text-[#F9FAFB] bg-[#0B0F19]">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1F2937] to-indigo-950/20 border border-zinc-800/80 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-[#3B82F6] text-white rounded-xl shadow-md shrink-0">
            <Columns className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Side-by-Side Opportunity Decision Matrix</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-blue-300 border border-[#3B82F6]/25 font-bold">
                {comparedOpportunities.length} / 4 Comparing
              </span>
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed max-w-xl">
              Compare match scores, stipends, prerequisites, and AI improvement recommendations simultaneously. Add or remove cards across scholarships, internships, and hackathons.
            </p>
          </div>
        </div>

        {onAddMore && (
          <button
            onClick={onAddMore}
            className="px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </button>
        )}
      </div>

      {/* Table Body */}
      {comparedOpportunities.length === 0 ? (
        <div className="p-16 text-center bg-[#1F2937] rounded-2xl border border-dashed border-zinc-800/80 text-[#9CA3AF] space-y-4 max-w-lg mx-auto">
          <Columns className="w-10 h-10 mx-auto text-zinc-650" />
          <div>
            <p className="text-sm font-bold text-zinc-200">No opportunities currently selected for comparison.</p>
            <p className="text-xs text-zinc-500 mt-1">Browse any category view and click "+ Compare" on cards to build your matrix.</p>
          </div>
          {onAddMore && (
            <button
              onClick={onAddMore}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B0F19] border border-zinc-800 hover:border-[#3B82F6]/40 text-zinc-300 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Browse Opportunities</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800/80 rounded-2xl bg-[#1F2937] shadow-xl">
          <table className="w-full text-left border-collapse text-xs min-w-[640px]">
            <thead>
              <tr className="bg-[#111827] border-b border-zinc-800/80">
                <th className="p-4 font-mono uppercase text-[10px] text-zinc-500 font-bold w-44 bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60">
                  Specification
                </th>
                {comparedOpportunities.map(opp => (
                  <th key={opp.id} className="p-4 min-w-[220px] max-w-[280px] border-l border-zinc-800/60 relative group align-top bg-[#1F2937]">
                    <button
                      onClick={() => onToggleCompare(opp.id)}
                      className="absolute right-3 top-3 p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3B82F6]/10 text-blue-300 border border-[#3B82F6]/25 font-bold block w-fit mb-2">
                      {opp.category}
                    </span>
                    <div className="font-bold text-white text-sm leading-snug pr-6">{opp.title}</div>
                    <div className="text-[#9CA3AF] font-normal truncate mt-1">{opp.org}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {/* Match Score */}
              <tr>
                <td className="p-4 font-bold text-zinc-300 bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>AI Match Score</span>
                </td>
                {comparedOpportunities.map(opp => (
                  <td key={opp.id} className="p-4 border-l border-zinc-800/60 font-mono font-bold text-base text-[#10B981] bg-[#10B981]/5">
                    ★ {opp.matchScore}% Compatibility
                  </td>
                ))}
              </tr>

              {/* Stipend / Award */}
              <tr>
                <td className="p-4 font-bold text-zinc-300 bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Stipend / Award</span>
                </td>
                {comparedOpportunities.map(opp => (
                  <td key={opp.id} className="p-4 border-l border-zinc-800/60 font-bold text-zinc-100">
                    {opp.awardOrStipend}
                  </td>
                ))}
              </tr>

              {/* Deadline */}
              <tr>
                <td className="p-4 font-bold text-zinc-300 bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span>Application Due</span>
                </td>
                {comparedOpportunities.map(opp => (
                  <td key={opp.id} className="p-4 border-l border-zinc-800/60 font-mono text-red-400 font-semibold">
                    📅 {opp.deadline}
                  </td>
                ))}
              </tr>

              {/* Location & Modality */}
              <tr>
                <td className="p-4 font-bold text-zinc-300 bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Location & Mode</span>
                </td>
                {comparedOpportunities.map(opp => (
                  <td key={opp.id} className="p-4 border-l border-zinc-800/60">
                    <div className="font-medium text-zinc-200 mb-1">{opp.location}</div>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 bg-[#0B0F19] border border-zinc-800/50 text-zinc-300 rounded text-[10px] font-mono font-bold">{opp.modality}</span>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded text-[10px] font-mono font-bold">{opp.difficulty}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Primary Match Reason */}
              <tr>
                <td className="p-4 font-bold text-zinc-300 bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60 align-top">
                  <div className="flex items-center gap-1.5 text-[#10B981] mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Top Fit Reason</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-normal">Extracted by Match Agent</span>
                </td>
                {comparedOpportunities.map(opp => (
                  <td key={opp.id} className="p-4 border-l border-zinc-800/60 text-zinc-350 leading-relaxed align-top bg-[#0B0F19]/20">
                    <p className="text-xs">✓ {opp.matchReasons[0]}</p>
                    {opp.matchReasons[1] && (
                      <p className="text-xs mt-1.5 text-zinc-450">• {opp.matchReasons[1]}</p>
                    )}
                  </td>
                ))}
              </tr>

              {/* Improvement Tips */}
              <tr>
                <td className="p-4 font-bold text-zinc-300 bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60 align-top">
                  <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gap Analysis & Tips</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-normal">Report Agent Advice</span>
                </td>
                {comparedOpportunities.map(opp => (
                  <td key={opp.id} className="p-4 border-l border-zinc-800/60 align-top">
                    {opp.improvementTips.map((tip, idx) => (
                      <div key={idx} className="text-xs bg-[#8B5CF6]/10 text-purple-300 border border-[#8B5CF6]/20 p-2.5 rounded-xl mb-1.5 last:mb-0 leading-relaxed">
                        → {tip}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 font-bold text-[#9CA3AF] bg-[#111827] sticky left-0 z-10 border-r border-zinc-800/60">
                  Actions
                </td>
                {comparedOpportunities.map(opp => (
                  <td key={opp.id} className="p-4 border-l border-zinc-800/60">
                    {onExplain && (
                      <button
                        onClick={() => onExplain(opp)}
                        className="w-full py-2 bg-[#0B0F19] hover:bg-zinc-800/60 border border-zinc-850 text-zinc-100 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Explain AI Match</span>
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ComparisonTable;
