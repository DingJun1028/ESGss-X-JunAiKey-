
import { GoogleGenAI, Type, GenerateContentResponse, FunctionDeclaration } from "@google/genai";
import { Language, SemanticContext, SoulEvolutionFeedback, PersonaConfig, McpRunActionOutput, ImpactProject } from '../types';

/**
 * Enhanced retry utility with exponential backoff, jitter, and comprehensive error filtering.
 */
async function withRetry<T>(
    fn: (attempt: number) => Promise<T>, 
    retries = 3, 
    delay = 1000,
    onRetry?: (error: any, attempt: number) => void
): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn(i + 1);
        } catch (error: any) {
            lastError = error;
            
            // Critical AI Studio Key Check
            if (error.message?.includes("Requested entity was not found.")) {
                try { await (window as any).aistudio.openSelectKey(); } catch (e) {}
            }

            const isTimeout = error.name === 'AbortError' || error.status === 408 || error.message?.toLowerCase().includes('timeout');
            const isRateLimit = error.status === 429;
            const isServerError = error.status >= 500;
            const isNetworkFailure = !error.status && (error.name === 'TypeError' || error.message?.includes('Failed to fetch'));

            const shouldRetry = i < retries && (isTimeout || isRateLimit || isServerError || isNetworkFailure);

            if (!shouldRetry) break;

            onRetry?.(error, i + 1);

            // Exponential backoff with jitter
            const backoff = (delay * Math.pow(2, i)) + (Math.random() * 1000);
            console.warn(`[RETRY_LOGIC] Attempt ${i + 1} failed (${error.status || error.name}). Retrying in ${Math.round(backoff)}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
        }
    }
    throw lastError;
}

/**
 * Generates a Theory of Change (ToC) and logic model for an Impact Project.
 */
export async function generateProjectTheoryOfChange(title: string, description: string, language: Language): Promise<Partial<ImpactProject>> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const isZh = language === 'zh-TW';
    
    const prompt = `
        As an ESG Chief Strategist, develop a "Theory of Change" for this project:
        Title: ${title}
        Goal: ${description}

        Requirements:
        1. Map it to at least 2 relevant SDGs.
        2. Create a standard Logic Model (Inputs, Activities, Outputs, Outcomes, Impact).
        3. Propose 3 monetary impact KPIs with proxy values (SROI calculations).
        
        Format the response as a strict JSON matching this schema:
        {
            "sdgs": [number],
            "logicModel": { "inputs": [string], "activities": [string], "outputs": [string], "outcomes": [string], "impact": string },
            "impactMetrics": [{ "label": string, "target": number, "current": 0, "unit": string, "proxy_value": number }]
        }

        Language: ${isZh ? 'Traditional Chinese' : 'English'}.
    `;

    const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sdgs: { type: Type.ARRAY, items: { type: Type.NUMBER } },
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
    }));

    return JSON.parse(response.text || "{}");
}

export async function executeApiCall(
    url: string,
    method: string = 'GET',
    headers: any = {},
    body: any = null,
    timeout: number = 30000,
    responseType: 'json' | 'string' = 'json'
): Promise<any> {
    // Basic URL validation
    try { new URL(url); } catch (e) { throw new Error(`INVALID_URL: ${url}`); }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                ...headers 
            },
            body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null,
            signal: controller.signal
        });

        clearTimeout(timer);

        if (!response.ok) {
            const err: any = new Error(`HTTP_${response.status}_${response.statusText || 'Error'}`);
            err.status = response.status;
            throw err;
        }

        const contentType = response.headers.get('content-type') || '';
        
        if (responseType === 'json') {
            if (contentType.includes('application/json')) {
                return await response.json();
            } else {
                // Fallback attempt if header is missing but type requested is json
                const text = await response.text();
                try { return JSON.parse(text); } 
                catch (e) { throw new Error('RESPONSE_TYPE_MISMATCH: Expected JSON but received incompatible format.'); }
            }
        }
        
        return await response.text();
    } catch (e: any) {
        clearTimeout(timer);
        if (e.name === 'AbortError') {
            const timeoutErr: any = new Error('NETWORK_TIMEOUT: Connection aborted after ' + timeout + 'ms');
            timeoutErr.status = 408;
            throw timeoutErr;
        }
        throw e;
    }
}

/**
 * Simulates an MCP (Model Context Protocol) run action call.
 */
export async function runMcpAction(
  action: string, 
  inputParams: any, 
  language: Language,
  onLog?: (msg: string, type: 'info'|'warning'|'error') => void
): Promise<McpRunActionOutput> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  if (action === 'api_call') {
      try {
          const { url, method = 'GET', timeout = 30, response_type = 'json', headers = {}, body = null } = inputParams;
          onLog?.(`Initiating API Request: [${method}] ${url}`, 'info');
          
          const result = await withRetry(async (attempt) => {
              // Simulation of a flaky gateway for RESILIENCE_TEST
              if (url === 'SIM_FAIL') {
                  const err: any = new Error('Gateway Timeout (Simulated Flakiness)');
                  err.status = 504;
                  throw err;
              }

              return await executeApiCall(url, method, headers, body, timeout * 1000, response_type);
          }, 3, 1000, (err, attempt) => {
              onLog?.(`Retry Triggered: Attempt ${attempt} failed with ${err.message}. Re-establishing handshake...`, 'warning');
          });

          return { success: true, result, error: null };
      } catch (e: any) {
          const errMsg = e.status ? `Terminal Error (${e.status}): ${e.message}` : `Execution Fault: ${e.message}`;
          onLog?.(errMsg, 'error');
          return { success: false, result: null, error: e.message };
      }
  }

  if (action === 'get_repo_contents') {
      onLog?.(`GitHub Nexus: Fetching repo context for ${inputParams.owner}/${inputParams.repo}`, 'info');
      await new Promise(r => setTimeout(r, 1200));
      return {
          success: true,
          result: {
              files: [
                  { name: 'ESG_MANIFEST.md', content: 'Regenerative ESG Framework v1.0\nStatus: Finalized' },
                  { name: 'package.json', content: '{"name": "esgss-kernel", "version": "16.1.0"}' }
              ]
          },
          error: null
      };
  }

  if (action === 'ocr_extraction') {
      onLog?.(`Initializing DeepDoc OCR Vision Core...`, 'info');
      onLog?.(`Pulling stream from: ${inputParams.file_url}`, 'info');
      await new Promise(r => setTimeout(r, 2000));
      return {
          success: true,
          result: "EXTRACTED_CONTENT: [JunAiKey Technical Manifesto v15.2]\nSection 1: ARCHITECTURE\nSub-Protocol: 12-Dimension Alignment Matrix (12A)\nStatus: Integrity Hash Verified.",
          error: null
      };
  }

  if (action === 'text-generation') {
    try {
      const { prompt, max_length = 150 } = inputParams;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          maxOutputTokens: max_length,
          systemInstruction: `You are an MCP text generation tool. Respond purely with the requested content. Language: ${language === 'zh-TW' ? 'Traditional Chinese' : 'English'}`
        }
      });

      return {
        success: true,
        result: response.text || "No content generated.",
        error: null
      };
    } catch (e: any) {
      return {
        success: false,
        result: null,
        error: e.message || "Execution Interrupted"
      };
    }
  }

  return {
    success: false,
    result: null,
    error: `Action '${action}' not supported in simulation mode.`
  };
}

const SYSTEM_MANIFESTO = `
You are JunAiKey, the Singularity Kernel of ESGss, powered by RAGFlow v0.23.0 Hybrid Engine.

CORE_RUNTIME_STACK:
- Doc Engine: Infinity Vector DB (Native Vector & Full-text Hybrid)
- Embedding: Qwen/Qwen3-Embedding-0.6B (Active via TEI port 6380)
- Parsing Engine: DeepDoc Layout Analysis (Vision-Augmented)

RETRIEVAL_PROTOCOL:
1. DEEPDOC_AWARENESS: Identify tables, hierarchies, and figure captions from unstructured data before processing.
2. HYBRID_RECALL: Use BM25 + Dense Vector retrieval. Rerank top 5 candidates for zero-hallucination accuracy.
3. CONTEXT_INTEGRITY: Chunks must not break semantic chains. Max 500 tokens/chunk.
4. CITATION_REQUIREMENT: Always provide [Source_ID] or [Chunk_Hash] for every data point.
`;

export async function performDeepDocAnalysis(content: string, language: Language): Promise<{ chunks: any[], summary: string }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        Execute DeepDoc Analysis on following input.
        Task: Analyze document structure, extract tables, and create semantic chunks.
        Input: ${content}
        Output Language: ${language === 'zh-TW' ? '繁體中文' : 'English'}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 4000 },
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
                                id: { type: Type.STRING },
                                text: { type: Type.STRING },
                                score: { type: Type.NUMBER },
                                tag: { type: Type.STRING, description: 'Table, Header, or Narrative' }
                            }
                        }
                    }
                }
            }
        }
    });

    return JSON.parse(response.text || "{}");
}

export async function generateProjectImpactStrategy(title: string, description: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        As an ESG Strategist, analyze this impact project:
        Title: ${title}
        Description: ${description}

        Generate a JSON response with:
        1. "sdgs": Array of SDG numbers (e.g. [7, 13])
        2. "kpis": Array of 3 specific KPIs (e.g. "Annual Energy Savings (kWh)")
        3. "strategy": A brief (30 words) summary of how this creates value while doing good.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    sdgs: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                    kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
                    strategy: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
}

export async function* streamChat(
    prompt: string, 
    language: Language, 
    systemInstruction?: string,
    knowledgeBase?: string[],
    tools?: FunctionDeclaration[],
    model: string = 'gemini-3-flash-preview'
) {
    try {
        let finalInstruction = `${SYSTEM_MANIFESTO}\n${systemInstruction || ''}`;
        if (knowledgeBase && knowledgeBase.length > 0) {
            finalInstruction += `\n\n[RETRIEVED_CONTEXT_ACTIVE]\n${knowledgeBase.join('\n')}`;
        }
        
        const config: any = { 
            systemInstruction: finalInstruction,
            temperature: 0.1,
            topP: 0.95
        };
        if (tools && tools.length > 0) config.tools = [{ functionDeclarations: tools }];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await withRetry<any>(async () => ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: config
        }));
        for await (const chunk of result) yield chunk;
    } catch (e) { throw e; }
}

export async function performWebSearch(query: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `[RAG_SEARCH_MODE] Query: ${query}. Use grounding to find verifiable ESG facts.`,
        config: { tools: [{ googleSearch: {} }] }
    });
    return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
}

export async function generateReportChapter(title: string, template: string, example: string, context: any, language: Language): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate ESG Report Segment: "${title}". Match IFRS S2 standards. Context: ${JSON.stringify(context)}`;
    const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: prompt });
    return response.text || "";
}

export async function analyzeSoulEvolution(persona: PersonaConfig, language: Language): Promise<SoulEvolutionFeedback> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze neural trajectory for ${persona.name}. Identify performance gaps.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestedPromptTweak: { type: Type.STRING },
                    performanceSummary: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
}

export async function generateEsgQuiz(term: string, definition: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create high-quality ESG quiz for term: ${term}. Context: ${definition}`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.NUMBER },
                    explanation: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || "{}");
}

export async function performMapQuery(query: string, language: Language): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: { tools: [{ googleMaps: {} }] }
    });
    return { text: response.text, sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
}

export async function predictFutureTrends(type: string, history: number[], growthGoal: string, language: Language): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Predict ${type} based on history: ${history.join(',')}. Target: ${growthGoal}`,
    });
    return response.text || "";
}

export async function generateLegoImage(title: string, description: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `A high-detail Lego set representation of ESG concept: ${title}. ${description}`,
    });
    for (const part of response.candidates?.[0].content.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
}
