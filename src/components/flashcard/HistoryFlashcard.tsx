'use client';

import BaseFlashcard from './BaseFlashcard';
import { HistoryEventData, HistoryFlashcardSettings } from '@/types/flashcard';
import { useMemo } from 'react';

type HistoryFlashcardProps = {
  event: HistoryEventData;
  showMemorize: boolean;
  direction: 'year-to-event' | 'event-to-year';
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function HistoryFlashcard({
  event,
  showMemorize,
  direction,
  onCorrect,
  onIncorrect,
}: HistoryFlashcardProps) {
  
  // Determine card height based on events count and memorize presence
  const getCardHeight = () => {
    if (!event) return 'h-64'; // Default height
    
    const eventsCount = event.events.length;
    const hasMemorize = showMemorize && event.memorize;
    
    // For year-to-event direction with events on back
    if (direction === 'year-to-event') {
      if (eventsCount > 3 && hasMemorize) return 'h-96'; // Many events with memorize
      if (eventsCount > 3) return 'h-80'; // Many events without memorize
      if (eventsCount > 1 && hasMemorize) return 'h-80'; // Multiple events with memorize
    }
    
    // For event-to-year direction with events on front
    if (direction === 'event-to-year' && eventsCount > 3) {
      return 'h-80'; // Taller card for many events on front
    }
    
    return 'h-64'; // Default height
  };

  const renderFrontContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    return direction === 'year-to-event' ? (
      <div className="text-5xl font-bold">
        {event.year}
        {event.events.length > 1 && (
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

  const renderBackContent = () => {
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
  
  return (
    <BaseFlashcard
      event={event}
      onCorrect={onCorrect}
      onIncorrect={onIncorrect}
      renderFrontContent={renderFrontContent}
      renderBackContent={renderBackContent}
      getCardHeight={getCardHeight}
    />
  );
}