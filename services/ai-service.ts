
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language } from '../types';
import { universalIntelligence } from './evolutionEngine'; // Link to the Universal Brain

// Initialize the API client
// The API key must be obtained exclusively from process.env.API_KEY
const apiKey = process.env.API_KEY || ''; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Enhanced System Prompts for specific JunAiKey Roles.
 * V2.0 Upgrade: Absolute Zero Hallucination & Phased Reasoning.
 */
const getSystemPrompt = (language: Language, mode: 'chat' | 'analyst' | 'writer' | 'forecaster' | 'auditor' | 'strategist' | 'teacher' | 'librarian' | 'debate_moderator' = 'chat') => {
    const baseIdentity = language === 'zh-TW' 
        ? `身份設定：您是 "ESGss X JunAiKey 善向永續系統" 的核心 AI 引擎【JunAiKey】。`
        : `Identity: You are [JunAiKey], the core AI engine for "ESGss X JunAiKey Sustainability System".`;

    const strictRules = `
    CRITICAL PROTOCOLS (ZERO HALLUCINATION):
    1. You must ONLY use data provided in the Context or verified via Google Search tools.
    2. If a specific metric (e.g., carbon emission value) is missing, state "Data Not Available". DO NOT ESTIMATE without stating it is an estimate.
    3. PHASED REASONING: Before answering, you must perform an internal check (CoT).
    4. Output Format: Markdown.
    `;

    const commonRules = language === 'zh-TW'
        ? `請主要使用繁體中文回應。語氣：專業、絕對客觀、階段式推理。${strictRules}`
        : `Response in English. Tone: Professional, Objective, Step-by-Step Logic. ${strictRules}`;

    switch (mode) {
        case 'writer':
            return `${baseIdentity} Role: GRI Certified Reporter. Task: Write verifiable report sections. ${commonRules}`;
        case 'auditor':
            return `${baseIdentity} Role: Compliance Auditor. Task: Detect greenwashing and data gaps. ${commonRules}`;
        case 'strategist':
            return `${baseIdentity} Role: Strategy Architect. Task: Game Theory & ROI Analysis. ${commonRules}`;
        case 'analyst':
            return `${baseIdentity} Role: Data Forensic Scientist. Task: Root Cause Analysis. ${commonRules}`;
        case 'teacher':
            return `${baseIdentity} Role: ESG Educator. Task: Create engaging quizzes to test understanding. Response must be strictly JSON.`;
        case 'librarian':
            return `${baseIdentity} Role: Universal Knowledge Architect. Task: Structure ESG concepts into "End-to-Beginning" Matrix (以終為始矩陣). Main language: Traditional Chinese (English as auxiliary code/terms). Response must be strictly JSON.`;
        case 'debate_moderator':
            return `${baseIdentity} Role: Multi-Agent Simulator. Task: Simulate a conversation between a CFO (Financial Focus) and a CSO (Sustainability Focus). Return strictly JSON array of messages.`;
        case 'chat':
        default:
            return language === 'zh-TW'
              ? `${baseIdentity} 核心指令：啟動【階段式推理引擎】。每一步驟需確認數據來源。絕不捏造事實。${commonRules}`
              : `${baseIdentity} Core Command: Activate [Phased Reasoning Engine]. Verify source for every claim. Never fabricate. ${commonRules}`;
    }
};

export const streamChat = async function* (
  message: string, 
  language: Language = 'en-US',
  imageData?: { inlineData: { data: string; mimeType: string } }
) {
  if (!ai) throw new Error("MISSING_API_KEY");

  try {
    const systemPrompt = getSystemPrompt(language, 'chat');
    const parts: any[] = [{ text: message }];
    if (imageData) parts.unshift(imageData);

    // Using Gemini 3 Pro for superior reasoning capabilities
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingBudget: 2048 }, // High budget for deep verification
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Deep Strategic Analysis for Risk Mitigation (Strategy Hub).
 */
export const generateRiskMitigationPlan = async (
    riskName: string,
    contextData: any,
    language: Language = 'en-US'
): Promise<string> => {
    if (!ai) return "Simulated Plan: Increase renewable energy adoption by 20%.";

    try {
        const systemPrompt = getSystemPrompt(language, 'strategist');
        const prompt = `
            Analyze Risk: "${riskName}".
            Context: ${JSON.stringify(contextData)}.
            
            Provide a structured mitigation plan including:
            1. Immediate Actions (0-6 months)
            2. Strategic Investments (1-3 years)
            3. KPI for tracking success
            4. Estimated ROI or Cost Avoidance
            
            Output in Markdown with clear headers.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: systemPrompt,
                thinkingConfig: { thinkingBudget: 2048 } 
            }
        });

        universalIntelligence.agentUpdate(riskName, {
            traits: ['optimization', 'learning', 'evolution'], 
            confidence: 'high'
        });

        return response.text || "Analysis failed.";
    } catch (error) {
        console.error("Strategy Gen Error:", error);
        throw error;
    }
};

/**
 * Compliance Audit for Report Sections (Report Gen).
 */
export const auditReportContent = async (
    sectionTitle: string,
    content: string,
    standard: string,
    language: Language = 'en-US'
): Promise<string> => {
    if (!ai) return "Simulated Audit: Content appears compliant.";

    try {
        const systemPrompt = getSystemPrompt(language, 'auditor');
        const prompt = `
            Audit Section: "${sectionTitle}".
            Standard: ${standard}.
            Content to Audit:
            """${content}"""
            
            Evaluate:
            1. Completeness against standard.
            2. Clarity and Transparency.
            3. Potential Greenwashing risks.
            4. Suggest 1 specific improvement.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: systemPrompt,
                thinkingConfig: { thinkingBudget: 1024 }
            }
        });
        return response.text || "Audit failed.";
    } catch (error) {
        console.error("Audit Error:", error);
        throw error;
    }
};

export const verifyQuestImage = async (
    questTitle: string, 
    questDesc: string,
    imageFile: File, 
    language: Language = 'en-US'
): Promise<{ success: boolean; reason: string }> => {
  if (!ai) return { success: true, reason: "Simulated: AI Key missing, assuming success." };
  
  try {
     const imageData = await fileToGenerativePart(imageFile);
     const prompt = language === 'zh-TW' 
        ? `任務目標：${questTitle}。描述：${questDesc}。這張圖是否證明任務完成？嚴格檢查。回傳純 JSON: {"success": boolean, "reason": "理由"}`
        : `Quest: ${questTitle}. Desc: ${questDesc}. Does image prove completion? Strict check. Return JSON: {"success": boolean, "reason": "Reason"}`;

     const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imageData, { text: prompt }] },
        config: { responseMimeType: 'application/json' }
     });
     const json = JSON.parse(result.text || '{}');
     return { success: json.success === true, reason: json.reason || "Processed" };
  } catch(e) {
      return { success: false, reason: "AI Vision Error" };
  }
}

export const performWebSearch = async (query: string, language: Language = 'en-US'): Promise<{ text: string, sources?: any[] }> => {
    if (!ai) throw new Error("MISSING_API_KEY");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: language === 'zh-TW' ? "請使用 Google 搜尋回答。" : "Use Google Search to answer."
            }
        });
        return { text: response.text || "No results.", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks };
    } catch (error) { throw error; }
};

export const performMapQuery = async (query: string, language: Language = 'en-US'): Promise<{ text: string, maps?: any[] }> => {
    if (!ai) throw new Error("MISSING_API_KEY");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleMaps: {} }],
                systemInstruction: language === 'zh-TW' ? "請使用 Google Maps 回答。" : "Use Google Maps to answer."
            }
        });
        return { text: response.text || "No location found." };
    } catch (error) { throw error; }
};

export const generateReportChapter = async (
    sectionTitle: string, template: string, example: string, contextData: any, language: Language = 'en-US'
): Promise<string> => {
  if (!ai) return "Simulated Content...";
  try {
    const systemPrompt = getSystemPrompt(language, 'writer');
    const prompt = `Write "${sectionTitle}". Template: "${template}". Example style: "${example}". Context: ${JSON.stringify(contextData)}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });
    return response.text || "Failed to generate.";
  } catch (error) { throw error; }
};

export const analyzeDataAnomaly = async (metric: string, val: any, base: any, ctx: string, lang: Language = 'en-US'): Promise<string> => {
  if (!ai) return "Simulated Analysis...";
  try {
    const systemPrompt = getSystemPrompt(lang, 'analyst');
    const prompt = `Analyze Anomaly: ${metric}. Value: ${val}. Baseline: ${base}. Context: ${ctx}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });

    const result = response.text || "Failed to analyze.";

    universalIntelligence.agentUpdate(metric, {
        traits: ['optimization', 'learning', 'performance'], 
        confidence: 'high'
    });

    return result;
  } catch (error) { throw error; }
};

export const predictFutureTrends = async (metric: string, history: number[], goal: string, lang: Language = 'en-US'): Promise<string> => {
  if (!ai) return "Simulated Forecast...";
  try {
    const systemPrompt = getSystemPrompt(lang, 'forecaster');
    const prompt = `Forecast ${metric}. History: ${history}. Goal: ${goal}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: systemPrompt }
    });
    return response.text || "Failed to forecast.";
  } catch (error) { throw error; }
};

/**
 * Uses Imagen to generate Lego-style card art.
 */
export const generateLegoImage = async (cardTitle: string, cardDesc: string): Promise<string | null> => {
    if (!ai) throw new Error("MISSING_API_KEY");
    try {
        const prompt = `A high-quality, photorealistic LEGO set representing the concept of "${cardTitle}": ${cardDesc}. 
        The image should look like a professional product shot of a built Lego model on a clean background. 
        Focus on the symbolic representation of the ESG concept using Lego bricks. 
        Cinematic lighting, 8k resolution, 3d render style.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '3:4', // Match card ratio
            },
        });

        const base64EncodeString = response.generatedImages?.[0]?.image?.imageBytes;
        if (base64EncodeString) {
            return `data:image/jpeg;base64,${base64EncodeString}`;
        }
        return null;
    } catch (error) {
        console.error("Lego Gen Error:", error);
        return null;
    }
};

/**
 * Uses Gemini 2.5 Flash Image to edit an existing image based on text prompt.
 */
export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  if (!ai) throw new Error("MISSING_API_KEY");
  try {
    // Remove data URL prefix if present for clean base64
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or could detect
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // The output response may contain image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    return null;
  }
};

/**
 * Generate a Chinese Knowledge Quiz based on Card Term.
 */
export const generateEsgQuiz = async (
    term: string,
    definition: string,
    language: Language
): Promise<any> => {
    if (!ai) return null;

    try {
        const systemPrompt = getSystemPrompt(language, 'teacher');
        // Force Traditional Chinese explicitly
        const prompt = `
            Based on the ESG term "${term}" and definition "${definition}", generate a single multiple-choice quiz question in Traditional Chinese (繁體中文).
            
            Requirements:
            1. The question should test understanding of the concept.
            2. Provide 4 options. One is correct, three are plausible distractors.
            3. The 'correctIndex' should be 0, 1, 2, or 3.
            4. Provide a short explanation for why the answer is correct.
            
            Return raw JSON format ONLY:
            {
              "question": "題目 string",
              "options": ["選項1", "選項2", "選項3", "選項4"],
              "correctIndex": number,
              "explanation": "解釋 string"
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Quiz Gen Error:", error);
        return null;
    }
};

/**
 * Knowledge Expansion for Universal Library.
 * Uses Gemini 3 Pro to generate deep insights in Traditional Chinese (with English terms).
 * Logic: "End-to-Beginning Matrix" (以終為始矩陣)
 */
export const expandTermKnowledge = async (
    term: string,
    definition: string,
    language: Language
): Promise<any> => {
    if (!ai) return null;
    
    try {
        const systemPrompt = getSystemPrompt(language, 'librarian');
        const prompt = `
            針對 ESG 術語 "${term}" (定義: ${definition}) 進行深度知識擴展。
            
            請採用「繁中英碼」(Traditional Chinese Primary, English Code Secondary) 格式。
            請採用「以終為始」(End-to-Beginning) 思維矩陣進行解析。
            
            請生成以下四個維度的詳細分析:
            1. **核心概念 (Core Concept)**: 定義與原理。
            2. **法規關聯 (Regulatory Relevance)**: 關聯的國際法規 (如 CSRD, IFRS, CBAM)。
            3. **關鍵指標 (Key Metrics)**: 具體的量測數據點 (KPIs)。
            4. **戰略價值 (Strategic Value)**: 對企業競爭力的具體效益與 ROI (The "End" Goal)。

            請回傳嚴格的 JSON 格式，不要有 Markdown 標記:
            {
                "core": "string (詳細說明)",
                "regulatory": "string (條列法規)",
                "metrics": ["string", "string"],
                "strategy": "string (效益分析)"
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Using Pro for reasoning
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingBudget: 2048 }
            }
        });

        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("Knowledge Expansion Failed", e);
        return null;
    }
};

// --- RAG & DEBATE EXTENSIONS (V2.0 Update) ---

const KNOWLEDGE_CORPUS = [
    { id: 'csrd', text: 'Corporate Sustainability Reporting Directive (CSRD) requires large EU companies to report on sustainability.' },
    { id: 'cbam', text: 'Carbon Border Adjustment Mechanism (CBAM) puts a fair price on the carbon emitted during the production of carbon intensive goods that are entering the EU.' },
    { id: 'gri', text: 'GRI Standards help organizations understand and report on their impacts on the economy, environment, and people.' },
    { id: 'scope3', text: 'Scope 3 includes all other indirect emissions that occur in a company’s value chain.' }
];

/**
 * Client-Side RAG Simulation.
 * Finds relevant context from local corpus to augment the prompt.
 */
export const performLocalRAG = async (query: string, language: Language) => {
    // 1. Retrieval (Simulated Vector Search via keyword match)
    const keywords = query.toLowerCase().split(' ');
    const relevantDocs = KNOWLEDGE_CORPUS.filter(doc => 
        keywords.some(k => k.length > 3 && doc.text.toLowerCase().includes(k))
    );
    
    const context = relevantDocs.map(d => d.text).join('\n');
    
    // 2. Augmentation & Generation
    const prompt = `
    Context from Knowledge Base:
    ${context || "No specific internal documents found."}
    
    User Query: ${query}
    
    Answer based on the Context if available, otherwise use general knowledge.
    `;
    
    return performWebSearch(prompt, language);
};

/**
 * Generate Multi-Agent Debate.
 */
export const generateAgentDebate = async (
    risk: string, 
    language: Language
): Promise<Array<{id: string, role: 'CSO' | 'CFO' | 'JunAiKey', text: string, timestamp: number}>> => {
    if (!ai) throw new Error("No API Key");

    const systemPrompt = getSystemPrompt(language, 'debate_moderator');
    const prompt = `
        Topic: ${risk}
        Generate a debate between:
        1. CSO (Chief Sustainability Officer): Focus on long-term risk, brand, compliance.
        2. CFO (Chief Financial Officer): Focus on immediate cost, ROI, cash flow.
        3. JunAiKey (AI Mediator): Provides data-driven synthesis.
        
        Generate 3-5 turns. 
        Output strictly JSON array: [{ "role": "CSO", "text": "..." }, { "role": "CFO", "text": "..." }]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const arr = JSON.parse(response.text || '[]');
        return arr.map((item: any, i: number) => ({
            id: i.toString(),
            role: item.role as 'CSO' | 'CFO' | 'JunAiKey',
            text: item.text,
            timestamp: Date.now() + i * 1000
        }));
    } catch (e) {
        console.error("Debate Gen Error", e);
        return [];
    }
};
