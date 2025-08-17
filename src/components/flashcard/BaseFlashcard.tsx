'use client';

import { ReactNode, useState } from 'react';
import { BaseFlashcardProps, BaseFlashcardData } from '@/types/flashcard';

interface BaseFlashcardExtendedProps<T extends BaseFlashcardData> extends BaseFlashcardProps<T> {
  renderFrontContent: () => ReactNode;
  renderBackContent: () => ReactNode;
  getCardHeight?: () => string;
}

export default function BaseFlashcard<T extends BaseFlashcardData>({
  event,
  onCorrect,
  onIncorrect,
  renderFrontContent,
  renderBackContent,
  getCardHeight = () => 'h-64', // Default height if not specified
}: BaseFlashcardExtendedProps<T>) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    if (event) {
      setTimeout(() => {
        onCorrect();
      }, 300); // Wait for the flip animation
    }
  };

  const handleIncorrect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    if (event) {
      setTimeout(() => {
        onIncorrect();
      }, 300); // Wait for the flip animation
    }
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
          {renderFrontContent()}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            (タップして答えを見る)
          </div>
        </div>
        <div
          className={`absolute inset-0 rounded-xl p-6 flex flex-col items-center justify-center backface-hidden transition-all duration-500 ${
            isFlipped ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-180'
          } bg-white dark:bg-gray-800`}
        >
          {renderBackContent()}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleIncorrect}
              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              不正解
            </button>
            <button
              onClick={handleCorrect}
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
