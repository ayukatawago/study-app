'use client';

import BaseFlashcard from '@/components/flashcard/BaseFlashcard';
import { CultureEventData } from '@/types/flashcard';

type CultureFlashcardProps = {
  event: CultureEventData;
  direction: 'keyword-to-desc' | 'desc-to-keyword';
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function CultureFlashcard({
  event,
  direction,
  onCorrect,
  onIncorrect,
}: CultureFlashcardProps) {
  const renderFrontContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg text-gray-900 dark:text-white">No card available</div>;
    }

    return direction === 'keyword-to-desc' ? (
      <>
        <div className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">{event.keyword}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          項目数: {event.descriptions.length}
        </div>
      </>
    ) : (
      <>
        <div className="text-lg mb-3">
          {event.descriptions.map((item, index) => (
            <div key={index} className={`${index > 0 ? 'mt-2' : ''} text-gray-900 dark:text-white`}>
              {item}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          項目数: {event.descriptions.length}
        </div>
      </>
    );
  };

  const renderBackContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg text-gray-900 dark:text-white">No card available</div>;
    }

    return direction === 'keyword-to-desc' ? (
      <>
        <div className="text-lg mb-3">
          {event.descriptions.map((item, index) => (
            <div key={index} className={`${index > 0 ? 'mt-2' : ''} text-gray-900 dark:text-white`}>
              {item}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">時代: {event.period}</div>
      </>
    ) : (
      <>
        <div className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">{event.keyword}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">時代: {event.period}</div>
      </>
    );
  };

  // Custom height calculation if needed (using default in this case)
  const getCardHeight = () => {
    // Customize card height based on content if needed
    return 'h-64'; // Default height
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
