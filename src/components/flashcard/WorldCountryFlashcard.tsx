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
    return 'h-96'; // 24rem = 384px, appropriate for the map component
  };

  const renderFrontContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    // Always show map on front side
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        {/* Show map on front side */}
        <div className="relative w-full h-full">
          <WorldMap 
            highlightedCountry={String(event.countryCode)}
            width={320}
            height={200}
          />
        </div>
      </div>
    );
  };

  const renderBackContent = () => {
    // Safety check in case event is undefined
    if (!event) {
      return <div className="text-lg">No card available</div>;
    }
    
    // Always show country name and capital on back side
    return (
      <div className="text-center py-8">
        <div className="text-4xl font-bold mb-4">
          {event.countryName}
        </div>
        {showCapital && (
          <div className="text-xl mt-4">
            <span className="font-medium">首都:</span> {event.capitalCity}
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