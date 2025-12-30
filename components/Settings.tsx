
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { Language } from '../types';
import { 
  Settings as SettingsIcon, Save, RotateCcw, User, Building, 
  PlayCircle, Factory, ChevronDown, HelpCircle, Layout, Github, Zap
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';

export const Settings: React.FC<{ language: Language }> = ({ language }) => {
  const { 
    companyName, setCompanyName, 
    industrySector, setIndustrySector,
    userName, setUserName,
    userRole, setUserRole,
    budget, setBudget,
    carbonCredits, setCarbonCredits,
    esgScores, updateEsgScore,
    resetData,
    addAuditLog,
    checkBadges,
    externalApiKeys,
    updateExternalApiKeys
  } = useCompany();
  
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';

  const [formData, setFormData] = useState({
    companyName,
    industrySector,
    userName,
    userRole,
    budget,
    carbonCredits,
    envScore: esgScores.environmental,
    socScore: esgScores.social,
    govScore: esgScores.governance,
    openaiKey: externalApiKeys.openai || '',
    straicoKey: externalApiKeys.straico || '',
    githubKey: externalApiKeys.github || ''
  });

  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const industryDropdownRef = useRef<HTMLDivElement>(null);

  const handleReplayOnboarding = () => {
      localStorage.removeItem('has_seen_v15_tour_final');
      window.location.reload();
  };

  const handleSave = () => {
    setCompanyName(formData.companyName);
    setIndustrySector(formData.industrySector);
    setUserName(formData.userName);
    setUserRole(formData.userRole);
    setBudget(formData.budget);
    setCarbonCredits(formData.carbonCredits);
    
    updateEsgScore('environmental', formData.envScore);
    updateEsgScore('social', formData.socScore);
    updateEsgScore('governance', formData.govScore);

    updateExternalApiKeys({
        openai: formData.openaiKey,
        straico: formData.straicoKey,
        github: formData.githubKey
    });
    
    addAuditLog('System Configuration Update', `Modified system profile and parameters.`);
    addToast('success', isZh ? '設定已更新' : 'Settings Updated', 'System');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-24">
      <UniversalPageHeader 
          icon={SettingsIcon}
          title={{ zh: '系統偏好設定', en: 'System Settings' }}
          description={{ zh: '管理個人檔案、企業參數與核心導覽協定', en: 'Manage profile, enterprise parameters, and onboarding protocols.' }}
          language={language}
          tag={{ zh: '配置中心', en: 'CONFIG_CTRL' }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Section */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-slate-900/40">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-celestial-purple" />
                {isZh ? '個人與角色' : 'User & Identity'}
            </h3>
            <div className="space-y-5">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1">Display Name</label>
                    <input 
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1">Vocation_Title</label>
                    <input 
                        type="text"
                        name="userRole"
                        value={formData.userRole}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all"
                    />
                </div>
            </div>
        </div>

        {/* External API Integration Section */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-slate-900/40 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                {/* Fix: Added Zap to lucide-react imports */}
                <Zap className="w-5 h-5 text-celestial-gold" />
                {isZh ? '外部 API 整合' : 'API Integrations'}
            </h3>
            <div className="space-y-5">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1">GitHub Personal Access Token</label>
                    <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            type="password"
                            name="githubKey"
                            value={formData.githubKey}
                            onChange={handleChange}
                            placeholder="ghp_xxxxxxxxxxxx"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-celestial-gold outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1">Straico API Key</label>
                    <input 
                        type="password"
                        name="straicoKey"
                        value={formData.straicoKey}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-celestial-gold outline-none transition-all"
                    />
                </div>
            </div>
            <p className="text-[9px] text-gray-600 mt-6 italic">
                * GitHub Key used for MCP direct connection to private repositories.
            </p>
        </div>

        {/* Enterprise Section */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-slate-900/40 md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <Building className="w-5 h-5 text-celestial-blue" />
                {isZh ? '企業實體配置' : 'Enterprise Config'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1">Entity_Name</label>
                    <input 
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-celestial-blue outline-none transition-all"
                    />
                </div>
                <div className="space-y-1 relative" ref={industryDropdownRef}>
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1">Industry_Sector</label>
                    <div className="relative">
                        <Factory className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            type="text"
                            name="industrySector"
                            autoComplete="off"
                            value={formData.industrySector}
                            onFocus={() => setShowIndustryDropdown(true)}
                            onChange={handleChange}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-1 focus:ring-celestial-blue outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <button 
            onClick={handleSave}
            className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-celestial-emerald to-celestial-blue text-white font-black rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
          >
            <Save className="w-5 h-5" />
            {isZh ? '儲存配置脈動' : 'Commit Configuration'}
          </button>
      </div>
    </div>
  );
};
