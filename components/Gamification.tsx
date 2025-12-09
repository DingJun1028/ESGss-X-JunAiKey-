
import React, { useState, useMemo } from 'react';
import { Language, EsgCard } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { UniversalCard } from './UniversalCard';
import { getEsgCards } from '../constants';
import { Search, Trophy, Zap, X, Shield } from 'lucide-react';
import { useCardPurification } from '../hooks/useCardPurification';

interface GamificationProps {
  language: Language;
}

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

  const allCards = useMemo(() => getEsgCards(language), [language]);

  const sortedCards = useMemo(() => {
      let filtered = allCards;
      if (filter !== 'all') {
          filtered = filtered.filter(c => c.attribute === filter || c.rarity === filter);
      }
      if (search) {
          filtered = filtered.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.term.toLowerCase().includes(search.toLowerCase()));
      }
      // Sort: Collected first, then by ID
      return filtered.sort((a, b) => {
          const aCollected = collectedCards.includes(a.id);
          const bCollected = collectedCards.includes(b.id);
          if (aCollected && !bCollected) return -1;
          if (!aCollected && bCollected) return 1;
          return 0;
      });
  }, [allCards, filter, search, collectedCards]);

  const stats = useMemo(() => {
      const total = allCards.length;
      const unlocked = collectedCards.length;
      const purified = purifiedCards.length;
      return { total, unlocked, purified };
  }, [allCards, collectedCards, purifiedCards]);

  return (
    <div className="space-y-8 animate-fade-in pb-24">
        {cardToPurify && (
            <PurificationModal 
                card={cardToPurify} 
                onClose={() => setCardToPurify(null)} 
                language={language} 
            />
        )}

        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">{isZh ? '善向卡牌遊戲' : 'ESG Sunshine Card Game'}</h2>
                <p className="text-gray-400">{isZh ? '全域系統化：將知識與影響力鑄造為數位資產' : 'Global Systemization: Minting knowledge & impact into digital assets.'}</p>
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

        {/* Filters */}
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

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {sortedCards.map((card) => {
                const isUnlocked = collectedCards.includes(card.id);
                const isPurified = purifiedCards.includes(card.id);
                const isSealed = isUnlocked && !isPurified;
                const mastery = cardMastery[card.id] || 'Novice';
                
                const handleCardClick = () => {
                    if (isSealed) {
                        setCardToPurify(card);
                    } else if (!isUnlocked) {
                        addToast('error', isZh ? '卡片未解鎖。請完成任務獲取。' : 'Locked. Complete quests to unlock.', 'System');
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
                    <div key={card.id} className="animate-fade-in">
                        <UniversalCard 
                            card={card} 
                            isLocked={!isUnlocked}
                            isSealed={isSealed} 
                            masteryLevel={mastery}
                            onKnowledgeInteraction={handleKnowledgeInteraction}
                            onPurifyRequest={() => setCardToPurify(card)} 
                            onClick={handleCardClick}
                        />
                    </div>
                );
            })}
        </div>
    </div>
  );
};
