'use client';

import { PoliticsItem } from '@/hooks/usePolitics';
import { useState, useEffect, useMemo } from 'react';
import ActionButton from '@/components/common/ActionButton';

type PoliticsCardProps = {
  item: PoliticsItem;
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function PoliticsCard({ item, onCorrect, onIncorrect }: PoliticsCardProps) {
  // Track revealed answers for each span
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  // Track if all answers are revealed
  const [allRevealed, setAllRevealed] = useState(false);

  // Count total number of span tags in keyword and all descriptions
  const totalSpans = useMemo(() => {
    let total = 0;

    // Count spans in keyword
    const keywordMatches = item.keyword.match(/<span>/g);
    total += keywordMatches ? keywordMatches.length : 0;

    // Count spans in descriptions
    total += item.description.reduce((descTotal, desc) => {
      const matches = desc.match(/<span>/g);
      return descTotal + (matches ? matches.length : 0);
    }, 0);

    // Count spans in memo if it exists
    if (item.memo) {
      const memoMatches = item.memo.match(/<span>/g);
      total += memoMatches ? memoMatches.length : 0;
    }

    return total;
  }, [item.keyword, item.description, item.memo]);

  // Check if all answers are revealed
  useEffect(() => {
    const revealedCount = Object.values(revealedAnswers).filter(value => value).length;
    setAllRevealed(revealedCount === totalSpans && totalSpans > 0);
  }, [revealedAnswers, totalSpans]);

  // Function to process text and handle <span> tags
  const processText = (text: string, sectionIndex: number) => {
    // Split by <span> and </span> tags
    const parts = text.split(/<span>|<\/span>/);

    return parts.map((part, index) => {
      // Even indexes are regular text, odd indexes are quiz content
      if (index % 2 === 0) {
        return <span key={`${sectionIndex}-${index}`}>{part}</span>;
      } else {
        // This is content inside a span tag
        const answerKey = `${sectionIndex}-${index}`;
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {processText(item.keyword, -1)}
        </h2>
      </div>

      <div className="mb-6">
        {item.description.map((desc, index) => (
          <div key={index} className="text-gray-700 dark:text-gray-300 mb-3">
            <span className="text-gray-500 dark:text-gray-400 mr-2">•</span>
            {processText(desc, index)}
          </div>
        ))}

        {item.memo && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {processText(item.memo, -2)}
            </p>
          </div>
        )}
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
