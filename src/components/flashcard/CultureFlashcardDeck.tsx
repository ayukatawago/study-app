'use client';

import { useEffect } from 'react';
import CultureFlashcard from './CultureFlashcard';
import { useCultureEvents } from '@/hooks/useCultureEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CultureSettingsPanel from './CultureSettingsPanel';
import BaseDeck from './BaseDeck';
import { CultureEventData, CultureFlashcardSettings } from '@/types/flashcard';

export default function CultureFlashcardDeck() {
  const { cultureEvents, isLoading, error } = useCultureEvents();
  
  const [settings, setSettings] = useLocalStorage<CultureFlashcardSettings>('culture_flashcard_settings', {
    cardDirection: 'person-to-desc',
    showMemorize: true,
    randomOrder: true,
    showIncorrectOnly: false,
  });

  // Filter culture events based on settings
  const filterItems = (items: CultureEventData[], incorrectIds: (string | number)[]) => {
    return items.filter(event => incorrectIds.includes(event.person));
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
  const renderSettingsPanel = () => {
    return (
      <CultureSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={() => {}}  // This will be handled by BaseDeck
      />
    );
  };

  // Extract the unique identifier from a culture event
  const getItemId = (event: CultureEventData) => event.person;

  return (
    <BaseDeck
      id="culture"
      items={cultureEvents}
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