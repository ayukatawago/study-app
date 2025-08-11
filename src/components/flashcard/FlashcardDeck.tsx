'use client';

import { useEffect, useState, useMemo } from 'react';
import Flashcard, { HistoryEvent } from './Flashcard';
import { useHistoryEvents } from '@/hooks/useHistoryEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { removeFromStorage } from '@/utils/localStorage';
import SettingsPanel from './SettingsPanel';

export default function FlashcardDeck() {
  const { historyEvents, isLoading, error } = useHistoryEvents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // Add a key to force re-render when switching cards
  const [settings, setSettings] = useLocalStorage('flashcard_settings', {
    cardDirection: 'year-to-event' as 'year-to-event' | 'event-to-year',
    showMemorize: true,
    randomOrder: true,
    showIncorrectOnly: false,
  });

  const [progress, setProgress] = useLocalStorage('flashcard_progress', {
    seen: [] as number[],
    correct: [] as number[],
    incorrect: [] as number[],
  });
  
  // Ensure all settings and progress have default values
  useEffect(() => {
    if (settings && typeof settings.showIncorrectOnly === 'undefined') {
      setSettings({
        ...settings,
        showIncorrectOnly: false
      });
    }
    
    // Ensure progress has all required properties
    if (progress) {
      const updatedProgress = { ...progress };
      let needsUpdate = false;
      
      if (!Array.isArray(updatedProgress.seen)) {
        updatedProgress.seen = [];
        needsUpdate = true;
      }
      
      if (!Array.isArray(updatedProgress.correct)) {
        updatedProgress.correct = [];
        needsUpdate = true;
      }
      
      if (!Array.isArray(updatedProgress.incorrect)) {
        updatedProgress.incorrect = [];
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        setProgress(updatedProgress);
      }
    }
  }, [settings, setSettings, progress, setProgress]);

  // Filter history events based on settings
  const filteredEvents = useMemo(() => {
    if (settings.showIncorrectOnly && progress && progress.incorrect && Array.isArray(progress.incorrect)) {
      // Only show events that are in the incorrect list
      return historyEvents.filter(event => progress.incorrect.includes(event.year));
    }
    return historyEvents;
  }, [historyEvents, progress, settings.showIncorrectOnly]);
  
  // Handle card selection when any relevant property changes
  useEffect(() => {
    // Set card index when data is loaded or settings change
    if (!isLoading && filteredEvents.length > 0) {
      if (settings.randomOrder) {
        const randomIndex = Math.floor(Math.random() * filteredEvents.length);
        setCurrentIndex(randomIndex);
      } else {
        setCurrentIndex(0);
      }
      // Force re-render of the flashcard component
      setKey(prevKey => prevKey + 1);
    }
  }, [isLoading, filteredEvents.length, settings.randomOrder, settings.showIncorrectOnly]);

  const handleCorrect = () => {
    if (!filteredEvents.length) return;

    const currentEventId = filteredEvents[currentIndex].year;
    
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
    if (!filteredEvents.length) return;

    const currentEventId = filteredEvents[currentIndex].year;
    
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

  // Helper function to get random index (different from current and not correctly answered)
  const getRandomIndex = () => {
    let randomIndex;
    let attempts = 0;
    const maxAttempts = filteredEvents.length * 2; // Prevent infinite loop
    
    do {
      randomIndex = Math.floor(Math.random() * filteredEvents.length);
      attempts++;
      // Break the loop if we've tried too many times to prevent infinite loops
      if (attempts > maxAttempts) break;
      
    } while (
      filteredEvents.length > 1 && 
      (randomIndex === currentIndex || 
       // Skip cards that have been correctly answered
       (progress.correct && progress.correct.includes(filteredEvents[randomIndex]?.year)))
    );
    
    return randomIndex;
  };

  const moveToNextCard = () => {
    if (settings.randomOrder) {
      // Pick a random card, but not the current one
      setCurrentIndex(getRandomIndex());
    } else {
      // Sequential mode
      if (currentIndex < filteredEvents.length - 1) {
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
      seen: [] as number[],
      correct: [] as number[],
      incorrect: [] as number[],
    });
    
    // Force refresh of the deck
    if (settings.randomOrder) {
      const randomIndex = Math.floor(Math.random() * filteredEvents.length);
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

  if (!filteredEvents.length && historyEvents.length > 0 && settings.showIncorrectOnly) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
            onResetProgress={handleResetProgress}
          />
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2">不正解のカードがありません</h2>
            <p>不正解のカードのみ表示モードですが、不正解のカードがありません。設定を変更してください。</p>
          </div>
        </div>
      </div>
    );
  } else if (error || !historyEvents.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 dark:bg-red-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
          <p>{error || 'データを取得できませんでした。'}</p>
        </div>
      </div>
    );
  }

  // Safely get current event, it could be undefined if filtered events are empty
  const currentEvent = filteredEvents.length > 0 ? filteredEvents[currentIndex] : undefined;
  const progressStats = {
    total: historyEvents.length,
    seen: Array.isArray(progress.seen) ? progress.seen.length : 0,
    correct: Array.isArray(progress.correct) ? progress.correct.length : 0,
    incorrect: Array.isArray(progress.incorrect) ? progress.incorrect.length : 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
        <div>
          <p className="text-sm font-medium">
            {currentIndex + 1} / {filteredEvents.length}
          </p>
        </div>
        <SettingsPanel 
          settings={settings}
          onSettingsChange={setSettings}
          onResetProgress={handleResetProgress}
        />
      </div>

      {currentEvent ? (
        <Flashcard
          key={key}
          event={currentEvent}
          showMemorize={settings.showMemorize}
          direction={settings.cardDirection}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
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