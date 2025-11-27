import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recipe: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        ingredients: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        steps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        servings: { type: Type.STRING },
        prepTime: { type: Type.STRING },
        cookTime: { type: Type.STRING },
      },
      required: ["title", "description", "ingredients", "steps"],
    },
    shortsStrategy: {
      type: Type.OBJECT,
      properties: {
        hook: { type: Type.STRING, description: "A catchy opening hook for a 60s short" },
        script: { type: Type.STRING, description: "The full script for the short" },
        visualCues: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Visual editing suggestions"
        },
        hashtags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        caption: { type: Type.STRING, description: "Social media post caption" },
      },
      required: ["hook", "script", "visualCues", "hashtags"],
    },
    videoStrategy: {
      type: Type.OBJECT,
      properties: {
        titleOptions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Click-worthy YouTube titles"
        },
        thumbnailText: { type: Type.STRING, description: "Text overlay for thumbnail" },
        structure: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            body: { type: Type.STRING },
            conclusion: { type: Type.STRING },
          },
        },
        seoKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["titleOptions", "thumbnailText", "structure"],
    },
    thumbnailPrompt: {
      type: Type.STRING,
      description: "A highly descriptive prompt to generate a photorealistic, appetizing YouTube thumbnail for this dish",
    },
  },
  required: ["recipe", "shortsStrategy", "videoStrategy", "thumbnailPrompt"],
};

export const analyzeVideoContent = async (base64Video: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Video,
            },
          },
          {
            text: "Analyze this cooking video deeply. Extract the recipe details, create a viral YouTube Shorts strategy, a long-form video optimization strategy, and a prompt for generating a high-quality thumbnail. Provide the output in strict JSON format.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a professional social media manager and expert chef. Your goal is to maximize engagement and clarity.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};

const cleanJsonString = (text: string): string => {
  // Remove markdown code blocks if present
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  return text;
};

export const analyzeYoutubeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Analyze the cooking video at this URL: ${url}
      
      Using Google Search, find the recipe details, transcript, or description for this video.
      Then, generate a viral YouTube Shorts strategy, a long-form video optimization strategy, and a prompt for a thumbnail.
      
      You must output the result as a strict JSON object with the following structure:
      {
        "recipe": {
          "title": "string",
          "description": "string",
          "ingredients": ["string"],
          "steps": ["string"],
          "servings": "string",
          "prepTime": "string",
          "cookTime": "string"
        },
        "shortsStrategy": {
          "hook": "string (catchy opening)",
          "script": "string (full script)",
          "visualCues": ["string"],
          "hashtags": ["string"],
          "caption": "string"
        },
        "videoStrategy": {
          "titleOptions": ["string"],
          "thumbnailText": "string",
          "structure": {
            "intro": "string",
            "body": "string",
            "conclusion": "string"
          },
          "seoKeywords": ["string"]
        },
        "thumbnailPrompt": "string"
      }
      
      Do not include markdown formatting or explanations. Return only the JSON string.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseSchema/MimeType are not allowed with googleSearch tool
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const cleanedText = cleanJsonString(text);
    return JSON.parse(cleanedText) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing YouTube URL:", error);
    throw error;
  }
};

export const generateThumbnailImage = async (prompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image for standard generation as per default guidelines,
    // although 3-pro-image-preview is better for quality, it requires complex auth flows sometimes.
    // Sticking to the robust default for this demo.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt + " Photorealistic, 4k, high resolution, professional food photography, vibrant colors." }],
      },
      config: {
        // Nano Banana models do not support responseMimeType/responseSchema/aspectRatio in the config object the same way as Imagen
        // But for generating an image from text, we rely on it returning an image part.
      },
    });

    // Check for inlineData in parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw error;
  }
};