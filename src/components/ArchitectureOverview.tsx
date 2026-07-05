import React from 'react';
import { Shield, Sparkles, BookOpen, Layers, Terminal, CheckCircle } from 'lucide-react';

export default function ArchitectureOverview() {
  return (
    <div className="space-y-6 text-[#F9FAFB] bg-[#0B0F19] font-sans max-w-6xl mx-auto overflow-y-auto pb-8">
      
      {/* Hero Banner (Matches premium dark professional palette) */}
      <div className="bg-gradient-to-br from-[#111827] via-[#1F2937] to-indigo-950/30 p-8 rounded-2xl border border-zinc-800/80 shadow-xl text-white relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B0F19]/80 border border-zinc-800 rounded-full text-[#3B82F6] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Hackathon Architecture Blueprint</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            OpportunityAI System Architecture
          </h1>
          <p className="text-sm md:text-base text-[#9CA3AF] leading-relaxed">
            A clean, highly modular multi-agent platform engineered in <strong>beginner-friendly Python</strong>. 
            Designed to help students discover personalized scholarships, hackathons, competitions, leadership programs, fellowships, and internships.
          </p>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md space-y-4 hover:border-[#3B82F6]/30 transition-all duration-300">
          <div className="p-3 bg-[#3B82F6]/10 border border-[#3B82F6]/25 rounded-xl w-fit text-[#3B82F6]">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Separation of Concerns</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Every file handles exactly <strong>one responsibility</strong>. Data contracts live in <code className="text-xs text-[#3B82F6] font-mono bg-[#0B0F19] border border-zinc-800/80 px-1.5 py-0.5 rounded-lg font-bold">models/</code>, AI API logic lives in <code className="text-xs text-[#3B82F6] font-mono bg-[#0B0F19] border border-zinc-800/80 px-1.5 py-0.5 rounded-lg font-bold">services/</code>, and agent reasoning lives in <code className="text-xs text-[#3B82F6] font-mono bg-[#0B0F19] border border-zinc-800/80 px-1.5 py-0.5 rounded-lg font-bold">agents/</code>.
          </p>
        </div>

        <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md space-y-4 hover:border-[#10B981]/30 transition-all duration-300">
          <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/25 rounded-xl w-fit text-[#10B981]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Beginner-Friendly Python</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Strictly avoids overly complex metaprogramming or obscure async frameworks. Uses standard Pydantic type hinting, clean docstrings, and expressive variable names.
          </p>
        </div>

        <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md space-y-4 hover:border-[#8B5CF6]/30 transition-all duration-300">
          <div className="p-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-xl w-fit text-[#8B5CF6]">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Hackathon Demo-Proofing</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Includes a mock static dataset (<code className="text-xs text-[#8B5CF6] font-mono bg-[#0B0F19] border border-zinc-800/80 px-1.5 py-0.5 rounded-lg font-bold">opportunities_db.json</code>) so judges experience instant 2-second recommendations without web scraper rate-limit crashes.
          </p>
        </div>
      </div>

      {/* How the Multi-Agent Pipeline Collaborates */}
      <div className="bg-[#1F2937] p-6 rounded-2xl border border-zinc-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-[#3B82F6]" />
            <span>The Conductor-Worker Collaboration Pattern</span>
          </h3>
          <span className="text-xs font-mono px-3 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 rounded-xl font-bold">
            Strict Routing Guaranteed
          </span>
        </div>

        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          In multi-agent systems, uncoordinated agents easily enter infinite dialogue loops or pass incompatible dictionaries. 
          OpportunityAI prevents this by appointing the <strong>CoordinatorAgent</strong> as the strict central router:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#0B0F19] p-4.5 rounded-2xl border border-zinc-800/60 flex items-start gap-3 shadow-inner">
            <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-zinc-100">Sequential Handoff Guarantee</span>
              <p className="text-[#9CA3AF] leading-relaxed">
                Worker agents do not call each other directly. The Coordinator passes the output of ProfileAgent into SearchAgent, then into MatchAgent.
              </p>
            </div>
          </div>

          <div className="bg-[#0B0F19] p-4.5 rounded-2xl border border-zinc-800/60 flex items-start gap-3 shadow-inner">
            <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-zinc-100">Pydantic Schema Contracts</span>
              <p className="text-[#9CA3AF] leading-relaxed">
                Data passed between agents is strictly typed via <code className="text-[#3B82F6] font-mono bg-[#1F2937]/50 px-1 py-0.5 rounded border border-zinc-800/80">models/</code>. If an LLM hallucinates a missing GPA field, Pydantic catches it immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
