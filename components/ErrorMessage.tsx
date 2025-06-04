import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface ErrorMessageProps {
  message: string | null;
  isDarkMode: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, isDarkMode }) => {
  if (!message) return null;
  return (
    <div className={`my-4 p-4 border rounded-lg shadow-md flex items-start space-x-3
                     ${isDarkMode ? 'bg-red-900 bg-opacity-30 border-red-700 text-red-300' 
                                 : 'bg-red-100 border-red-400 text-red-700'}`}>
      <AlertTriangleIcon className={`h-6 w-6 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
      <div>
        <p className="font-semibold">Oops! Something went wrong.</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
