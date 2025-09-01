'use client';

import { useState, useMemo, useEffect } from 'react';
import { useConstitution } from '@/hooks/useConstitution';
import ConstitutionCard from './ConstitutionCard';
import ConstitutionSettingsPanel from './ConstitutionSettingsPanel';
import StudyProgressStats from '@/components/flashcard/StudyProgressStats';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { trackQuizAttempt, trackCorrectAnswer } from '@/utils/dailyActivity';

interface ConstitutionDeckProps {
  showNextButton?: boolean;
}

export default function ConstitutionDeck({ showNextButton = true }: ConstitutionDeckProps) {
  const { constitutionData, isLoading, error } = useConstitution();

  const [settings, setSettings] = useLocalStorage('constitution_settings', {
    showIncorrectOnly: false,
    randomOrder: true,
  });

  const [progress, setProgress] = useLocalStorage('constitution_progress', {
    seen: [] as Array<{ section: number; article: number }>,
    correct: [] as Array<{ section: number; article: number }>,
    incorrect: [] as Array<{ section: number; article: number }>,
  });

  // Current card index
  const [currentIndex, setCurrentIndex] = useState(0);
  // Add a key to force re-render when switching cards
  const [key, setKey] = useState(0);

  // Flatten all sections and articles for display
  const allArticles = useMemo(() => {
    const articles = [];
    for (const section of constitutionData.sections) {
      for (const article of section.articles) {
        articles.push({
          section,
          article,
        });
      }
    }
    return articles;
  }, [constitutionData.sections]);

  // Filter articles based on settings
  const filteredArticles = useMemo(() => {
    if (settings.showIncorrectOnly && progress && progress.incorrect) {
      // Only show articles that are in the incorrect list
      return allArticles.filter(item =>
        progress.incorrect.some(
          inc => inc.section === item.section.section && inc.article === item.article.article
        )
      );
    }
    return allArticles;
  }, [allArticles, progress, settings.showIncorrectOnly]);

  // Randomize or sort the cards
  const displayArticles = useMemo(() => {
    if (settings.randomOrder) {
      return [...filteredArticles].sort(() => Math.random() - 0.5);
    }
    return filteredArticles;
  }, [filteredArticles, settings.randomOrder]);

  // When display articles change, reset to the first card
  useEffect(() => {
    setCurrentIndex(0);
    setKey(prevKey => prevKey + 1);
  }, [displayArticles]);

  // Helper function to get random index (different from current)
  const getRandomIndex = () => {
    let randomIndex;
    let attempts = 0;
    const maxAttempts = displayArticles.length * 2; // Prevent infinite loop

    do {
      randomIndex = Math.floor(Math.random() * displayArticles.length);
      attempts++;
      // Break the loop if we've tried too many times to prevent infinite loops
      if (attempts > maxAttempts) break;
    } while (displayArticles.length > 1 && randomIndex === currentIndex);

    return randomIndex;
  };

  // Move to next card
  const moveToNextCard = () => {
    if (displayArticles.length <= 1) return;

    if (settings.randomOrder) {
      // Pick a random card, but not the current one
      setCurrentIndex(getRandomIndex());
    } else {
      // Sequential mode
      if (currentIndex < displayArticles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // If reached the end, start over
        setCurrentIndex(0);
      }
    }

    // Force re-render
    setKey(prevKey => prevKey + 1);
  };

  const handleCorrect = (sectionId: number, articleId: number) => {
    // Track quiz attempt and correct answer
    trackQuizAttempt('constitution');
    trackCorrectAnswer('constitution');

    setProgress(prev => {
      // Add to seen and correct lists if not already there
      const newSeen = [...prev.seen];
      if (!prev.seen.some(item => item.section === sectionId && item.article === articleId)) {
        newSeen.push({ section: sectionId, article: articleId });
      }

      const newCorrect = [...prev.correct];
      if (!prev.correct.some(item => item.section === sectionId && item.article === articleId)) {
        newCorrect.push({ section: sectionId, article: articleId });
      }

      // Remove from incorrect list if it was there
      const newIncorrect = prev.incorrect.filter(
        item => !(item.section === sectionId && item.article === articleId)
      );

      return {
        seen: newSeen,
        correct: newCorrect,
        incorrect: newIncorrect,
      };
    });

    // Move to the next card
    moveToNextCard();
  };

  const handleIncorrect = (sectionId: number, articleId: number) => {
    // Track quiz attempt (but not correct answer)
    trackQuizAttempt('constitution');

    setProgress(prev => {
      // Add to seen and incorrect lists if not already there
      const newSeen = [...prev.seen];
      if (!prev.seen.some(item => item.section === sectionId && item.article === articleId)) {
        newSeen.push({ section: sectionId, article: articleId });
      }

      const newIncorrect = [...prev.incorrect];
      if (!prev.incorrect.some(item => item.section === sectionId && item.article === articleId)) {
        newIncorrect.push({ section: sectionId, article: articleId });
      }

      // Remove from correct list if it was there
      const newCorrect = prev.correct.filter(
        item => !(item.section === sectionId && item.article === articleId)
      );

      return {
        seen: newSeen,
        correct: newCorrect,
        incorrect: newIncorrect,
      };
    });

    // Move to the next card
    moveToNextCard();
  };

  const handleResetProgress = () => {
    setProgress({
      seen: [],
      correct: [],
      incorrect: [],
    });
  };

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    // Reset index to 0 when settings change
    setCurrentIndex(0);
    // Force re-render of the card
    setKey(prevKey => prevKey + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !constitutionData.sections.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 dark:bg-red-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            エラーが発生しました
          </h2>
          <p className="text-gray-900 dark:text-white">
            {error || 'データを取得できませんでした。'}
          </p>
        </div>
      </div>
    );
  }

  // Calculate total articles count
  const totalArticlesCount = allArticles.length;
  const correctCount = progress.correct.length;
  const incorrectCount = progress.incorrect.length;
  const seenCount = progress.seen.length;

  // If in incorrect only mode but no incorrect articles
  const noIncorrectCardsInIncorrectMode = settings.showIncorrectOnly && !filteredArticles.length;

  // Check if all cards have been answered correctly
  const allCardsAnsweredCorrectly =
    !settings.showIncorrectOnly &&
    totalArticlesCount > 0 &&
    progress.correct.length === totalArticlesCount;

  if (allCardsAnsweredCorrectly) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <ConstitutionSettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onResetProgress={handleResetProgress}
          />
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-6 bg-green-100 dark:bg-green-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              おめでとうございます！
            </h2>
            <p className="text-gray-900 dark:text-white">
              すべてのカードに正解しました！学習を続けるには「リセット」してください。
            </p>
          </div>
        </div>
      </div>
    );
  } else if (noIncorrectCardsInIncorrectMode) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <ConstitutionSettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onResetProgress={handleResetProgress}
          />
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              不正解のカードがありません
            </h2>
            <p className="text-gray-900 dark:text-white">
              不正解のカードのみ表示モードですが、不正解のカードがありません。設定を変更してください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {currentIndex + 1} / {displayArticles.length}
          </p>
        </div>
        <ConstitutionSettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onResetProgress={handleResetProgress}
        />
      </div>

      {displayArticles.length > 0 ? (
        <div>
          <ConstitutionCard
            key={`card-${key}`}
            section={displayArticles[currentIndex].section}
            article={displayArticles[currentIndex].article}
            onCorrect={() =>
              handleCorrect(
                displayArticles[currentIndex].section.section,
                displayArticles[currentIndex].article.article
              )
            }
            onIncorrect={() =>
              handleIncorrect(
                displayArticles[currentIndex].section.section,
                displayArticles[currentIndex].article.article
              )
            }
          />

          {showNextButton && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={moveToNextCard}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                次のカード
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              カードがありません
            </h2>
            <p className="text-gray-900 dark:text-white">
              現在の設定に合うカードがありません。設定を変更してください。
            </p>
          </div>
        </div>
      )}

      <StudyProgressStats
        categoryName="憲法"
        seenCount={seenCount}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
      />
    </div>
  );
}
