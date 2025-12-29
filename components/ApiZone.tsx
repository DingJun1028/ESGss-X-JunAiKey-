import React, { useState } from 'react';
import { Language, WebhookConfig, WebhookDelivery } from '../types';
import { 
    Code, Key, Book, Activity, Copy, CheckCircle, Terminal, Zap, Shield, Globe, 
    Server, Radio, Network, Wifi, Trash2, Send, Plus, RefreshCw, Webhook, 
    Eye, EyeOff, AlertCircle, CheckCircle2, ChevronRight, Info, ShieldCheck,
    Loader2, X
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useCompany } from './providers/CompanyProvider';

interface ApiZoneProps {
  language: Language;
}

export const ApiZone: React.FC<ApiZoneProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { webhooks, addWebhook, deleteWebhook, updateWebhookStatus } = useCompany();
  
  // API Key State (Still local as it's typically derived/view-only in this demo)
  const [apiKey, setApiKey] = useState('sk-esgss-' + Math.random().toString(36).substring(7));
  const [copied, setCopied] = useState(false);

  // UI Local States
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvent, setNewWebhookEvent] = useState('report.generated');
  const [showSecretId, setShowSecretId] = useState<string | null>(null);
  const [isTestingId, setIsTestingId] = useState<string | null>(null);
  const [lastTestResult, setLastTestResult] = useState<WebhookDelivery | null>(null);

  const eventTypes = [
      'report.generated',
      'carbon.threshold_exceeded',
      'audit.verified',
      'alert.critical',
      'system.evolution',
      'card.unlocked'
  ];

  const pageData = {
      title: { zh: 'API 開發者專區', en: 'API Developer Zone' },
      desc: { zh: '整合 JunAiKey 引擎至您的企業應用與自動化流水線', en: 'Integrate JunAiKey Engine with Enterprise Applications & Pipelines' },
      tag: { zh: '開發核心', en: 'Dev Core' }
  };

  const handleCopy = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      addToast('success', `${label} Copied`, 'System');
  };

  const handleRegenerateKey = () => {
      setApiKey('sk-esgss-' + Math.random().toString(36).substring(7));
      addToast('info', 'New API Key Generated', 'Security');
  };

  const handleRegisterWebhook = () => {
      if (!newWebhookUrl.trim() || !newWebhookUrl.startsWith('http')) {
          addToast('error', isZh ? '請輸入有效的 HTTPS URL' : 'Please enter a valid HTTPS URL', 'Validation');
          return;
      }
      addWebhook({
          eventType: newWebhookEvent,
          url: newWebhookUrl,
          status: 'active'
      });
      setNewWebhookUrl('');
      addToast('success', isZh ? 'Webhook 已註冊並持久化' : 'Webhook Registered & Persisted', 'API');
  };

  const handleTestWebhook = async (wh: WebhookConfig) => {
      setIsTestingId(wh.id);
      setLastTestResult(null);
      addToast('info', isZh ? `正在發送測試事件至 ${wh.id}...` : `Sending test event to ${wh.id}...`, 'Webhook Test');
      
      // Simulate network latency
      await new Promise(r => setTimeout(r, 1500));
      
      const isSuccess = Math.random() > 0.1; // 90% success rate for simulation
      const delivery: WebhookDelivery = {
          id: 'del_' + Math.random().toString(36).substring(7),
          webhookId: wh.id,
          timestamp: Date.now(),
          payload: {
              event: wh.eventType,
              timestamp: new Date().toISOString(),
              data: {
                  id: "evt_test_123",
                  summary: "This is a simulated test delivery via Seraphim Protocol."
              }
          },
          responseCode: isSuccess ? 200 : 500,
          status: isSuccess ? 'success' : 'failure'
      };

      setLastTestResult(delivery);
      setIsTestingId(null);
      
      updateWebhookStatus(wh.id, { 
          lastTriggered: Date.now(),
          lastStatus: isSuccess ? 'success' : 'failure'
      });

      if (isSuccess) {
          addToast('success', 'HTTP 200 OK - Signal Received', 'Test Success');
      } else {
          addToast('error', 'HTTP 500 Internal Server Error', 'Test Failed');
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-6xl mx-auto">
        <UniversalPageHeader 
            icon={Code}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        {/* SECTION 1: API KEY MANAGEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-8 rounded-[2rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Key className="w-40 h-40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <Key className="w-5 h-5 text-celestial-gold" />
                    {isZh ? 'API 金鑰認證' : 'API Key Authentication'}
                </h3>
                
                <div className="space-y-4">
                    <p className="text-sm text-gray-400 max-w-xl">
                        {isZh 
                            ? '使用此金鑰透過 Bearer Token 方式調用 ESGss REST API。請妥善保管。' 
                            : 'Use this key to authenticate with the ESGss REST API via Bearer Token. Keep it secure.'}
                    </p>
                    <div className="bg-slate-950 rounded-2xl p-5 border border-white/10 flex items-center justify-between group relative">
                        <div className="font-mono text-celestial-gold text-sm tracking-widest blur-[4px] group-hover:blur-0 transition-all duration-500 cursor-help">
                            {apiKey}
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleCopy(apiKey, 'API Key')} 
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
                                title="Copy Key"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleRegenerateKey}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Endpoint Security</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    All requests are protected by rate-limiting (100 req/min) and TLS 1.3 encryption.
                </p>
                <button className="w-full py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold rounded-xl text-xs transition-all border border-indigo-500/30">
                    Security Policy
                </button>
            </div>
        </div>

        {/* SECTION 2: WEBHOOK MANAGEMENT */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Webhook className="w-7 h-7 text-pink-500" />
                        {isZh ? 'Webhook 註冊與管理' : 'Webhook Management'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{isZh ? '在特定系統事件發生時接收實時推送通知。' : 'Receive real-time push notifications when specific system events occur.'}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        HIVE_BUS_READY
                    </div>
                </div>
            </div>

            {/* Register Form */}
            <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Event Trigger</label>
                        <select 
                            value={newWebhookEvent}
                            onChange={(e) => setNewWebhookEvent(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-pink-500/50 outline-none transition-all appearance-none"
                        >
                            {eventTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:col-span-6">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Target Destination (HTTPS)</label>
                        <input 
                            type="text" 
                            value={newWebhookUrl}
                            onChange={(e) => setNewWebhookUrl(e.target.value)}
                            placeholder="https://your-api.com/webhooks"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-pink-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="lg:col-span-2 flex items-end">
                        <button 
                            onClick={handleRegisterWebhook}
                            disabled={!newWebhookUrl.trim()}
                            className="w-full h-[46px] bg-pink-500 hover:bg-pink-600 disabled:opacity-30 text-white font-black rounded-xl transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {isZh ? '新增' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>

            {/* List of Webhooks */}
            <div className="space-y-4">
                {webhooks.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                        <Webhook className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">{isZh ? '尚無已註冊的 Webhook' : 'No webhooks registered yet.'}</p>
                    </div>
                ) : (
                    webhooks.map((wh) => (
                        <div key={wh.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-white/20 transition-all group overflow-hidden relative">
                            {/* Delivery Status Glow */}
                            <div className={`absolute top-0 left-0 w-1 h-full ${wh.lastStatus === 'success' ? 'bg-emerald-500' : wh.lastStatus === 'failure' ? 'bg-rose-500' : 'bg-gray-700'}`} />

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                                <div className="flex gap-6 items-start">
                                    <div className={`p-4 rounded-2xl ${wh.status === 'active' ? 'bg-pink-500/10 text-pink-400' : 'bg-gray-800 text-gray-500'} border border-white/5`}>
                                        <Radio className={`w-6 h-6 ${wh.status === 'active' ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-lg font-bold text-white">{wh.eventType}</span>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${wh.lastStatus === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                {wh.lastStatus || 'NO_DATA'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono flex items-center gap-2 truncate">
                                            <Globe className="w-3 h-3" /> {wh.url}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 pl-16 lg:pl-0">
                                    {/* Secret Key Toggle */}
                                    <div className="flex flex-col gap-1 min-w-[140px]">
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Signing Secret</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] text-gray-400 bg-black/40 px-2 py-1 rounded border border-white/5">
                                                {showSecretId === wh.id ? wh.secret : '••••••••••••••••'}
                                            </span>
                                            <button 
                                                onClick={() => setShowSecretId(showSecretId === wh.id ? null : wh.id)}
                                                className="text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showSecretId === wh.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleTestWebhook(wh)}
                                            disabled={isTestingId === wh.id}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5 flex items-center gap-2 disabled:opacity-30"
                                        >
                                            {isTestingId === wh.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                            Test
                                        </button>
                                        <button 
                                            onClick={() => deleteWebhook(wh.id)}
                                            className="p-2.5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* SECTION 3: TEST RESULTS CONSOLE (ACTIVE WHEN TESTING) */}
        {lastTestResult && (
            <div className="glass-panel p-8 rounded-[2.5rem] border border-celestial-blue/30 bg-slate-900/60 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-celestial-blue/20 rounded-xl text-celestial-blue">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 aria-label="Section Title" className="text-sm font-bold text-white uppercase tracking-widest">Last Delivery Result</h4>
                            <p className="text-[10px] text-gray-500 font-mono">ID: {lastTestResult.id}</p>
                        </div>
                    </div>
                    <button onClick={() => setLastTestResult(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Status</span>
                                <span className={lastTestResult.status === 'success' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                    {lastTestResult.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">HTTP Response</span>
                                <span className="text-white font-mono">{lastTestResult.responseCode}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Duration</span>
                                <span className="text-white font-mono">245ms</span>
                            </div>
                        </div>

                        <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 flex gap-4">
                             <Info className="w-5 h-5 text-indigo-400 shrink-0" />
                             <p className="text-[10px] text-indigo-200/70 leading-relaxed italic">
                                Verification Tip: Use your signing secret and the 'X-Esgss-Signature' header to verify that the payload hasn't been tampered with.
                             </p>
                        </div>
                    </div>

                    <div className="bg-black rounded-2xl border border-white/5 p-4 overflow-hidden flex flex-col max-h-[300px]">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                            <Code className="w-3 h-3 text-gray-600" />
                            <span className="text-[9px] font-black text-gray-500 uppercase">Payload Body (JSON)</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] text-emerald-400 leading-relaxed p-2">
                            <pre>{JSON.stringify(lastTestResult.payload, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* SECTION 4: DOCS SHORTCUT */}
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-slate-900/40">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Book className="w-6 h-6 text-indigo-400" />
                {isZh ? '整合開發者文檔' : 'Integration Documentation'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="#" className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">REST API Basics</div>
                            <div className="text-[10px] text-gray-500">Authentication & Rate Limits</div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
                <a href="#" className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                            <Webhook className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Webhooks & Security</div>
                            <div className="text-[10px] text-gray-500">Verifying Payload Signatures</div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
            </div>
        </div>
    </div>
  );
};