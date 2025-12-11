
import React, { useState, useMemo } from 'react';
import { Language, EsgCard } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalCard } from './UniversalCard';
import { getEsgCards } from '../constants';
import { Search, Trophy, Zap, X, Shield, FileText, CheckCircle, Activity, Globe, Leaf, ArrowUp, ArrowDown, Triangle, Loader2, Link, Book } from 'lucide-react';
import { useCardPurification } from '../hooks/useCardPurification';
import { universalIntelligence } from '../services/evolutionEngine';
import { analyzeCardContext } from '../services/ai-service';

interface GamificationProps {
  language: Language;
}

const RARITY_VALUE: Record<string, number> = {
  'Common': 1,
  'Rare': 2,
  'Epic': 3,
  'Legendary': 4
};

// Modal for Card Purification
const PurificationModal: React.FC<{ 
    card: EsgCard; 
    onClose: () => void; 
    language: Language;
}> = ({ card, onClose, language }) => {
    const isZh = language === 'zh-TW';
    // Using the hook we presumably have or simulating logic here if simpler
    const { 
        step, currentQuiz, loading, startReading, startQuiz, submitAnswer, resetProcess
    } = useCardPurification(card, false, onClose);

    // Initial trigger
    React.useEffect(() => {
        startReading();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-celestial-purple" />
                        {isZh ? '知識淨化儀式' : 'Knowledge Purification Ritual'}
                    </h3>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
                </div>
                
                <div className="p-8 flex-1 overflow-y-auto">
                    {step === 'reading' && (
                        <div className="text-center space-y-6">
                            <h2 className="text-2xl font-bold text-white">{card.term}</h2>
                            <p className="text-gray-300 leading-relaxed max-w-lg mx-auto">{card.definition}</p>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-400">
                                {isZh ? '請仔細閱讀以上定義。準備好後開始測驗。' : 'Read the definition carefully. Start quiz when ready.'}
                            </div>
                            <button onClick={startQuiz} disabled={loading} className="px-8 py-3 bg-celestial-purple text-white font-bold rounded-xl hover:bg-purple-600 transition-all">
                                {loading ? 'Loading...' : (isZh ? '開始測驗' : 'Start Quiz')}
                            </button>
                        </div>
                    )}

                    {step === 'quizzing' && currentQuiz && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white">{currentQuiz.question}</h3>
                            <div className="space-y-3">
                                {currentQuiz.options.map((opt, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => submitAnswer(idx)}
                                        className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-celestial-purple/50 transition-all text-gray-200"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center space-y-6">
                            <Trophy className="w-20 h-20 text-celestial-gold mx-auto animate-bounce" />
                            <h2 className="text-3xl font-bold text-white">{isZh ? '淨化成功！' : 'Purification Complete!'}</h2>
                            <p className="text-gray-400">{isZh ? '您已解鎖此卡片的完整力量。' : 'You have unlocked the full power of this card.'}</p>
                            <button onClick={onClose} className="px-8 py-3 bg-celestial-gold text-black font-bold rounded-xl hover:bg-amber-400 transition-all">
                                {isZh ? '領取獎勵' : 'Claim Reward'}
                            </button>
                        </div>
                    )}

                    {step === 'failed' && (
                        <div className="text-center space-y-6">
                            <Shield className="w-20 h-20 text-red-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-white">{isZh ? '淨化失敗' : 'Purification Failed'}</h2>
                            <p className="text-gray-400">{isZh ? '共鳴不足。請重新閱讀定義。' : 'Resonance insufficient. Please review the definition.'}</p>
                            <button onClick={resetProcess} className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                                {isZh ? '重試' : 'Retry'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Modal for Intel Prism (Light Interpretation)
const IntelPrismModal: React.FC<{ 
    card: EsgCard; 
    data: any; 
    onClose: () => void; 
    language: Language 
}> = ({ card, data, onClose, language }) => {
    const isZh = language === 'zh-TW';
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-4xl bg-slate-900 border border-celestial-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-celestial-gold/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-celestial-gold/20 rounded-lg">
                            <Triangle className="w-6 h-6 text-celestial-gold" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{card.term}</h3>
                            <div className="flex items-center gap-2 text-xs text-celestial-gold/80">
                                <Activity className="w-3 h-3 animate-pulse" />
                                {isZh ? '即時智能光譜分析' : 'Real-time Intel Prism'}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Core Frequency */}
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/5 text-sm font-mono text-gray-400 mb-3">
                            CORE FREQUENCY
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-celestial-gold to-white tracking-tight">
                            "{data?.coreFrequency || 'Analyzing Signal...'}"
                        </h2>
                    </div>

                    {/* Spectrum Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {data?.spectrum?.map((band: any, i: number) => (
                            <div key={i} className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-b opacity-10 rounded-2xl transition-opacity group-hover:opacity-20
                                    ${band.color === 'emerald' ? 'from-emerald-500 to-transparent' : 
                                      band.color === 'amber' ? 'from-amber-500 to-transparent' : 
                                      'from-purple-500 to-transparent'}
                                `} />
                                <div className={`p-6 rounded-2xl border border-white/10 h-full flex flex-col relative z-10
                                    ${band.color === 'emerald' ? 'hover:border-emerald-500/50' : 
                                      band.color === 'amber' ? 'hover:border-amber-500/50' : 
                                      'hover:border-purple-500/50'}
                                    transition-colors
                                `}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded
                                            ${band.color === 'emerald' ? 'text-emerald-400 bg-emerald-500/10' : 
                                              band.color === 'amber' ? 'text-amber-400 bg-amber-500/10' : 
                                              'text-purple-400 bg-purple-500/10'}
                                        `}>
                                            {band.wavelength}
                                        </span>
                                        <span className="text-xs font-mono text-gray-500">{band.intensity}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                        {band.insight}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sources */}
                    {data?.sources && data.sources.length > 0 && (
                        <div className="pt-6 border-t border-white/10">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Intelligence Sources</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.sources.map((src: any, i: number) => (
                                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400">
                                        <Link className="w-3 h-3" />
                                        {typeof src === 'string' ? src : src.title || 'Web Source'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Whitepaper Modal Component ---
const WhitepaperModal: React.FC<{ onClose: () => void; isZh: boolean }> = ({ onClose, isZh }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-4xl bg-slate-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
                        <Globe className="w-5 h-5 text-celestial-gold" />
                        Good Era: Omni-OS v4.0 Technical Whitepaper
                    </h3>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Genesis Monolith • AGPL-3.0</span>
                </div>
                <button onClick={onClose}><X className="w-6 h-6 text-gray-400 hover:text-white" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                    <div className="p-4 border border-celestial-gold/30 bg-celestial-gold/5 rounded-xl mb-8">
                        <strong className="text-celestial-gold block mb-2">📜 核心哲學 (Core Philosophy)</strong>
                        <p>以代碼承載 ESG 知識，以遊戲驅動真實變革。 (Encoding ESG knowledge into code; driving real change through gamification.)</p>
                    </div>

                    <h2 className="text-white font-bold text-lg mt-6 mb-4 border-b border-white/10 pb-2">1. 系統架構總覽 (System Architecture)</h2>
                    <p>本系統採用 「單體微服務化 (Monolithic Microservices)」 的前端架構設計。雖為單頁應用 (SPA)，但內部邏輯嚴格遵循 MECE (互斥且窮盡) 原則進行模組切割。</p>
                    
                    <h3 className="text-white font-semibold mt-4 mb-2">1.1 技術堆疊 (Tech Stack)</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong className="text-celestial-emerald">Core:</strong> React 19 (Fiber/Hooks)</li>
                        <li><strong className="text-celestial-blue">Style:</strong> Tailwind CSS (Utility-first) + Glassmorphism 2.0</li>
                        <li><strong className="text-celestial-purple">State:</strong> Universal Intelligence Engine (Custom Observable Store)</li>
                        <li><strong className="text-celestial-gold">AI:</strong> Gemini 3 Pro (Reasoning) + Gemini 2.5 Flash (Vision)</li>
                    </ul>

                    <h2 className="text-white font-bold text-lg mt-8 mb-4 border-b border-white/10 pb-2">2. 核心模塊詳解 (Core Modules)</h2>
                    
                    <h3 className="text-white font-semibold mt-4 mb-2">🔧 模塊一：萬能智庫 (Universal Think Tank)</h3>
                    <div className="bg-white/5 p-3 rounded-lg mb-4 font-mono text-xs">
                        #記憶聖所 #全知之眼
                    </div>
                    <p>職責：管理靜態資產、多語言字典、卡牌數據庫。卡牌結構支援動態 i18n 切換。</p>

                    <h3 className="text-white font-semibold mt-4 mb-2">🔧 模塊二：進化引擎 (Evolution Engine)</h3>
                    <div className="bg-white/5 p-3 rounded-lg mb-4 font-mono text-xs">
                        #原罪煉金 #熵減寶石
                    </div>
                    <p>職責：處理遊戲循環、資源計算、戰役推進。引入 Roguelike 地圖算法生成隨機事件節點。</p>

                    <h3 className="text-white font-semibold mt-4 mb-2">🔧 模塊三：全知學院 (Academy System)</h3>
                    <div className="bg-white/5 p-3 rounded-lg mb-4 font-mono text-xs">
                        #光之羽翼 #知識傳承
                    </div>
                    <p>職責：教育互動、測驗回饋、真實獎勵。Learn-to-Earn 機制，答題獲取 IP 購買卡包。</p>

                    <h2 className="text-white font-bold text-lg mt-8 mb-4 border-b border-white/10 pb-2">3. 復刻與擴展 (Replication & Roadmap)</h2>
                    <p>為了確保系統歷久彌新，未來開發者應遵循以下路徑：</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li><strong>v4.5 (Real-Link):</strong> 連接真實後端 Node.js 服務與 WikiRate API。</li>
                        <li><strong>v5.0 (Chain-Link):</strong> 接入 ethers.js，將 DAO 投票上鏈至 Ethereum/Polygon。</li>
                        <li><strong>v6.0 (Reality-Link):</strong> PWA 版本，利用手機鏡頭 API 進行真實世界的「環保行為驗證 (Play-to-Impact)」。</li>
                    </ul>

                    <div className="mt-8 pt-4 border-t border-white/10 text-center italic text-gray-500">
                        "System Status: All Green. Entropy: Minimal. Legacy: Eternal."
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const Gamification: React.FC<GamificationProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { 
      collectedCards, purifiedCards, cardMastery, 
      updateCardMastery, awardXp 
  } = useCompany();
  const { addToast } = useToast();
  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [cardToPurify, setCardToPurify] = useState<EsgCard | null>(null);
  const [showWhitepaper, setShowWhitepaper] = useState(false);
  
  // Sorting State
  const [sortKey, setSortKey] = useState<'collection' | 'rarity' | 'title' | 'defense' | 'offense'>('collection');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Prism State
  const [prismCard, setPrismCard] = useState<EsgCard | null>(null);
  const [prismData, setPrismData] = useState<any>(null);
  const [isPrismLoading, setIsPrismLoading] = useState(false);

  const allCards = useMemo(() => getEsgCards(language), [language]);

  // Active Synergies Calculation
  const activeSynergies = useMemo(() => 
      universalIntelligence.calculateActiveSynergies(collectedCards, language), 
  [collectedCards, language]);

  const sortedCards = useMemo(() => {
      let filtered = allCards;
      if (filter !== 'all') {
          filtered = filtered.filter(c => c.attribute === filter || c.rarity === filter);
      }
      if (search) {
          filtered = filtered.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.term.toLowerCase().includes(search.toLowerCase()));
      }
      
      return filtered.sort((a, b) => {
          let comparison = 0;
          switch (sortKey) {
              case 'rarity':
                  comparison = (RARITY_VALUE[a.rarity] || 0) - (RARITY_VALUE[b.rarity] || 0);
                  break;
              case 'defense':
                  comparison = a.stats.defense - b.stats.defense;
                  break;
              case 'offense':
                  comparison = a.stats.offense - b.stats.offense;
                  break;
              case 'title':
                  comparison = a.title.localeCompare(b.title);
                  break;
              case 'collection':
              default:
                  // Collection sorting: By Collection Set first, then ID
                  if (a.collectionSet !== b.collectionSet) {
                      comparison = a.collectionSet.localeCompare(b.collectionSet);
                  } else {
                      comparison = a.id.localeCompare(b.id);
                  }
                  break;
          }
          return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [allCards, filter, search, sortKey, sortDirection]);

  const stats = useMemo(() => {
      const total = allCards.length;
      const unlocked = collectedCards.length;
      const purified = purifiedCards.length;
      return { total, unlocked, purified };
  }, [allCards, collectedCards, purifiedCards]);

  const handlePrismRequest = async (card: EsgCard) => {
      setPrismCard(card);
      setPrismData(null); // Reset
      setIsPrismLoading(true);
      addToast('info', isZh ? `啟動光譜分析：${card.term}...` : `Initializing Intel Prism: ${card.term}...`, 'AI Agent');

      try {
          const result = await analyzeCardContext(card.term, language);
          if (result) {
              setPrismData(result);
              addToast('success', isZh ? '分析完成' : 'Analysis Complete', 'Intel Prism');
          } else {
              throw new Error("Empty Result");
          }
      } catch (e) {
          setPrismCard(null); // Close modal on error
          addToast('error', isZh ? '分析失敗，請稍後再試' : 'Analysis Failed', 'Error');
      } finally {
          setIsPrismLoading(false);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 relative">
        {isPrismLoading && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-celestial-gold/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="w-12 h-12 text-celestial-gold animate-spin relative z-10" />
                    </div>
                    <span className="text-white font-mono text-sm animate-pulse">
                        {isZh ? '正在折射全球數據...' : 'Refracting Global Data...'}
                    </span>
                </div>
            </div>
        )}

        {prismCard && prismData && (
            <IntelPrismModal 
                card={prismCard} 
                data={prismData} 
                onClose={() => setPrismCard(null)} 
                language={language} 
            />
        )}

        {cardToPurify && (
            <PurificationModal 
                card={cardToPurify} 
                onClose={() => setCardToPurify(null)} 
                language={language} 
            />
        )}

        {showWhitepaper && (
            <WhitepaperModal onClose={() => setShowWhitepaper(false)} isZh={isZh} />
        )}

        {/* System Status Bar - Genesis Monolith Style */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border border-emerald-500/20 rounded-lg text-[10px] font-mono tracking-wider text-emerald-500 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>SYSTEM STATUS: ALL GREEN</span>
            </div>
            <div className="hidden md:block opacity-50">ENTROPY: MINIMAL</div>
            <div>VER: v4.0.2 (Card Album)</div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    {isZh ? '善向紀元 永續ESG (Card Album)' : 'Good Era Sustainable ESG (Album)'}
                    <span className="text-xs bg-celestial-gold text-black px-2 py-0.5 rounded font-mono font-bold tracking-tight">Omni-OS v4.0</span>
                </h2>
                <div className="flex items-center gap-4 text-gray-400 mt-2">
                    <p>{isZh ? '全域系統化：將知識與影響力鑄造為數位資產' : 'Global Systemization: Minting knowledge & impact into digital assets.'}</p>
                    <button 
                        onClick={() => setShowWhitepaper(true)}
                        className="flex items-center gap-1 text-xs text-celestial-purple hover:text-white transition-colors border-b border-dashed border-celestial-purple hover:border-white pb-0.5"
                    >
                        <FileText className="w-3 h-3" />
                        {isZh ? '神聖契約 (白皮書)' : 'Sacred Whitepaper'}
                    </button>
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{isZh ? '收集進度' : 'Collection'}</div>
                    <div className="text-xl font-bold text-white">{stats.unlocked} <span className="text-sm text-gray-500">/ {stats.total}</span></div>
                </div>
                <div className="text-center px-4 py-2 bg-celestial-purple/10 rounded-xl border border-celestial-purple/20">
                    <div className="text-xs text-purple-300 uppercase tracking-wider">{isZh ? '已淨化' : 'Purified'}</div>
                    <div className="text-xl font-bold text-celestial-purple">{stats.purified}</div>
                </div>
            </div>
        </div>

        {/* Synergy Panel (New) */}
        <div className="glass-panel p-6 rounded-xl border border-celestial-gold/20 bg-gradient-to-r from-celestial-gold/5 to-transparent">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-celestial-gold" />
                {isZh ? '共鳴矩陣 (Active Synergies)' : 'Active Synergies'}
            </h3>
            {activeSynergies.length === 0 ? (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Leaf className="w-4 h-4 opacity-50" />
                    {isZh ? '尚未觸發共鳴。收集更多組合卡片以解鎖被動增益。' : 'No synergies active. Collect combos to unlock passive buffs.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeSynergies.map(syn => (
                        <div key={syn.id} className="p-4 bg-slate-900/50 rounded-xl border border-celestial-gold/30 flex items-start gap-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-celestial-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="p-2 bg-celestial-gold/10 rounded-lg">
                                <Zap className="w-4 h-4 text-celestial-gold animate-pulse" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{syn.name}</h4>
                                <p className="text-xs text-gray-400 mt-1">{syn.description}</p>
                                <div className="mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded w-fit">
                                    Buff: {syn.effect.target.toUpperCase()} +{syn.effect.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 items-center glass-panel p-4 rounded-xl border border-white/10">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={isZh ? "搜尋卡片..." : "Search cards..."}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-celestial-emerald/50"
                />
            </div>
            
            <div className="flex gap-2 items-center">
                {/* Sort Controls */}
                <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-white/10 px-2 h-9">
                    <span className="text-[10px] text-gray-500 font-bold uppercase hidden sm:block whitespace-nowrap">{isZh ? '排序' : 'Sort'}:</span>
                    <select 
                        value={sortKey} 
                        onChange={(e) => setSortKey(e.target.value as any)}
                        className="bg-transparent text-white text-xs font-bold outline-none border-none cursor-pointer pr-4 appearance-none hover:text-celestial-emerald transition-colors"
                    >
                        <option value="collection" className="bg-slate-900 text-white">{isZh ? '預設 (卡冊)' : 'Default (Album)'}</option>
                        <option value="rarity" className="bg-slate-900 text-white">{isZh ? '稀有度' : 'Rarity'}</option>
                        <option value="title" className="bg-slate-900 text-white">{isZh ? '名稱' : 'Name'}</option>
                        <option value="defense" className="bg-slate-900 text-white">{isZh ? '防禦 (合規)' : 'Defense (Compliance)'}</option>
                        <option value="offense" className="bg-slate-900 text-white">{isZh ? '攻擊 (創價)' : 'Offense (Value)'}</option>
                    </select>
                    <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
                    <button 
                        onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                        title={isZh ? (sortDirection === 'asc' ? '升序' : '降序') : (sortDirection === 'asc' ? 'Ascending' : 'Descending')}
                    >
                        {sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
                
                <div className="h-6 w-[1px] bg-white/10 mx-2" />

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {['all', 'Environmental', 'Social', 'Governance', 'Legendary'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${filter === f ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Card Album Grid - Immersive Wrapper */}
        <div className="p-8 bg-black/40 rounded-3xl border-4 border-slate-800 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Album Spine Effect */}
            <div className="absolute top-0 bottom-0 left-8 w-px bg-white/5 z-0" />
            <div className="absolute top-0 bottom-0 left-9 w-px bg-white/5 z-0" />
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                {sortedCards.map((card) => {
                    const isUnlocked = collectedCards.includes(card.id);
                    const isPurified = purifiedCards.includes(card.id);
                    const isSealed = isUnlocked && !isPurified;
                    const mastery = cardMastery[card.id] || 'Novice';
                    
                    const handleCardClick = () => {
                        if (isSealed) {
                            setCardToPurify(card);
                        } else if (!isUnlocked) {
                            addToast('error', isZh ? '卡片槽位未解鎖。請前往任務中心。' : 'Slot Locked. Visit Quest Center.', 'Empty Slot');
                        }
                    };

                    const handleKnowledgeInteraction = () => {
                        if (mastery === 'Novice') {
                            updateCardMastery(card.id, 'Apprentice');
                            awardXp(50);
                            addToast('reward', isZh ? '知識吸收：熟練度提升至學徒' : 'Knowledge Absorbed: Mastery Upgraded to Apprentice', 'Card Evolved');
                        }
                        else if (mastery === 'Apprentice') {
                            updateCardMastery(card.id, 'Master');
                            awardXp(150);
                            addToast('reward', isZh ? '深度理解：熟練度提升至大師' : 'Deep Understanding: Mastery Upgraded to Master', 'Card Evolved');
                        } else {
                            addToast('info', isZh ? '已完全掌握此知識節點。' : 'Knowledge node re-accessed. Reviewing insights.', 'Mastery Maxed');
                        }
                    };

                    return (
                        <div key={card.id} className="animate-fade-in perspective-1000">
                            <UniversalCard 
                                card={card} 
                                isLocked={!isUnlocked}
                                isSealed={isSealed} 
                                masteryLevel={mastery}
                                onKnowledgeInteraction={handleKnowledgeInteraction}
                                onPurifyRequest={() => setCardToPurify(card)} 
                                onClick={handleCardClick}
                                onPrismRequest={() => handlePrismRequest(card)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};
