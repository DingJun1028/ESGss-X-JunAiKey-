import React, { useState, useRef, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Minus, LucideIcon, 
  Activity, Puzzle, Tag, HelpCircle, ShieldCheck, Sparkles, Info
} from 'lucide-react';
import { 
    OmniEsgTrait, OmniEsgDataLink, OmniEsgMode, OmniEsgConfidence, 
    OmniEsgColor, UniversalLabel, LogicWitness 
} from '../types';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { useToast } from '../contexts/ToastContext';
import { GLOBAL_GLOSSARY } from '../constants';

// Import Minimal Atomic Components
import { DataLinkIndicator } from './minimal/DataLinkIndicator';
import { ConfidenceIndicator } from './minimal/ConfidenceIndicator';
import { QuantumAiTrigger } from './minimal/QuantumAiTrigger';
import { QuantumValueEditor } from './minimal/QuantumValueEditor';
import { InsightTooltip } from './minimal/InsightTooltip';

const THEMES = {
  emerald: { border: 'group-hover:border-emerald-500/40', glow: 'bg-emerald-500', text: 'text-emerald-400', iconBg: 'bg-emerald-500/10', gradient: 'from-emerald-500/20' },
  gold: { border: 'group-hover:border-amber-500/40', glow: 'bg-amber-500', text: 'text-amber-400', iconBg: 'bg-amber-500/10', gradient: 'from-amber-500/20' },
  purple: { border: 'group-hover:border-purple-500/40', glow: 'bg-purple-500', text: 'text-purple-400', iconBg: 'bg-purple-500/10', gradient: 'from-purple-500/20' },
  blue: { border: 'group-hover:border-blue-500/40', glow: 'bg-blue-500', text: 'text-blue-400', iconBg: 'bg-blue-500/10', gradient: 'from-blue-500/20' },
  slate: { border: 'group-hover:border-slate-400/40', glow: 'bg-slate-400', text: 'text-slate-400', iconBg: 'bg-slate-500/10', gradient: 'from-slate-500/20' },
};

const getTheme = (color: OmniEsgColor) => THEMES[color] || THEMES.emerald;

interface OmniEsgCellBaseProps {
  id?: string;
  mode: OmniEsgMode;
  label?: string | UniversalLabel;
  value?: string | number;
  subValue?: string;
  confidence?: OmniEsgConfidence;
  verified?: boolean;
  loading?: boolean;
  dataLink?: OmniEsgDataLink;
  traits?: OmniEsgTrait[];
  tags?: string[];
  icon?: LucideIcon;
  color?: OmniEsgColor;
  className?: string;
  witness?: LogicWitness;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  onAiAnalyze?: () => void;
  onClick?: () => void;
}

type OmniEsgCellProps = OmniEsgCellBaseProps & InjectedProxyProps;

const resolveLabel = (label: string | UniversalLabel): UniversalLabel => {
    if (typeof label === 'object') return label;
    if (GLOBAL_GLOSSARY[label]) {
         const entry = GLOBAL_GLOSSARY[label];
         return { text: label, definition: entry.definition, formula: entry.formula, rationale: entry.rationale };
    }
    return { text: label };
};

const OmniEsgCellBase: React.FC<OmniEsgCellProps> = React.memo((props) => {
  const { 
    mode, label, value, subValue, confidence = 'high', verified = false, 
    loading = false, dataLink, traits = [], tags = [], icon: Icon, color = 'emerald', 
    className = '', trend, onClick, onAiAnalyze, witness,
    adaptiveTraits = [], trackInteraction, isHighFrequency, isAgentActive
  } = props;
  
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const resolvedLabel = useMemo(() => resolveLabel(label || 'Unknown'), [label]);
  const labelText = resolvedLabel.text;
  const isRichLabel = !!(resolvedLabel.definition || resolvedLabel.formula || resolvedLabel.rationale);
  const activeTraits = useMemo(() => Array.from(new Set([...traits, ...adaptiveTraits])), [traits, adaptiveTraits]);

  const isLearning = activeTraits.includes('learning') || isAgentActive; 
  const theme = getTheme(color);

  if (loading) return <div className={`h-20 w-full bg-white/5 animate-pulse rounded-xl ${className}`} />;

  const wrapperClasses = `
    group relative overflow-visible transition-all duration-500 ease-out focus:outline-none focus:ring-1 focus:ring-celestial-purple/30
    backdrop-blur-xl bg-slate-900/60 border border-white/5 hover:bg-white/10
    ${theme.border}
    ${isHighFrequency ? 'ring-1 ring-celestial-purple/20' : ''}
    ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}
    ${className}
  `;

  // 實作一行原則與線性壓縮
  const LabelWithIcon = (
      <div 
        className="flex items-center gap-1.5 relative select-none max-w-full overflow-hidden"
        onMouseEnter={() => isRichLabel && setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
          <span className={`text-gray-500 text-[10px] font-black tracking-[0.1em] transition-colors uppercase whitespace-nowrap overflow-hidden text-ellipsis ${isRichLabel ? 'border-b border-dotted border-celestial-gold/50 hover:text-white cursor-help' : ''}`}>
              {labelText}
          </span>
          {isRichLabel && (
              <div className="p-0.5 rounded bg-celestial-gold/10 text-celestial-gold">
                  <Info className="w-2.5 h-2.5" />
              </div>
          )}
          <InsightTooltip label={resolvedLabel} isVisible={isTooltipVisible} />
      </div>
  );

  const AgentIndicator = isLearning ? (
        <div className="absolute top-2 right-2 z-10">
            <div className="relative">
                <div className="absolute inset-0 bg-celestial-purple rounded-full animate-ping opacity-75" />
                <div className="relative w-1.5 h-1.5 bg-celestial-purple rounded-full border border-white/50" />
            </div>
        </div>
  ) : null;

  if (mode === 'card') {
    return (
      <div className={`${wrapperClasses} rounded-[2rem] shadow-2xl`} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
        {AgentIndicator}
        <div className="relative z-10 p-5 flex flex-col h-full justify-between gap-4">
          <div className="flex justify-between items-start overflow-hidden">
            <div className="space-y-1.5 flex-1 min-w-0">
               <div className="flex items-center gap-3">
                  {LabelWithIcon}
                  <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={() => trackInteraction?.('ai-trigger')} label={labelText} />
               </div>
               <div className="flex flex-wrap gap-2">
                 {dataLink && <DataLinkIndicator type={dataLink} />}
               </div>
            </div>
            <div className={`p-2 rounded-xl border border-white/5 ${theme.iconBg} ${theme.text} transition-all shrink-0 ml-2 shadow-inner`}>
               {Icon ? <Icon className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
            </div>
          </div>

          <div className="mt-2">
             <QuantumValueEditor value={value || 0} theme={theme} onUpdate={(nv) => trackInteraction?.('edit', nv)} />
          </div>
          
          <div className="flex items-end justify-between overflow-hidden">
             <div className="truncate flex-1 mr-2">
                {subValue && <p className="text-[9px] text-gray-500 font-black uppercase leading-none truncate whitespace-nowrap overflow-hidden text-ellipsis">{subValue}</p>}
             </div>
             <ConfidenceIndicator level={confidence} verified={verified} compact />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div className={`${wrapperClasses} p-3 rounded-2xl flex items-center justify-between`} onClick={onClick}>
          {AgentIndicator}
          <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className={`p-2.5 rounded-xl ${theme.iconBg} ${theme.text} shrink-0 shadow-lg`}>
                  {Icon ? <Icon className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
              </div>
              <div className="leading-tight min-w-0 flex-1">
                  <div className="flex items-center gap-2 overflow-hidden mb-0.5">
                    {LabelWithIcon}
                    <QuantumAiTrigger onClick={onAiAnalyze} onInternalTrigger={() => trackInteraction?.('ai-trigger')} label={labelText} />
                  </div>
                  <div className="flex items-center gap-2 text-[9px] overflow-hidden">
                      {subValue && <span className="text-gray-600 font-bold uppercase whitespace-nowrap overflow-hidden text-ellipsis">{subValue}</span>}
                  </div>
              </div>
          </div>
          <div className="text-right px-2 shrink-0 ml-4">
              <div className={`text-sm font-black font-mono whitespace-nowrap ${theme.text}`}>{value}</div>
              <ConfidenceIndicator level={confidence} verified={verified} compact />
          </div>
      </div>
    );
  }

  return null;
});

export const OmniEsgCell = withUniversalProxy(OmniEsgCellBase);
