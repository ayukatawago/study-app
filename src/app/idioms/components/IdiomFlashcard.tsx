'use client';

import BaseFlashcard from '@/components/flashcard/BaseFlashcard';
import { IdiomData, IdiomSettings } from '@/types/flashcard';

interface IdiomFlashcardProps {
  idiom: IdiomData;
  settings: IdiomSettings;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function IdiomFlashcard({
  idiom,
  settings,
  onCorrect,
  onIncorrect,
}: IdiomFlashcardProps) {
  // Determine card height based on content length
  const getCardHeight = () => {
    const idiomLength = idiom.idiom?.length || 0;
    const meaningLength = idiom.meaning?.length || 0;
    const exampleLength = idiom.example?.length || 0;

    // Adjust height based on content length
    if (meaningLength > 80 || exampleLength > 60) {
      return 'h-96'; // 24rem for very long content
    } else if (meaningLength > 50 || exampleLength > 40) {
      return 'h-80'; // 20rem for long content
    } else {
      return 'h-72'; // 18rem for normal content
    }
  };

  const renderFrontContent = () => {
    if (settings.cardDirection === 'idiom-to-meaning') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2 text-center">
            {idiom.idiom}
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">{idiom.meaning}</div>
        </div>
      );
    }
  };

  const renderBackContent = () => {
    if (settings.cardDirection === 'idiom-to-meaning') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">意味:</div>
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">{idiom.meaning}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-purple-300 pl-4">
            例：{idiom.example}
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">慣用句:</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            {idiom.idiom}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-purple-300 pl-4">
            例：{idiom.example}
          </div>
        </div>
      );
    }
  };

  return (
    <BaseFlashcard
      event={idiom}
      onCorrect={onCorrect}
      onIncorrect={onIncorrect}
      renderFrontContent={renderFrontContent}
      renderBackContent={renderBackContent}
      getCardHeight={getCardHeight}
    />
  );
}
