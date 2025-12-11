import { GoogleGenAI, Type } from "@google/genai";
import { Language, SemanticContext } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Image Generation ---

/**
 * Uses Gemini 3 Pro Image (Preview) for high-quality Lego art.
 */
export const generateLegoImage = async (cardTitle: string, cardDesc: string): Promise<string | null> => {
    try {
        const prompt = `Create a LEGO brick art image for the concept: "${cardTitle}" - ${cardDesc}. 
        The image should feature a central LEGO model built from colorful bricks, representing the ESG concept (Environmental, Social, or Governance).
        Style: Isometric view, 3D render, studio lighting, clean background, high detail LEGO texture.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: "1K"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64EncodeString: string = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
        return null;
    } catch (e) {
        console.error("Lego Gen Error", e);
        return null;
    }
};

// --- Text & Chat ---

export async function* streamChat(prompt: string, language: Language) {
    try {
        const result = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        for await (const chunk of result) {
            yield chunk.text || '';
        }
    } catch (e) {
        console.error("Stream Chat Error", e);
        yield "System: Connection interrupted.";
    }
}

// --- Analysis & Insights ---

export const analyzeDataAnomaly = async (label: string, value: string | number, baseline: string, context: string, language: Language) => {
    // Mock simulation for AI trigger interaction
    return Promise.resolve();
};

export const generateLightInterpretation = async (metrics: any[], language: Language) => {
    // Mock spectral analysis result
    return {
        coreFrequency: '432Hz',
        spectrum: [
            { color: 'emerald', wavelength: '520nm', intensity: 'High', insight: 'Strong environmental performance detected.' },
            { color: 'amber', wavelength: '590nm', intensity: 'Medium', insight: 'Social engagement metrics stabilizing.' },
            { color: 'purple', wavelength: '400nm', intensity: 'Low', insight: 'Governance structure requires optimization.' }
        ]
    };
};

export const performLocalRAG = async (query: string, language: Language) => {
    const prompt = `Answer the following query using available knowledge. Query: ${query}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    return {
        text: response.text || "No relevant information found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const performWebSearch = performLocalRAG; // Alias for Business Intelligence

export const quantizeData = async (input: string, language: Language) => {
    // Mocking quantum node generation to save tokens/latency in demo
    return [
        { id: `q-${Date.now()}-1`, atom: 'Scope 1', vector: ['Direct', 'Fuel'], weight: 0.9, connections: [] },
        { id: `q-${Date.now()}-2`, atom: 'Scope 2', vector: ['Indirect', 'Electricity'], weight: 0.85, connections: [] },
        { id: `q-${Date.now()}-3`, atom: 'Scope 3', vector: ['Value Chain', 'Upstream'], weight: 0.7, connections: [] }
    ];
};

export const inferSemanticContext = async (query: string, language: Language): Promise<SemanticContext> => {
    return {
        intent: 'exploration',
        keywords: query.split(' ').filter(w => w.length > 3),
        requiredConfidence: 0.8
    };
};

export const generateAgentDebate = async (topic: string, language: Language) => {
    const prompt = `Simulate a debate between a CSO (Chief Sustainability Officer) and a CFO (Chief Financial Officer) regarding: "${topic}".
    Return a JSON array of messages (approx 4-6 turns): [{ "role": "CSO" | "CFO", "text": "..." }].
    Ensure the debate is professional but highlights the conflict between cost and sustainability.
    Language: ${language}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    
    try {
        return JSON.parse(response.text || "[]");
    } catch {
        return [{ role: 'CSO', text: 'Analysis failed.' }];
    }
};

// --- Report Generation ---

export const generateReportChapter = async (title: string, template: string, example: string, context: any, language: Language) => {
    const prompt = `Write a sustainability report chapter titled "${title}".
    Context: ${JSON.stringify(context)}
    Template: ${template}
    Language: ${language}
    Tone: Professional, Data-driven, GRI Compliant.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text || "";
};

export const auditReportContent = async (title: string, content: string, standards: string, language: Language) => {
    const prompt = `Audit the following report content against ${standards}.
    Title: ${title}
    Content: ${content}
    Provide a brief audit summary and list missing requirements in Markdown.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text || "Audit complete.";
};

// --- Tools & Utilities ---

export const performMapQuery = async (query: string, language: Language) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find information and location details for: ${query}`,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    return {
        text: response.text || "Location details not found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
};

export const predictFutureTrends = async (metric: string, history: number[], context: string, language: Language) => {
    // Mock simulation for finance chart
    return Promise.resolve();
};

const fileToPart = (file: File): Promise<any> => new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve({ inlineData: { data: (reader.result as string).split(',')[1], mimeType: file.type } });
    reader.readAsDataURL(file);
});

export const verifyQuestImage = async (questTitle: string, questDesc: string, file: File, language: Language) => {
    try {
        const imagePart = await fileToPart(file);
        const prompt = `Verify if this image satisfies the quest: "${questTitle}" - ${questDesc}. 
        Return strictly JSON: { "success": boolean, "reason": "string" }`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{"success": false, "reason": "AI could not verify."}');
    } catch (e) {
        return { success: false, reason: "Verification error." };
    }
};

export const generateEsgQuiz = async (term: string, definition: string, language: Language) => {
    const prompt = `Create a multiple choice quiz question for the ESG term: "${term}" (${definition}).
    Return strictly JSON: { "question": "string", "options": ["string"], "correctIndex": number, "explanation": "string" }
    Language: ${language}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });
    
    return JSON.parse(response.text || "{}");
};