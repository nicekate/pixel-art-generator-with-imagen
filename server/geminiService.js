import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const ai = new GoogleGenAI({ apiKey });

export async function generatePixelArtImage(userPrompt) {
  const fullPrompt = `Generate a high-quality pixel art image. The style should be distinctively pixelated, reminiscent of classic 8-bit or 16-bit video games, or modern indie pixel art. Avoid smooth gradients or anti-aliasing. The subject is: "${userPrompt}". Ensure the final image has a clear, crisp, low-resolution pixel aesthetic.`;

  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/png'
    },
  });

  if (
    response.generatedImages &&
    response.generatedImages.length > 0 &&
    response.generatedImages[0].image?.imageBytes
  ) {
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
  }

  throw new Error('No image data received from API');
}
