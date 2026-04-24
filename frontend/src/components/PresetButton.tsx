import React from 'react';

interface PresetButtonProps {
    label: string;
    description: string;
    onClick: () => void;
}

const PresetButton: React.FC<PresetButtonProps> = ({ label, description, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-start p-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 rounded-xl transition-all group"
        >
            <span className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300">{label}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{description}</span>
        </button>
    );
};

export default PresetButton;
