'use client';

import { useState } from 'react';
import { CraftData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'CraftFlashcard' });

interface CraftFlashcardProps {
  question: CraftData;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function CraftFlashcard({ question, onCorrect, onIncorrect }: CraftFlashcardProps) {
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
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">都道府県</div>
          <div className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {question.prefecture}
          </div>
          {question.answer.length > 1 && (
            <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              {question.answer.length}項目
            </div>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">タップして答えを表示</div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col justify-center items-center p-6 rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{question.prefecture}</div>
          <div className="text-base text-center text-gray-900 dark:text-white mb-6">
            {question.answer.map((craft, index) => (
              <div key={index} className="mb-1">
                {craft}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4">
            <button
              onClick={e => {
                e.stopPropagation();
                handleIncorrect();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              不正解
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleCorrect();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              正解
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
