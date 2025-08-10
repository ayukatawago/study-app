'use client';

import { useState } from 'react';

export type HistoryEvent = {
  id: number;
  year: number;
  item: string;
  memorize: string;
};

type FlashcardProps = {
  event: HistoryEvent;
  showMemorize: boolean;
  direction: 'year-to-event' | 'event-to-year';
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function Flashcard({
  event,
  showMemorize,
  direction,
  onCorrect,
  onIncorrect,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getFrontContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    return direction === 'year-to-event' ? (
      <div className="text-5xl font-bold">{event.year}</div>
    ) : (
      <div className="text-lg">{event.item}</div>
    );
  };

  const getBackContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    return direction === 'year-to-event' ? (
      <>
        <div className="text-lg mb-3">{event.item}</div>
        {showMemorize && (
          <div className="text-xs italic border-t pt-2 mt-2 border-gray-300">
            <span className="font-medium">覚え方:</span> {event.memorize}
          </div>
        )}
      </>
    ) : (
      <>
        <div className="text-5xl font-bold mb-3">{event.year}</div>
        {showMemorize && (
          <div className="text-xs italic border-t pt-2 mt-2 border-gray-300">
            <span className="font-medium">覚え方:</span> {event.memorize}
          </div>
        )}
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