import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Image Generation ---

/**
 * Uses Gemini 2.5 Flash Image to generate Lego-style card art.
 */
export const generateLegoImage = async (cardTitle: string, cardDesc: string): Promise<string | null> => {
    try {
        const prompt = `Create a LEGO brick art image for the concept: "${cardTitle}" - ${cardDesc}. 
        The image should feature a central LEGO model built from colorful bricks, representing the ESG concept (Environmental, Social, or Governance).
        Style: Isometric view, 3D render, studio lighting, clean background, high detail LEGO texture.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                // @ts-ignore
                imageConfig: {
                    aspectRatio: "3:4"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Lego Gen Error:", error);
        return null;
    }
};

// --- Chat & Text Generation ---

export async function* streamChat(prompt: string, language: string) {
    try {
        const model = 'gemini-2.5-flash';
        const response = await ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: `You are JunAiKey, an advanced ESG AI assistant. Respond in ${language === 'zh-TW' ? 'Traditional Chinese' : 'English'}. Be concise, professional, and helpful.`,
            }
        });

        for await (const chunk of response) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Stream Chat Error:", error);
        yield "System Error: Unable to connect to AI.";
    }
}

export const analyzeDataAnomaly = async (metric: string, value: any, context: string, trigger: string, language: string) => {
    try {
        const prompt = `Analyze this anomaly: Metric: ${metric}, Value: ${value}, Context: ${context}. Trigger: ${trigger}. Provide a short insight. Language: ${language}.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Anomaly Analysis Error:", error);
        throw error;
    }
};

export const performLocalRAG = async (query: string, language: string) => {
    try {
        // Simulating RAG with search tool for now, as we don't have a real vector DB connected in this scope
        const prompt = `Research query: ${query}. Provide a summary with sources. Language: ${language}.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        const text = response.text || "No results found.";
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { text, sources };
    } catch (error) {
        console.error("RAG Error:", error);
        throw error;
    }
};

export const generateReportChapter = async (sectionTitle: string, template: string, example: string, contextData: any, language: string) => {
    try {
        const prompt = `Write a sustainability report chapter for "${sectionTitle}".
        Template: ${template}
        Example Style: ${example}
        Context Data: ${JSON.stringify(contextData)}
        Language: ${language}.
        Output in Markdown format.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (error) {
        console.error("Report Gen Error:", error);
        throw error;
    }
};

export const auditReportContent = async (chapterTitle: string, content: string, standards: string, language: string) => {
    try {
        const prompt = `Audit the following report section "${chapterTitle}" against ${standards}.
        Content: ${content}
        Provide a critique and suggestions for improvement in ${language}.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (error) {
        console.error("Audit Error:", error);
        throw error;
    }
};

export const performMapQuery = async (query: string, language: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Locate and provide details for: ${query}. Language: ${language}`,
            config: {
                tools: [{ googleMaps: {} }]
            }
        });
        return { text: response.text || "Location not found." };
    } catch (error) {
        console.error("Map Query Error:", error);
        throw error;
    }
};

export const predictFutureTrends = async (metric: string, history: any[], horizon: string, language: string) => {
    try {
        const prompt = `Predict future trends for ${metric} over ${horizon}. History: ${JSON.stringify(history)}. Language: ${language}. Return a short analysis.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using flash for speed, 3-pro for complex reasoning
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Prediction Error:", error);
        throw error;
    }
};

export const generateRiskMitigationPlan = async (risk: string, language: string) => {
    try {
        const prompt = `Create a risk mitigation plan for: ${risk}. Language: ${language}.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Risk Plan Error:", error);
        throw error;
    }
};

export const generateAgentDebate = async (topic: string, language: string) => {
    try {
        const prompt = `Simulate a debate between a CSO (Chief Sustainability Officer) and a CFO regarding "${topic}". 
        Generate a JSON array of messages.
        Format: [{ "id": "1", "role": "CSO", "text": "..." }, { "id": "2", "role": "CFO", "text": "..." }]
        Language: ${language}.
        Limit to 4 turns.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        return JSON.parse(response.text || "[]");
    } catch (error) {
        console.error("Debate Gen Error:", error);
        return [];
    }
};

export const verifyQuestImage = async (title: string, desc: string, file: File, language: string) => {
    try {
        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remove data URL prefix
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const prompt = `Verify if this image proves the completion of the ESG quest: "${title}" - ${desc}. 
        Return JSON: { "success": boolean, "reason": string }. 
        Language: ${language}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: file.type, data: base64Data } }
                ]
            },
            config: {
                responseMimeType: "application/json"
            }
        });

        return JSON.parse(response.text || '{ "success": false, "reason": "AI Error" }');
    } catch (error) {
        console.error("Vision Verify Error:", error);
        return { success: false, reason: "Verification Failed" };
    }
};

export const performWebSearch = async (query: string, language: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${query}. Language: ${language}`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        return { text: response.text || "No info." };
    } catch (error) {
        console.error("Web Search Error:", error);
        throw error;
    }
};

export const generateEsgQuiz = async (term: string, definition: string, language: string) => {
    try {
        const prompt = `Generate a quiz question for the ESG term "${term}" (Definition: ${definition}).
        Return JSON: { "question": string, "options": string[], "correctIndex": number, "explanation": string }.
        Language: ${language}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Quiz Gen Error:", error);
        throw error;
    }
};

/**
 * Optical Data Prism: Refracts raw data into spectral insights.
 */
export const generateLightInterpretation = async (metrics: any, language: string) => {
    try {
        const prompt = `Act as an "Optical Data Prism". 
        I will provide raw corporate ESG metrics. Refract this "white light" (raw data) into a spectrum of 3 insights.
        
        Metrics: ${JSON.stringify(metrics)}
        
        Return JSON in this format:
        {
            "coreFrequency": "One short phrase summarizing the company's energy (e.g. 'High Velocity Growth')",
            "spectrum": [
                { "color": "emerald", "wavelength": "Efficiency", "intensity": "90%", "insight": "Short insight about environmental performance." },
                { "color": "amber", "wavelength": "Risk", "intensity": "40%", "insight": "Short insight about potential risks." },
                { "color": "purple", "wavelength": "Innovation", "intensity": "75%", "insight": "Short insight about governance or tech." }
            ]
        }
        Language: ${language}. Keep insights concise.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Light Interpretation Error:", error);
        return {
            coreFrequency: "Signal Interrupted",
            spectrum: []
        };
    }
};

/**
 * Retrieves real-time intelligence for a card and refracts it into a light spectrum.
 */
export const analyzeCardContext = async (term: string, language: string) => {
    try {
        const prompt = `
        Perform a deep analysis on the ESG term: "${term}".
        1.  Search for the latest global trends, regulations (like EU CBAM, SEC), and key metrics associated with this term.
        2.  Refract this information into a "Light Spectrum" format.

        Return RAW JSON only. Do not use Markdown code blocks.
        Format:
        {
            "coreFrequency": "A short, punchy phrase summarizing the current global sentiment or status (e.g. 'Regulatory Tightening', 'Innovation Surge')",
            "spectrum": [
                { "color": "emerald", "wavelength": "Opportunity", "intensity": "High/Med/Low", "insight": "Key growth or efficiency opportunity." },
                { "color": "amber", "wavelength": "Risk", "intensity": "High/Med/Low", "insight": "Key compliance or operational risk." },
                { "color": "purple", "wavelength": "Innovation", "intensity": "High/Med/Low", "insight": "Emerging tech or strategy." }
            ],
            "sources": ["Source A", "Source B"]
        }
        Language: ${language}.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
                // responseMimeType cannot be used with googleSearch
            }
        });

        let text = response.text || "{}";
        // Clean Markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(text);
    } catch (error) {
        console.error("Card Intel Error:", error);
        return null;
    }
};
