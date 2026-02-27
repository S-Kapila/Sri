import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateCampaign = async (product: string, targetAudience: string, goals: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a comprehensive marketing campaign for the following:
    Product: ${product}
    Target Audience: ${targetAudience}
    Goals: ${goals}
    
    Include:
    1. Campaign Theme
    2. Key Messaging
    3. Channel Strategy (Social, Email, Search, etc.)
    4. Sample Ad Copy
    5. Success Metrics`,
  });
  return response.text;
};

export const generateSalesPitch = async (product: string, prospectInfo: string, painPoints: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a persuasive sales pitch for:
    Product: ${product}
    Prospect Details: ${prospectInfo}
    Prospect Pain Points: ${painPoints}
    
    Structure the pitch with:
    1. Hook
    2. Value Proposition
    3. Addressing Pain Points
    4. Social Proof/Evidence
    5. Clear Call to Action`,
  });
  return response.text;
};

export const analyzeLeads = async (leadData: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze the following lead data and provide insights:
    Lead Data: ${leadData}
    
    Provide:
    1. Lead Scoring (High/Medium/Low priority)
    2. Key Opportunities
    3. Recommended Next Steps for each lead
    4. Potential Risks`,
  });
  return response.text;
};

export const getPredictiveAnalysis = async (historicalData: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Based on the following historical sales/marketing data, provide a predictive analysis for the next 6 months:
    Data: ${historicalData}
    
    Return the response in JSON format with the following structure:
    {
      "summary": "string",
      "forecast": [
        { "month": "string", "predictedSales": number, "predictedLeads": number }
      ],
      "recommendations": ["string"]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                predictedSales: { type: Type.NUMBER },
                predictedLeads: { type: Type.NUMBER }
              }
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse predictive analysis JSON", e);
    return null;
  }
};
