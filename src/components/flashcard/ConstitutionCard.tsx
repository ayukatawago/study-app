'use client';

import { ConstitutionArticle, ConstitutionSection } from '@/hooks/useConstitution';
import { useState, useEffect, useMemo } from 'react';

type ConstitutionCardProps = {
  section: ConstitutionSection;
  article: ConstitutionArticle;
  onCorrect: (sectionId: number, articleId: number) => void;
  onIncorrect: (sectionId: number, articleId: number) => void;
};

export default function ConstitutionCard({
  section,
  article,
  onCorrect,
  onIncorrect,
}: ConstitutionCardProps) {
  // Track revealed answers for each span
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  // Track if all answers are revealed
  const [allRevealed, setAllRevealed] = useState(false);
  
  // Count total number of span tags in all paragraphs
  const totalSpans = useMemo(() => {
    return article.paragraphs.reduce((total, para) => {
      // Count <span> tags in the paragraph
      const matches = para.match(/<span>/g);
      return total + (matches ? matches.length : 0);
    }, 0);
  }, [article.paragraphs]);
  
  // Check if all answers are revealed
  useEffect(() => {
    const revealedCount = Object.values(revealedAnswers).filter(value => value).length;
    setAllRevealed(revealedCount === totalSpans && totalSpans > 0);
  }, [revealedAnswers, totalSpans]);

  // Function to process text and handle <span> tags and newlines
  const processText = (text: string, paragraphIndex: number) => {
    // First, split by newlines to handle paragraph breaks
    const paragraphs = text.split('\n');
    
    return (
      <>
        {paragraphs.map((paragraph, pIndex) => {
          // Split by <span> and </span> tags
          const parts = paragraph.split(/<span>|<\/span>/);
          
          // Create the content for this paragraph
          const content = parts.length === 1 
            ? <>{paragraph}</> 
            : parts.map((part, index) => {
                // Even indexes are regular text, odd indexes are quiz content
                if (index % 2 === 0) {
                  return <span key={`${paragraphIndex}-${pIndex}-${index}`}>{part}</span>;
                } else {
                  // This is content inside a span tag
                  const answerKey = `${paragraphIndex}-${pIndex}-${index}`;
                  const isRevealed = revealedAnswers[answerKey];
                  
                  return (
                    <span 
                      key={answerKey}
                      onClick={() => {
                        setRevealedAnswers(prev => ({
                          ...prev,
                          [answerKey]: !prev[answerKey]
                        }));
                      }}
                      className="cursor-pointer"
                    >
                      {isRevealed ? 
                        <span className="font-bold text-blue-600">{part}</span> : 
                        <span className="text-red-600">( ??? )</span>}
                    </span>
                  );
                }
              });
          
          // Return this paragraph with a margin bottom (except for the last one)
          return (
            <div key={`para-${paragraphIndex}-${pIndex}`} className={pIndex < paragraphs.length - 1 ? "mb-4" : ""}>
              {content}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-400">{section.title}</span>
        <h2 className="text-xl font-bold flex items-center gap-2">
          {article.article !== 0 ? `第${article.article}条` : '前文'}
          {article.summary && (
            <span className="text-base font-normal text-gray-600 dark:text-gray-300">
              - {article.summary}
            </span>
          )}
        </h2>
      </div>
      
      <div className="mb-6">
        {article.paragraphs.map((para, index) => (
          <div key={index} className="text-gray-700 dark:text-gray-300 mb-4">
            {article.paragraphs.length > 1 && (
              <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs mr-2 mb-1">
                {index + 1}
              </span>
            )}
            {processText(para, index)}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onIncorrect(section.section, article.article)}
          className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          不正解
        </button>
        <button
          onClick={() => onCorrect(section.section, article.article)}
          disabled={!allRevealed && totalSpans > 0}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            allRevealed || totalSpans === 0
              ? "bg-green-500 text-white hover:bg-green-600" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          正解
        </button>
      </div>
    </div>
  );
}