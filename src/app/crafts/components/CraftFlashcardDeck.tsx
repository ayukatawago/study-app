'use client';

import CraftFlashcard from './CraftFlashcard';
import { useCrafts } from '@/hooks/useCrafts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CraftSettingsPanel from './CraftSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { CraftData, CraftSettings } from '@/types/flashcard';

export default function CraftFlashcardDeck() {
  const { craftQuestions, isLoading, error } = useCrafts();

  const [settings, setSettings] = useLocalStorage<CraftSettings>('craft_settings', {
    randomOrder: true,
    showIncorrectOnly: false,
    cardDirection: 'prefecture-to-craft',
  });

  // Filter craft questions based on settings
  const filterItems = (items: CraftData[], incorrectIds: (string | number)[]) => {
    return items.filter(question => incorrectIds.includes(question.id));
  };

  // Render individual craft flashcard
  const renderCard = (question: CraftData, onCorrect: () => void, onIncorrect: () => void) => {
    return (
      <CraftFlashcard
        question={question}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
        settings={settings}
      />
    );
  };

  // Render settings panel
  const renderSettingsPanel = (onResetProgress: () => void) => {
    return (
      <CraftSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={onResetProgress}
      />
    );
  };

  // Extract the unique identifier from a craft question
  const getItemId = (question: CraftData) => question.id;

  return (
    <BaseDeck
      id="craft"
      items={craftQuestions}
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
