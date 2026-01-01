
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Language, View } from '../types';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { universalIntelligence } from '../services/evolutionEngine';
import { streamChat } from '../services/ai-service';
import { 
    MessageSquare, Send, X, Bot, Sparkles, Loader2, Settings, Sliders, 
    PenTool, Save, RotateCcw, Minus, Database, CheckCircle2, Mic, Volume2, Brain,
    Wifi, Radio, Activity
} from 'lucide-react';
import { QuantumSlider } from './minimal/QuantumSlider';
import { useToast } from '../contexts/ToastContext';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// --- Audio Decoding Helpers (Required for Live API) ---
function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
}

function encode(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

function createBlob(data: Float32Array): any {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

export const AiAssistant: React.FC<{ language: Language, onNavigate: (view: View) => void, currentView: View, isMobile?: boolean }> = ({ language, onNavigate, currentView, isMobile }) => {
  const { activePersona, addLog, commitChatToMemory, traits, updateTraits, isProcessing } = useUniversalAgent();
  const { addToast } = useToast();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string, isSaved?: boolean, thinking?: boolean}[]>([]);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  
  // Voice Mode States
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  
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
            ${isThinkingMode ? "請進行深思熟慮的推理。" : ""}
        `;

        const knowledgeBase = retrievedNodes.map(node => node.atom);
        const stream = streamChat(textToSend, language, augmentedSystemPrompt, knowledgeBase, [], 'gemini-3-pro-preview', isThinkingMode);

        let assistantText = '';
        setChatHistory(prev => [...prev, { role: 'assistant', text: '', thinking: isThinkingMode }]);
        
        for await (const chunk of stream) {
            assistantText += chunk.text || '';
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].text = assistantText;
                return newHistory;
            });
        }
        
        commitChatToMemory(textToSend, assistantText);
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].isSaved = true;
            return newHistory;
        });
        addToast('success', isZh ? '智慧已刻印至內核記憶' : 'Intelligence engraved to kernel', 'Memory Hub');
    } catch(e) {
        addLog('Logic Error', 'error', 'Kernel');
    } finally {
        setIsTyping(false);
    }
  }, [input, isTyping, activePersona, traits, language, commitChatToMemory, addLog, addToast, isZh, isThinkingMode]);

  // --- Voice Mode Logic (Live API) ---
  const startVoiceMode = async () => {
      if (isVoiceActive) {
          sessionRef.current?.close();
          setIsVoiceActive(false);
          return;
      }

      setIsVoiceActive(true);
      addToast('info', isZh ? '正在初始化神經共鳴語音協定...' : 'Initializing Neural Voice Protocol...', 'Live API');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outCtx;

      const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
              onopen: () => {
                  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                      const inCtx = new AudioContext({ sampleRate: 16000 });
                      const source = inCtx.createMediaStreamSource(stream);
                      const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
                      scriptProcessor.onaudioprocess = (e) => {
                          const pcmBlob = createBlob(e.inputBuffer.getChannelData(0));
                          sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
                      };
                      source.connect(scriptProcessor);
                      scriptProcessor.connect(inCtx.destination);
                  });
              },
              onmessage: async (msg: LiveServerMessage) => {
                  const base64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                  if (base64) {
                      nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                      const buf = await decodeAudioData(decode(base64), outCtx, 24000, 1);
                      const source = outCtx.createBufferSource();
                      source.buffer = buf;
                      source.connect(outCtx.destination);
                      source.start(nextStartTimeRef.current);
                      nextStartTimeRef.current += buf.duration;
                  }
              },
              onerror: () => setIsVoiceActive(false),
              onclose: () => setIsVoiceActive(false),
          },
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
              systemInstruction: 'You are a helpful ESG expert. Keep responses concise and natural for voice conversation.'
          }
      });
      sessionRef.current = await sessionPromise;
  };

  const toggleAssistant = () => {
    if (isOpen) {
      setIsFlying(true);
      setTimeout(() => { setIsOpen(false); setIsFlying(false); }, 800);
    } else { setIsOpen(true); }
  };

  return (
    <>
      <div 
        className={`fixed z-[300] transition-all duration-700 ease-in-out ${isOpen ? 'bottom-20 right-6' : 'bottom-6 right-6'} ${isFlying ? 'fly-to-logo' : ''}`}
        style={!isFlying ? {} : { top: '20px', left: '20px', width: '32px', height: '32px', opacity: 0, transform: 'scale(0.2) rotate(360deg)' }}
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
                style={{ height: '620px', maxHeight: '80vh' }}
            >
                {/* Header */}
                <div className="p-5 border-b border-white/5 bg-slate-900/40 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-celestial-purple/20 border border-celestial-purple/30 ${isVoiceActive ? 'animate-neural-pulse text-emerald-400' : 'text-celestial-purple'}`}>
                            {isVoiceActive ? <Radio className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div>
                            <span className="font-black text-white uppercase tracking-widest text-[10px] block">JunAiKey Agent</span>
                            <span className="text-[7px] text-gray-500 font-mono uppercase tracking-tighter">HYPERCUBE_SYNC_L16.1</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setIsThinkingMode(!isThinkingMode)} 
                            className={`p-2 rounded-xl transition-all ${isThinkingMode ? 'bg-amber-500/20 text-amber-500' : 'text-gray-500 hover:text-white'}`}
                            title="Thinking Mode (Gemini 3 Pro)"
                        >
                            <Brain className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={startVoiceMode} 
                            className={`p-2 rounded-xl transition-all ${isVoiceActive ? 'bg-emerald-500 text-black animate-pulse' : 'text-gray-500 hover:text-white'}`}
                            title="Conversational Voice (Live API)"
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-xl transition-all ${showSettings ? 'bg-celestial-gold text-black' : 'hover:bg-white/5 text-gray-500'}`}><Settings className="w-4 h-4" /></button>
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
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                                {isVoiceActive && (
                                    <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                                        <div className="relative mb-8">
                                            <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 animate-neural-pulse" />
                                            <Activity className="absolute inset-0 m-auto w-12 h-12 text-emerald-400" />
                                        </div>
                                        <h4 className="zh-main text-white mb-2">神經共鳴中 (Voice Active)</h4>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Live Audio Stream Locked</p>
                                    </div>
                                )}
                                
                                {!isVoiceActive && chatHistory.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                        <Sparkles className="w-12 h-12 text-celestial-gold mb-4 animate-pulse" />
                                        <h4 className="zh-main text-white mb-2">{isZh ? '架構師，有何指令？' : 'Awaiting directive, Architect.'}</h4>
                                    </div>
                                )}
                                
                                {!isVoiceActive && chatHistory.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed relative ${m.role === 'user' ? 'bg-celestial-purple text-white rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'}`}>
                                            {m.thinking && m.role === 'assistant' && (
                                                <div className="text-[7px] text-amber-500 font-bold uppercase mb-1 flex items-center gap-1">
                                                    <Brain className="w-2 h-2" /> Reasoned_Result
                                                </div>
                                            )}
                                            {m.text}
                                            {m.role === 'assistant' && m.isSaved && (
                                                <div className="absolute -bottom-2 -right-2 p-1 bg-slate-900 rounded-lg border border-white/10 shadow-lg animate-fade-in"><Database className="w-2.5 h-2.5 text-celestial-gold" /></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex gap-2 items-center">
                                            <Loader2 className="w-3 h-3 text-celestial-purple animate-spin" />
                                            <span className="text-[9px] text-gray-500 font-black uppercase">{isThinkingMode ? 'Deep Reasoning...' : 'Syncing...'}</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-white/5 bg-slate-950/50">
                                <div className="relative">
                                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-celestial-purple outline-none" placeholder={isVoiceActive ? "Voice mode active..." : (isThinkingMode ? "Query with Deep Thinking..." : "Ask something...")} disabled={isVoiceActive} />
                                    <button onClick={() => handleSend()} disabled={!input.trim() || isTyping || isVoiceActive} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-celestial-purple text-white rounded-xl shadow-lg disabled:opacity-30"><Send className="w-4 h-4" /></button>
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
