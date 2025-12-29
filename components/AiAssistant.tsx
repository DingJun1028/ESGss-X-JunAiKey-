import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Language, View } from '../types';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { universalIntelligence } from '../services/evolutionEngine';
import { streamChat } from '../services/ai-service';
import { MessageSquare, Send, X, Bot, Sparkles, Loader2, Settings, Sliders, PenTool, Save, RotateCcw, Minus } from 'lucide-react';
import { QuantumSlider } from './minimal/QuantumSlider';

export const AiAssistant: React.FC<{ language: Language, onNavigate: (view: View) => void, currentView: View, isMobile?: boolean }> = ({ language, onNavigate, currentView, isMobile }) => {
  const { 
    activePersona, addLog, trainingDocs, commitChatToMemory, 
    traits, updateTraits, updatePersonaStats, isProcessing
  } = useUniversalAgent();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isZh = language === 'zh-TW';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSend = useCallback(async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;
    if (!customInput) setInput('');
    setIsTyping(true);
    
    setChatHistory(prev => [...prev, { role: 'user', text: textToSend }]);
    
    try {
        const keywords = textToSend.split(/\s+/).filter(k => k.length > 1);
        const retrievedNodes = universalIntelligence.retrieveContextualNodes({ keywords });
        
        const augmentedSystemPrompt = `
            ${activePersona.systemPrompt}
            當前用戶人格矩陣：利他:${traits.altruism}% 實用:${traits.pragmatism}% 創新:${traits.innovation}%
        `;

        const knowledgeBase = retrievedNodes.map(node => node.atom);
        const stream = streamChat(textToSend, language, augmentedSystemPrompt, knowledgeBase);

        let assistantText = '';
        setChatHistory(prev => [...prev, { role: 'assistant', text: '' }]);
        
        for await (const chunk of stream) {
            assistantText += chunk.text || '';
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].text = assistantText;
                return newHistory;
            });
        }
        commitChatToMemory(textToSend, assistantText);
    } catch(e) {
        addLog('Logic Error', 'error', 'Kernel');
    } finally {
        setIsTyping(false);
    }
  }, [input, isTyping, activePersona, traits, language, commitChatToMemory, addLog]);

  const toggleAssistant = () => {
    if (isOpen) {
      // 觸發飛向 Logo 動畫
      setIsFlying(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsFlying(false);
      }, 800);
    } else {
      setIsOpen(true);
    }
  };

  const flyingStyles = useMemo(() => {
    if (!isFlying) return {};
    return {
      top: '20px',
      left: '20px',
      width: '32px',
      height: '32px',
      opacity: 0,
      transform: 'scale(0.2) rotate(360deg)',
    };
  }, [isFlying]);

  return (
    <>
      <div 
        className={`fixed z-[300] transition-all duration-700 ease-in-out ${isOpen ? 'bottom-20 right-6' : 'bottom-6 right-6'} ${isFlying ? 'fly-to-logo' : ''}`}
        style={flyingStyles}
      >
        {!isOpen ? (
            <button 
                onClick={toggleAssistant}
                className="w-14 h-14 rounded-full bg-celestial-purple shadow-2xl flex items-center justify-center hover:scale-110 transition-all group border border-white/20 animate-liquid-flow"
            >
                <div className="absolute inset-0 bg-celestial-purple blur-xl opacity-40 animate-pulse rounded-full" />
                <Bot className="w-6 h-6 text-white relative z-10 group-hover:animate-bounce" />
            </button>
        ) : (
            <div 
                className={`${isMobile ? 'w-[92vw] right-[4vw]' : 'w-[400px]'} bg-[#020617] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up backdrop-blur-3xl`}
                style={{ height: '560px', maxHeight: '70vh' }}
            >
                {/* Header */}
                <div className="p-5 border-b border-white/5 bg-slate-900/40 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-celestial-purple/20 text-celestial-purple border border-celestial-purple/30">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-black text-white uppercase tracking-widest text-[10px] block">JunAiKey Agent</span>
                            <span className="text-[7px] text-gray-500 font-mono uppercase tracking-tighter">KERNEL_v16_STABLE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-xl transition-all ${showSettings ? 'bg-celestial-gold text-black' : 'hover:bg-white/5 text-gray-500'}`} title="Settings"><Settings className="w-4 h-4" /></button>
                        <button onClick={toggleAssistant} className="p-2 hover:bg-white/5 rounded-xl text-gray-500"><Minus className="w-4 h-4"/></button>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
                    {showSettings ? (
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-slate-950/20 animate-fade-in">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2"><Sliders className="w-3 h-3 text-celestial-gold" /> TRAIT_MATRIX</h4>
                            <div className="space-y-6">
                                <QuantumSlider label={isZh ? '利他' : 'Altruism'} value={traits.altruism} min={0} max={100} unit="%" color="emerald" onChange={(v) => updateTraits({ altruism: v })} />
                                <QuantumSlider label={isZh ? '實用' : 'Pragmatism'} value={traits.pragmatism} min={0} max={100} unit="%" color="gold" onChange={(v) => updateTraits({ pragmatism: v })} />
                                <QuantumSlider label={isZh ? '創新' : 'Innovation'} value={traits.innovation} min={0} max={100} unit="%" color="purple" onChange={(v) => updateTraits({ innovation: v })} />
                            </div>
                            <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-xl"><Save className="w-4 h-4" /> Apply_Protocol</button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05)_0%,transparent_70%)]">
                                {chatHistory.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                        <Sparkles className="w-12 h-12 text-celestial-gold mb-4 animate-pulse" />
                                        <h4 className="zh-main text-white mb-2">{isZh ? '架構師，有何指令？' : 'Awaiting directive, Architect.'}</h4>
                                    </div>
                                )}
                                {chatHistory.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed ${m.role === 'user' ? 'bg-celestial-purple text-white rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'}`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-2 items-center">
                                            <Loader2 className="w-3 h-3 text-celestial-purple animate-spin" />
                                            <span className="text-[9px] text-gray-500 font-black uppercase">Reasoning...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-white/5 bg-slate-950/50">
                                <div className="relative">
                                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all placeholder:text-gray-600" placeholder={isZh ? "輸入查詢..." : "Query..."} />
                                    <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-celestial-purple text-white rounded-xl shadow-lg disabled:opacity-30"><Send className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}
      </div>
    </>
  );
};
