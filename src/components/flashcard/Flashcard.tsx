'use client';

import { useState } from 'react';

export type HistoryEvent = {
  year: number;
  events: string[];
  memorize?: string;
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
      <div className="text-5xl font-bold">
        {event.year}
        {event.events.length > 2 && (
          <div className="text-sm font-normal mt-1 text-gray-500">
            {event.events.length}件のイベント
          </div>
        )}
      </div>
    ) : (
      <div className="text-lg">
        {event.events.map((item, index) => (
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
    
    return direction === 'year-to-event' ? (
      <>
        <div className="text-lg mb-3 max-h-60 overflow-y-auto">
          {event.events.map((item, index) => (
            <div key={index} className={index > 0 ? "mt-2" : ""}>
              {item}
            </div>
          ))}
        </div>
        {showMemorize && event.memorize && (
          <div className="text-xs italic border-t pt-2 mt-2 border-gray-300">
            <span className="font-medium">覚え方:</span> {event.memorize}
          </div>
        )}
      </>
    ) : (
      <>
        <div className="text-5xl font-bold mb-3">{event.year}</div>
        {showMemorize && event.memorize && (
          <div className="text-xs italic border-t pt-2 mt-2 border-gray-300">
            <span className="font-medium">覚え方:</span> {event.memorize}
          </div>
        )}
      </>
    );
  };

  // Determine card height based on events count and memorize presence
  const getCardHeight = () => {
    if (!event) return 'h-64'; // Default height
    
    const eventsCount = event.events.length;
    const hasMemorize = showMemorize && event.memorize;
    
    // For year-to-event direction with flipped card (showing events)
    if (direction === 'year-to-event' && isFlipped) {
      if (eventsCount > 3 && hasMemorize) return 'h-96'; // Many events with memorize
      if (eventsCount > 3) return 'h-80'; // Many events without memorize
      if (eventsCount > 1 && hasMemorize) return 'h-80'; // Multiple events with memorize
      return 'h-64'; // Default for simple cases
    }
    
    // For event-to-year direction with events on front
    if (direction === 'event-to-year' && !isFlipped && eventsCount > 3) {
      return 'h-80'; // Taller card for many events on front
    }
    
    return 'h-64'; // Default height
  };
  
  return (
    <div className="w-full px-4 max-w-lg mx-auto">
      <div
        className={`relative w-full max-w-sm sm:max-w-md md:w-96 ${getCardHeight()} cursor-pointer transition-all duration-500 ${
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