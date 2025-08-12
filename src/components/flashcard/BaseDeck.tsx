'use client';

import { useEffect, useState, useMemo, ReactNode } from 'react';
import { BaseFlashcardData, BaseFlashcardSettings, BaseFlashcardProgress } from '@/types/flashcard';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface BaseDeckProps<T extends BaseFlashcardData, S extends BaseFlashcardSettings> {
  id: string;  // Unique identifier for localStorage keys
  items: T[];  // Items to display in the deck
  isLoading: boolean;
  error: string | null;
  settings: S;
  setSettings: (settings: S) => void;
  renderCard: (item: T, onCorrect: () => void, onIncorrect: () => void) => ReactNode;
  renderSettingsPanel: () => ReactNode;
  getItemId: (item: T) => string | number;  // Function to extract the unique identifier from an item
  filterItems?: (items: T[], incorrectIds: (string | number)[]) => T[];  // Custom filter function
}

export default function BaseDeck<T extends BaseFlashcardData, S extends BaseFlashcardSettings>({
  id,
  items,
  isLoading,
  error,
  settings,
  setSettings,
  renderCard,
  renderSettingsPanel,
  getItemId,
  filterItems,
}: BaseDeckProps<T, S>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // Add a key to force re-render when switching cards
  const [shownIndices, setShownIndices] = useState<number[]>([]); // Track shown indices for randomization
  
  const [progress, setProgress] = useLocalStorage<BaseFlashcardProgress<string | number>>(`${id}_progress`, {
    seen: [],
    correct: [],
    incorrect: [],
  });
  
  // Reset shown indices when page loads
  useEffect(() => {
    setShownIndices([]);
  }, []);

  // Filter items based on settings
  const filteredItems = useMemo(() => {
    if (settings.showIncorrectOnly && progress && progress.incorrect && Array.isArray(progress.incorrect)) {
      // Use custom filter function if provided
      if (filterItems) {
        return filterItems(items, progress.incorrect);
      }
      // Default filter: show only items in the incorrect list
      return items.filter(item => progress.incorrect.includes(getItemId(item)));
    }
    return items;
  }, [items, progress, settings.showIncorrectOnly, filterItems, getItemId]);
  
  // Handle card selection when any relevant property changes
  useEffect(() => {
    // Set card index when data is loaded or settings change
    if (!isLoading && filteredItems.length > 0) {
      if (settings.randomOrder) {
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        setCurrentIndex(randomIndex);
      } else {
        setCurrentIndex(0);
      }
      // Force re-render of the flashcard component
      setKey(prevKey => prevKey + 1);
    }
  }, [isLoading, filteredItems.length, settings.randomOrder, settings.showIncorrectOnly]);

  const handleCorrect = () => {
    if (!filteredItems.length) return;

    const currentItemId = getItemId(filteredItems[currentIndex]);
    
    setProgress((prev) => {
      // Add to seen and correct lists if not already there
      const newSeen = prev.seen.includes(currentItemId) 
        ? prev.seen 
        : [...prev.seen, currentItemId];
      
      const newCorrect = prev.correct.includes(currentItemId)
        ? prev.correct
        : [...prev.correct, currentItemId];
        
      // Remove from incorrect list if it was there
      const newIncorrect = prev.incorrect.filter((id) => id !== currentItemId);
      
      return {
        seen: newSeen,
        correct: newCorrect,
        incorrect: newIncorrect,
      };
    });

    moveToNextCard();
  };

  const handleIncorrect = () => {
    if (!filteredItems.length) return;

    const currentItemId = getItemId(filteredItems[currentIndex]);
    
    setProgress((prev) => {
      // Add to seen and incorrect lists if not already there
      const newSeen = prev.seen.includes(currentItemId) 
        ? prev.seen 
        : [...prev.seen, currentItemId];
      
      const newIncorrect = prev.incorrect.includes(currentItemId)
        ? prev.incorrect
        : [...prev.incorrect, currentItemId];
      
      // Remove from correct list if it was there
      const newCorrect = prev.correct.filter(id => id !== currentItemId);
      
      return {
        seen: newSeen,
        correct: newCorrect,
        incorrect: newIncorrect,
      };
    });

    moveToNextCard();
  };

  // Helper function to get random index (different from current and not correctly answered)
  const getRandomIndex = () => {
    let randomIndex;
    let attempts = 0;
    const maxAttempts = filteredItems.length * 2; // Prevent infinite loop
    
    // If we've shown all cards, reset the shown indices
    if (shownIndices.length >= filteredItems.length - 1) {
      setShownIndices([currentIndex]);
    }
    
    do {
      randomIndex = Math.floor(Math.random() * filteredItems.length);
      attempts++;
      // Break the loop if we've tried too many times to prevent infinite loops
      if (attempts > maxAttempts) break;
      
    } while (
      filteredItems.length > 1 && 
      (randomIndex === currentIndex || 
       // Skip cards that have been correctly answered
       (progress.correct && progress.correct.includes(getItemId(filteredItems[randomIndex]))) ||
       // Don't show cards we've already shown in this session
       shownIndices.includes(randomIndex))
    );
    
    return randomIndex;
  };

  const moveToNextCard = () => {
    if (settings.randomOrder) {
      // Pick a random card, but not one we've already shown
      const newIndex = getRandomIndex();
      setCurrentIndex(newIndex);
      // Add the new index to our list of shown indices
      setShownIndices(prev => [...prev, newIndex]);
    } else {
      // Sequential mode
      if (currentIndex < filteredItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // If reached the end, start over
        setCurrentIndex(0);
      }
    }
    
    // Update the key to force a re-render of the flashcard component
    setKey(prevKey => prevKey + 1);
  };
  
  const handleResetProgress = () => {
    // Reset the progress data
    setProgress({
      seen: [],
      correct: [],
      incorrect: [],
    });
    
    // Reset shown indices
    setShownIndices([]);
    
    // Force refresh of the deck
    if (settings.randomOrder) {
      const randomIndex = Math.floor(Math.random() * filteredItems.length);
      setCurrentIndex(randomIndex);
    } else {
      setCurrentIndex(0);
    }
    
    setKey(prevKey => prevKey + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if all cards have been answered correctly (when not in showIncorrectOnly mode)
  const allCardsAnsweredCorrectly = 
    !settings.showIncorrectOnly && 
    items.length > 0 && 
    progress.correct.length === items.length;

  // Check if we're in showIncorrectOnly mode and there are no incorrect cards
  const noIncorrectCardsInIncorrectMode = 
    settings.showIncorrectOnly && 
    items.length > 0 && 
    !filteredItems.length;
    
  if (allCardsAnsweredCorrectly) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          {renderSettingsPanel()}
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-6 bg-green-100 dark:bg-green-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2">おめでとうございます！</h2>
            <p>すべてのカードに正解しました！学習を続けるには「学習状況をリセット」してください。</p>
          </div>
        </div>
      </div>
    );
  } else if (noIncorrectCardsInIncorrectMode) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          {renderSettingsPanel()}
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2">不正解のカードがありません</h2>
            <p>不正解のカードのみ表示モードですが、不正解のカードがありません。設定を変更してください。</p>
          </div>
        </div>
      </div>
    );
  } else if (error || !items.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 dark:bg-red-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
          <p>{error || 'データを取得できませんでした。'}</p>
        </div>
      </div>
    );
  }

  // Safely get current item
  const currentItem = filteredItems.length > 0 ? filteredItems[currentIndex] : undefined;
  const progressStats = {
    total: items.length,
    seen: Array.isArray(progress.seen) ? progress.seen.length : 0,
    correct: Array.isArray(progress.correct) ? progress.correct.length : 0,
    incorrect: Array.isArray(progress.incorrect) ? progress.incorrect.length : 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
        <div>
          <p className="text-sm font-medium">
            {currentIndex + 1} / {filteredItems.length}
          </p>
        </div>
        {renderSettingsPanel()}
      </div>

      {currentItem ? (
        <div>
          {renderCard(currentItem, handleCorrect, handleIncorrect)}
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={moveToNextCard}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              次のカード
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2">カードがありません</h2>
            <p>現在の設定に合うカードがありません。設定を変更してください。</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mx-4 sm:mx-0">
        <h2 className="font-bold mb-2">学習状況</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">学習済み</p>
            <p className="text-xl font-bold">{progressStats.seen}</p>
          </div>
          <div>
            <p className="text-sm text-green-500">正解</p>
            <p className="text-xl font-bold">{progressStats.correct}</p>
          </div>
          <div>
            <p className="text-sm text-red-500">不正解</p>
            <p className="text-xl font-bold">{progressStats.incorrect}</p>
          </div>
        </div>
      </div>
    </div>
  );
}