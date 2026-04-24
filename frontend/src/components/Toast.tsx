'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
    const [shouldRender, setShouldRender] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!shouldRender && !isVisible) return null;

    const bgColors = {
        success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
    };

    return (
        <div 
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full border shadow-2xl backdrop-blur-xl transition-all duration-300 ${bgColors[type]} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
            <div className="flex items-center gap-3 font-medium">
                {type === 'success' && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                <span className="text-sm whitespace-nowrap">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
