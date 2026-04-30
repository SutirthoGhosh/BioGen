import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, BioResult } from "../types";

export async function generateBios(input: UserInput, apiKey: string): Promise<BioResult> {
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `You are an expert personal branding consultant. 
Generate compelling social media bios and personal taglines. 
The tone should strictly follow the user's choice: 
- luxury: Sophisticated, exclusive, high-end feel.
- professional: Trustworthy, clear, accomplishment-oriented.
- savage: Bold, witty, a bit edgy, high-energy.
- minimal: Very short, impactful, clean.

Respond ONLY with a valid JSON object matching this structure:
{
  "instagram": ["bio1", "bio2", "bio3"],
  "twitter": ["bio1", "bio2", "bio3"],
  "taglines": ["tag1", "tag2", "tag3"]
}`;

  const prompt = `Name: ${input.name}
Niche: ${input.niche}
Tone: ${input.tone}

Generate 3 Instagram bios, 3 Twitter bios, and 3 personal taglines based on this information.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instagram: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            twitter: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            taglines: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["instagram", "twitter", "taglines"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as BioResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
