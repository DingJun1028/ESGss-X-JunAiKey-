
import React, { useState, useEffect } from 'react';
import { Loader2, BrainCircuit, Zap, Database, Server } from 'lucide-react';
import { LogoIcon } from './Layout';

const LOADING_MESSAGES = [
    "Initializing JunAiKey Kernel...",
    "Syncing Neural Pathways...",
    "Establishing Secure Handshake...",
    "Calibrating Zero Hallucination Protocol...",
    "Optimizing Generative UI Components...",
    "Allocating Tensor Resources...",
    "Verifying Integrity Hashes..."
];

export const LoadingScreen: React.FC<{ message?: string }> = ({ message }) => {
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

    useEffect(() => {
        if (!message) {
            const interval = setInterval(() => {
                setCurrentMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 800);
            return () => clearInterval(interval);
        }
    }, [message]);

    const displayMessage = message || LOADING_MESSAGES[currentMsgIndex];

    return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 animate-fade-in bg-slate-900/20 backdrop-blur-sm rounded-3xl">
            <div className="relative mb-8 flex items-center justify-center">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 bg-celestial-gold/20 blur-3xl rounded-full animate-pulse" />
                
                {/* Spinner Container */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Orbitals */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-celestial-purple/60 animate-[spin_2s_linear_infinite]" />
                    <div className="absolute inset-3 rounded-full border-r-2 border-celestial-emerald/60 animate-[spin_3s_linear_infinite_reverse]" />
                    
                    {/* Logo */}
                    <div className="relative z-10 animate-pulse">
                        <LogoIcon className="w-16 h-16 shadow-[0_0_20px_rgba(251,191,36,0.4)]" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 text-center max-w-sm">
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wide font-mono min-h-[20px] transition-all duration-300">
                    {displayMessage}
                </span>
                
                {/* Progress Bar Visual */}
                <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-celestial-purple via-celestial-blue to-celestial-emerald w-full animate-pulse" />
                </div>

                <div className="flex gap-4 mt-4 text-gray-600">
                    <Zap className="w-4 h-4 animate-pulse delay-75" />
                    <Database className="w-4 h-4 animate-pulse delay-150" />
                    <Server className="w-4 h-4 animate-pulse delay-300" />
                </div>
            </div>
        </div>
    );
};
