'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePolitics, PoliticsSettings } from '@/hooks/usePolitics';
import PoliticsCard from './PoliticsCard';
import PoliticsSettingsPanel from './PoliticsSettingsPanel';
import StudyProgressStats from '@/components/flashcard/StudyProgressStats';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { trackQuizAttempt, trackCorrectAnswer } from '@/utils/dailyActivity';

interface PoliticsDeckProps {
  showNextButton?: boolean;
}

export default function PoliticsDeck({ showNextButton = true }: PoliticsDeckProps) {
  const { politicsData, isLoading, error } = usePolitics();

  const [settings, setSettings] = useLocalStorage<PoliticsSettings>('politics_settings', {
    showIncorrectOnly: false,
    randomOrder: true,
    category: 'all',
  });

  const [progress, setProgress] = useLocalStorage('politics_progress', {
    seen: [] as number[],
    correct: [] as number[],
    incorrect: [] as number[],
  });

  // Current card index
  const [currentIndex, setCurrentIndex] = useState(0);
  // Add a key to force re-render when switching cards
  const [key, setKey] = useState(0);

  // Flatten all categories for display
  const allItems = useMemo(() => {
    const items = [];

    if (settings.category === 'all' || settings.category === 'diet') {
      items.push(...politicsData.diet.map(item => ({ ...item, category: 'diet' as const })));
    }
    if (settings.category === 'all' || settings.category === 'cabinet') {
      items.push(...politicsData.cabinet.map(item => ({ ...item, category: 'cabinet' as const })));
    }
    if (settings.category === 'all' || settings.category === 'court') {
      items.push(...politicsData.court.map(item => ({ ...item, category: 'court' as const })));
    }

    return items;
  }, [politicsData, settings.category]);

  // Filter items based on settings
  const filteredItems = useMemo(() => {
    if (settings.showIncorrectOnly && progress && progress.incorrect) {
      // Only show items that are in the incorrect list
      return allItems.filter(item => progress.incorrect.includes(item.id));
    }
    return allItems;
  }, [allItems, progress, settings.showIncorrectOnly]);

  // Randomize or sort the cards
  const displayItems = useMemo(() => {
    if (settings.randomOrder) {
      return [...filteredItems].sort(() => Math.random() - 0.5);
    }
    return filteredItems;
  }, [filteredItems, settings.randomOrder]);

  // When display items change, reset to the first card
  useEffect(() => {
    setCurrentIndex(0);
    setKey(prevKey => prevKey + 1);
  }, [displayItems]);

  // Helper function to get random index (different from current)
  const getRandomIndex = () => {
    let randomIndex;
    let attempts = 0;
    const maxAttempts = displayItems.length * 2; // Prevent infinite loop

    do {
      randomIndex = Math.floor(Math.random() * displayItems.length);
      attempts++;
      // Break the loop if we've tried too many times to prevent infinite loops
      if (attempts > maxAttempts) break;
    } while (displayItems.length > 1 && randomIndex === currentIndex);

    return randomIndex;
  };

  // Move to next card
  const moveToNextCard = () => {
    if (displayItems.length <= 1) return;

    if (settings.randomOrder) {
      // Pick a random card, but not the current one
      setCurrentIndex(getRandomIndex());
    } else {
      // Sequential mode
      if (currentIndex < displayItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // If reached the end, start over
        setCurrentIndex(0);
      }
    }

    // Force re-render
    setKey(prevKey => prevKey + 1);
  };

  const handleCorrect = (itemId: number) => {
    // Track quiz attempt and correct answer
    trackQuizAttempt('politics');
    trackCorrectAnswer('politics');

    setProgress(prev => {
      // Add to seen and correct lists if not already there
      const newSeen = prev.seen.includes(itemId) ? prev.seen : [...prev.seen, itemId];
      const newCorrect = prev.correct.includes(itemId) ? prev.correct : [...prev.correct, itemId];
      // Remove from incorrect list if it was there
      const newIncorrect = prev.incorrect.filter(id => id !== itemId);

      return {
        seen: newSeen,
        correct: newCorrect,
        incorrect: newIncorrect,
      };
    });

    // Move to the next card
    moveToNextCard();
  };

  const handleIncorrect = (itemId: number) => {
    // Track quiz attempt (but not correct answer)
    trackQuizAttempt('politics');

    setProgress(prev => {
      // Add to seen and incorrect lists if not already there
      const newSeen = prev.seen.includes(itemId) ? prev.seen : [...prev.seen, itemId];
      const newIncorrect = prev.incorrect.includes(itemId)
        ? prev.incorrect
        : [...prev.incorrect, itemId];
      // Remove from correct list if it was there
      const newCorrect = prev.correct.filter(id => id !== itemId);

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

  const handleSettingsChange = (newSettings: PoliticsSettings) => {
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

  if (error || !Object.values(politicsData).some(arr => arr.length > 0)) {
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

  // Calculate total items count
  const totalItemsCount = allItems.length;
  const correctCount = progress.correct.length;
  const incorrectCount = progress.incorrect.length;
  const seenCount = progress.seen.length;

  // If in incorrect only mode but no incorrect items
  const noIncorrectCardsInIncorrectMode = settings.showIncorrectOnly && !filteredItems.length;

  // Check if all cards have been answered correctly
  const allCardsAnsweredCorrectly =
    !settings.showIncorrectOnly &&
    totalItemsCount > 0 &&
    progress.correct.length === totalItemsCount;

  if (allCardsAnsweredCorrectly) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <PoliticsSettingsPanel
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
          <PoliticsSettingsPanel
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
            {currentIndex + 1} / {displayItems.length}
          </p>
        </div>
        <PoliticsSettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onResetProgress={handleResetProgress}
        />
      </div>

      {displayItems.length > 0 ? (
        <div>
          <PoliticsCard
            key={`card-${key}`}
            item={displayItems[currentIndex]}
            onCorrect={() => handleCorrect(displayItems[currentIndex].id)}
            onIncorrect={() => handleIncorrect(displayItems[currentIndex].id)}
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
        categoryName="政治"
        seenCount={seenCount}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
      />
    </div>
  );
}
