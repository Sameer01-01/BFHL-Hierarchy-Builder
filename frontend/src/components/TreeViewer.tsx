'use client';

import React, { useState } from 'react';

interface TreeViewerProps {
    data: any;
    name: string;
    depth?: number;
}

const TreeViewer: React.FC<TreeViewerProps> = ({ data, name, depth = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = data && typeof data === 'object' && Object.keys(data).length > 0;

    // Level-based colors
    const colors = [
        'bg-indigo-600',   // Root
        'bg-violet-600',   // Level 1
        'bg-fuchsia-600',  // Level 2
        'bg-pink-600',     // Level 3
        'bg-rose-600'      // Level 4+
    ];
    const colorClass = colors[Math.min(depth, colors.length - 1)];

    return (
        <div className={`ml-4 border-l border-slate-800/50 pl-4 py-1 tree-node-enter`}>
            <div className="flex items-center gap-3 group">
                {hasChildren ? (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 hover:bg-slate-800/30 px-2 py-1 rounded-lg transition-colors"
                    >
                        <svg 
                            className={`w-3 h-3 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${colorClass} text-white text-xs font-black shadow-lg shadow-indigo-500/10`}>
                            {name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                            {Object.keys(data).length} branches
                        </span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 px-2 py-1">
                        <div className="w-3 h-px bg-slate-800" />
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${colorClass} text-white text-xs font-black shadow-lg shadow-indigo-500/10 opacity-80`}>
                            {name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-600 italic">leaf</span>
                    </div>
                )}
            </div>

            {hasChildren && isExpanded && (
                <div className="mt-1 space-y-1 overflow-hidden">
                    {Object.entries(data).sort().map(([key, value]) => (
                        <TreeViewer key={key} data={value} name={key} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeViewer;
