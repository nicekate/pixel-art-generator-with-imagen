import { GoogleGenAI } from "@google/genai";

// Ensure API_KEY is accessed correctly, considering browser environment
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY 
    ? process.env.API_KEY 
    : undefined;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("API_KEY is not available. Gemini API calls will fail.");
}

export async function generatePixelArtImage(userPrompt: string): Promise<string> {
  if (!ai) {
    throw new Error('Gemini API client is not initialized. Check API_KEY.');
  }
  
  try {
    // Craft a detailed prompt to encourage pixel art style
    const fullPrompt = `Generate a high-quality pixel art image. The style should be distinctively pixelated, reminiscent of classic 8-bit or 16-bit video games, or modern indie pixel art. Avoid smooth gradients or anti-aliasing. The subject is: "${userPrompt}". Ensure the final image has a clear, crisp, low-resolution pixel aesthetic.`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002', // Correct Imagen model
      prompt: fullPrompt,
      config: { 
        numberOfImages: 1, 
        outputMimeType: 'image/png' // PNG is generally better for pixel art
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      console.error('API response did not contain image data:', response);
      throw new Error('No image data received from API. The model might not have been able to generate an image for this prompt.');
    }
  } catch (error) {
    console.error('Error generating image with Imagen:', error);
    let errorMessage = 'Failed to generate image due to an API error.';
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
            errorMessage = 'Invalid API Key. Please ensure your API_KEY environment variable is correctly configured.';
        } else if (error.message.includes('quota')) {
            errorMessage = 'API quota exceeded. Please check your Google Cloud project quota or try again later.';
        } else if (error.message.includes('filtered')) {
            errorMessage = 'The prompt was filtered by the safety settings. Please try a different prompt.';
        } else {
            errorMessage = `API Error: ${error.message}`;
        }
    }
    throw new Error(errorMessage);
  }
}
