'use client';

import { useEffect, useState } from 'react';
import Flashcard, { HistoryEvent } from './Flashcard';
import { useHistoryEvents } from '@/hooks/useHistoryEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import SettingsPanel from './SettingsPanel';

export default function FlashcardDeck() {
  const { historyEvents, isLoading, error } = useHistoryEvents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // Add a key to force re-render when switching cards
  const [settings, setSettings] = useLocalStorage('flashcard_settings', {
    cardDirection: 'year-to-event' as 'year-to-event' | 'event-to-year',
    showMemorize: true,
    randomOrder: true,
  });

  // Set initial random card when history events are loaded
  useEffect(() => {
    if (!isLoading && historyEvents.length > 0 && settings.randomOrder) {
      const randomIndex = Math.floor(Math.random() * historyEvents.length);
      setCurrentIndex(randomIndex);
    }
  }, [historyEvents, isLoading, settings.randomOrder]);

  const [progress, setProgress] = useLocalStorage('flashcard_progress', {
    seen: [] as number[],
    correct: [] as number[],
    incorrect: [] as number[],
  });

  const handleCorrect = () => {
    if (!historyEvents.length) return;

    const currentEventId = historyEvents[currentIndex].id;
    
    setProgress((prev) => {
      // Add to seen and correct lists if not already there
      const newSeen = prev.seen.includes(currentEventId) 
        ? prev.seen 
        : [...prev.seen, currentEventId];
      
      const newCorrect = prev.correct.includes(currentEventId)
        ? prev.correct
        : [...prev.correct, currentEventId];
        
      // Remove from incorrect list if it was there
      const newIncorrect = prev.incorrect.filter((id) => id !== currentEventId);
      
      return {
        seen: newSeen,
        correct: newCorrect,
        incorrect: newIncorrect,
      };
    });

    moveToNextCard();
  };

  const handleIncorrect = () => {
    if (!historyEvents.length) return;

    const currentEventId = historyEvents[currentIndex].id;
    
    setProgress((prev) => {
      // Add to seen and incorrect lists if not already there
      const newSeen = prev.seen.includes(currentEventId) 
        ? prev.seen 
        : [...prev.seen, currentEventId];
      
      const newIncorrect = prev.incorrect.includes(currentEventId)
        ? prev.incorrect
        : [...prev.incorrect, currentEventId];
      
      return {
        ...prev,
        seen: newSeen,
        incorrect: newIncorrect,
      };
    });

    moveToNextCard();
  };

  // Helper function to get random index (different from current)
  const getRandomIndex = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * historyEvents.length);
    } while (historyEvents.length > 1 && randomIndex === currentIndex);
    return randomIndex;
  };

  const moveToNextCard = () => {
    if (settings.randomOrder) {
      // Pick a random card, but not the current one
      setCurrentIndex(getRandomIndex());
    } else {
      // Sequential mode
      if (currentIndex < historyEvents.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // If reached the end, start over
        setCurrentIndex(0);
      }
    }
    
    // Update the key to force a re-render of the flashcard component
    setKey(prevKey => prevKey + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !historyEvents.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 dark:bg-red-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
          <p>{error || 'データを取得できませんでした。'}</p>
        </div>
      </div>
    );
  }

  const currentEvent = historyEvents[currentIndex];
  const progressStats = {
    total: historyEvents.length,
    seen: progress.seen.length,
    correct: progress.correct.length,
    incorrect: progress.incorrect.length,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-medium">
            {currentIndex + 1} / {historyEvents.length}
          </p>
        </div>
        <SettingsPanel 
          settings={settings}
          onSettingsChange={setSettings}
        />
      </div>

      <Flashcard
        key={key}
        event={currentEvent}
        showMemorize={settings.showMemorize}
        direction={settings.cardDirection}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
      />

      <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h2 className="font-bold mb-2">学習状況</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
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