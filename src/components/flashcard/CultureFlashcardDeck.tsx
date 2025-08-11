'use client';

import { useEffect, useState, useMemo } from 'react';
import CultureFlashcard, { CultureEvent } from './CultureFlashcard';
import { useCultureEvents } from '@/hooks/useCultureEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { removeFromStorage } from '@/utils/localStorage';
import CultureSettingsPanel from './CultureSettingsPanel';

export default function CultureFlashcardDeck() {
  const { cultureEvents, isLoading, error } = useCultureEvents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // Add a key to force re-render when switching cards
  const [shownIndices, setShownIndices] = useState<number[]>([]);
  
  const [settings, setSettings] = useLocalStorage('culture_flashcard_settings', {
    cardDirection: 'person-to-desc' as 'person-to-desc' | 'desc-to-person',
    showMemorize: true,
    randomOrder: true,
    showIncorrectOnly: false,
  });

  const [progress, setProgress] = useLocalStorage('culture_flashcard_progress', {
    seen: [] as string[],
    correct: [] as string[],
    incorrect: [] as string[],
  });
  
  // Reset shown indices when page loads
  useEffect(() => {
    setShownIndices([]);
  }, []);

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

  // Handle settings change and reset shown indices
  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    setShownIndices([]);
  };

  // Filter culture events based on settings
  const filteredEvents = useMemo(() => {
    if (settings.showIncorrectOnly && progress && progress.incorrect && Array.isArray(progress.incorrect)) {
      // Only show events that are in the incorrect list
      return cultureEvents.filter(event => progress.incorrect.includes(event.person));
    }
    return cultureEvents;
  }, [cultureEvents, progress, settings.showIncorrectOnly]);
  
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

    const currentEventId = filteredEvents[currentIndex].person;
    
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

    const currentEventId = filteredEvents[currentIndex].person;
    
    setProgress((prev) => {
      // Add to seen and incorrect lists if not already there
      const newSeen = prev.seen.includes(currentEventId) 
        ? prev.seen 
        : [...prev.seen, currentEventId];
      
      const newIncorrect = prev.incorrect.includes(currentEventId)
        ? prev.incorrect
        : [...prev.incorrect, currentEventId];
      
      // Remove from correct list if it was there
      const newCorrect = prev.correct.filter(id => id !== currentEventId);
      
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
    const maxAttempts = filteredEvents.length * 2; // Prevent infinite loop
    
    // If we've shown all cards, reset the shown indices
    if (shownIndices.length >= filteredEvents.length - 1) {
      setShownIndices([currentIndex]);
    }
    
    do {
      randomIndex = Math.floor(Math.random() * filteredEvents.length);
      attempts++;
      // Break the loop if we've tried too many times to prevent infinite loops
      if (attempts > maxAttempts) break;
      
    } while (
      filteredEvents.length > 1 && 
      (randomIndex === currentIndex || 
       // Skip cards that have been correctly answered
       (progress.correct && progress.correct.includes(filteredEvents[randomIndex]?.person)) ||
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
      seen: [] as string[],
      correct: [] as string[],
      incorrect: [] as string[],
    });
    
    // Reset shown indices
    setShownIndices([]);
    
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

  // Check if all cards have been answered correctly (when not in showIncorrectOnly mode)
  const allCardsAnsweredCorrectly = 
    !settings.showIncorrectOnly && 
    cultureEvents.length > 0 && 
    progress.correct.length === cultureEvents.length;

  // Check if we're in showIncorrectOnly mode and there are no incorrect cards
  const noIncorrectCardsInIncorrectMode = 
    settings.showIncorrectOnly && 
    cultureEvents.length > 0 && 
    !filteredEvents.length;
    
  if (allCardsAnsweredCorrectly) {
    return (
      <div>
        <div className="flex justify-end mb-6">
          <CultureSettingsPanel 
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onResetProgress={handleResetProgress}
          />
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
          <CultureSettingsPanel 
            settings={settings}
            onSettingsChange={handleSettingsChange}
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
  } else if (error || !cultureEvents.length) {
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
    total: cultureEvents.length,
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
        <CultureSettingsPanel 
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onResetProgress={handleResetProgress}
        />
      </div>

      {currentEvent ? (
        <CultureFlashcard
          key={key}
          event={currentEvent}
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