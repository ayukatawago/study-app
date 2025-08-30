'use client';

import BaseFlashcard from '@/components/flashcard/BaseFlashcard';
import { HistoryEventData } from '@/types/flashcard';

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
  // Front side should change based on direction setting
  const renderFrontContent = () => {
    if (direction === 'year-to-event') {
      return (
        <div>
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            {event.year}
          </h2>
        </div>
      );
    } else {
      // For event-to-year, show the events instead
      return (
        <div className="text-center">
          {event.events.map((item, index) => (
            <p key={index} className="mb-2 text-gray-900 dark:text-white">
              {item}
            </p>
          ))}
        </div>
      );
    }
  };

  // Back side changes based on direction setting
  const renderBackContent = () => {
    if (direction === 'year-to-event') {
      return (
        <div className="text-center">
          {event.events.map((item, index) => (
            <p key={index} className="mb-2 text-gray-900 dark:text-white">
              {item}
            </p>
          ))}
          {showMemorize && event.memorize && (
            <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">{event.memorize}</p>
            </div>
          )}
        </div>
      );
    } else {
      // For event-to-year, show the year instead
      return (
        <div>
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            {event.year}
          </h2>
          {showMemorize && event.memorize && (
            <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">{event.memorize}</p>
            </div>
          )}
        </div>
      );
    }
  };

  // Dynamically calculate card height based on content
  const getCardHeight = () => {
    // More events means taller card
    const eventsLength = event.events.length;
    const hasMemorize = showMemorize && event.memorize;

    if (eventsLength > 2 || (eventsLength > 1 && hasMemorize)) {
      return 'h-80'; // Extra tall
    } else if (eventsLength > 1 || hasMemorize) {
      return 'h-72'; // Tall
    }
    return 'h-64'; // Default
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
