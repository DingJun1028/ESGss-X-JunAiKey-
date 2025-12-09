
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Command, X } from 'lucide-react';
import { View, Language } from '../types';
import { useToast } from '../contexts/ToastContext';

interface VoiceControlProps {
  onNavigate: (view: View) => void;
  language: Language;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({ onNavigate, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<any>(null);
  const { addToast } = useToast();
  
  const isZh = language === 'zh-TW';

  useEffect(() => {
    // Check for browser support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = isZh ? 'zh-TW' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            setTranscript(transcriptText);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
            processCommand(transcript);
        };
    }
  }, [language, transcript]); // Re-init on language change

  const processCommand = (cmd: string) => {
      const lowerCmd = cmd.toLowerCase();
      let actionTaken = false;

      // Navigation Commands
      if (lowerCmd.includes('dashboard') || lowerCmd.includes('儀表板')) {
          onNavigate(View.DASHBOARD);
          setFeedback(isZh ? '正在導航至儀表板...' : 'Navigating to Dashboard...');
          actionTaken = true;
      } else if (lowerCmd.includes('carbon') || lowerCmd.includes('碳')) {
          onNavigate(View.CARBON);
          setFeedback(isZh ? '開啟碳資產管理...' : 'Opening Carbon Assets...');
          actionTaken = true;
      } else if (lowerCmd.includes('strategy') || lowerCmd.includes('策略')) {
          onNavigate(View.STRATEGY);
          setFeedback(isZh ? '進入策略中樞...' : 'Accessing Strategy Hub...');
          actionTaken = true;
      } else if (lowerCmd.includes('report') || lowerCmd.includes('報告')) {
          onNavigate(View.REPORT);
          setFeedback(isZh ? '啟動報告生成器...' : 'Initializing Report Gen...');
          actionTaken = true;
      } else if (lowerCmd.includes('scan') || lowerCmd.includes('掃描')) {
          onNavigate(View.RESEARCH_HUB);
          setFeedback(isZh ? '啟動研究中心掃描...' : 'Initiating Research Scan...');
          actionTaken = true;
      }

      if (actionTaken) {
          addToast('success', isZh ? `語音指令: "${cmd}"` : `Voice Command: "${cmd}"`, 'JunAiKey Voice');
      } else if (cmd.trim()) {
          setFeedback(isZh ? '無法識別指令。' : 'Command not recognized.');
      }
      
      setTranscript('');
      setTimeout(() => setFeedback(''), 3000);
  };

  const toggleListening = () => {
      if (isListening) {
          recognitionRef.current?.stop();
          setIsListening(false);
      } else {
          setTranscript('');
          setFeedback(isZh ? '正在聆聽...' : 'Listening...');
          
          if (recognitionRef.current) {
              try {
                  recognitionRef.current.start();
                  setIsListening(true);
              } catch (e) {
                  console.error("Speech API Error", e);
                  // Fallback simulation for environments without mic access
                  simulateVoiceInput(); 
              }
          } else {
              simulateVoiceInput();
          }
      }
  };

  const simulateVoiceInput = () => {
      setIsListening(true);
      setFeedback(isZh ? '模擬語音輸入中...' : 'Simulating Voice Input...');
      
      const phrases = isZh 
        ? ['開啟儀表板', '分析碳排數據', '生成 ESG 報告'] 
        : ['Open Dashboard', 'Analyze Carbon Data', 'Generate Report'];
      
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      
      let i = 0;
      const interval = setInterval(() => {
          setTranscript(randomPhrase.substring(0, i + 1));
          i++;
          if (i === randomPhrase.length) {
              clearInterval(interval);
              setTimeout(() => {
                  setIsListening(false);
                  processCommand(randomPhrase);
              }, 800);
          }
      }, 50);
  };

  return (
    <>
      <button
        onClick={toggleListening}
        className={`fixed bottom-6 right-24 z-50 p-4 rounded-full shadow-lg transition-all duration-300 group
            ${isListening 
                ? 'bg-red-500/90 shadow-red-500/50 animate-pulse scale-110' 
                : 'bg-slate-800/80 hover:bg-slate-700 text-white border border-white/10 hover:border-celestial-emerald/50'
            }
        `}
        title={isZh ? "語音指令" : "Voice Command"}
      >
        {isListening ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-gray-400 group-hover:text-white" />}
      </button>

      {/* Voice Overlay UI */}
      {isListening && (
          <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
              <button onClick={toggleListening} className="absolute top-8 right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
                  <X className="w-6 h-6" />
              </button>

              <div className="relative mb-8">
                  {/* Pulsing Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-celestial-emerald/30 animate-[ping_2s_linear_infinite]" />
                  <div className="absolute inset-0 rounded-full border-2 border-celestial-purple/30 animate-[ping_2s_linear_infinite_0.5s]" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-celestial-emerald to-celestial-purple flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                      <Mic className="w-10 h-10 text-white animate-bounce" />
                  </div>
              </div>

              <div className="text-center space-y-4 max-w-lg px-4">
                  <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                      <Command className="w-6 h-6 text-celestial-gold" />
                      JunAiKey Voice
                  </h3>
                  
                  <div className="h-16 flex items-center justify-center">
                      {transcript ? (
                          <p className="text-xl text-white font-mono">{transcript}</p>
                      ) : (
                          <div className="flex items-center gap-1 h-8">
                              {[...Array(5)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className="w-1.5 bg-celestial-emerald rounded-full animate-[pulse_1s_ease-in-out_infinite]"
                                    style={{ height: `${Math.random() * 24 + 8}px`, animationDelay: `${i * 0.1}s` }} 
                                  />
                              ))}
                          </div>
                      )}
                  </div>
                  
                  <p className="text-sm text-gray-400">{feedback}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-8 opacity-70">
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400">
                          "Go to Dashboard"
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400">
                          "Open Carbon Assets"
                      </div>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
