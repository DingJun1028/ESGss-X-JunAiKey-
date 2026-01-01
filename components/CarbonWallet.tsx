
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Coins, TrendingUp, ArrowRight, Loader2, Zap, ShieldCheck, 
    Globe, Activity, DollarSign, ArrowUpRight, ArrowDownLeft,
    Box, Star, RefreshCw, BarChart3, Wallet, Flame, Gem,
    ExternalLink, CheckCircle, Info, Layout, ShoppingCart
} from 'lucide-react';
import { Language, CarbonMarketHistory, CarbonAssetPackage } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { runMcpAction } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer 
} from 'recharts';

export const CarbonWallet: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { companyName, carbonData, awardXp, addJournalEntry } = useCompany();
  
  const [isMinting, setIsMinting] = useState(false);
  const [marketHistory, setMarketHistory] = useState<CarbonMarketHistory[]>([]);
  const [activeAssets, setActiveAssets] = useState<CarbonAssetPackage[]>([]);
  const [tradingLog, setTradingLog] = useState<{ id: string, msg: string, time: string }[]>([]);

  // Action 10 State
  const [manifestedAsset, setManifestedAsset] = useState<any>(null);

  useEffect(() => {
      // Mock data for wealth visualization
      const data: CarbonMarketHistory[] = Array.from({ length: 20 }).map((_, i) => ({
          time: `${i}:00`,
          price: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5
      }));
      setMarketHistory(data);

      setActiveAssets([
          { id: 'vcs-001', standard: 'VCS', volume: 1250, unit: 'tCO2e', status: 'Verified', marketValue: 106250, listingHash: '0x8B32...F2' },
          { id: 'gs-042', standard: 'GOLD_STANDARD', volume: 840, unit: 'tCO2e', status: 'Listed', marketValue: 88200, listingHash: '0x12A9...C3' }
      ]);
  }, []);

  const handleMintAsset = async () => {
    setIsMinting(true);
    setManifestedAsset(null);
    addToast('info', isZh ? '正在執行 [動作 10：數位資產煉金]...' : 'Initiating [Action 10: Digital Asset Alchemistry]...', 'Market Liaison');
    
    try {
        const res = await runMcpAction('list_carbon_credits', {
            verifiedReduction: 12450, // Cumulative verified total
            projectMeta: { name: companyName, region: 'Taiwan', type: 'Energy Efficiency' }
        }, language);

        if (res.success) {
            setManifestedAsset(res.result);
            awardXp(1500);
            addJournalEntry(
                isZh ? '完成碳資產國際掛牌' : 'Carbon Asset Listed Internationally',
                isZh ? `成功將減碳成果轉化為可交易資產。掛牌量: 12,450 tCO2e。預計價值: $${res.result.totalValue.toLocaleString()}` : `Reduction manifested as tradable asset. Volume: 12,450. Estimated Value: $${res.result.totalValue.toLocaleString()}`,
                1500, 'milestone', ['CarbonMarket', 'Alchemistry']
            );
            addToast('reward', isZh ? `神跡顯現！資產已上架，預計價值 $${res.result.totalValue.toLocaleString()}` : `Manifestation Successful! Value: $${res.result.totalValue.toLocaleString()}`, 'Sacred Forge');
        }
    } catch (e) {
        addToast('error', 'Market reasoning sequence interrupted.', 'Error');
    } finally {
        setIsMinting(false);
    }
  };

  const totalWealth = useMemo(() => {
      const activeVal = activeAssets.reduce((acc, a) => acc + a.marketValue, 0);
      const manifestedVal = manifestedAsset ? manifestedAsset.totalValue : 0;
      return activeVal + manifestedVal;
  }, [activeAssets, manifestedAsset]);

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-12">
        <UniversalPageHeader 
            icon={Gem}
            title={{ zh: '國際碳資產錢包', en: 'Global Carbon Wallet' }}
            description={{ zh: '從成本中心轉向獲利中心：減碳數據的直接資產化與國際交易對接', en: 'From Cost Center to Profit Center: Carbon Tokenization & Global Listing.' }}
            language={language}
            tag={{ zh: '財富核心 v1.0', en: 'WEALTH_CORE_v1.0' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            
            {/* 1. 財富顯化 HUD (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
                <div className="glass-bento p-10 bg-slate-900 border-celestial-gold/30 rounded-[3.5rem] relative overflow-hidden shrink-0 shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05] animate-spin-slow"><Flame className="w-64 h-64 text-celestial-gold" /></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-celestial-gold text-black rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)] animate-prism-pulse mb-6">
                            <Wallet className="w-10 h-10" />
                        </div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Total_Carbon_Asset_Value</h4>
                        <div className="text-6xl font-mono font-black text-white tracking-tighter mb-2">
                            ${totalWealth.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                            <TrendingUp className="w-4 h-4" /> Market Gain: +12.4%
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-950 border-white/10 rounded-[3rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <ShoppingCart className="w-4 h-4" /> ACTIVE_LISTINGS
                    </h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                        {activeAssets.map(asset => (
                            <div key={asset.id} className="p-5 bg-white/5 border border-white/5 rounded-[2.5rem] group hover:border-celestial-gold/40 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-black/40 rounded-xl text-emerald-400 border border-emerald-500/20"><Globe className="w-4 h-4"/></div>
                                        <span className="zh-main text-sm text-white">{asset.standard}</span>
                                    </div>
                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{asset.status}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[18px] font-mono font-bold text-white">{asset.volume.toLocaleString()} <span className="text-[10px] text-gray-600 font-normal">{asset.unit}</span></div>
                                        <div className="text-[10px] text-gray-500 font-mono mt-1">{asset.listingHash}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-celestial-gold">${asset.marketValue.toLocaleString()}</div>
                                        <div className="text-[8px] text-gray-600 uppercase">Valuation</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. 交易市場與資產套現 (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                <div className="flex-[1.5] glass-bento bg-slate-900/40 border-white/5 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.03)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-10 shrink-0 relative z-10">
                        <div className="space-y-4">
                            <h3 className="zh-main text-3xl text-white tracking-tighter uppercase">動作 10：數位資產顯化 (#數據套現)</h3>
                            <p className="text-gray-400 text-lg leading-relaxed font-light italic max-w-xl">
                                「將您的碳減量勳章正式鑄造為國際碳權資產。一鍵對接 ACX 交易所，實現環境價值之實體金流顯化。」
                            </p>
                        </div>
                        <button 
                            onClick={handleMintAsset}
                            disabled={isMinting}
                            className="px-16 py-6 bg-white text-black font-black rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex flex-col items-center gap-2 uppercase tracking-[0.3em] text-xs disabled:opacity-30"
                        >
                            {isMinting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Flame className="w-8 h-8 fill-current" />}
                            MINT_CARBON_ASSET
                        </button>
                    </div>

                    <div className="flex-1 min-h-0 w-full relative z-10 bg-black/40 rounded-[2.5rem] border border-white/5 p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global_Carbon_Price_Index (ACX)</span>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-white">LIVE_FEED: 1.2Hz</div>
                        </div>
                        
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={marketHistory}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }} />
                                    <Area type="monotone" dataKey="price" stroke="#fbbf24" fill="url(#colorPrice)" strokeWidth={3} isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {manifestedAsset && (
                        <div className="mt-8 p-10 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[3rem] animate-slide-up relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck className="w-32 h-32 text-emerald-400" /></div>
                            <div className="space-y-4 flex-1">
                                <div className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5" /> ASSET_MANIFESTED_SUCCESS
                                </div>
                                <h5 className="zh-main text-3xl text-white">掛牌證書：{manifestedAsset.assetId}</h5>
                                <p className="text-sm text-gray-300 italic max-w-2xl leading-relaxed">"{manifestedAsset.marketNarrative}"</p>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-[9px] text-gray-600 uppercase font-black mb-1">Estimated_Settlement</div>
                                <div className="text-5xl font-mono font-black text-white">${manifestedAsset.totalValue.toLocaleString()}</div>
                                <button className="mt-6 px-10 py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-celestial-gold transition-all shadow-xl">Execute_Settlement</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 glass-bento p-8 bg-slate-950 border-white/10 rounded-[3rem] shadow-xl flex flex-col min-h-0 overflow-hidden relative">
                     <div className="flex justify-between items-center mb-6 shrink-0 px-2">
                        <h4 className="zh-main text-[11px] text-celestial-gold uppercase tracking-[0.3em] flex items-center gap-3"><RefreshCw className="w-4 h-4" /> LIVE_TRANSACTION_RESONANCE</h4>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                     </div>
                     <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[10px] text-gray-500 space-y-3 px-2">
                        {[
                            { time: '10:02:45', msg: 'Block verified: VCS project 0xBF32 listed successfully.', type: 'MARKET' },
                            { time: '10:05:12', msg: 'Price signal received: VCS index at $88.42/t.', type: 'TICKER' },
                            { time: '10:12:33', msg: 'Settlement complete: Project SME_04 sold for 42,500 USD.', type: 'SETTLE' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 border-b border-white/[0.02] pb-2 group">
                                <span className="text-gray-800 shrink-0">[{log.time}]</span>
                                <span className="text-celestial-gold font-black shrink-0">[{log.type}]</span>
                                <span className="text-gray-400 group-hover:text-white transition-colors">{log.msg}</span>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
};
