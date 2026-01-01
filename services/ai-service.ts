import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration, Modality, Blob, VideoGenerationReferenceType } from "@google/genai";
import { Language, SemanticContext, SoulEvolutionFeedback, PersonaConfig, McpRunActionOutput, ImpactProject } from '../types';
import { z } from 'zod';

/**
 * Universal retry wrapper for AI service calls and node actions.
 */
async function withRetry<T>(
    fn: () => Promise<T>, 
    retries = 3, 
    initialDelay = 1000
): Promise<T> {
    let lastError: any;
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            if (error.message?.includes("Requested entity was not found.") || error.status === 404) {
                try { await (window as any).aistudio.openSelectKey(); } catch (e) {}
            }
            const isTransient = 
                error.status === 429 || 
                (error.status >= 500 && error.status <= 599) || 
                error.name === 'AbortError' ||
                error.message?.toLowerCase().includes("fetch") ||
                error.message?.toLowerCase().includes("network");

            if (i < retries && isTransient) {
                const delay = initialDelay * Math.pow(2, i) + (Math.random() * 200);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw lastError;
            }
        }
    }
    throw lastError;
}

/**
 * JunAiKey Centralized API Facade (v1.0)
 */
export const JunAiKeyAPI = {
    v1: {
        perception: {
            analyze: async (media: string, prompt: string, mimeType: string = 'image/png') => analyzeMedia(media, prompt, mimeType),
        },
        cognition: {
            reason: async (prompt: string, context: string[] = [], useThinking: boolean = true) => {
                const stream = streamChat(prompt, 'zh-TW', 'Deep Reasoning Mode', context, [], 'gemini-3-pro-preview', useThinking);
                let res = '';
                for await (const chunk of stream) res += chunk.text || '';
                return res;
            },
        },
        manifest: {
            summarize: async (content: string, language: Language = 'zh-TW') => generateNoteSummary(content, language),
            renderReport: async (title: string, context: any) => generateReportChapter(title, "", "", context, 'zh-TW')
        },
         intelligence: {
            search: async (query: string) => performWebSearch(query, 'zh-TW')
        }
    }
};

export async function runMcpAction(
  action: string, 
  inputParams: any, 
  language: Language,
  onLog?: (msg: string, type: 'info'|'warning'|'error'|'success') => void
): Promise<McpRunActionOutput> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isZh = language === 'zh-TW';

  return withRetry(async () => {
      // --- Action: Incident Response Protocol (#OriginalSinInvestigation) ---
      if (action === 'perform_incident_investigation') {
          onLog?.(`[SECURITY] Initiating Original Sin Investigation for ${inputParams.targetEntity}...`, 'warning');
          const prompt = `
            [C] Context: Anomaly detected in ESG data for ${inputParams.targetEntity}. Anomaly: ${inputParams.anomalyType}.
            [R] Role: ESGss Forensic Architect.
            [A] Action: 
                1. Diagnose the logic contradiction (Variance Guard / Correlation Clash).
                2. Formulate an automated corrective task for Flowlu.
                3. Draft a firm yet helpful notification for the Project Manager.
            [F] Format: JSON { diagnosis, recommendation, flowlu_task_title, email_body }.
            Language: ${isZh ? 'Traditional Chinese (zh-TW)' : 'English'}
          `;
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });
          return { success: true, result: JSON.parse(response.text || "{}"), error: null };
      }

      // --- Action 01: Supplier Survey Dispatch (#HolyRelay) ---
      if (action === 'dispatch_supplier_survey') {
          onLog?.(`[SYNERGY] Forging Quantum Invite Link for ${inputParams.supplierName}...`, 'info');
          const prompt = `
            [C] Context: Supplier ESG Data Collection. Target: ${inputParams.supplierName}. Standard: GRI 2024.
            [R] Role: ESGss Liaison Architect.
            [A] Action: 
                1. Craft three types of professional emails: Initiation (Value-driven), In-Progress (Entropy reduction), and Completed (Achievement).
                2. Explain the "Value Creation" benefit for the supplier (Not just a burden).
            [F] Format: JSON { initiation: { subject, body }, progress: { subject, body }, completed: { subject, body } }.
            Language: ${isZh ? 'Traditional Chinese (zh-TW)' : 'English'}
          `;
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });
          return { success: true, result: JSON.parse(response.text || "{}"), error: null };
      }

      // --- Action 05: OCR Data Purity Verification ---
      if (action === 'verify_data_purity') {
        onLog?.(`[ALCHEMY] Verifying Essence Purity of uploaded media...`, 'info');
        const prompt = `
          [C] Context: User uploaded a utility bill. We need to score its "Purity" for OCR.
          [R] Role: ESGss Quality Alchemist.
          [A] Action:
              1. Score the following categories from 0-100: Clarity (Image quality), Alignment (Is it a utility bill?), Validity (Is it current?).
              2. Provide a polite AI guidance text if any score is below 80.
          [F] Format: JSON { clarity, alignment, validity, guidance_text }.
          Language: ${isZh ? 'Traditional Chinese (zh-TW)' : 'English'}
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return { success: true, result: JSON.parse(response.text || "{}"), error: null };
      }

      // --- Action 07: Architecture Audit (#DefensiveTesting) ---
      if (action === 'perform_architecture_audit') {
          onLog?.(`[WITNESS] Executing Defensive Testing Rituals...`, 'info');
          const prompt = `
            [C] Context: Flowlu Integration & Schema Verification.
            [R] Role: System Architect Auditor.
            [A] Action: 
                1. Run simulations on Flowlu API connectivity.
                2. Check for "Schema Drift" (ID changes).
                3. Verify logic integrity for carbon calculation.
            [F] Format: JSON { tests: [{ name, status, details }], schema_integrity: 0-100 }.
            Language: ${isZh ? 'Traditional Chinese (zh-TW)' : 'English'}
          `;
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });
          return { success: true, result: JSON.parse(response.text || "{}"), error: null };
      }

      // --- Action 05: Data Engraving Logic (#QuantumEngraving) ---
      if (action === 'engrave_crm_data') {
          onLog?.(`[ALCHEMY] Transmuting RAW Submission to Flowlu Shard...`, 'info');
          const prompt = `
            [C] Context: Supplier Submission: ${JSON.stringify(inputParams.rawData)}. Target: Flowlu CRM Custom Fields.
            [R] Role: ESGss Data Alchemist.
            [A] Action:
                1. Map raw metrics to sustainability pillars.
                2. Calculate "Trust Score" delta based on evidence quality.
                3. Generate Flowlu API patch payload.
            [F] Format: JSON.
            Language: ${isZh ? 'Traditional Chinese (zh-TW)' : 'English'}
          `;
          const response = await ai.models.generateContent({
              model: 'gemini-3-pro-preview',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });
          return { success: true, result: JSON.parse(response.text || "{}"), error: null };
      }

      // Other actions...
      return { success: false, result: null, error: `Action '${action}' not implemented.` };
  });
}

export async function generateNoteSummary(content: string, language: Language): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Summarize in 30 words: ${content}` });
        return response.text || "";
    });
}

export async function* streamChat(prompt: string, language: Language, systemInstruction?: string, knowledgeBase?: string[], tools?: FunctionDeclaration[], model: string = 'gemini-3-pro-preview', useThinking: boolean = false) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const config: any = { systemInstruction: `${systemInstruction || ''}\nContext: ${knowledgeBase?.join('\n') || ''}` };
    if (useThinking) config.thinkingConfig = { thinkingBudget: 32768 };
    const result = await withRetry(async () => { return await ai.models.generateContentStream({ model: model, contents: prompt, config }); });
    for await (const chunk of result) yield chunk;
}

export async function analyzeMedia(fileBase64: string, prompt: string, mimeType: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: { parts: [{ inlineData: { data: fileBase64, mimeType } }, { text: prompt }] } });
        return response.text || "";
    });
}

export async function generateReportChapter(title: string, template: string, example: string, context: any, language: Language): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate formal ESG report chapter for ${title}. Context: ${JSON.stringify(context)}. Template: ${template}. Example: ${example}. Language: ${language}`;
    return withRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
        return response.text || "";
    });
}

export async function performWebSearch(query: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: query, config: { tools: [{ googleSearch: {} }] } });
        return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
    });
}

export async function predictFutureTrends(data: any[], language: Language): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Predict future ESG trends based on this data: ${JSON.stringify(data)}. Language: ${language}`,
        });
        return response.text || "";
    });
}

export async function generateLegoImage(title: string, description: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: `A detailed LEGO set model representing the concept: ${title}. ${description}. High quality 3D render, white background.`,
        });
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64Data: string = part.inlineData.data;
                return `data:image/png;base64,${base64Data}`;
            }
        }
        return null;
    });
}

export async function generateEsgQuiz(term: string, definition: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a multiple choice quiz question about ${term} based on definition: ${definition}. Language: ${language}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctIndex: { type: Type.INTEGER },
                        explanation: { type: Type.STRING }
                    },
                    required: ["question", "options", "correctIndex", "explanation"]
                }
            }
        });
        return JSON.parse(response.text || "{}");
    });
}

export async function generateProjectTheoryOfChange(title: string, desc: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate a Theory of Change for project: ${title}. Description: ${desc}. Language: ${language}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sdgs: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                        logicModel: {
                            type: Type.OBJECT,
                            properties: {
                                inputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                                activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                                outputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                                outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                                impact: { type: Type.STRING }
                            }
                        },
                        impactMetrics: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING },
                                    target: { type: Type.NUMBER },
                                    current: { type: Type.NUMBER },
                                    unit: { type: Type.STRING },
                                    proxy_value: { type: Type.NUMBER }
                                }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    });
}

/**
 * Added fix: performDeepDocAnalysis implementation.
 * Performs deep structural document analysis for ResearchHub.
 */
export async function performDeepDocAnalysis(query: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: query,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        chunks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    tag: { type: Type.STRING },
                                    score: { type: Type.NUMBER }
                                },
                                required: ["text", "tag", "score"]
                            }
                        }
                    },
                    required: ["summary", "chunks"]
                }
            }
        });
        return JSON.parse(response.text || "{}");
    });
}

/**
 * Added fix: performMapQuery implementation.
 * Performs Google Maps grounded search for CarbonAsset and GlobalOperations.
 */
export async function performMapQuery(query: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleMaps: {} }, { googleSearch: {} }],
            },
        });
        return {
            text: response.text,
            sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        };
    });
}
