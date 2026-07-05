import React, { useState } from 'react';
import { AGENTS_COLLABORATION_SPECS } from '../data/blueprintData';
import { AgentSpec } from '../types';
import { 
  Cpu, UserCheck, Search, Sparkles, Compass, FileText, 
  ArrowRight, ArrowDown, CheckCircle2, Layers, Info 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 text-white" />,
  UserCheck: <UserCheck className="w-5 h-5 text-white" />,
  Search: <Search className="w-5 h-5 text-white" />,
  Sparkles: <Sparkles className="w-5 h-5 text-white" />,
  Compass: <Compass className="w-5 h-5 text-white" />,
  FileText: <FileText className="w-5 h-5 text-white" />
};

const AGENT_BG_MAP: Record<string, string> = {
  coordinator: 'bg-indigo-600 border-indigo-700 text-white',
  profile: 'bg-emerald-600 border-emerald-700 text-white',
  search: 'bg-blue-600 border-blue-700 text-white',
  match: 'bg-purple-600 border-purple-700 text-white',
  advisor: 'bg-orange-600 border-orange-700 text-white',
  report: 'bg-cyan-600 border-cyan-700 text-white',
};

export default function AgentFlowDiagram() {
  const [selectedAgent, setSelectedAgent] = useState<AgentSpec>(AGENTS_COLLABORATION_SPECS[0]);

  return (
    <div className="space-y-6 text-[#F9FAFB] font-sans max-w-6xl mx-auto pb-8 bg-[#0B0F19]">
      
      {/* Header Info */}
      <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#3B82F6]" />
            <span>Multi-Agent Collaboration Architecture</span>
          </h2>
          <p className="text-xs md:text-sm text-[#9CA3AF] mt-1.5 max-w-2xl leading-relaxed">
            OpportunityAI operates on a centralized <strong>Orchestrator-Worker</strong> pattern. The master 
            <span className="text-[#3B82F6] font-mono font-semibold"> CoordinatorAgent </span> manages sequential handoffs between 5 specialized worker agents.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0B0F19] px-3.5 py-2 rounded-xl border border-zinc-800/80 text-xs text-[#9CA3AF] font-medium shrink-0 shadow-inner">
          <Info className="w-4 h-4 text-[#3B82F6] shrink-0" />
          <span>Click any agent box to inspect data flow</span>
        </div>
      </div>

      {/* Visual Workflow Diagram Grid */}
      <div className="bg-[#1F2937] p-6 md:p-8 rounded-2xl border border-zinc-800/80 shadow-lg relative">
        
        {/* Step 0: User Input */}
        <div className="flex justify-center mb-4">
          <div className="px-4 py-2 bg-[#0B0F19] text-zinc-350 rounded-full text-xs font-mono shadow-inner border border-zinc-800/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Student Input (app.py Streamlit UI)</span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <ArrowDown className="w-5 h-5 text-[#3B82F6] animate-bounce" />
        </div>

        {/* Master Coordinator Box */}
        <div className="max-w-md mx-auto mb-8">
          <div 
            onClick={() => setSelectedAgent(AGENTS_COLLABORATION_SPECS[0])}
            className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-200 text-center shadow-md ${
              selectedAgent.id === 'coordinator' 
                ? 'bg-[#111827] border-[#3B82F6] shadow-xl ring-4 ring-blue-500/5' 
                : 'bg-[#0B0F19] border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm shrink-0">
                {ICON_MAP['Cpu']}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-base">1. Coordinator Agent</h3>
                <p className="text-xs text-[#3B82F6] font-semibold">Master Conductor & Pipeline Router</p>
              </div>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-2 border-t border-zinc-800/60 pt-2.5 leading-relaxed">
              Dispatches sequential execution commands and handles fallback error recovery.
            </p>
          </div>
        </div>

        {/* Down arrows to workers */}
        <div className="flex items-center justify-center gap-2 mb-6 text-zinc-500 text-[10px] font-mono uppercase tracking-widest font-bold">
          <span>── Dispatches Sequential Tasks ──►</span>
        </div>

        {/* 5 Worker Agents Horizontal Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AGENTS_COLLABORATION_SPECS.slice(1).map((agent, idx) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div key={agent.id} className="relative flex flex-col items-center">
                <div
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full p-4 rounded-2xl cursor-pointer border-2 transition-all duration-250 flex flex-col items-center text-center h-full shadow-sm ${
                    isSelected
                      ? 'bg-[#0B0F19] text-white border-[#3B82F6] shadow-xl scale-[1.02] z-10'
                      : 'bg-[#1F2937]/45 border-zinc-800/80 hover:border-zinc-700 text-zinc-100'
                  }`}
                >
                  <div className={`p-2 rounded-xl mb-3 shadow-md ${AGENT_BG_MAP[agent.id]}`}>
                    {ICON_MAP[agent.iconName]}
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-[#3B82F6]' : 'text-zinc-500'}`}>
                    Step {idx + 2}
                  </span>
                  <h4 className={`font-bold text-xs mb-1 ${isSelected ? 'text-white' : 'text-zinc-100'}`}>{agent.name}</h4>
                  <p className={`text-[11px] leading-snug flex-1 ${isSelected ? 'text-[#9CA3AF]' : 'text-zinc-400'}`}>
                    {agent.role}
                  </p>
                </div>

                {idx < 4 && (
                  <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-zinc-700 pointer-events-none">
                    <ArrowRight className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final output */}
        <div className="mt-8 pt-6 border-t border-zinc-800/60 flex justify-center">
          <div className="px-5 py-2.5 bg-[#10B981]/5 text-[#10B981] rounded-full text-xs font-semibold border border-[#10B981]/20 flex items-center gap-2 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Returns Formatted Report to Student (Scholarships, Hackathons, Fellowships, Internships)</span>
          </div>
        </div>
      </div>

      {/* Selected Agent Deep Dive Panel */}
      <div className="bg-[#1F2937] p-6 md:p-8 rounded-2xl border border-zinc-800/80 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shadow-md ${AGENT_BG_MAP[selectedAgent.id]}`}>
              {ICON_MAP[selectedAgent.iconName]}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{selectedAgent.name} Specification</h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">{selectedAgent.role}</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-[#0B0F19] px-3.5 py-1.5 rounded-xl text-[#9CA3AF] border border-zinc-800/80 font-bold">
            {selectedAgent.id === 'coordinator' ? 'Orchestrator' : 'Worker Module'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Responsibilities */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#3B82F6] font-extrabold">Key Responsibilities</h4>
            <ul className="space-y-2">
              {selectedAgent.responsibilities.map((resp, i) => (
                <li key={i} className="text-xs text-[#F9FAFB] flex items-start gap-2 bg-[#0B0F19] p-3 rounded-xl border border-zinc-800/60 leading-normal font-semibold">
                  <span className="text-[#3B82F6] font-black">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Inputs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-extrabold">Expected Input Schemas</h4>
            <ul className="space-y-2">
              {selectedAgent.inputs.map((inp, i) => (
                <li key={i} className="text-xs font-mono text-[#10B981] bg-[#10B981]/5 p-3 rounded-xl border border-[#10B981]/20 flex items-start gap-2 leading-relaxed">
                  <span>📥</span>
                  <span className="break-all">{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Outputs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] font-extrabold">Generated Outputs</h4>
            <ul className="space-y-2">
              {selectedAgent.outputs.map((out, i) => (
                <li key={i} className="text-xs font-mono text-purple-300 bg-[#8B5CF6]/5 p-3 rounded-xl border border-[#8B5CF6]/20 flex items-start gap-2 leading-relaxed">
                  <span>📤</span>
                  <span className="break-all">{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
