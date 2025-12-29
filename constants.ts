
import { 
  DimensionID, Course, UniversalCrystal, UserTitle, Badge, OfficialEvent, 
  ReportSection, EsgCard, ScriptureNode 
} from './types';

// Add missing dimension labels for Dashboard HUD
export const DIMENSION_LABELS: Record<DimensionID, { zh: string; en: string }> = {
  A1: { zh: '覺醒 (Awakening)', en: 'Awakening' },
  A2: { zh: '橋接 (Bridging)', en: 'Bridging' },
  A3: { zh: '認知 (Cognition)', en: 'Cognition' },
  A4: { zh: '防禦 (Defense)', en: 'Defense' },
  A5: { zh: '熵 (Entropy)', en: 'Entropy' },
  A6: { zh: '金融 (Finance)', en: 'Finance' },
  A7: { zh: '治理 (Governance)', en: 'Governance' },
  A8: { zh: '和諧 (Harmony)', en: 'Harmony' },
  A9: { zh: '影響 (Impact)', en: 'Impact' },
  A10: { zh: '公正 (Justice)', en: 'Justice' },
  A11: { zh: '知識 (Knowledge)', en: 'Knowledge' },
  A12: { zh: '光 (Light)', en: 'Light' },
};

// Add course data generator for Academy
export const getMockCourses = (lang: string): Course[] => [
  { id: 'c1', title: lang === 'zh-TW' ? '碳盤查基礎' : 'Carbon Inventory Basics', thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80', level: 'Novice', category: 'NetZero', progress: 85 },
  { id: 'c2', title: lang === 'zh-TW' ? 'GRI 2024 準則導讀' : 'GRI 2024 Guidelines', thumbnail: 'https://images.unsplash.com/photo-1454165833767-1314d69c44d7?w=400&q=80', level: 'Apprentice', category: 'Governance', progress: 40 },
  { id: 'c3', title: lang === 'zh-TW' ? 'Berkeley 策略創新' : 'Berkeley Strategy Innovation', thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80', level: 'Master', category: 'Innovation', progress: 10 },
];

// Add glossary for OmniEsgCell rich tooltips
export const GLOBAL_GLOSSARY: Record<string, { definition: string; formula?: string; rationale?: string }> = {
  'Scope 1': { definition: 'Direct emissions from owned or controlled sources.', formula: 'Fuel consumed * Emission Factor', rationale: 'Essential for regulatory compliance.' },
  'Scope 2': { definition: 'Indirect emissions from the generation of purchased energy.', formula: 'Electricity consumed * Grid Factor', rationale: 'Key part of operational footprint.' },
  'Carbon Intensity': { definition: 'Emissions per unit of activity or financial metric.', formula: 'tCO2e / Revenue', rationale: 'Measures decoupling of growth and emissions.' },
};

// Add vocation definitions for Gamification and CompanyProvider
export const VOCATIONS: Record<string, { label: string; color: string; desc: string }> = {
  Architect: { label: '架構師', color: 'indigo', desc: 'System Architecture & Strategy' },
  Alchemist: { label: '煉金術士', color: 'amber', desc: 'Data Synthesis & Transmutation' },
  Scribe: { label: '速記官', color: 'pink', desc: 'Reporting & Communication' },
  Envoy: { label: '使節', color: 'blue', desc: 'External Relations & Partnerships' },
  Seeker: { label: '探索者', color: 'cyan', desc: 'Research & Discovery' },
  Guardian: { label: '守護者', color: 'emerald', desc: 'Audit & Compliance' },
};

// Add initial user titles
export const INITIAL_TITLES: UserTitle[] = [
  { id: 't1', text: '萬能代理千面化身 junaikey', rarity: 'Legendary', bonusEffect: 'Omni-Resonance +20%' },
  { id: 't2', text: '永續見習生', rarity: 'Common' },
  { id: 't3', text: '碳中和先鋒', rarity: 'Rare', bonusEffect: 'Carbon Credit Yield +5%' },
];

// Add initial system badges
export const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'First Action', description: 'Performed your first ESG calculation.', category: 'Milestone', unlockedAt: Date.now() },
  { id: 'b2', name: 'Data Weaver', description: 'Connected 3 external data sources.', category: 'Achievement' },
  { id: 'b3', name: 'Social Connector', description: 'Participated in a group learning session.', category: 'Social' },
];

// Add system events
export const MOCK_EVENTS: OfficialEvent[] = [
  { id: 'e1', title: 'Global ESG Summit 2025', date: '2025-06-15', status: 'Upcoming', xpReward: 500 },
  { id: 'e2', title: 'Net Zero Workshop', date: '2025-04-22', status: 'Participating', xpReward: 300 },
];

// Add universal crystal states
export const UNIVERSAL_CORES: UniversalCrystal[] = [
  { id: 'core-p', name: 'Perception Core', type: 'Perception', description: 'Sensory input management', state: 'Restored', integrity: 100, fragmentsCollected: 5, fragmentsRequired: 5 },
  { id: 'core-c', name: 'Cognition Core', type: 'Cognition', description: 'Deep reasoning logic', state: 'Crystallizing', integrity: 85, fragmentsCollected: 3, fragmentsRequired: 5 },
  { id: 'core-m', name: 'Memory Core', type: 'Memory', description: 'Vectorized history storage', state: 'Restored', integrity: 98, fragmentsCollected: 5, fragmentsRequired: 5 },
];

// Add report section structure
export const REPORT_STRUCTURE: ReportSection[] = [
  { 
    id: '1', 
    title: 'Chapter 1: Vision & Strategy', 
    template: '## 願景聲明\n當前企業願景：[企業願景]\n\n## 策略定位\n...', 
    example: '參考 Apple 2023 報告之簡潔敘事風格。', 
    griStandards: 'GRI 2, GRI 3', 
    subSections: [
      /* Fix: Added missing 'griStandards' property to satisfy ReportSection interface */
      { id: '1.01', title: 'Executive Summary', template: '摘要當前進度與亮點...', example: '強調淨零路徑的關鍵里程碑。', griStandards: 'GRI 2-22' },
      /* Fix: Added missing 'griStandards' property to satisfy ReportSection interface */
      { id: '1.02', title: 'Sustainability Goals', template: '列出 2030 與 2050 目標...', example: '對標 SBTi 之科學減碳路徑。', griStandards: 'GRI 2-23' }
    ]
  },
  {
    id: '2',
    title: 'Chapter 2: Environmental Impact',
    griStandards: 'GRI 302, GRI 305',
    subSections: [
      /* Fix: Added missing 'griStandards' property to satisfy ReportSection interface */
      { id: '2.01', title: 'Carbon Footprint', template: '揭露範疇一、二、三數據...', example: '包含排放強度之對比分析。', griStandards: 'GRI 305' }
    ]
  }
];

// Add built-in knowledge repositories
export const BUILTIN_KNOWLEDGE_REPOS = [
  { id: 'repo-official-tpl', name: 'Official Templates', description: 'GRI/SASB Standard ESG templates', category: 'Documentation' },
  { id: 'repo-yang-wisdom', name: 'Yang Bo Wisdom', description: 'Expert strategic insights from Thoth Yang', category: 'Expertise' },
  { id: 'repo-benchmark', name: 'Industry Benchmarks', description: 'Fortune 500 sustainability metrics', category: 'Data' },
];

// Add ESG card factory
export const getEsgCards = (lang: string): EsgCard[] => [
  { id: 'card-legend-001', title: lang === 'zh-TW' ? '淨正向' : 'Net Positive', term: 'Net Positive', definition: '一家公司如果能改善它所影響的每個人、每個規模的福祉，它就是『淨正向』的公司。', description: '給予多於獲取的再生商模核心概念。', rarity: 'Legendary', attribute: 'Vision', collectionSet: 'Genesis', stats: { defense: 20, offense: 50 } },
  { id: 'relic-knowledge-base', title: lang === 'zh-TW' ? '知識庫聖物' : 'Knowledge Relic', term: 'RAG Source', definition: '檢索增強生成之核心知識庫。', description: '賦予代理人存取聖典的能力。', rarity: 'Rare', attribute: 'Knowledge', collectionSet: 'Utility', stats: { defense: 30, offense: 10 } },
  { id: 'card-epic-001', title: lang === 'zh-TW' ? '雙重重大性' : 'Double Materiality', term: 'Double Materiality', definition: '企業對環境社會的影響與外部對企業財務的影響。', description: '歐盟 CSRD 與 IFRS S1/S2 的核心要求。', rarity: 'Epic', attribute: 'Governance', collectionSet: 'Genesis', stats: { defense: 40, offense: 20 } },
];

// Add Adan wisdom scriptures
export const BUILTIN_SCRIPTURES: ScriptureNode[] = [
  { 
    id: 's1', code: 'WD-001', title: '王道核心思維', en: 'Wangdao Essence', 
    content: '領導力的本質在於利他，透過多方利益的動態平衡達成永續經營。', 
    category: 'Leadership', 
    tags: [{ zh: '領導', en: 'Leadership' }, { zh: '文化', en: 'Culture' }] 
  },
  { 
    id: 's2', code: 'RE-001', title: '再生設計原則', en: 'Regen Design', 
    content: '不只是減少傷害，而是要主動修復受損的生態與社會系統。', 
    category: 'Innovation', 
    tags: [{ zh: '設計', en: 'Design' }, { zh: '再生', en: 'Regen' }] 
  },
];

export const TRANSLATIONS = {
  'zh-TW': {
    nav: {
      myEsg: '我的 ESG / HOME',
      dashboard: '數據中樞 / AIMS',
      businessIntel: 'AMICE 智慧 / AMICE',
      strategy: '顧問實驗室 / ADVISORY',
      regenerative: '再生模型 / REGEN',
      carbon: '權能鍛造 / FORGING',
      report: '報告顯化 / REPORT',
      adanZone: '王道阿丹 / ADAN',
      yangBo: '導師楊博 / THOTH',
      academy: '學院試煉 / TRIALS',
      partnerPortal: '生態好站 / PARTNERS',
    }
  },
  'en-US': {
    nav: {
      myEsg: 'COCKPIT',
      dashboard: 'AIMS CONSOLE',
      businessIntel: 'AMICE INTEL',
      strategy: 'ADVISORY LAB',
      regenerative: 'REGEN MODEL',
      carbon: 'FORGE CORE',
      report: 'REPORT GEN',
      adanZone: 'ADAN WISDOM',
      yangBo: 'THOTH ZONE',
      academy: 'TRIALS',
      partnerPortal: 'PARTNERS',
    }
  }
};
