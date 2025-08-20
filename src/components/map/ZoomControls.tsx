import React from 'react';

interface ZoomControlsProps {
  showZoomIn: boolean;
  showZoomOut: boolean;
  onZoomIn: (e: React.MouseEvent) => void;
  onZoomOut: (e: React.MouseEvent) => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  showZoomIn,
  showZoomOut,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="absolute top-2 right-2 z-10 flex space-x-1">
      {showZoomIn && (
        <button
          className="p-1.5 rounded-full bg-white shadow-md hover:bg-blue-100 active:bg-blue-200 transition-all duration-300 text-blue-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onZoomIn}
          title="Zoom to country"
          aria-label="Zoom in to country"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3a1 1 0 012 0v5.5h5.5a1 1 0 110 2H11V16a1 1 0 11-2 0v-5.5H3.5a1 1 0 110-2H9V3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {showZoomOut && (
        <button
          className="p-1.5 rounded-full bg-white shadow-md hover:bg-blue-100 active:bg-blue-200 transition-all duration-300 text-blue-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={onZoomOut}
          title="Zoom out"
          aria-label="Zoom out to world view"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
