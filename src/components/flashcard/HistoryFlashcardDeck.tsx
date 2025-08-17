'use client';

import HistoryFlashcard from './HistoryFlashcard';
import { useHistoryEvents } from '@/hooks/useHistoryEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import SettingsPanel from './SettingsPanel';
import BaseDeck from './BaseDeck';
import { HistoryEventData, HistoryFlashcardSettings } from '@/types/flashcard';

export default function HistoryFlashcardDeck() {
  const { historyEvents, isLoading, error } = useHistoryEvents();

  const [settings, setSettings] = useLocalStorage<HistoryFlashcardSettings>('flashcard_settings', {
    cardDirection: 'year-to-event',
    showMemorize: true,
    randomOrder: true,
    showIncorrectOnly: false,
  });

  // Filter history events based on settings
  const filterItems = (items: HistoryEventData[], incorrectIds: (string | number)[]) => {
    return items.filter(event => incorrectIds.includes(event.year));
  };

  // Render individual history flashcard
  const renderCard = (event: HistoryEventData, onCorrect: () => void, onIncorrect: () => void) => {
    return (
      <HistoryFlashcard
        event={event}
        showMemorize={settings.showMemorize}
        direction={settings.cardDirection}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  };

  // Render settings panel
  const renderSettingsPanel = () => {
    return (
      <SettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={() => {}} // This will be handled by BaseDeck
      />
    );
  };

  // Extract the unique identifier from a history event
  const getItemId = (event: HistoryEventData) => event.year;

  return (
    <BaseDeck
      id="history"
      items={historyEvents}
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
