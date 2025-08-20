import React from 'react';

interface LoadingIndicatorProps {
  isVisible: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-blue-200 bg-opacity-20 animate-ping"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-300 bg-opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-400 bg-opacity-40"></div>
      </div>
    </div>
  );
};
