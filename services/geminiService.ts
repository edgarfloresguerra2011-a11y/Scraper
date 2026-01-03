
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Fix: Use new GoogleGenAI instance per call with process.env.API_KEY as per guidelines
export const huntWinningProducts = async (lang: Language = 'es') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `[YEAR: 2026] SEARCH THE WEB NOW for 10 "winning products" trending TODAY in March 2026 on TikTok, Amazon, and Global e-commerce.
    Respond strictly in ${lang === 'es' ? 'Spanish' : lang === 'en' ? 'English' : lang === 'fr' ? 'French' : lang === 'de' ? 'German' : 'Chinese'}.
    
    Return ONLY a JSON array of objects with keys: name, niche, priceEstimate, reasonWhyWinning, potentialMargin, trendScore, imageUrl, sourceUrl, sourceTitle.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            niche: { type: Type.STRING },
            priceEstimate: { type: Type.STRING },
            reasonWhyWinning: { type: Type.STRING },
            potentialMargin: { type: Type.STRING },
            trendScore: { type: Type.NUMBER },
            imageUrl: { type: Type.STRING },
            sourceUrl: { type: Type.STRING },
            sourceTitle: { type: Type.STRING }
          },
          required: ["name", "niche", "priceEstimate", "reasonWhyWinning", "potentialMargin", "trendScore", "imageUrl", "sourceUrl", "sourceTitle"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

// Fix: Added missing analyzeMarketTrends function required by Dashboard.tsx
export const analyzeMarketTrends = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze current market trends for the query: ${query}. Focus on e-commerce opportunities in 2026. Return a concise and informative summary.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return response.text || "";
};

// Fix: Added missing generateProductDescription function required by AIAssistant.tsx
export const generateProductDescription = async (productInfo: string, tone: string, audience: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Complex text task
    contents: `Generate a professional and high-converting product description based on:
    Information: ${productInfo}
    Tone: ${tone}
    Audience: ${audience}
    Format the output with clear sections and persuasive language.`,
  });
  return response.text || "";
};

export const getDeepProductAnalysis = async (productName: string, lang: Language = 'es') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `[CONTEXT: MARCH 2026] Perform deep market research for product: "${productName}". 
    Respond strictly in ${lang}.
    JSON with: competitors (array), customerSentiment (string), priceHistory (array), topRisks (array), sources (array {title, uri}).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeNicheMarket = async (niche: string, lang: Language = 'es') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `[CONTEXT: 2026 MARKET DATA] Research market structure for: "${niche}". 
    Respond strictly in ${lang}.
    JSON with: brands (array {name, sharePercent}), giniIndex (number), insight (string).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || "{}");
};
