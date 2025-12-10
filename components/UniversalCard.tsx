import React, { useState } from 'react';
import { Lock, Box, Loader2, Maximize2, Shield, Zap, Triangle } from 'lucide-react';
import { EsgCard, MasteryLevel } from '../types';
import { generateLegoImage } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';

interface UniversalCardProps {
  card: EsgCard;
  isLocked: boolean;
  isSealed: boolean;
  masteryLevel: MasteryLevel;
  onKnowledgeInteraction: () => void;
  onPurifyRequest: () => void;
  onClick: () => void;
  onPrismRequest?: () => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
  card,
  isLocked,
  isSealed,
  masteryLevel,
  onKnowledgeInteraction,
  onPurifyRequest,
  onClick,
  onPrismRequest
}) => {
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedImages, setSavedImages] = useState<string[]>([]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'border-amber-500 shadow-amber-500/20 from-amber-500/10 to-amber-900/20';
      case 'Epic': return 'border-purple-500 shadow-purple-500/20 from-purple-500/10 to-purple-900/20';
      case 'Rare': return 'border-blue-500 shadow-blue-500/20 from-blue-500/10 to-blue-900/20';
      default: return 'border-emerald-500 shadow-emerald-500/20 from-emerald-500/10 to-emerald-900/20';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-amber-400';
      case 'Epic': return 'text-purple-400';
      case 'Rare': return 'text-blue-400';
      default: return 'text-emerald-400';
    }
  };

  const handleLegoize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;
    setIsProcessing(true);
    addToast('info', 'Generating AI Lego visualization...', 'Creative Agent');
    
    try {
        const image = await generateLegoImage(card.title, card.description);
        if (image) {
            setSavedImages(prev => [...prev, image]);
            addToast('success', 'Lego Model Generated!', 'Creative Agent');
        } else {
            addToast('error', 'Generation failed.', 'System');
        }
    } catch (e) {
        addToast('error', 'AI Service Unavailable', 'Error');
    } finally {
        setIsProcessing(false);
    }
  };

  // --- RENDER LOCKED STATE (The "Hole" in the Album) ---
  if (isLocked) {
      return (
        <div 
            onClick={onClick}
            className="relative w-64 h-96 rounded-2xl border-2 border-dashed border-white/10 bg-slate-950 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-6 group cursor-not-allowed transition-all duration-300 hover:border-white/20"
        >
            {/* Inner Recessed Shadow Overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none rounded-2xl" />
            
            {/* Phantom Icon */}
            <div className="z-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
                <Box className="w-24 h-24 text-gray-500" />
            </div>

            {/* Lock Indicator */}
            <div className="z-10 mt-6 flex flex-col items-center gap-2">
                <div className="p-3 bg-black/50 rounded-full border border-white/10 shadow-lg">
                    <Lock className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>
                <span className="text-xs font-mono text-gray-600 uppercase tracking-[0.2em] group-hover:text-gray-500 transition-colors">
                    Missing Memory
                </span>
            </div>

            {/* Hint at bottom */}
            <div className="absolute bottom-6 text-[10px] text-gray-700 font-bold uppercase tracking-wider">
                {card.collectionSet} Collection
            </div>
        </div>
      );
  }

  // --- RENDER UNLOCKED CARD ---
  return (
    <div 
        className={`relative w-64 h-96 rounded-2xl border-2 transition-all duration-500 cursor-pointer group hover:-translate-y-2 hover:shadow-2xl overflow-hidden flex flex-col
            ${getRarityColor(card.rarity)} bg-gradient-to-br
        `}
        onClick={onClick}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      {/* Header - Fixed Height Area */}
      <div className="relative z-10 p-4 flex justify-between items-start shrink-0">
          <div className={`text-xs font-bold uppercase tracking-wider ${getRarityTextColor(card.rarity)}`}>
              {card.rarity}
          </div>
          {masteryLevel !== 'Novice' && (
              <div className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white border border-white/20">
                  {masteryLevel}
              </div>
          )}
      </div>

      {/* Card Image Area - Fixed Height */}
      <div className="relative h-40 mx-4 rounded-xl bg-black/30 border border-white/10 overflow-hidden flex items-center justify-center group/img shrink-0">
          {savedImages.length > 0 ? (
              <img src={savedImages[savedImages.length - 1]} alt="Lego Art" className="w-full h-full object-cover" />
          ) : card.imageUrl ? (
              <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover opacity-80 group-hover/img:scale-110 transition-transform duration-700" />
          ) : (
              <Box className={`w-16 h-16 ${getRarityTextColor(card.rarity)} opacity-50`} />
          )}
          
          {/* Sealed Overlay */}
          {isSealed && (
              <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-400 font-mono">KNOWLEDGE SEALED</span>
              </div>
          )}
      </div>

      {/* Content - Flex Grow to Fill */}
      <div className="relative z-10 p-4 pt-3 flex flex-col flex-1 min-h-0">
          {/* Title - Line Clamped */}
          <div className="min-h-[2.5rem] mb-1 flex items-center">
            <h3 className={`text-lg font-bold text-white leading-tight line-clamp-2 ${isSealed ? 'blur-sm' : ''}`}>
                {card.title}
            </h3>
          </div>
          
          {/* Description - Takes available space but clamped */}
          <p className={`text-xs text-gray-300 line-clamp-3 mb-2 ${isSealed ? 'blur-sm' : ''}`}>
              {card.description}
          </p>

          {/* Stats Bar - Pushed to Bottom */}
          <div className="mt-auto flex justify-between items-center text-[10px] font-mono text-gray-400 border-t border-white/10 pt-2">
              <div className="flex gap-2">
                  <span>DEF: {card.stats.defense}</span>
                  <span>OFF: {card.stats.offense}</span>
              </div>
              <div>{card.attribute.substring(0,3).toUpperCase()}</div>
          </div>
      </div>

      {/* Actions (Hover) - Absolute Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center z-20">
          {!isSealed && (
              <div className="flex items-center gap-1">
                  <button 
                      onClick={(e) => { e.stopPropagation(); onKnowledgeInteraction(); }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Study Card"
                  >
                      <Maximize2 className="w-4 h-4" />
                  </button>
                  {onPrismRequest && (
                      <button 
                          onClick={(e) => { e.stopPropagation(); onPrismRequest(); }}
                          className="p-2 rounded-full bg-white/10 hover:bg-celestial-gold/20 text-celestial-gold transition-colors ml-1"
                          title="Intel Prism (AI Real-time)"
                      >
                          <Triangle className="w-4 h-4" />
                      </button>
                  )}
              </div>
          )}
          
          {/* Lego Generation Button (Only if purified and slots available) */}
          {!isSealed && savedImages.length < 3 && (
              <button 
                  onClick={handleLegoize}
                  className={`ml-2 p-2 rounded-lg border transition-all group/btn ${
                      isProcessing 
                      ? 'bg-celestial-gold/20 border-celestial-gold/50 animate-pulse' 
                      : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-celestial-gold/50'
                  } backdrop-blur-md shadow-lg flex items-center gap-1`}
                  title="Generate AI Lego Visual (Max 3)"
              >
                  {isProcessing ? (
                      <Loader2 className="w-3 h-3 text-celestial-gold animate-spin" />
                  ) : (
                      <>
                          <Box className="w-3 h-3 text-gray-200 group-hover/btn:text-celestial-gold transition-colors" />
                          <span className="text-[8px] font-bold text-gray-300 group-hover/btn:text-celestial-gold hidden group-hover/btn:inline-block transition-all">
                              LEGO
                          </span>
                      </>
                  )}
              </button>
          )}
          
          {/* Purify Button (Only if sealed) */}
          {isSealed && (
              <button 
                  onClick={(e) => { e.stopPropagation(); onPurifyRequest(); }}
                  className="w-full py-2 bg-celestial-purple text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors animate-pulse"
              >
                  <Zap className="w-3 h-3" /> Purify
              </button>
          )}
      </div>
    </div>
  );
};