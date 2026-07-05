import React from 'react';
import { PythonFileSpec } from '../types';
import { FileCode, Layers, GitFork, CheckCircle2, Code } from 'lucide-react';

interface FileSpecViewerProps {
  spec: PythonFileSpec | null;
  onClose?: () => void;
}

export default function FileSpecViewer({ spec }: FileSpecViewerProps) {
  if (!spec) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#1F2937] rounded-2xl border border-zinc-800/80 shadow-lg text-zinc-400">
        <div className="w-12 h-12 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 rounded-2xl flex items-center justify-center mb-4 shadow-md">
          <FileCode className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white">Select a Python File</h3>
        <p className="text-xs text-[#9CA3AF] max-w-xs mt-2 leading-relaxed">
          Click any file in the folder tree to inspect its architectural purpose, contained classes/functions, and module connections.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1F2937] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl text-white">
      
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-zinc-800/60 flex items-center justify-between bg-[#111827] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0B0F19] border border-zinc-800 rounded-xl flex items-center justify-center text-[#3B82F6] shadow-inner">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-mono font-bold text-white">{spec.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0B0F19] text-[#9CA3AF] border border-zinc-800/60 rounded-lg">
                {spec.folder === 'root' ? '/' : `/${spec.folder}/`}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 mt-1">{spec.path}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#1F2937]">
        
        {/* 1. Purpose */}
        <section className="bg-[#0B0F19] p-5 rounded-2xl border border-zinc-800/60 shadow-inner space-y-2.5">
          <div className="flex items-center gap-2 text-[#3B82F6] font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
            <span>1. Architectural Purpose</span>
          </div>
          <p className="text-xs md:text-sm text-zinc-200 leading-relaxed pl-6 font-medium">
            {spec.purpose}
          </p>
        </section>

        {/* 2. Contains (Classes & Functions) */}
        <section className="bg-[#0B0F19] p-5 rounded-2xl border border-zinc-800/60 shadow-inner space-y-3.5">
          <div className="flex items-center gap-2 text-[#10B981] font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#10B981]" />
            <span>2. Contained Classes & Functions</span>
          </div>
          <ul className="space-y-2 pl-6">
            {spec.contains.map((item, idx) => (
              <li key={idx} className="text-xs font-mono bg-[#1F2937] text-[#10B981] py-2.5 px-3.5 rounded-xl border border-zinc-800 shadow-sm flex items-start gap-2">
                <span className="text-zinc-600 select-none">•</span>
                <span className="break-all font-bold">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Connections */}
        <section className="bg-[#0B0F19] p-5 rounded-2xl border border-zinc-800/60 shadow-inner space-y-3.5">
          <div className="flex items-center gap-2 text-purple-450 font-bold text-xs uppercase tracking-wider">
            <GitFork className="w-4 h-4 text-purple-400" />
            <span>3. Connections & Dependencies</span>
          </div>
          <ul className="space-y-2 pl-6">
            {spec.connections.map((conn, idx) => (
              <li key={idx} className="text-xs text-zinc-200 flex items-start gap-2 bg-[#1F2937] p-2.5 rounded-xl border border-zinc-800 shadow-sm font-semibold">
                <span className="text-purple-400 font-bold">→</span>
                <span>{conn}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Code Snippet Preview */}
        {spec.codeSnippetPreview && (
          <section className="bg-[#0B0F19] text-[#9CA3AF] rounded-2xl p-5 border border-zinc-800/60 shadow-inner">
            <div className="flex items-center justify-between mb-3 border-b border-zinc-800/60 pb-2.5">
              <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest font-mono">
                <Code className="w-4 h-4 text-[#3B82F6]" />
                <span>Beginner-Friendly Python Skeleton</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#1F2937] text-blue-300 rounded-lg border border-zinc-800">python</span>
            </div>
            <pre className="text-xs font-mono text-zinc-200 overflow-x-auto p-3.5 bg-[#111827] rounded-xl border border-zinc-800/80 leading-relaxed shadow-inner">
              <code>{spec.codeSnippetPreview}</code>
            </pre>
          </section>
        )}

      </div>
    </div>
  );
}
