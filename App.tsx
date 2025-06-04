import React, { useState, useEffect, useCallback } from 'react';
import { generatePixelArtImage } from './services/apiService';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorMessage } from './components/ErrorMessage';
import { ImageDisplayArea } from './components/ImageDisplayArea';
import { SparklesIcon, SunIcon, MoonIcon } from './components/Icons';

const MAX_PROMPT_LENGTH = 200;

function sanitizeInput(input: string): string {
  return input.replace(/[^\w\s.,!?'-]/g, '');
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
     // Apply dark/light mode to HTML element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  const handleGenerateImage = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('Please enter a prompt to generate pixel art.');
      return;
    }
    if (trimmed.length > MAX_PROMPT_LENGTH) {
      setError('Prompt too long. Please keep it under 200 characters.');
      return;
    }
    const sanitizedPrompt = sanitizeInput(trimmed);

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageUrl = await generatePixelArtImage(sanitizedPrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while generating the image.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`w-full max-w-2xl mx-auto rounded-xl shadow-2xl p-6 sm:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border border-purple-700' : 'bg-white border border-gray-300'}`}>
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-purple-600 hover:bg-gray-200'}`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
          </div>
          <div className="flex items-center justify-center mb-2">
             <SparklesIcon className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h1 className={`text-4xl sm:text-5xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            Pixel Art Creator
          </h1>
          <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Craft unique pixel art with the power of Imagen.
          </p>
        </header>

        <main>
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt-input" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                Describe your vision:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="prompt-input"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={MAX_PROMPT_LENGTH}
                  placeholder="e.g., a knight battling a dragon"
                  className={`flex-grow p-3 rounded-lg border outline-none transition-all duration-150
                              ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:ring-purple-500 focus:border-purple-500 text-white' 
                                          : 'bg-white border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-gray-900'}
                              disabled:opacity-50`}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleGenerateImage();
                    }
                  }}
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isLoading || !prompt.trim() || prompt.trim().length > MAX_PROMPT_LENGTH}
                  className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out
                              flex items-center justify-center
                              focus:outline-none focus:ring-2 focus:ring-opacity-50
                              ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500' 
                                          : 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400'}
                              disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Create Pixel Art'
                  )}
                </button>
              </div>
            </div>
            
            <ErrorMessage message={error} isDarkMode={isDarkMode} />

            {isLoading && <LoadingIndicator isDarkMode={isDarkMode} />}
            
            <ImageDisplayArea imageUrl={generatedImageUrl} isLoading={isLoading} prompt={prompt} isDarkMode={isDarkMode} />

          </div>
        </main>

        <footer className={`text-center pt-8 mt-8 border-t ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-600'} text-sm`}>
          <p>&copy; {new Date().getFullYear()} Pixel Art Creator. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
