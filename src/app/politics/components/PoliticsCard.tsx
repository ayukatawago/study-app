'use client';

import { PoliticsItem } from '@/hooks/usePolitics';
import { useState, useEffect, useMemo } from 'react';

type PoliticsCardProps = {
  item: PoliticsItem;
  onCorrect: () => void;
  onIncorrect: () => void;
};

export default function PoliticsCard({ item, onCorrect, onIncorrect }: PoliticsCardProps) {
  // Track revealed answers for each span and pre
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  // Track if all answers are revealed
  const [allRevealed, setAllRevealed] = useState(false);

  // Count total number of span and pre tags in all descriptions
  const totalTags = useMemo(() => {
    return item.description.reduce((total, desc) => {
      // Count <span> and <pre> tags in the description
      const spanMatches = desc.match(/<span>/g);
      const preMatches = desc.match(/<pre>/g);
      return total + (spanMatches ? spanMatches.length : 0) + (preMatches ? preMatches.length : 0);
    }, 0);
  }, [item.description]);

  // Check if all answers are revealed
  useEffect(() => {
    const revealedCount = Object.values(revealedAnswers).filter(value => value).length;
    setAllRevealed(revealedCount === totalTags && totalTags > 0);
  }, [revealedAnswers, totalTags]);

  // Function to process text and handle <span>, <pre> tags
  const processText = (text: string, descriptionIndex: number) => {
    // Split by both <span> and <pre> tags
    const parts = text.split(/(<span>.*?<\/span>|<pre>.*?<\/pre>)/);

    return parts.map((part, index) => {
      if (part.includes('<span>')) {
        // Extract content from span tag
        const content = part.replace(/<\/?span>/g, '');
        const answerKey = `${descriptionIndex}-span-${index}`;
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
              <span className="font-bold text-blue-600 dark:text-blue-400">{content}</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">( ??? )</span>
            )}
          </span>
        );
      } else if (part.includes('<pre>')) {
        // Extract content from pre tag
        const content = part.replace(/<\/?pre>/g, '');
        const answerKey = `${descriptionIndex}-pre-${index}`;
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
              <span className="font-bold text-green-600 dark:text-green-400">{content}</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">( ??? )</span>
            )}
          </span>
        );
      } else {
        // Regular text
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className="w-full mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.keyword}</h2>
      </div>

      <div className="mb-6">
        {item.description.map((desc, index) => (
          <div key={index} className="text-gray-700 dark:text-gray-300 mb-3">
            {processText(desc, index)}
          </div>
        ))}

        {item.memo && allRevealed && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 animate-fade-in">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <span className="font-semibold">メモ：</span>
              {processText(item.memo, -1)}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => onIncorrect()}
          className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          不正解
        </button>
        <button
          onClick={() => onCorrect()}
          disabled={!allRevealed && totalTags > 0}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            allRevealed || totalTags === 0
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          正解
        </button>
      </div>
    </div>
  );
}
