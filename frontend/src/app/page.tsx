'use client';

import { useState, useEffect } from 'react';
import { postBFHL, BFHLResponse } from '@/services/api';
import TreeViewer from '@/components/TreeViewer';
import StatCard from '@/components/StatCard';
import PresetButton from '@/components/PresetButton';
import JsonViewer from '@/components/JsonViewer';
import Toast from '@/components/Toast';

export default function Home() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState<BFHLResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
        message: '',
        type: 'info',
        visible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type, visible: true });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);
        setResponse(null);

        try {
            const data = input.split(',').map(s => s.trim()).filter(s => s !== '');
            if (data.length === 0) {
                throw new Error("Please enter edge data (e.g. A->B)");
            }
            const res = await postBFHL(data);
            setResponse(res);
            showToast('Hierarchy built successfully!', 'success');
        } catch (err: any) {
            showToast(err.message || 'Processing failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePreset = (val: string) => {
        setInput(val);
        showToast('Preset loaded. Ready to build.', 'info');
    };

    return (
        <main className="min-h-screen mesh-bg relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-indigo-500 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <header className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Enterprise Grade Visualizer v1.1
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        BFHL <span className="text-indigo-500 italic">Hierarchy</span> Builder
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Transform flat edge data into deep nested hierarchies. Detect cycles, calculate path depths, and visualize structure with precision.
                    </p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    {/* Control Panel */}
                    <aside className="xl:col-span-4 space-y-6">
                        <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="data" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            Edge Definition
                                        </label>
                                        <span className="text-[10px] text-slate-600 font-mono">
                                            {input.split(',').filter(x => x.trim()).length} edges
                                        </span>
                                    </div>
                                    <textarea
                                        id="data"
                                        rows={5}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700 font-mono text-sm resize-none"
                                        placeholder="A->B, B->C, C->D..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Presets</span>
                                    <div className="grid grid-cols-2 gap-3">
                                        <PresetButton 
                                            label="Complex Tree" 
                                            description="Multiple levels"
                                            onClick={() => handlePreset('A->B, A->C, B->D, B->E, C->F, E->G')} 
                                        />
                                        <PresetButton 
                                            label="Cycle Detect" 
                                            description="Recursive loop"
                                            onClick={() => handlePreset('A->B, B->C, C->A')} 
                                        />
                                        <PresetButton 
                                            label="Multi-Parent" 
                                            description="First parent wins"
                                            onClick={() => handlePreset('A->C, B->C, B->D')} 
                                        />
                                        <PresetButton 
                                            label="Disconnected" 
                                            description="Two hierarchies"
                                            onClick={() => handlePreset('A->B, X->Y')} 
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ANALYZING...
                                        </span>
                                    ) : 'GENERATE HIERARCHY'}
                                </button>
                            </form>
                        </div>
                        
                        <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-6">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">System Note</h4>
                            <p className="text-[11px] text-indigo-300/60 leading-relaxed">
                                The system enforces a strict single-parent rule. If a node is assigned a second parent, it is ignored to preserve tree integrity. Cycles are detected using component-wide DFS.
                            </p>
                        </div>
                    </aside>

                    {/* Result View */}
                    <div className="xl:col-span-8 space-y-8">
                        {!response && !loading && (
                            <div className="bg-slate-900/20 border border-slate-800/30 border-dashed rounded-3xl h-[600px] flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-slate-700">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 mb-2">Awaiting Edge Input</h3>
                                <p className="text-slate-600 text-sm max-w-xs">Define your node relationships on the left to generate the visual hierarchy.</p>
                            </div>
                        )}

                        {response && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                                {/* Summary Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard 
                                        label="Total Hierarchies" 
                                        value={response.summary.total_trees + response.summary.total_cycles} 
                                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                                        colorClass="text-indigo-400"
                                    />
                                    <StatCard 
                                        label="Success Ratio" 
                                        value={`${Math.round(response.summary.total_trees / (response.summary.total_trees + response.summary.total_cycles || 1) * 100)}%`}
                                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                                        colorClass="text-emerald-400"
                                    />
                                    <StatCard 
                                        label="Cycles Found" 
                                        value={response.summary.total_cycles} 
                                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                                        colorClass="text-rose-400"
                                    />
                                    <StatCard 
                                        label="Processing Time" 
                                        value={`${(response as any).processing_time_ms || 0}ms`} 
                                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                        colorClass="text-amber-400"
                                    />
                                </div>

                                {/* Hierarchies List */}
                                <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black tracking-tight text-white">Visual Hierarchies</h3>
                                        <div className="flex gap-2">
                                            {response.invalid_entries.length > 0 && (
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold">
                                                    {response.invalid_entries.length} INVALID
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                                        {response.hierarchies.map((hierarchy, idx) => (
                                            <div key={idx} className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-6 transition-all hover:bg-slate-950/60 group">
                                                <div className="flex items-center justify-between mb-6 border-b border-slate-900 pb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Entry Point</span>
                                                            <span className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase">{hierarchy.root}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {(hierarchy as any).node_count && (
                                                            <span className="text-[10px] font-bold text-slate-600 bg-slate-900 px-2 py-1 rounded tracking-tighter">
                                                                {(hierarchy as any).node_count} NODES
                                                            </span>
                                                        )}
                                                        {hierarchy.has_cycle ? (
                                                            <span className="bg-rose-500/10 text-rose-500 text-[10px] px-3 py-1 rounded-full border border-rose-500/20 font-black animate-pulse">
                                                                CYCLE DETECTED
                                                            </span>
                                                        ) : (
                                                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full border border-emerald-500/20 font-black uppercase">
                                                                Depth: {hierarchy.depth}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {hierarchy.has_cycle ? (
                                                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                                        <svg className="w-8 h-8 text-rose-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        <p className="text-slate-500 text-xs text-center italic max-w-xs">
                                                            A recursive loop was detected starting from node {hierarchy.root}. Recursive rendering is disabled to prevent infinite loops.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="py-2">
                                                        <TreeViewer name={hierarchy.root} data={hierarchy.tree} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Raw View */}
                                <JsonViewer data={response} />

                                {/* User Details Footer */}
                                <div className="bg-slate-900/20 border border-slate-800/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Developer ID</p>
                                            <p className="text-sm font-bold text-slate-300">{response.user_id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden md:block">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">College Email</p>
                                            <p className="text-sm font-bold text-slate-400">{response.email_id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Roll Number</p>
                                            <p className="text-sm font-bold text-slate-400">{response.college_roll_number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <Toast 
                message={toast.message} 
                type={toast.type} 
                isVisible={toast.visible} 
                onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
            />
        </main>
    );
}
