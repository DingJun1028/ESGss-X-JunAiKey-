
import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { Coins, ArrowUpRight, ArrowDownLeft, ShoppingBag, Package, Sparkles, AlertCircle, Loader2, Wallet, CreditCard, TrendingUp, Star } from 'lucide-react';
import { OmniEsgCell } from './OmniEsgCell';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { getEsgCards } from '../constants';
import { withUniversalProxy, InjectedProxyProps } from './hoc/withUniversalProxy';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';

interface GoodwillCoinProps {
  language: Language;
}

interface VaultAgentProps extends InjectedProxyProps {
    goodwillBalance: number;
    isZh: boolean;
    handleTransaction: (type: 'send' | 'receive') => void;
    isTransacting: boolean;
    openingPack: boolean;
    luckFactor: number; // 傳入幸運係數
}

const VaultAgentBase: React.FC<VaultAgentProps> = ({ 
    goodwillBalance, isZh, handleTransaction, isTransacting, openingPack, luckFactor,
    adaptiveTraits, trackInteraction 
}) => {
    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Coins className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-xl bg-celestial-gold/20 text-celestial-gold border border-celestial-gold/30">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{isZh ? '我的錢包' : 'My Wallet'}</div>
                        <div className="text-3xl font-bold text-white font-mono">{goodwillBalance.toLocaleString()}</div>
                        <div className="text-[10px] text-celestial-gold font-bold">GWC</div>
                    </div>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] text-emerald-400 font-black uppercase">Goodwill Luck</div>
                        <div className="text-lg font-bold text-white">{luckFactor.toFixed(2)}x</div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                        onClick={() => { handleTransaction('send'); trackInteraction?.('click'); }} 
                        disabled={isTransacting || openingPack}
                        className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 disabled:opacity-50"
                    >
                        <ArrowUpRight className="w-4 h-4 text-rose-400" /> {isZh ? '發送' : 'Send'}
                    </button>
                    <button 
                        onClick={() => { handleTransaction('receive'); trackInteraction?.('click'); }} 
                        disabled={isTransacting || openingPack}
                        className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 disabled:opacity-50"
                    >
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> {isZh ? '接收' : 'Receive'}
                    </button>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    {isZh ? '* 善向幣 (GWC) 可用於兌換卡冊與贊助永續專案。' : '* Goodwill Coins (GWC) can redeem cards & sponsor projects.'}
                </p>
            </div>
        </div>
    );
};

const VaultAgent = withUniversalProxy(VaultAgentBase);

export const GoodwillCoin: React.FC<GoodwillCoinProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { goodwillBalance, updateGoodwillBalance, addAuditLog, unlockCard, collectedCards } = useCompany();
  const { luckFactor } = useUniversalAgent(); // 取得幸運係數
  const { addToast } = useToast();
  const [isTransacting, setIsTransacting] = useState(false);
  const [openingPack, setOpeningPack] = useState(false);

  const pageData = {
      title: { zh: '善向幣市集', en: 'Goodwill Marketplace' },
      desc: { zh: '兌換 ESG 知識卡片與虛擬資產', en: 'Redeem ESG Knowledge Cards & Virtual Assets' },
      tag: { zh: '經濟核心', en: 'Econ Core' }
  };

  const ESG_CARDS = useMemo(() => getEsgCards(language), [language]);

  const handleTransaction = (type: 'send' | 'receive') => {
      setIsTransacting(true);
      const amount = Math.floor(Math.random() * 50) + 10;
      setTimeout(() => {
          if (type === 'send') {
              if (goodwillBalance < amount) addToast('error', isZh ? '餘額不足' : 'Insufficient Balance', 'Failed');
              else {
                  updateGoodwillBalance(-amount);
                  addToast('success', isZh ? `已發送 ${amount} GWC` : `Sent ${amount} GWC`, 'Success');
              }
          } else {
              updateGoodwillBalance(amount);
              addToast('success', isZh ? `已接收 ${amount} GWC` : `Received ${amount} GWC`, 'Success');
          }
          setIsTransacting(false);
      }, 1000);
  };

  const handleBuyPack = (cost: number, packName: string) => {
      if (goodwillBalance < cost) {
          addToast('error', isZh ? '餘額不足' : 'Insufficient GWC', 'Marketplace');
          return;
      }

      setOpeningPack(true);
      updateGoodwillBalance(-cost);
      
      setTimeout(() => {
          let results = [];
          for (let i = 0; i < 15; i++) {
              // 幸運 Roll 點邏輯
              const roll = Math.random();
              const legendaryThreshold = 0.99 - (0.01 * luckFactor); // 幸運值越高，門檻越低
              const epicThreshold = 0.95 - (0.02 * luckFactor);
              const rareThreshold = 0.80 - (0.05 * luckFactor);

              let rarityPool = ESG_CARDS.filter(c => c.rarity === 'Common');
              if (roll > legendaryThreshold) rarityPool = ESG_CARDS.filter(c => c.rarity === 'Legendary');
              else if (roll > epicThreshold) rarityPool = ESG_CARDS.filter(c => c.rarity === 'Epic');
              else if (roll > rareThreshold) rarityPool = ESG_CARDS.filter(c => c.rarity === 'Rare');

              const randomCard = rarityPool[Math.floor(Math.random() * rarityPool.length)] || ESG_CARDS[0];
              unlockCard(randomCard.id);
              results.push(randomCard);
          }
          
          const legendaryCount = results.filter(c => c.rarity === 'Legendary').length;
          
          addAuditLog('Marketplace Purchase', `Bought ${packName}. Received 15 cards. Legendary: ${legendaryCount}`);
          addToast('reward', isZh ? `獲得 15 張卡片！(包含 ${legendaryCount} 張傳說卡)` : `Acquired 15 Cards! (${legendaryCount} Legendary)`, 'Pack Opened', 6000);
          setOpeningPack(false);
      }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Coins}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VaultAgent 
                id="UserVault"
                label="Digital Vault"
                goodwillBalance={goodwillBalance}
                isZh={isZh}
                handleTransaction={handleTransaction}
                isTransacting={isTransacting}
                openingPack={openingPack}
                luckFactor={luckFactor}
            />

            <div className="md:col-span-2 glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-celestial-purple" />
                        {isZh ? '善向卡牌包 (15張/包)' : 'Card Booster Packs (15/pack)'}
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-black uppercase">
                        <Star className="w-3 h-3 fill-current" /> Goodwill Boost Active
                    </div>
                </div>
                
                {openingPack && (
                    <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm animate-fade-in">
                        <div className="relative">
                            <Package className="w-20 h-20 text-celestial-gold animate-bounce" />
                            <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-celestial-gold animate-pulse" />
                        </div>
                        <span className="text-celestial-gold font-bold mt-4 animate-pulse">
                            {isZh ? `幸運值 ${luckFactor.toFixed(2)}x 正在影響結果...` : `Luck Factor ${luckFactor.toFixed(2)}x influencing results...`}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer group relative" onClick={() => handleBuyPack(500, 'Standard Pack')}>
                        <div className="flex justify-between items-start mb-4">
                            <Package className="w-10 h-10 text-blue-400" />
                            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold text-white border border-white/10">500 GWC</span>
                        </div>
                        <h4 aria-label="Section Title" className="font-bold text-white mb-1">Standard Pack</h4>
                        <p className="text-xs text-gray-400">Contains 15 random ESG cards. Better drops with higher Goodwill.</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-celestial-gold/30 bg-celestial-gold/5 hover:bg-celestial-gold/10 transition-all cursor-pointer group relative overflow-hidden" onClick={() => handleBuyPack(1200, 'Premium Pack')}>
                        <div className="absolute top-0 right-0 p-2 bg-celestial-gold text-black text-[8px] font-black uppercase tracking-widest">High Rarity</div>
                        <div className="flex justify-between items-start mb-4">
                            <Sparkles className="w-10 h-10 text-celestial-gold animate-pulse" />
                            <span className="px-3 py-1 bg-celestial-gold text-black rounded-lg text-xs font-bold shadow-lg">1200 GWC</span>
                        </div>
                        <h4 aria-label="Section Title" className="font-bold text-white mb-1">Premium Pack</h4>
                        <p className="text-xs text-gray-400">Guaranteed 3 Rare+ cards. Massive bonus from Luck Factor.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
