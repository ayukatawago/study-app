'use client';

import { useState } from 'react';
import { PrefectureData } from '@/types/flashcard';
import { createLogger } from '@/utils/logger';
import ActionButton from '@/components/common/ActionButton';

const logger = createLogger({ prefix: 'PrefectureFlashcard' });

interface PrefectureFlashcardProps {
  question: PrefectureData;
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
          className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col justify-center items-center p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{question.prefecture}</div>
          <div className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {question.keyword}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">タップして答えを表示</div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col justify-center items-center p-6 rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{question.prefecture}</div>
          <div className="text-base text-center text-gray-900 dark:text-white mb-6">
            {Array.isArray(question.answer) ? (
              <ul className="list-none space-y-1">
                {question.answer.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              question.answer
            )}
          </div>

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
