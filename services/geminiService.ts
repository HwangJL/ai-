import { GoogleGenAI } from "@google/genai";

// Using Nano Banana (Gemini 2.5 Flash Image) as requested
const MODEL_NAME = 'gemini-2.5-flash-image';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Convert a Blob/File to a Base64 string
 */
export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Fetch an image from a URL and convert to Base64
 */
export const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return fileToBase64(blob);
};

/**
 * Generate a garment image based on a text prompt
 */
export const generateGarmentImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { text: `Design a standalone piece of clothing: ${prompt}. The image should only contain the clothing item on a neutral background, flat lay or mannequin style, high quality, photorealistic.` }
        ]
      }
    });

    // Handle response to find image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating garment:", error);
    throw error;
  }
};

/**
 * Generate the final "Try-On" image combining person and garment
 */
export const generateTryOnImage = async (personBase64: string, garmentBase64: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: "Perform a virtual try-on. Image 1 is the person. Image 2 is the garment. Generate a photorealistic full-body image of the person from Image 1 wearing the garment from Image 2. Maintain the person's original pose, facial features, body shape, and the background. The lighting and texture should match naturally."
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg/png, the API handles standard types
              data: personBase64
            }
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: garmentBase64
            }
          }
        ]
      }
    });

     if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No try-on result generated.");
  } catch (error) {
    console.error("Error generating try-on:", error);
    throw error;
  }
};