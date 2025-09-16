'use client';

import BaseFlashcard from '@/components/flashcard/BaseFlashcard';
import { WagoData, WagoSettings } from '@/types/flashcard';

interface WagoFlashcardProps {
  wago: WagoData;
  settings: WagoSettings;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function WagoFlashcard({
  wago,
  settings,
  onCorrect,
  onIncorrect,
}: WagoFlashcardProps) {
  // Determine card height based on content length - generous sizing to avoid scrolling
  const getCardHeight = () => {
    const meaningCount = wago.meanings?.length || 0;
    const totalMeaningLength =
      wago.meanings?.reduce(
        (total, item) => total + (item.meaning?.length || 0) + (item.example?.length || 0),
        0
      ) || 0;

    // Very generous height adjustment to eliminate scrolling
    if (meaningCount >= 4 || totalMeaningLength > 300) {
      return 'h-[48rem]'; // 48rem for many meanings or very long content
    } else if (meaningCount >= 3 || totalMeaningLength > 200) {
      return 'h-[40rem]'; // 40rem for 3 meanings or long content
    } else if (meaningCount >= 2 || totalMeaningLength > 100) {
      return 'h-[32rem]'; // 32rem for 2 meanings or moderate content
    } else if (totalMeaningLength > 50) {
      return 'h-[28rem]'; // 28rem for slightly longer content
    } else {
      return 'h-96'; // 24rem for short content
    }
  };

  const renderFrontContent = () => {
    if (settings.cardDirection === 'word-to-meaning') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2 text-center">
            {wago.word}
          </div>
          {wago.meanings && wago.meanings.length > 1 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {wago.meanings.length}つの意味
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {wago.meanings && wago.meanings.length > 0 && (
              <div>
                {wago.meanings.map((meaningItem, index) => (
                  <div key={index} className={index > 0 ? 'mt-4' : ''}>
                    <div className="mb-2">{meaningItem.meaning}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  const renderBackContent = () => {
    if (settings.cardDirection === 'word-to-meaning') {
      return (
        <div className="w-full h-full flex flex-col justify-center text-center p-6">
          <div className="font-bold text-lg mb-6 text-gray-900 dark:text-white">意味:</div>
          <div className="text-base text-gray-700 dark:text-gray-300 space-y-6">
            {wago.meanings &&
              wago.meanings.map((meaningItem, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {wago.meanings.length > 1 && (
                      <span className="text-green-600 dark:text-green-400 mr-2">{index + 1}.</span>
                    )}
                    {meaningItem.meaning}
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                    <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                      使用例
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      {meaningItem.example}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col justify-center text-center p-6">
          <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white">和語:</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
            {wago.word}
          </div>
          <div className="space-y-4">
            {wago.meanings &&
              wago.meanings.map((meaningItem, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400"
                >
                  <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                    使用例 {wago.meanings.length > 1 ? `${index + 1}` : ''}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    {meaningItem.example}
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }
  };

  return (
    <BaseFlashcard
      event={wago}
      onCorrect={onCorrect}
      onIncorrect={onIncorrect}
      renderFrontContent={renderFrontContent}
      renderBackContent={renderBackContent}
      getCardHeight={getCardHeight}
    />
  );
}
