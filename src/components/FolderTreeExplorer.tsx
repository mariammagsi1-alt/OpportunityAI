import React, { useState } from 'react';
import { FolderNode, PythonFileSpec } from '../types';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown } from 'lucide-react';

interface FolderTreeExplorerProps {
  tree: FolderNode[];
  selectedFile: PythonFileSpec | null;
  onSelectFile: (spec: PythonFileSpec) => void;
}

interface NodeItemProps {
  node: FolderNode;
  depth?: number;
  selectedFile: PythonFileSpec | null;
  onSelectFile: (spec: PythonFileSpec) => void;
}

const NodeItem: React.FC<NodeItemProps> = ({
  node,
  depth = 0,
  selectedFile,
  onSelectFile,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedFile?.path === node.path;

  if (node.type === 'folder') {
    return (
      <div className="select-none font-sans">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl cursor-pointer transition-colors ${
            isOpen ? 'bg-[#0B0F19] text-white font-bold border border-zinc-800/60' : 'hover:bg-zinc-800/45 text-[#9CA3AF]'
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#3B82F6]">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
            {isOpen ? <FolderOpen className="w-4 h-4 text-[#3B82F6]" /> : <Folder className="w-4 h-4 text-[#3B82F6]" />}
            <span className="text-zinc-200">{node.name}/</span>
          </div>
          {node.description && (
            <span className="text-[10px] font-sans px-2 py-0.5 bg-[#1F2937] border border-zinc-800 text-zinc-500 rounded-lg hidden sm:inline-block truncate max-w-[180px]">
              {node.description}
            </span>
          )}
        </div>

        {isOpen && node.children && (
          <div className="mt-1 border-l border-zinc-800 ml-5 pl-1.5 space-y-1">
            {node.children.map((child) => (
              <NodeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // File
  return (
    <div
      onClick={() => node.spec && onSelectFile(node.spec)}
      className={`flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'bg-[#3B82F6] text-white font-bold shadow-md translate-x-0.5'
          : 'hover:bg-[#0B0F19] text-[#9CA3AF] hover:text-white font-medium'
      }`}
      style={{ paddingLeft: `${depth * 16 + 28}px` }}
    >
      <div className="flex items-center gap-2 font-mono text-xs truncate">
        <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#3B82F6]'}`} />
        <span>{node.name}</span>
      </div>
      {node.spec && (
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg shrink-0 ${
          isSelected ? 'bg-blue-750 text-blue-100' : 'bg-[#0B0F19] border border-zinc-800 text-zinc-500'
        }`}>
          {node.spec.contains.length} specs
        </span>
      )}
    </div>
  );
};

export default function FolderTreeExplorer({
  tree,
  selectedFile,
  onSelectFile,
}: FolderTreeExplorerProps) {
  return (
    <div className="h-full flex flex-col bg-[#1F2937] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl text-white">
      <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between bg-[#111827]">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-[#3B82F6]" />
          <h2 className="text-sm font-bold text-white tracking-tight font-sans">
            Python Folder Structure
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-[#0B0F19] px-2.5 py-0.5 rounded-lg border border-zinc-800 text-zinc-400">
          opportunity_ai/
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-xs text-[#9CA3AF] font-mono px-3 py-2.5 bg-[#0B0F19] rounded-xl border border-zinc-800/80 mb-3 flex items-center justify-between shadow-inner">
          <span>opportunity_ai/</span>
          <span className="text-[10px] text-zinc-500"># Hackathon Root</span>
        </div>
        {tree.map((rootNode) => (
          <NodeItem
            key={rootNode.path}
            node={rootNode}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
}
