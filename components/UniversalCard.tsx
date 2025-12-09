
import React, { useState } from 'react';
import { EsgCard, ESGAttribute, MasteryLevel } from '../types';
import { Leaf, Users, Scale, Lock, Info, Shield, Sword, Box, Loader2, Star, Hexagon, EyeOff, Sparkles, ChevronLeft, ChevronRight, Edit3, Trash2, Check, X } from 'lucide-react';
import { QuantumAiTrigger } from './minimal/QuantumAiTrigger';
import { useToast } from '../contexts/ToastContext';
import { universalIntelligence } from '../services/evolutionEngine';
import { generateLegoImage, expandTermKnowledge, editImageWithGemini } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';

interface UniversalCardProps {
  card: EsgCard;
  isLocked?: boolean;
  isSealed?: boolean; // New Prop
  masteryLevel?: MasteryLevel;
  onKnowledgeInteraction?: () => void;
  onPurifyRequest?: () => void; // Trigger for Sealed -> Quiz
  onClick?: () => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({ 
    card, 
    isLocked = false, 
    isSealed = false,
    masteryLevel = 'Novice', 
    onKnowledgeInteraction, 
    onPurifyRequest,
    onClick 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  // Image Management
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  
  const [isExpandingKnowledge, setIsExpandingKnowledge] = useState(false);
  const { addToast } = useToast();

  // Optical Theme Engine
  const getTheme = (attr: ESGAttribute) => {
    switch (attr) {
      case 'Environmental': return {
        color: 'text-[#00FF9D]',
        border: 'border-[#00FF9D]/30',
        glow: 'shadow-[0_0_20px_rgba(0,255,157,0.2)]',
        bg: 'bg-gradient-to-br from-[#00FF9D]/10 to-transparent',
        icon: <Leaf className="w-12 h-12 text-[#00FF9D]" strokeWidth={1} />
      };
      case 'Social': return {
        color: 'text-[#00F0FF]',
        border: 'border-[#00F0FF]/30',
        glow: 'shadow-[0_0_20px_rgba(0,240,255,0.2)]',
        bg: 'bg-gradient-to-br from-[#00F0FF]/10 to-transparent',
        icon: <Users className="w-12 h-12 text-[#00F0FF]" strokeWidth={1} />
      };
      case 'Governance': return {
        color: 'text-[#FFD700]',
        border: 'border-[#FFD700]/30',
        glow: 'shadow-[0_0_20px_rgba(255,215,0,0.2)]',
        bg: 'bg-gradient-to-br from-[#FFD700]/10 to-transparent',
        icon: <Scale className="w-12 h-12 text-[#FFD700]" strokeWidth={1} />
      };
    }
  };

  const theme = getTheme(card.attribute);
  const isLegendary = card.rarity === 'Legendary';

  const handleAiDeepDive = async () => {
      if (isExpandingKnowledge) return;
      setIsExpandingKnowledge(true);
      
      addToast('info', `Connecting to Universal Library for: ${card.term}...`, 'JunAiKey Reasoning');
      
      try {
          // Use real Gemini 3 Pro service for structured expansion (TC Primary)
          const insights = await expandTermKnowledge(card.term, card.definition, 'zh-TW');
          
          if (insights) {
              // Ingest into the Brain
              universalIntelligence.ingestKnowledge(card.id, card.term, insights);
              addToast('success', `Knowledge Matrix Expanded: ${card.term}`, 'Universal Intelligence');
              onKnowledgeInteraction?.(); // Trigger mastery progress
          } else {
              addToast('error', 'AI Expansion Failed', 'Error');
          }
      } catch (e) {
          addToast('error', 'Connection Error', 'System');
      } finally {
          setIsExpandingKnowledge(false);
      }
  };

  const handleLegoize = async (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card flip
      if (isProcessing || savedImages.length >= 3) return;
      
      setIsProcessing(true);
      addToast('info', `Constructing Lego Prototype for ${card.title}...`, 'JunAiKey Creative');
      
      try {
          const imgUrl = await generateLegoImage(card.title, card.description);
          if (imgUrl) {
              setSavedImages(prev => [...prev, imgUrl]);
              setCurrentImageIndex(savedImages.length); // Point to new image (length because array size increases by 1)
              addToast('success', 'Lego Model Generated! (Slot Used)', 'Creative Engine');
          } else {
              addToast('error', 'Failed to generate Lego image.', 'System');
          }
      } catch (e) {
          addToast('error', 'AI Generation Error', 'System');
      } finally {
          setIsProcessing(false);
      }
  };

  const handleEditImage = async () => {
      if (!editPrompt.trim() || isProcessing || savedImages.length >= 3) return;
      
      setIsProcessing(true);
      addToast('info', `Applying edit with Nano Banana Model...`, 'Gemini 2.5 Flash Image');
      
      try {
          const currentImg = savedImages[currentImageIndex];
          const newImg = await editImageWithGemini(currentImg, editPrompt);
          if (newImg) {
              setSavedImages(prev => [...prev, newImg]);
              setCurrentImageIndex(savedImages.length);
              setEditPrompt('');
              setShowEditInput(false);
              addToast('success', 'Image Edited Successfully!', 'Gemini Vision');
          } else {
              addToast('error', 'Edit failed or blocked.', 'System');
          }
      } catch (e) {
          addToast('error', 'Edit Service Error', 'System');
      } finally {
          setIsProcessing(false);
      }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (savedImages.length === 0) return;
      
      const newImages = savedImages.filter((_, i) => i !== currentImageIndex);
      setSavedImages(newImages);
      setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
      addToast('info', 'Image variant deleted.', 'System');
  };

  const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex(prev => Math.min(savedImages.length - 1, prev + 1));
  };

  const renderMasteryStars = () => {
      const count = masteryLevel === 'Master' ? 3 : masteryLevel === 'Apprentice' ? 2 : 1;
      return (
          <div className="flex gap-0.5" title={`Mastery: ${masteryLevel}`}>
              {[...Array(count)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-celestial-gold fill-current" />
              ))}
          </div>
      );
  };

  // --- LOCKED STATE ---
  if (isLocked) {
      return (
        <div 
            className="w-[240px] h-[360px] relative rounded-xl overflow-hidden bg-[#1a1f2e] border border-white/5 flex flex-col items-center justify-center group cursor-pointer shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" 
            onClick={onClick}
        >
            <div className="absolute inset-4 rounded-lg bg-[#0f121a] shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.05)] flex items-center justify-center">
                <div className="flex flex-col items-center opacity-20 mix-blend-overlay pointer-events-none">
                    <div className="relative">
                        <Hexagon className="w-24 h-24 text-gray-800 fill-gray-900 drop-shadow-[2px_2px_2px_rgba(255,255,255,0.1)]" />
                        <Leaf className="w-12 h-12 text-gray-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[1px_1px_1px_rgba(255,255,255,0.1)]" />
                    </div>
                    <span className="mt-4 font-bold text-lg text-gray-800 tracking-widest drop-shadow-[1px_1px_0px_rgba(255,255,255,0.05)]">
                        ESG SUNSHINE
                    </span>
                </div>
                <div className="absolute bottom-6 flex flex-col items-center opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm">
                        <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] mt-2">{card.rarity}</span>
                </div>
            </div>
            <div className="absolute inset-0 rounded-xl border border-white/5 pointer-events-none" />
        </div>
      );
  }

  // --- UNLOCKED STATE ---
  const handleInteraction = () => {
      if (isSealed) {
          onPurifyRequest?.();
      } else if (!showEditInput) { // Prevent flip if editing
          setIsFlipped(!isFlipped);
          onClick?.();
      }
  };

  const currentImage = savedImages.length > 0 ? savedImages[currentImageIndex] : null;

  return (
    <div 
        className="group relative w-[240px] h-[360px] perspective-1000 cursor-pointer"
        onClick={handleInteraction}
    >
      <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* --- FRONT SIDE --- */}
        <div className={`
            absolute inset-0 backface-hidden rounded-xl overflow-hidden backdrop-blur-xl border 
            ${isSealed ? 'border-purple-900/50 bg-slate-950' : `${theme.border} ${theme.bg}`}
            ${!isSealed && (isLegendary ? 'shadow-[0_0_30px_rgba(255,215,0,0.3)]' : theme.glow)}
        `}>
            {/* Sealed Overlay */}
            {isSealed && (
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.3)_0%,_transparent_70%)] animate-pulse" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 p-3">
                        <Lock className="w-4 h-4 text-purple-400 opacity-70" />
                    </div>
                </div>
            )}

            {/* Holographic Foil */}
            {!isSealed && isLegendary && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 animate-shimmer pointer-events-none" />}
            
            {/* Lego/Edit Image Overlay */}
            {!isSealed && currentImage && (
                <div className="absolute inset-0 z-0 animate-fade-in group/image">
                    <img src={currentImage} alt="Card Art" className="w-full h-full object-cover opacity-90 mix-blend-overlay transition-transform duration-700 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900/90" />
                    
                    {/* Image Controls (Hover) */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
                        {savedImages.length < 3 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowEditInput(true); }}
                                className="p-1.5 bg-black/50 hover:bg-black/80 rounded-lg text-white backdrop-blur-sm border border-white/10"
                                title="Edit with AI"
                            >
                                <Edit3 className="w-3 h-3" />
                            </button>
                        )}
                        <button 
                            onClick={handleDeleteImage}
                            className="p-1.5 bg-red-900/50 hover:bg-red-900/80 rounded-lg text-white backdrop-blur-sm border border-red-500/30"
                            title="Delete Image"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    {savedImages.length > 1 && (
                        <>
                            <button 
                                onClick={handlePrevImage} 
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white hover:bg-black/30 rounded-full transition-all z-20"
                                disabled={currentImageIndex === 0}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleNextImage} 
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white hover:bg-black/30 rounded-full transition-all z-20"
                                disabled={currentImageIndex === savedImages.length - 1}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                                {savedImages.map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/30'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
            
            {/* Edit Input Overlay */}
            {showEditInput && (
                <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <h4 className="text-white text-xs font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-celestial-gold" /> AI Edit
                    </h4>
                    <input 
                        autoFocus
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="e.g. Add retro filter..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white mb-2 outline-none focus:border-celestial-gold"
                        onKeyDown={(e) => e.key === 'Enter' && handleEditImage()}
                    />
                    <div className="flex gap-2 w-full">
                        <button onClick={() => setShowEditInput(false)} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs text-gray-300">Cancel</button>
                        <button onClick={handleEditImage} disabled={isProcessing} className="flex-1 py-1.5 bg-celestial-gold hover:bg-amber-400 text-black rounded text-xs font-bold flex justify-center items-center gap-1">
                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Apply
                        </button>
                    </div>
                </div>
            )}

            {!isSealed && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />}

            <div className="relative z-10 h-full flex flex-col p-4 justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-gray-400 tracking-widest uppercase shadow-black drop-shadow-md">{card.category}</span>
                        {!isSealed && renderMasteryStars()}
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border shadow-black drop-shadow-md ${isLegendary && !isSealed ? 'text-yellow-400 border-yellow-400/50 bg-black/20' : 'text-gray-400 border-gray-600 bg-black/20'}`}>
                        {card.rarity.toUpperCase()}
                    </span>
                </div>

                {/* Central Prism Symbol */}
                {!currentImage && (
                    <div className="flex-1 flex items-center justify-center relative">
                        <div className={`absolute inset-0 bg-gradient-to-b blur-2xl rounded-full ${isSealed ? 'from-purple-900/20 to-transparent' : 'from-white/5 to-transparent'}`} />
                        <div className={`relative transform transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110`}>
                            {isSealed ? <Hexagon className="w-12 h-12 text-purple-700 animate-pulse" /> : theme.icon}
                        </div>
                        {isSealed && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-black/50 px-3 py-1 rounded text-[10px] text-purple-300 font-mono tracking-widest backdrop-blur-md border border-purple-500/30">
                                    SEALED ARTIFACT
                                </span>
                            </div>
                        )}
                    </div>
                )}
                {currentImage && <div className="flex-1" />} 

                {/* Footer */}
                <div className="space-y-1">
                    <h3 className={`text-lg font-bold font-sans tracking-tight leading-none drop-shadow-lg ${isLegendary && !isSealed ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500' : 'text-white'}`}>
                        {card.title}
                    </h3>
                    <div className={`h-0.5 w-10 ${!isSealed ? theme.color.replace('text', 'bg') : 'bg-purple-900'} opacity-80`} />
                    <div className="flex justify-between items-end">
                        <p className="text-[9px] text-gray-300 line-clamp-2 leading-relaxed pt-1 flex-1 drop-shadow-md">
                            {isSealed ? 'Knowledge hidden. Purify to unlock details.' : card.description}
                        </p>
                        
                        {/* Lego Generation Button (Only if purified and slots available) */}
                        {!isSealed && savedImages.length < 3 && (
                            <button 
                                onClick={handleLegoize}
                                className={`ml-2 p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all group/btn ${isProcessing ? 'animate-pulse' : ''} backdrop-blur-md shadow-lg`}
                                title="Generate Lego Model (Max 3)"
                            >
                                {isProcessing ? <Loader2 className="w-3 h-3 text-celestial-gold animate-spin" /> : <Box className="w-3 h-3 text-gray-200 group-hover/btn:text-celestial-gold" />}
                            </button>
                        )}
                        {/* Purify Button (Only if sealed) */}
                        {isSealed && (
                            <button 
                                className="ml-2 p-2 rounded-lg bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/40 transition-all animate-pulse"
                                title="Start Purification Ritual"
                            >
                                <Sparkles className="w-3 h-3 text-purple-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- BACK SIDE (The Definition) --- */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-slate-900 border ${theme.border} p-4 flex flex-col`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]" />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 justify-between">
                    <div className="flex items-center gap-2">
                        <Info className={`w-3.5 h-3.5 ${theme.color}`} />
                        <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Knowledge Node</span>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleAiDeepDive(); }} 
                        disabled={isExpandingKnowledge}
                        className="p-1.5 rounded-lg bg-celestial-purple/20 hover:bg-celestial-purple/40 text-celestial-purple border border-celestial-purple/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all"
                        title="AI Deep Dive (Expand Knowledge)"
                    >
                        {isExpandingKnowledge ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                    </button>
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className={`text-lg font-bold font-serif ${theme.color} mb-1 leading-tight`}>{card.term}</h4>
                            <div className="text-[9px] text-gray-500 font-mono flex gap-2">
                                <span>[noun]</span>
                                <span>•</span>
                                <span>{card.attribute}</span>
                            </div>
                        </div>
                        <div className="text-[9px] font-bold px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                            {masteryLevel}
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-300 leading-relaxed font-light border-l-2 border-white/10 pl-2">
                        {card.definition}
                    </p>
                </div>

                <div className="mt-auto pt-2 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <Shield className="w-2.5 h-2.5" /> Defense
                            </span>
                            <span className="text-base font-mono text-white font-bold">{card.stats.defense}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                <Sword className="w-2.5 h-2.5" /> Offense
                            </span>
                            <span className={`text-base font-mono font-bold ${theme.color}`}>{card.stats.offense}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
