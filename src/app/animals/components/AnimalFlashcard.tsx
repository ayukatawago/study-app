'use client';

import BaseFlashcard from '@/components/flashcard/BaseFlashcard';
import { AnimalQuizData } from '@/types/flashcard';

type AnimalFlashcardProps = {
  quiz: AnimalQuizData;
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function AnimalFlashcard({ quiz, onCorrect, onIncorrect }: AnimalFlashcardProps) {
  // Determine card height based on content length
  const getCardHeight = () => {
    const questionLength = quiz.question?.length || 0;
    const answerLength = quiz.answer?.length || 0;

    // Adjust height based on question and answer length
    if (questionLength > 100 || answerLength > 100) {
      return 'h-96'; // 24rem for very long content
    } else if (questionLength > 60 || answerLength > 60) {
      return 'h-80'; // 20rem for long content
    } else {
      return 'h-72'; // 18rem for normal content
    }
  };

  const renderFrontContent = () => {
    // Safety check in case quiz is undefined
    if (!quiz) {
      return <div className="text-lg text-gray-900 dark:text-white">No question available</div>;
    }

    // Show question on front side
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-lg font-medium mb-3 text-gray-900 dark:text-white">問題 {quiz.id}</div>
        <div className="text-xl text-center text-gray-900 dark:text-white">{quiz.question}</div>
      </div>
    );
  };

  const renderBackContent = () => {
    // Safety check in case quiz is undefined
    if (!quiz) {
      return <div className="text-lg text-gray-900 dark:text-white">No answer available</div>;
    }

    // Show answer on back side
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="text-lg font-medium mb-3 text-gray-900 dark:text-white">問題 {quiz.id}</div>
        <div className="text-xl text-center mb-4 text-gray-900 dark:text-white">
          {quiz.question}
        </div>
        <div className="mt-2 border-t pt-4 w-full">
          <div className="font-bold text-lg mb-1 text-gray-900 dark:text-white">答え:</div>
          <div className="text-xl text-center text-blue-600 dark:text-blue-400">{quiz.answer}</div>
        </div>
      </div>
    );
  };

  return (
    <BaseFlashcard
      event={quiz}
      onCorrect={onCorrect}
      onIncorrect={onIncorrect}
      renderFrontContent={renderFrontContent}
      renderBackContent={renderBackContent}
      getCardHeight={getCardHeight}
    />
  );
}
