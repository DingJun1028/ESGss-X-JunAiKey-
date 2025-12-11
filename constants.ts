
import { Metric, Course, SystemHealth, Language, ReportSection, EsgCard, CardSynergy, UniversalCrystal, View } from './types';

// --- Universal Cores (The Crystals) ---
export const UNIVERSAL_CORES: UniversalCrystal[] = [
    {
        id: 'core-perception',
        name: 'Perception Core (Spectral Eye)',
        type: 'Perception',
        description: 'Grants the ability to see and digitize the physical world.',
        state: 'Fragmented',
        integrity: 45,
        fragmentsCollected: 1,
        fragmentsRequired: 4,
        linkedModule: View.RESEARCH_HUB,
        abilities: ['Spectral Scan (OCR)', 'Data Ingestion']
    },
    {
        id: 'core-cognition',
        name: 'Cognition Core (Deep Mind)',
        type: 'Cognition',
        description: 'Unlocks deep reasoning, simulation, and strategic foresight.',
        state: 'Fragmented',
        integrity: 60,
        fragmentsCollected: 2,
        fragmentsRequired: 5,
        linkedModule: View.STRATEGY,
        abilities: ['Multi-Agent Debate', 'Risk Heatmap', 'Carbon Pricing Sim']
    },
    {
        id: 'core-memory',
        name: 'Memory Core (Quantum Lattice)',
        type: 'Memory',
        description: 'Stores knowledge as atomic nodes for infinite recall and context.',
        state: 'Restored',
        integrity: 90,
        fragmentsCollected: 5,
        fragmentsRequired: 5,
        linkedModule: View.MY_ESG,
        abilities: ['Knowledge Graph', 'SDR Archive', 'Skill Embedding']
    },
    {
        id: 'core-expression',
        name: 'Expression Core (The Scribe)',
        type: 'Expression',
        description: 'Manifests insights into reports, visuals, and interfaces.',
        state: 'Crystallizing',
        integrity: 75,
        fragmentsCollected: 3,
        fragmentsRequired: 4,
        linkedModule: View.REPORT,
        abilities: ['Auto-Report Gen', 'Generative UI', 'Visual Refraction']
    },
    {
        id: 'core-nexus',
        name: 'Nexus Core (The Synapse)',
        type: 'Nexus',
        description: 'Orchestrates the entire system and connects to external reality.',
        state: 'Fragmented',
        integrity: 30,
        fragmentsCollected: 1,
        fragmentsRequired: 3,
        linkedModule: View.INTEGRATION,
        abilities: ['API Gateway', 'Role Switching', 'Audit Chain']
    }
];

// --- NEW: Global Knowledge Base for Tooltips ---
export const GLOBAL_GLOSSARY: Record<string, { definition: string; formula?: string; rationale?: string; tags?: string[] }> = {
    'Scope 1': {
        definition: "Direct GHG emissions occurring from sources that are owned or controlled by the company (e.g., combustion in boilers, furnaces, vehicles).",
        formula: "Σ (Fuel Quantity × Emission Factor × GWP)",
        rationale: "Crucial for identifying direct decarbonization opportunities (e.g., electrification) and meeting compliance mandates like CBAM.",
        tags: ['GHG Protocol', 'Direct']
    },
    'Scope 2': {
        definition: "Indirect GHG emissions from the generation of purchased electricity, steam, heat, or cooling consumed by the company.",
        formula: "Σ (Electricity Consumption × Location/Market-based Factor)",
        rationale: "Essential for evaluating energy efficiency strategies and RE100 commitments.",
        tags: ['GHG Protocol', 'Indirect']
    },
    'Scope 3': {
        definition: "All other indirect emissions that occur in a company's value chain (e.g., purchased goods, business travel, waste disposal).",
        formula: "Σ (Activity Data × Spend-based or Average-data Factor)",
        rationale: "Often >70% of total footprint. Managing this reduces supply chain risk and meets customer demands.",
        tags: ['Value Chain', 'Upstream/Downstream']
    },
    'ESG Score': {
        definition: "A composite score evaluating a company's environmental, social, and governance performance relative to industry peers.",
        formula: "(0.4 × Environmental) + (0.3 × Social) + (0.3 × Governance)",
        rationale: "High scores lower the cost of capital, attract green investment, and improve brand reputation.",
        tags: ['Rating', 'KPI']
    },
    'Carbon Pricing': {
        definition: "An internal shadow price applied to carbon emissions to evaluate investment decisions and drive decarbonization.",
        formula: "Total Emissions (tCO2e) × Shadow Price ($/t)",
        rationale: "Internalizes environmental costs to prepare for future carbon taxes and drive low-carbon innovation.",
        tags: ['Finance', 'Risk']
    },
    'Supply Chain Coverage': {
        definition: "The percentage of suppliers (by spend or emissions) who have reported primary carbon data.",
        formula: "(Suppliers with Primary Data / Total Suppliers) × 100",
        rationale: "Higher coverage improves Scope 3 accuracy, replacing estimates with real data for better decision making.",
        tags: ['Engagement', 'Data Quality']
    },
    'Energy Anomaly': {
        definition: "A detected deviation in energy consumption patterns significantly exceeding the baseline variance.",
        formula: "|Current - Baseline| > (2 × Standard Deviation)",
        rationale: "Early detection prevents equipment failure, reduces waste, and lowers unexpected operational costs.",
        tags: ['AI', 'Monitoring']
    },
    'SROI': {
        definition: "Social Return on Investment. A method for measuring values that are not traditionally reflected in financial statements.",
        formula: "(Net Present Value of Benefits / Net Present Value of Investment)",
        rationale: "Quantifies the 'invisible' value of social projects, justifying budgets for CSR and community engagement.",
        tags: ['Impact', 'Social']
    },
    'CBAM': {
        definition: "Carbon Border Adjustment Mechanism. EU regulation putting a fair price on carbon emitted during production of carbon intensive goods entering the EU.",
        formula: "Imported Quantity × (Embedded Emissions - Free Allowances) × Weekly ETS Price",
        rationale: "Critical for maintaining EU market access and avoiding heavy carbon tariffs on exports.",
        tags: ['Regulation', 'EU']
    }
};

export const TRANSLATIONS = {
  'en-US': {
    nav: {
      myEsg: 'My ESG',
      dashboard: 'Dashboard',
      strategy: 'Strategy Hub',
      talent: 'Talent Passport',
      carbon: 'Carbon Asset',
      report: 'Report Gen',
      integration: 'Integration Hub',
      culture: 'Culture Bot',
      finance: 'ROI Simulator',
      audit: 'Audit Trail',
      goodwill: 'Goodwill Coin',
      cardGame: 'Core Restoration', // Renamed
      researchHub: 'Research Hub',
      academy: 'Academy',
      diagnostics: 'Diagnostics',
      settings: 'Settings',
      yangBo: 'Yang Bo Zone',
      businessIntel: 'Business Intel',
      healthCheck: 'Health Check',
      universalTools: 'Universal Tools',
      fundraising: 'Fundraising',
      aboutUs: 'About Us',
      universalBackend: 'Universal Backend',
      apiZone: 'API Zone',
      alumniZone: 'Alumni & LMS'
    },
    modules: {
      myEsg: { title: 'My ESG Cockpit', desc: 'Your personalized sustainability command center.' },
      strategy: { title: 'Strategy Hub', desc: 'Risk heatmaps and stakeholder engagement analysis.' },
      talent: { title: 'Talent Passport', desc: 'Blockchain-verified certificates and skill tracking.' },
      carbon: { title: 'Carbon Asset Mgmt', desc: 'SBTi paths and internal carbon pricing simulation.' },
      report: { title: 'Report Generator', desc: 'AI-driven GRI/SASB report drafting (ESGss X JunAiKey).' },
      integration: { title: 'Integration Hub', desc: 'IoT/ERP connections and data ETL flows.' },
      culture: { title: 'Culture Bot', desc: 'Micro-learning and ESG culture promotion.' },
      finance: { title: 'Financial Simulator', desc: 'ROI analysis for decarbonization investments.' },
      audit: { title: 'Audit Trail', desc: 'SHA-256 data verification and confidence scoring.' },
      goodwill: { title: 'Goodwill Coin', desc: 'Tokenized rewards and redemption center.' },
      cardGame: { title: 'Universal Core Restoration', desc: 'Collect Memory Fragment Crystals to restore the system to perfection.' },
    },
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Real-time sustainability performance overview.',
      periods: { daily: 'Daily', monthly: 'Monthly', yearly: 'Yearly' },
      chartTitle: 'Emissions vs Baseline',
      feedTitle: 'JunAiKey Intelligence Feed',
      marketingTitle: 'Marketing Impact',
      vsLastMonth: 'vs last month'
    },
    research: {
      title: 'Research Hub',
      subtitle: 'Deep dive into data and regulatory frameworks.',
      searchPlaceholder: 'Search regulations, data points, or documents...',
      dataExplorer: 'Data Explorer',
      knowledgeBase: 'Knowledge Base',
      filters: 'Filters',
      viewAll: 'View All Documents',
      table: {
        metric: 'Metric',
        scope: 'Scope',
        value: 'Value',
        confidence: 'Confidence',
        source: 'Source'
      }
    },
    academy: {
      title: 'Sustainability Academy',
      subtitle: 'Upskill your team with curated ESG learning paths.',
      levelInfo: 'Level 12 • 4 Badges',
      progress: 'Progress',
      start: 'Start',
      resume: 'Resume'
    },
    diagnostics: {
      title: 'System Diagnostics',
      subtitle: 'Platform health and intelligence verification status.',
      moduleHealth: 'Module Health',
      security: 'Security & Compliance',
      uptime: 'Uptime',
      audit: 'SOC2 Audit',
      alerts: 'Critical Alerts',
      version: 'Version',
      maintenance: 'Maintenance Scheduled'
    }
  },
  'zh-TW': {
    nav: {
      myEsg: '我的 ESG',
      dashboard: '儀表板 (Dashboard)',
      strategy: '策略中樞 (Strategy Hub)',
      talent: '人材護照 (Talent Passport)',
      carbon: '碳資產 (Carbon Asset)',
      report: '報告生成 (Report Gen)',
      integration: '集成中樞 (Integration Hub)',
      culture: '文化推廣 (Culture Bot)',
      finance: 'ROI 模擬 (ROI Simulator)',
      audit: '稽核軌跡 (Audit Trail)',
      goodwill: '善向幣 (Goodwill Coin)',
      cardGame: '萬能核心修復', // Renamed
      researchHub: '研究中心 (Research Hub)',
      academy: '永續學院 (Academy)',
      diagnostics: '系統診斷 (Diagnostics)',
      settings: '設定 (Settings)',
      yangBo: '楊博專區 (Yang Bo)',
      businessIntel: '商情中心 (Biz Intel)',
      healthCheck: '全方位健檢 (Health Check)',
      universalTools: '萬能工具 (Universal Tools)',
      fundraising: '善向募資 (Fundraising)',
      aboutUs: '關於我們 (About Us)',
      universalBackend: '萬能管理後臺 (Backend Zone)',
      apiZone: 'API 專區',
      alumniZone: '校友專區 (Alumni LMS)'
    },
    modules: {
      myEsg: { title: '我的 ESG (My ESG)', desc: '您的個人化永續戰情室與成長中心。' },
      strategy: { title: '策略中樞 (Strategy Hub)', desc: '風險熱點圖與利害關係人議合分析 (Risk heatmaps & stakeholder engagement)。' },
      talent: { title: '人材護照 (Talent Passport)', desc: '區塊鏈驗證證書與技能追蹤 (Blockchain-verified certificates)。' },
      carbon: { title: '碳資產管理 (Carbon Asset Mgmt)', desc: 'SBTi 路徑與內部碳定價模擬 (SBTi paths & Carbon Pricing)。' },
      report: { title: '報告生成 (Report Generator)', desc: 'JunAiKey 驅動之 GRI/SASB 報告草稿生成。' },
      integration: { title: '集成中樞 (Integration Hub)', desc: 'IoT/ERP連接與數據 ETL 流程 (IoT/ERP connections)。' },
      culture: { title: '文化推廣 (Culture Bot)', desc: '每日微學習與 ESG 文化推廣 (Micro-learning)。' },
      finance: { title: '財務模擬 (Financial Simulator)', desc: '減碳投資 ROI 分析與碳稅衝擊 (ROI analysis)。' },
      audit: { title: '稽核軌跡 (Audit Trail)', desc: 'SHA-256 數據驗證與信心分級 (Data verification)。' },
      goodwill: { title: '善向幣 (Goodwill Coin)', desc: '代幣化獎勵與兌換中心 (Tokenized rewards)。' },
      cardGame: { title: '萬能核心修復計畫', desc: '收集萬能元件記憶碎片結晶，將系統修復至完美型態 (Zero Hallucination)。' },
    },
    dashboard: {
      title: '企業決策儀表板 (Executive Dashboard)',
      subtitle: '即時永續績效概覽 (Real-time sustainability performance overview)',
      periods: { daily: '日 (Daily)', monthly: '月 (Monthly)', yearly: '年 (Yearly)' },
      chartTitle: '排放量 vs 基準線 (Emissions vs Baseline)',
      feedTitle: 'JunAiKey 智慧情報流',
      marketingTitle: '行銷影響力 (Marketing Impact)',
      vsLastMonth: '與上月相比 (vs last month)'
    },
    research: {
      title: '研究中心 (Research Hub)',
      subtitle: '深入挖掘數據與法規框架 (Deep dive into data and regulatory frameworks)',
      searchPlaceholder: '搜尋法規、數據點或文件 (Search regulations, data points...)',
      dataExplorer: '數據探索器 (Data Explorer)',
      knowledgeBase: '知識庫 (Knowledge Base)',
      filters: '篩選 (Filters)',
      viewAll: '查看所有文件 (View All)',
      table: {
        metric: '指標 (Metric)',
        scope: '範疇 (Scope)',
        value: '數值 (Value)',
        confidence: '信心度 (Confidence)',
        source: '來源 (Source)'
      }
    },
    academy: {
      title: '永續學院 (Sustainability Academy)',
      subtitle: '提升團隊 ESG 技能 (Upskill your team with curated ESG learning paths)',
      levelInfo: '等級 12 • 4 徽章',
      progress: '進度 (Progress)',
      start: '開始 (Start)',
      resume: '繼續 (Resume)'
    },
    diagnostics: {
      title: '系統診斷 (System Diagnostics)',
      subtitle: '平台健康與 JunAiKey 狀態 (Platform health and intelligence verification status)',
      moduleHealth: '模組健康度 (Module Health)',
      security: '安全與合規 (Security & Compliance)',
      uptime: '運行時間 (Uptime)',
      audit: 'SOC2 稽核 (Audit)',
      alerts: '關鍵警報 (Critical Alerts)',
      version: '版本 (Version)',
      maintenance: '排程維護 (Maintenance Scheduled)'
    }
  }
};

export const DAILY_BRIEFING_TEMPLATES = {
    'en-US': {
        greeting: "Good Morning",
        intro: "While you were offline, I monitored 4.2TB of supply chain data and regulatory updates.",
        insights: [
            { type: 'risk', text: "EU CBAM carbon price projection increased by 2.4% overnight." },
            { type: 'opportunity', text: "Plant B solar efficiency reached a record high of 98%." },
            { type: 'alert', text: "Supplier 'TechFab Inc.' reported a water usage anomaly." }
        ],
        action: "Review Supplier Audit",
        button: "Accept Briefing"
    },
    'zh-TW': {
        greeting: "早安",
        intro: "在您休息時，我監控了 4.2TB 的供應鏈數據與法規更新。以下是今日關鍵匯報：",
        insights: [
            { type: 'risk', text: "歐盟 CBAM 碳價預測值隔夜上漲 2.4%，建議檢視 Q3 預算。" },
            { type: 'opportunity', text: "B 廠區太陽能發電效率達到 98% 的歷史新高。" },
            { type: 'alert', text: "供應商「TechFab Inc.」通報水資源使用異常，需關注。" }
        ],
        action: "審閱供應商稽核",
        button: "接受匯報"
    }
};

export const REPORT_STRUCTURE: ReportSection[] = [
  {
    id: '1',
    title: '1 關於本報告書 (About Report)',
    guidelines: 'Define report scope, boundaries, and reporting period. Reference GRI 102 General Disclosures.',
    principles: 'Accuracy, Balance, Clarity, Comparability, Reliability, Timeliness (GRI Principles).',
    subSections: [
      { 
          id: '1.01', 
          title: '1.01 經營者的話 (Letter from CEO)', 
          template: '# Message from the CEO\n\n[Opening: Commitment to Sustainability]\n\n[Body: Key Achievements of the Year]\n\n[Closing: Future Outlook]', 
          example: 'In 2024, we reduced our carbon intensity by 15%...', 
          griStandards: 'GRI 2-22' 
      },
      {
          id: '1.02', 
          title: '1.02 關於我們 (About Us)', 
          template: '## Company Profile\n\n* **Name:** [Name]\n* **HQ:** [Location]\n* **Employees:** [Count]', 
          griStandards: 'GRI 2-1' 
      }
    ]
  },
  {
      id: '2',
      title: '2 環境永續 (Environmental)',
      guidelines: 'Focus on material topics: Emissions, Energy, Water, Waste.',
      principles: 'Quantitative data should be consistent with financial reporting where possible.',
      subSections: [
          { id: '2.01', title: '2.01 氣候行動 (Climate Action)', template: '## GHG Emissions\n\nScope 1: [Value] tCO2e\nScope 2: [Value] tCO2e', griStandards: 'GRI 305' },
          { id: '2.02', title: '2.02 能源管理 (Energy)', template: '## Energy Consumption', griStandards: 'GRI 302' }
      ]
  }
];

/**
 * Universal Optical Cards - The Knowledge Prism
 * Theme: "Refracting Resources into Impact"
 * Updated to support bilingual display dynamically.
 */
export const getEsgCards = (language: Language): EsgCard[] => {
  const isZh = language === 'zh-TW';
  return [
    {
      id: 'card-legend-001',
      title: isZh ? 'ESGss 善向永續' : 'ESGss Sunshine Protocol',
      description: isZh 
        ? '建立在資本、政策與知識之間的「黃金三角」三方架構。將合規轉化為影響力。'
        : 'A Golden Triangle framework connecting Capital (TSMC), Policy (Taipei), and Knowledge. Transforms compliance into impact.',
      attribute: 'Governance',
      category: 'Partnership',
      rarity: 'Legendary',
      term: isZh ? '善向永續協議' : 'ESG Sunshine Protocol',
      definition: isZh
        ? '透過數據驗證與教育賦能，將靜態的 ESG 合規轉化為動態的社會影響力的架構。'
        : 'An architecture refracting resources into verifiable social impact through data & education.',
      stats: { defense: 100, offense: 100 },
      collectionSet: 'Genesis',
      isPurified: true
    },
    {
      id: 'card-e1-001',
      title: isZh ? '範疇一追蹤器' : 'Scope 1 Tracker',
      description: isZh
        ? '精確測量來自自有源的直接溫室氣體排放。'
        : 'Precision measurement of direct emissions from owned sources.',
      attribute: 'Environmental',
      category: 'Green_Ops',
      rarity: 'Common',
      term: isZh ? '直接排放' : 'Direct Emissions',
      definition: isZh
        ? '報告實體擁有或控制的來源產生的溫室氣體排放。'
        : 'GHG emissions from sources that are owned or controlled by the reporting entity.',
      stats: { defense: 80, offense: 20 },
      collectionSet: 'Starter',
      isPurified: true
    },
    {
      id: 'card-e1-rec',
      title: isZh ? '綠電憑證交易' : 'REC Trader',
      description: isZh
        ? '購買再生能源憑證以抵銷範疇二排放，是達成碳中和的過渡工具。'
        : 'Purchasing Renewable Energy Certificates to offset Scope 2 emissions as a transitional tool for carbon neutrality.',
      attribute: 'Environmental',
      category: 'Green_Ops',
      rarity: 'Common',
      term: isZh ? 'REC 交易' : 'REC Trading',
      definition: isZh
        ? '將再生能源的環境效益與物理電力分離的可交易憑證機制。'
        : 'Tradable certificates representing the environmental attributes of renewable energy generation, separate from physical power.',
      stats: { defense: 70, offense: 15 },
      collectionSet: 'Operations',
      isPurified: true
    },
    {
      id: 'card-s1-001',
      title: isZh ? '柏克萊策略菁英' : 'Berkeley Strategy Elite',
      description: isZh
        ? '獲得 UC Berkeley Haas 雙軌認證課程，具備國際永續策略規劃能力。'
        : 'UC Berkeley Haas certification. Global sustainability strategy planning capability.',
      attribute: 'Social',
      category: 'Human_Capital',
      rarity: 'Legendary',
      term: isZh ? 'ESG 領導力' : 'ESG Leadership',
      definition: isZh
        ? '整合商業策略與永續發展目標，推動組織變革的核心能力。'
        : 'Core competency integrating business strategy with SDGs to drive organizational change.',
      stats: { defense: 60, offense: 95 },
      collectionSet: 'Academy',
      isPurified: false
    },
    {
      id: 'card-g2-001',
      title: isZh ? '供應鏈護城河' : 'Supply Chain Moat',
      description: isZh
        ? '建立高韌性、低碳排的綠色供應鏈網絡。'
        : 'Building a resilient, low-carbon green supply chain network.',
      attribute: 'Governance',
      category: 'Partnership',
      rarity: 'Epic',
      term: isZh ? '供應鏈議合' : 'Supplier Engagement',
      definition: isZh
        ? '與供應商合作以改善其績效並減少範疇三排放的過程。'
        : 'Process of working with suppliers to improve their performance and reduce Scope 3 emissions.',
      stats: { defense: 90, offense: 70 },
      collectionSet: 'Operations',
      isPurified: true
    }
  ];
};

// --- Synergy System Data ---
export const getCardSynergies = (lang: Language): CardSynergy[] => {
    const isZh = lang === 'zh-TW';
    return [
        {
            id: 'syn-carbon-master',
            name: isZh ? '碳管理大師' : 'Carbon Master',
            description: isZh ? '同時擁有追蹤器與交易卡，解鎖碳數據整合視圖。' : 'Combine Tracker & Trader for integrated carbon view.',
            requiredCards: ['card-e1-001', 'card-e1-rec'],
            effect: { type: 'score_boost', target: 'environmental', value: 5 }
        },
        {
            id: 'syn-legend',
            name: isZh ? '善向創始者' : 'Genesis Founder',
            description: isZh ? '持有善向永續協議卡，獲得全域治理加成。' : 'Hold the Genesis Protocol for global governance buff.',
            requiredCards: ['card-legend-001'],
            effect: { type: 'score_boost', target: 'governance', value: 10 }
        },
        {
            id: 'syn-eco-chain',
            name: isZh ? '生態系鏈結' : 'Eco-Linkage',
            description: isZh ? '連結供應鏈與人才，強化社會影響力。' : 'Connect supply chain & talent for social impact.',
            requiredCards: ['card-g2-001', 'card-s1-001'],
            effect: { type: 'score_boost', target: 'social', value: 8 }
        }
    ];
};

// Deprecated static export, kept for legacy if any, but modules should use getEsgCards(lang)
export const ESG_CARDS = getEsgCards('en-US'); 

// SDR Global Databases
export const GLOBAL_SDR_MODULES = [
    { id: 'sdr-cdp', name: 'CDP Open Data', description: 'Global disclosure system for investors, companies, cities.', status: 'available', icon: 'Database' },
    { id: 'sdr-gri', name: 'GRI Database', description: 'Comprehensive sustainability reporting standards data.', status: 'available', icon: 'FileText' },
    { id: 'sdr-ifrs', name: 'IFRS S1/S2', description: 'International financial reporting standards for sustainability.', status: 'available', icon: 'Globe' },
    { id: 'sdr-tnfd', name: 'TNFD Nature Data', description: 'Taskforce on Nature-related Financial Disclosures.', status: 'beta', icon: 'Leaf' },
];

export const getMockMetrics = (lang: Language): Metric[] => {
  const isZh = lang === 'zh-TW';
  return [
    { 
        id: '1', 
        label: isZh ? '範疇一排放 (Scope 1)' : 'Scope 1 Emissions', 
        value: '1,240', 
        change: -5.2, 
        trend: 'up', 
        color: 'emerald', 
        traits: ['performance'], 
        tags: ['Direct'] 
    },
    { 
        id: '2', 
        label: isZh ? '範疇二排放 (Scope 2)' : 'Scope 2 Emissions', 
        value: '850', 
        change: -2.1, 
        trend: 'down', 
        color: 'blue', 
        traits: ['optimization'], 
        tags: ['Indirect'] 
    },
    { 
        id: '3', 
        label: isZh ? 'ESG 綜合評分' : 'ESG Score', 
        value: '88.4', 
        change: 1.5, 
        trend: 'up', 
        color: 'purple', 
        traits: ['evolution'], 
        tags: ['Rating'] 
    },
    { 
        id: '4', 
        label: isZh ? '供應鏈數據覆蓋率' : 'Supply Chain Coverage', 
        value: '72%', 
        change: 8.4, 
        trend: 'up', 
        color: 'gold', 
        traits: ['gap-filling'], 
        tags: ['Scope 3'], 
        dataLink: 'ai' 
    },
  ];
};

export const getMockCourses = (lang: Language): Course[] => [
    { id: '1', title: 'GHG Protocol Fundamentals', category: 'Environment', level: 'Beginner', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&q=80' },
    { id: '2', title: 'Supply Chain Decarbonization', category: 'Strategy', level: 'Advanced', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80' },
    { id: '3', title: 'Social Impact Measurement', category: 'Social', level: 'Intermediate', progress: 10, thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80' },
];

export const getMockHealth = (lang: Language): SystemHealth[] => [
    { module: 'Data Collector', status: 'Healthy', latency: 45 },
    { module: 'AI Reasoning', status: 'Healthy', latency: 120 },
    { module: 'Blockchain Node', status: 'Warning', latency: 450 },
    { module: 'Reporting Engine', status: 'Healthy', latency: 85 },
];

export const CHART_DATA = [
  { name: 'Jan', value: 400, baseline: 450 },
  { name: 'Feb', value: 380, baseline: 440 },
  { name: 'Mar', value: 420, baseline: 460 },
  { name: 'Apr', value: 350, baseline: 430 },
  { name: 'May', value: 340, baseline: 420 },
  { name: 'Jun', value: 310, baseline: 410 },
  { name: 'Jul', value: 300, baseline: 400 },
];
