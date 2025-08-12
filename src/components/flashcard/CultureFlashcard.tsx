'use client';

import BaseFlashcard from './BaseFlashcard';
import { CultureEventData, CultureFlashcardSettings } from '@/types/flashcard';

type CultureFlashcardProps = {
  event: CultureEventData;
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
  
  const renderFrontContent = () => {
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

  const renderBackContent = () => {
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