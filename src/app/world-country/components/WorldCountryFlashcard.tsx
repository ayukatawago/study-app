'use client';

import BaseFlashcard from '@/components/flashcard/BaseFlashcard';
import { WorldCountryData } from '@/types/flashcard';
import WorldMap from '@/components/map/WorldMap';

type WorldCountryFlashcardProps = {
  event: WorldCountryData;
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function WorldCountryFlashcard({
  event,
  onCorrect,
  onIncorrect,
}: WorldCountryFlashcardProps) {
  // Use fixed card height
  const getCardHeight = () => {
    return 'h-96'; // Fixed height of 24rem = 384px for all cards
  };

  const renderFrontContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg text-gray-900 dark:text-white">No card available</div>;
    }

    // Always show map on front side
    return (
      <div
        className="w-full h-full flex items-center justify-center relative"
        style={{ overflow: 'visible' }}
      >
        <WorldMap highlightedCountry={String(event.countryCode)} />
      </div>
    );
  };

  const renderBackContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg text-gray-900 dark:text-white">No card available</div>;
    }

    // Show country name, capital, and descriptions on back side
    return (
      <div className="text-center py-2 max-h-full overflow-y-auto">
        <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
          {event.countryName}
        </div>
        <div className="text-lg mt-1 mb-2 text-gray-900 dark:text-white">
          <span className="font-medium">首都:</span> {event.capitalCity}
        </div>
        {event.descriptions && event.descriptions.length > 0 && (
          <div className="mt-2 px-2">
            <ul className="text-left list-disc list-outside pl-4">
              {event.descriptions.map((desc, index) => (
                <li
                  key={index}
                  className="text-sm my-1 leading-snug text-gray-700 dark:text-gray-300"
                >
                  {desc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
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
