'use client';

import { useState } from 'react';

export type CultureEvent = {
  person: string;
  period: string;
  descriptions: string[];
};

type CultureFlashcardProps = {
  event: CultureEvent;
  direction: 'person-to-desc' | 'desc-to-person';
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function CultureFlashcard({
  event,
  direction,
  onCorrect,
  onIncorrect,
}: CultureFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getFrontContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    return direction === 'person-to-desc' ? (
      <div className="text-3xl font-bold">
        {event.person}
      </div>
    ) : (
      <div className="text-lg">
        {event.descriptions.map((item, index) => (
          <div key={index} className={index > 0 ? "mt-2" : ""}>
            {item}
          </div>
        ))}
      </div>
    );
  };

  const getBackContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    return direction === 'person-to-desc' ? (
      <>
        <div className="text-lg mb-3">
          {event.descriptions.map((item, index) => (
            <div key={index} className={index > 0 ? "mt-2" : ""}>
              {item}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-4">
          時代: {event.period}
        </div>
      </>
    ) : (
      <>
        <div className="text-3xl font-bold mb-3">{event.person}</div>
        <div className="text-sm text-gray-500 mt-4">
          時代: {event.period}
        </div>
      </>
    );
  };

  return (
    <div className="w-full px-4 max-w-lg mx-auto">
      <div
        className={`relative w-full max-w-sm sm:max-w-md md:w-96 h-64 cursor-pointer transition-all duration-500 ${
          isFlipped ? 'shadow-xl' : 'shadow-md'
        } mx-auto`}
        onClick={handleFlip}
      >
        <div
          className={`absolute inset-0 rounded-xl p-6 flex flex-col items-center justify-center backface-hidden transition-all duration-500 ${
            isFlipped ? 'opacity-0 rotate-y-180' : 'opacity-100'
          } bg-white dark:bg-gray-800`}
        >
          {getFrontContent()}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            (タップして答えを見る)
          </div>
        </div>
        <div
          className={`absolute inset-0 rounded-xl p-6 flex flex-col items-center justify-center backface-hidden transition-all duration-500 ${
            isFlipped ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-180'
          } bg-white dark:bg-gray-800`}
        >
          {getBackContent()}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                if (event) { // Only call onIncorrect if event exists
                  setTimeout(() => {
                    onIncorrect();
                  }, 300); // Wait for the flip animation
                }
              }}
              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              不正解
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
                if (event) { // Only call onCorrect if event exists
                  setTimeout(() => {
                    onCorrect();
                  }, 300); // Wait for the flip animation
                }
              }}
              className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              正解
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}