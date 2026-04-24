'use client';

import React, { useState } from 'react';

interface JsonViewerProps {
    data: any;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-300">Raw JSON Response</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        {Math.round(JSON.stringify(data).length / 1024 * 100) / 100} KB
                    </span>
                </div>
            </button>
            
            {isOpen && (
                <div className="relative p-6 bg-slate-950 border-t border-slate-800">
                    <button
                        onClick={handleCopy}
                        className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                        )}
                    </button>
                    <pre className="text-xs font-mono text-slate-400 overflow-x-auto custom-scrollbar max-h-[400px]">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default JsonViewer;
