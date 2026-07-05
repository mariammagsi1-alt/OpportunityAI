import React, { useState } from 'react';
import { DEVELOPMENT_ROADMAP } from '../data/blueprintData';
import { Clock, Code2, Rocket, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

export default function DevelopmentRoadmap() {
  const [activePhase, setActivePhase] = useState<number>(1);
  const phaseData = DEVELOPMENT_ROADMAP.find(p => p.phase === activePhase) || DEVELOPMENT_ROADMAP[0];

  return (
    <div className="space-y-6 text-[#F9FAFB] font-sans max-w-6xl mx-auto overflow-y-auto pb-8">
      
      <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#3B82F6]" />
            <span>Step-by-Step Hackathon Development Roadmap</span>
          </h2>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1 leading-relaxed">
            To build OpportunityAI smoothly without getting overwhelmed by multi-agent bugs, follow this strictly ordered 
            <strong> 6-Milestone Implementation Plan</strong>. Build and verify each milestone completely before proceeding to the next.
          </p>
        </div>
      </div>

      {/* Phase Stepper Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEVELOPMENT_ROADMAP.map((p) => {
          const isActive = p.phase === activePhase;
          return (
            <button
              key={p.phase}
              onClick={() => setActivePhase(p.phase)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-[#3B82F6]/50 text-white shadow-xl font-bold scale-102'
                  : 'bg-[#111827] border-zinc-800/80 text-[#9CA3AF] hover:bg-zinc-800/60 hover:text-white hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg uppercase font-bold ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-[#1F2937] text-zinc-400 border border-zinc-800/60'
                }`}>
                  Phase {p.phase}
                </span>
              </div>
              <div className={`font-bold text-xs truncate w-full ${isActive ? 'text-white' : 'text-white/90'}`}>
                {p.title.replace(`Milestone ${p.phase}: `, '')}
              </div>
              <div className={`text-[10px] flex items-center gap-1 mt-1.5 font-mono ${isActive ? 'text-blue-100' : 'text-zinc-500'}`}>
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{p.estimatedTime}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Specification Card */}
      <div className="bg-[#1F2937] p-6 md:p-8 rounded-2xl border border-zinc-800/80 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/60 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#3B82F6] font-bold">
              Implementation Milestone #{phaseData.phase}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">{phaseData.title}</h3>
            <p className="text-sm text-[#9CA3AF] mt-1 leading-relaxed">{phaseData.subtitle}</p>
          </div>
          <div className="px-3.5 py-1.5 bg-[#0B0F19] border border-zinc-800/80 rounded-xl text-xs font-mono text-zinc-300 flex items-center gap-2 shrink-0 font-medium shadow-inner">
            <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Target: {phaseData.estimatedTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Files to create & Goals */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold mb-3 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#3B82F6]" />
                <span>Target Python Files to Implement First</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {phaseData.modules.map((mod, i) => (
                  <span key={i} className="text-xs font-mono bg-[#3B82F6]/10 text-blue-300 border border-[#3B82F6]/25 px-3 py-1.5 rounded-xl font-bold shadow-inner">
                    📄 {mod}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-bold mb-3">
                Milestone Action Items
              </h4>
              <ul className="space-y-3">
                {phaseData.goals.map((g, i) => (
                  <li key={i} className="text-xs text-[#9CA3AF] bg-[#0B0F19] p-3.5 rounded-xl border border-zinc-800/60 flex items-start gap-3 shadow-inner">
                    <span className="w-5 h-5 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center shrink-0 font-extrabold font-mono text-[11px] shadow-sm border border-[#3B82F6]/10">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed font-semibold text-zinc-200">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Deliverable Acceptance Criteria */}
          <div className="lg:col-span-5 bg-[#111827] p-6 rounded-2xl border border-zinc-800/80 flex flex-col justify-between space-y-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-[#10B981] font-bold text-sm mb-2.5">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                <span>Milestone Acceptance Guarantee</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-4">
                Before writing code for Phase {phaseData.phase + 1}, confirm this verification test in your terminal:
              </p>
              
              <div className="bg-[#0B0F19] p-4 rounded-xl border border-zinc-800/80 shadow-inner">
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-2 uppercase tracking-wider font-bold">
                  <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Terminal Verification</span>
                </div>
                <p className="text-xs font-mono text-[#10B981] font-bold break-all leading-relaxed">
                  ✓ {phaseData.deliverable}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Milestone {activePhase}/6</span>
              {activePhase < 6 ? (
                <button 
                  onClick={() => setActivePhase(activePhase + 1)}
                  className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-750 text-white rounded-xl transition-all flex items-center gap-1.5 font-sans font-bold text-xs cursor-pointer shadow-md"
                >
                  <span>Next: Phase {activePhase + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="px-3 py-1.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 rounded-xl font-bold text-xs shadow-md">
                  ★ Ready for Pitch Demo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
