'use client';

import BaseFlashcard from './BaseFlashcard';
import { WorldCountryData } from '@/types/flashcard';
import WorldMap from '../map/WorldMap';

type WorldCountryFlashcardProps = {
  event: WorldCountryData;
  showCapital: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function WorldCountryFlashcard({
  event,
  showCapital,
  onCorrect,
  onIncorrect,
}: WorldCountryFlashcardProps) {
  
  // Determine card height based on content
  const getCardHeight = () => {
    // Increase height if there are descriptions
    if (event.descriptions && event.descriptions.length > 0) {
      // Adjust height based on number of descriptions
      const descCount = event.descriptions.length;
      if (descCount >= 3) {
        return 'h-96'; // 24rem = 384px for 3+ descriptions
      } else if (descCount === 2) {
        return 'h-80'; // 20rem = 320px for 2 descriptions
      } else {
        return 'h-72'; // 18rem = 288px for 1 description
      }
    }
    return 'h-64'; // 16rem = 256px for no descriptions
  };

  const renderFrontContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    // Always show map on front side
    return (
      <div className="w-full h-full">
        <WorldMap
          highlightedCountry={String(event.countryCode)}
        />
      </div>
    );
  };

  const renderBackContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    // Show country name, capital, and descriptions on back side
    return (
      <div className="text-center py-2 max-h-full overflow-y-auto">
        <div className="text-3xl font-bold mb-1">
          {event.countryName}
        </div>
        {showCapital && (
          <div className="text-lg mt-1 mb-2">
            <span className="font-medium">首都:</span> {event.capitalCity}
          </div>
        )}
        {event.descriptions && event.descriptions.length > 0 && (
          <div className="mt-2 px-2">
            <ul className="text-left list-disc list-outside pl-4">
              {event.descriptions.map((desc, index) => (
                <li key={index} className="text-sm my-1 leading-snug">{desc}</li>
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