import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => {
    return (
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700/50 group">
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{label}</span>
                <div className={`${colorClass} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    {icon}
                </div>
            </div>
            <div className={`text-2xl font-bold ${colorClass.split(' ')[0].replace('text-', 'text-')}`}>
                {value}
            </div>
        </div>
    );
};

export default StatCard;
