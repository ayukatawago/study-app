'use client';

import { useMemo } from 'react';
import CultureFlashcard from './CultureFlashcard';
import { useCultureEvents } from '@/hooks/useCultureEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CultureSettingsPanel from './CultureSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { CultureEventData, CultureFlashcardSettings } from '@/types/flashcard';

export default function CultureFlashcardDeck() {
  const { cultureEvents, isLoading, error } = useCultureEvents();

  const [settings, setSettings] = useLocalStorage<CultureFlashcardSettings>(
    'culture_flashcard_settings',
    {
      cardDirection: 'keyword-to-desc',
      showMemorize: true,
      randomOrder: true,
      showIncorrectOnly: false,
      category: 'all',
    }
  );

  // Apply category filtering to all items
  const filteredByCategory = useMemo(() => {
    if (settings.category === 'all') {
      return cultureEvents;
    }
    return cultureEvents.filter(event => event.type === settings.category);
  }, [cultureEvents, settings.category]);

  // Filter culture events based on settings (only handle incorrect items filtering since category is handled above)
  const filterItems = (items: CultureEventData[], incorrectIds: (string | number)[]) => {
    return items.filter(event => incorrectIds.includes(event.id));
  };

  // Render individual culture flashcard
  const renderCard = (event: CultureEventData, onCorrect: () => void, onIncorrect: () => void) => {
    return (
      <CultureFlashcard
        event={event}
        direction={settings.cardDirection}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  };

  // Render settings panel
  const renderSettingsPanel = (onResetProgress: () => void) => {
    return (
      <CultureSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={onResetProgress}
      />
    );
  };

  // Extract the unique identifier from a culture event
  const getItemId = (event: CultureEventData) => event.id;

  return (
    <BaseDeck
      id="culture"
      items={filteredByCategory}
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
