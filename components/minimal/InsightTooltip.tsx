
import React from 'react';
import { Info, Calculator, BookOpen } from 'lucide-react';
import { UniversalLabel } from '../../types';

interface InsightTooltipProps {
  label: UniversalLabel;
  isVisible: boolean;
}

export const InsightTooltip: React.FC<InsightTooltipProps> = ({ label, isVisible }) => {
  if (!isVisible || (!label.definition && !label.formula)) return null;

  return (
    <div className="absolute top-8 left-0 z-50 w-64 p-4 mt-2 rounded-xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-xl animate-fade-in text-left pointer-events-none">
      {/* Connector Arrow */}
      <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-900/95 border-l border-t border-white/20 transform rotate-45" />
      
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Info className="w-4 h-4 text-celestial-emerald" />
            <span className="text-sm font-bold text-white">{label.text}</span>
        </div>

        {/* Definition Section */}
        {label.definition && (
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    <BookOpen className="w-3 h-3" />
                    Definition
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                    {label.definition}
                </p>
            </div>
        )}

        {/* Formula Section */}
        {label.formula && (
            <div className="space-y-1 bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-celestial-gold tracking-wider">
                    <Calculator className="w-3 h-3" />
                    Calculation
                </div>
                <code className="block text-[10px] font-mono text-celestial-gold/90 break-words">
                    {label.formula}
                </code>
            </div>
        )}
      </div>
    </div>
  );
};
