'use client';

import { useState } from 'react';
import { PrefectureQuestionData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';

const logger = createLogger({ prefix: 'PrefectureFlashcard' });

interface PrefectureFlashcardProps {
  question: PrefectureQuestionData & { prefecture: string };
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function PrefectureFlashcard({
  question,
  onCorrect,
  onIncorrect,
}: PrefectureFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    logger.debug(`Card flipped: ${question.prefecture} - ${question.keyword}`);
  };

  const handleCorrect = () => {
    logger.debug(`Marked correct: ${question.prefecture} - ${question.keyword}`);
    setIsFlipped(false);
    setTimeout(() => {
      onCorrect();
    }, 300); // Wait for the flip animation
  };

  const handleIncorrect = () => {
    logger.debug(`Marked incorrect: ${question.prefecture} - ${question.keyword}`);
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
          className="absolute inset-0 backface-hidden bg-white border border-gray-300 rounded-lg shadow-md flex flex-col justify-center items-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-sm text-gray-500 mb-2">{question.prefecture}</div>
          <div className="text-2xl font-bold text-center text-gray-800">{question.keyword}</div>
          <div className="text-sm text-gray-400 mt-4">タップして答えを表示</div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden bg-blue-50 border border-blue-300 rounded-lg shadow-md flex flex-col justify-center items-center p-6 rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-sm text-gray-500 mb-4">{question.prefecture}</div>
          <div className="text-base text-center text-gray-700 mb-6">{question.answer}</div>

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
