'use client';

import { useState, useEffect } from 'react';
import IdiomFlashcard from './IdiomFlashcard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import IdiomSettingsPanel from './IdiomSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { IdiomData, IdiomSettings } from '@/types/flashcard';

export default function IdiomFlashcardDeck() {
  const [settings, setSettings] = useLocalStorage<IdiomSettings>('idiom_settings', {
    cardDirection: 'idiom-to-meaning',
    randomOrder: true,
    showIncorrectOnly: false,
  });

  const [idiomData, setIdiomData] = useState<IdiomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch idiom data
  useEffect(() => {
    const fetchIdiomData = async () => {
      try {
        const response = await fetch('/data/japanese/idioms.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch idiom data: ${response.status}`);
        }
        const data = await response.json();
        setIdiomData(data.idioms);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load idiom data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdiomData();
  }, []);

  // Filter idiom data based on settings
  const filterItems = (items: IdiomData[], incorrectIds: (string | number)[]) => {
    return items.filter(idiom => incorrectIds.includes(idiom.id));
  };

  // Render individual idiom flashcard
  const renderCard = (idiom: IdiomData, onCorrect: () => void, onIncorrect: () => void) => {
    return (
      <IdiomFlashcard
        idiom={idiom}
        settings={settings}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  };

  // Render settings panel
  const renderSettingsPanel = (onResetProgress: () => void) => {
    return (
      <IdiomSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={onResetProgress}
      />
    );
  };

  // Extract the unique identifier from an idiom item
  const getItemId = (idiom: IdiomData) => idiom.id;

  return (
    <BaseDeck
      id="idiom"
      items={idiomData}
      isLoading={isLoading}
      error={error}
      settings={settings}
      setSettings={setSettings}
      renderCard={renderCard}
      renderSettingsPanel={renderSettingsPanel}
      getItemId={getItemId}
      filterItems={filterItems}
    />
  );
}
