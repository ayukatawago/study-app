'use client';

import { ConstitutionArticle, ConstitutionSection } from '@/hooks/useConstitution';

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
      
      <div className="space-y-2 mb-6">
        {article.text.map((paragraph, index) => (
          <p key={index} className="text-gray-700 dark:text-gray-300">
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onIncorrect(section.section, article.article)}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          不正解
        </button>
        <button
          onClick={() => onCorrect(section.section, article.article)}
          className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          正解
        </button>
      </div>
    </div>
  );
}