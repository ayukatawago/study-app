'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUnitedNations, UnitedNationsItem } from '@/hooks/useUnitedNations';
import UNItem from './UNItem';
import InternationalCommunitySettingsPanel from './InternationalCommunitySettingsPanel';
import StudyProgressStats from '@/components/flashcard/StudyProgressStats';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UNDeckProps {
  showNextButton?: boolean;
}

export default function UNDeck({ showNextButton = true }: UNDeckProps) {
  const { unitedNationsData, isLoading, error } = useUnitedNations();

  const [settings, setSettings] = useLocalStorage('international_community_settings', {
    showIncorrectOnly: false,
    randomOrder: true,
    selectedCategory: 'all' as
      | 'all'
      | 'general'
      | 'agencies'
      | 'human_rights'
      | 'global_environment',
  });

  const [progress, setProgress] = useLocalStorage('international_community_progress', {
    seen: [] as number[],
    correct: [] as number[],
    incorrect: [] as number[],
  });

  // Current card index
  const [currentIndex, setCurrentIndex] = useState(0);
  // Add a key to force re-render when switching cards
  const [key, setKey] = useState(0);

  // Flatten all categories and items for display
  const allItems = useMemo(() => {
    const items: Array<UnitedNationsItem & { category: string }> = [];

    // Add items from each category with category information
    unitedNationsData.general.forEach(item => items.push({ ...item, category: 'general' }));
    unitedNationsData.agencies.forEach(item => items.push({ ...item, category: 'agencies' }));
    unitedNationsData.human_rights.forEach(item =>
      items.push({ ...item, category: 'human_rights' })
    );
    unitedNationsData.global_environment.forEach(item =>
      items.push({ ...item, category: 'global_environment' })
    );

    return items;
  }, [unitedNationsData]);

  // Filter items based on category and settings
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Filter by category
    if (settings.selectedCategory !== 'all') {
      items = items.filter(item => item.category === settings.selectedCategory);
    }

    // Filter by incorrect only
    if (settings.showIncorrectOnly && progress && progress.incorrect) {
      items = items.filter(item => progress.incorrect.includes(item.id));
    }

    return items;
  }, [allItems, progress, settings.selectedCategory, settings.showIncorrectOnly]);

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
    setProgress(prev => {
      // Add to seen and correct lists if not already there
      const newSeen = [...prev.seen];
      if (!prev.seen.includes(itemId)) {
        newSeen.push(itemId);
      }

      const newCorrect = [...prev.correct];
      if (!prev.correct.includes(itemId)) {
        newCorrect.push(itemId);
      }

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
    setProgress(prev => {
      // Add to seen and incorrect lists if not already there
      const newSeen = [...prev.seen];
      if (!prev.seen.includes(itemId)) {
        newSeen.push(itemId);
      }

      const newIncorrect = [...prev.incorrect];
      if (!prev.incorrect.includes(itemId)) {
        newIncorrect.push(itemId);
      }

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

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    // Reset index to 0 when settings change
    setCurrentIndex(0);
    // Force re-render of the card
    setKey(prevKey => prevKey + 1);
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'general':
        return '基本情報';
      case 'agencies':
        return '機関・組織';
      case 'human_rights':
        return '人権条約';
      case 'global_environment':
        return '地球環境';
      default:
        return 'すべて';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !allItems.length) {
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

  // Calculate counts for the current category filter
  const categoryItems =
    settings.selectedCategory === 'all'
      ? allItems
      : allItems.filter(item => item.category === settings.selectedCategory);
  const totalItemsCount = categoryItems.length;
  const correctCount = progress.correct.filter(id =>
    categoryItems.some(item => item.id === id)
  ).length;
  const incorrectCount = progress.incorrect.filter(id =>
    categoryItems.some(item => item.id === id)
  ).length;
  const seenCount = progress.seen.filter(id => categoryItems.some(item => item.id === id)).length;

  // If in incorrect only mode but no incorrect items
  const noIncorrectCardsInIncorrectMode = settings.showIncorrectOnly && !filteredItems.length;

  // Check if all cards have been answered correctly
  const allCardsAnsweredCorrectly =
    !settings.showIncorrectOnly && totalItemsCount > 0 && correctCount === totalItemsCount;

  if (allCardsAnsweredCorrectly) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <InternationalCommunitySettingsPanel
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
              {getCategoryName(settings.selectedCategory)}
              のすべてのカードに正解しました！学習を続けるには「リセット」してください。
            </p>
          </div>
        </div>
      </div>
    );
  } else if (noIncorrectCardsInIncorrectMode) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <InternationalCommunitySettingsPanel
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            カテゴリ: {getCategoryName(settings.selectedCategory)}
          </p>
        </div>
        <InternationalCommunitySettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onResetProgress={handleResetProgress}
        />
      </div>

      {displayItems.length > 0 ? (
        <div>
          <UNItem
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
        categoryName={getCategoryName(settings.selectedCategory)}
        seenCount={seenCount}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
      />
    </div>
  );
}
