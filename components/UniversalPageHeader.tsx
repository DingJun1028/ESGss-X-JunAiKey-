import React from 'react';
import { Language } from '../types';
import { LucideIcon } from 'lucide-react';

interface UniversalPageHeaderProps {
    icon: LucideIcon;
    title: { zh: string; en: string };
    description: { zh: string; en: string };
    language: Language;
    tag?: { zh: string; en: string };
}

export const UniversalPageHeader: React.FC<UniversalPageHeaderProps> = ({ 
    icon: Icon, 
    title, 
    description, 
    language,
    tag 
}) => {
    const isZh = language === 'zh-TW';
    return (
        <div className="flex items-start gap-4 animate-fade-in mb-2 shrink-0">
            <div className="p-2 bg-gradient-to-br from-white/10 to-transparent rounded-xl border border-white/10 shadow-xl shrink-0">
                <Icon className="w-5 h-5 text-celestial-gold" />
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-3">
                    <h2 
                        className={`text-xl tracking-tight uppercase ${isZh ? 'font-black text-white' : 'font-light text-white/90'}`}
                        lang={isZh ? 'zh' : 'en'}
                    >
                        {isZh ? title.zh : title.en}
                    </h2>
                    {tag && (
                        <span className="text-[7px] font-mono font-black text-celestial-purple px-1.5 py-0.5 rounded border border-celestial-purple/20 bg-celestial-purple/5 tracking-[0.2em] hidden sm:inline">
                            {isZh ? tag.en : tag.zh}
                        </span>
                    )}
                </div>
                <p 
                    className={`text-[9px] uppercase tracking-[0.15em] mt-0.5 opacity-60 ${isZh ? 'font-bold text-gray-300' : 'font-light text-gray-500'}`}
                    lang={isZh ? 'zh' : 'en'}
                >
                    {isZh ? description.zh : description.en}
                </p>
            </div>
        </div>
    );
};