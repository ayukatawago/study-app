'use client';

import { useState } from 'react';
import { CraftData, CraftSettings } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';
import ActionButton from '@/components/common/ActionButton';

const logger = createLogger({ prefix: 'CraftFlashcard' });

interface CraftFlashcardProps {
  question: CraftData;
  onCorrect: () => void;
  onIncorrect: () => void;
  settings: CraftSettings;
}

export default function CraftFlashcard({
  question,
  onCorrect,
  onIncorrect,
  settings,
}: CraftFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    logger.debug(`Card flipped: ${question.prefecture}`);
  };

  const handleCorrect = () => {
    logger.debug(`Marked correct: ${question.prefecture}`);
    setIsFlipped(false);
    setTimeout(() => {
      onCorrect();
    }, 300); // Wait for the flip animation
  };

  const handleIncorrect = () => {
    logger.debug(`Marked incorrect: ${question.prefecture}`);
    setIsFlipped(false);
    setTimeout(() => {
      onIncorrect();
    }, 300); // Wait for the flip animation
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className={`relative w-full h-96 cursor-pointer transition-all duration-300 transform-gpu preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col justify-center items-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {settings.cardDirection === 'prefecture-to-craft' ? (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">都道府県</div>
              <div className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                {question.prefecture}
              </div>
              {question.answer.length > 1 && (
                <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  {question.answer.length}項目
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">伝統工芸品</div>
              <div className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                {question.answer.map((craft, index) => (
                  <div key={index} className="mb-1">
                    {craft}
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">タップして答えを表示</div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col justify-center items-center p-6 rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {settings.cardDirection === 'prefecture-to-craft' ? (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {question.prefecture}
              </div>
              <div className="text-base text-center text-gray-900 dark:text-white mb-6">
                {question.answer.map((craft, index) => (
                  <div key={index} className="mb-1">
                    {craft}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {question.answer.join(', ')}
              </div>
              <div className="text-base text-center text-gray-900 dark:text-white mb-6">
                {question.prefecture}
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex space-x-4">
            <ActionButton
              onClick={e => {
                e.stopPropagation();
                handleIncorrect();
              }}
              variant="incorrect"
              size="lg"
            >
              不正解
            </ActionButton>
            <ActionButton
              onClick={e => {
                e.stopPropagation();
                handleCorrect();
              }}
              variant="correct"
              size="lg"
            >
              正解
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
