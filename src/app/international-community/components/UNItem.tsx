'use client';

import { UnitedNationsItem } from '@/hooks/useUnitedNations';
import { useState, useEffect, useMemo } from 'react';
import ActionButton from '@/components/common/ActionButton';

type UNItemProps = {
  item: UnitedNationsItem;
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function UNItem({ item, onCorrect, onIncorrect }: UNItemProps) {
  // Track revealed answers for each span
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  // Track if all answers are revealed
  const [allRevealed, setAllRevealed] = useState(false);

  // Count total number of span tags in title and all description items
  const totalSpans = useMemo(() => {
    // Count spans in title
    const titleMatches = item.title.match(/<span>/g);
    let titleSpans = titleMatches ? titleMatches.length : 0;

    // Count spans in descriptions
    const descSpans = item.description.reduce((total, desc) => {
      const matches = desc.match(/<span>/g);
      return total + (matches ? matches.length : 0);
    }, 0);

    return titleSpans + descSpans;
  }, [item.title, item.description]);

  // Check if all answers are revealed
  useEffect(() => {
    const revealedCount = Object.values(revealedAnswers).filter(value => value).length;
    setAllRevealed(revealedCount === totalSpans && totalSpans > 0);
  }, [revealedAnswers, totalSpans]);

  // Function to process text and handle <span> tags
  const processText = (text: string, textType: string, textIndex: number = 0) => {
    // Split by <span> and </span> tags
    const parts = text.split(/<span>|<\/span>/);

    if (parts.length === 1) {
      return <>{text}</>;
    }

    return parts.map((part, index) => {
      // Even indexes are regular text, odd indexes are quiz content
      if (index % 2 === 0) {
        return <span key={`${textType}-${textIndex}-${index}`}>{part}</span>;
      } else {
        // This is content inside a span tag
        const answerKey = `${textType}-${textIndex}-${index}`;
        const isRevealed = revealedAnswers[answerKey];

        return (
          <span
            key={answerKey}
            onClick={() => {
              setRevealedAnswers(prev => ({
                ...prev,
                [answerKey]: !prev[answerKey],
              }));
            }}
            className="cursor-pointer"
          >
            {isRevealed ? (
              <span className="font-bold text-blue-600 dark:text-blue-400">{part}</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">( ??? )</span>
            )}
          </span>
        );
      }
    });
  };

  return (
    <div className="w-full mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {processText(item.title, 'title', 0)}
        </h2>
      </div>

      <div className="mb-6">
        {item.description.map((desc, index) => (
          <div key={index} className="text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-start">
              <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs mr-2 mt-1 flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1">{processText(desc, 'desc', index)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <ActionButton onClick={() => onIncorrect()} variant="incorrect">
          不正解
        </ActionButton>
        <ActionButton
          onClick={() => onCorrect()}
          variant="correct"
          disabled={!allRevealed && totalSpans > 0}
        >
          正解
        </ActionButton>
      </div>
    </div>
  );
}
