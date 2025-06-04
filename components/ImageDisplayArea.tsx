import React from 'react';
import { ImageIcon } from './Icons';

interface ImageDisplayAreaProps {
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
  isDarkMode: boolean;
}

export const ImageDisplayArea: React.FC<ImageDisplayAreaProps> = ({ imageUrl, isLoading, prompt, isDarkMode }) => {
  if (isLoading) {
    // Loading state is handled by LoadingIndicator component in App.tsx
    // This component can show a simpler placeholder during loading if needed,
    // but for now, we'll rely on the main loading indicator.
    // Or, return a styled box that indicates content is loading.
     return (
      <div className={`mt-6 p-4 rounded-lg shadow-inner flex flex-col items-center justify-center h-80 sm:h-96 border-2 border-dashed transition-colors duration-300
                      ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Waiting for pixels...</p>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className={`mt-6 p-2 sm:p-4 rounded-lg shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <img 
          src={imageUrl} 
          alt={`Pixel art of: ${prompt || 'generated image'}`} 
          className={`max-w-full h-auto mx-auto rounded-md border-2 pixelated shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105
                      ${isDarkMode ? 'border-purple-500' : 'border-purple-400'}`}
        />
      </div>
    );
  }

  return (
    <div className={`mt-6 p-10 rounded-lg shadow-inner flex flex-col items-center justify-center h-80 sm:h-96 border-2 border-dashed transition-colors duration-300
                    ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>
      <ImageIcon className={`h-16 w-16 mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      <p className="text-lg font-medium">Your Pixel Art Awaits</p>
      <p className="text-sm text-center">Enter a prompt above and click "Create Pixel Art" to begin.</p>
    </div>
  );
};
