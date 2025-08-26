'use client';

import PrefectureFlashcard from './PrefectureFlashcard';
import { usePrefectures } from '@/hooks/usePrefectures';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import PrefectureSettingsPanel from './PrefectureSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { PrefectureData, PrefectureSettings } from '@/types/flashcard';

export default function PrefectureFlashcardDeck() {
  const { prefectureQuestions, isLoading, error } = usePrefectures();

  const [settings, setSettings] = useLocalStorage<PrefectureSettings>('prefecture_settings', {
    randomOrder: true,
    showIncorrectOnly: false,
  });

  // Filter prefecture questions based on settings
  const filterItems = (items: PrefectureData[], incorrectIds: (string | number)[]) => {
    return items.filter(question => incorrectIds.includes(question.id));
  };

  // Render individual prefecture flashcard
  const renderCard = (question: PrefectureData, onCorrect: () => void, onIncorrect: () => void) => {
    return (
      <PrefectureFlashcard question={question} onCorrect={onCorrect} onIncorrect={onIncorrect} />
    );
  };

  // Render settings panel
  const renderSettingsPanel = (onResetProgress: () => void) => {
    return (
      <PrefectureSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={onResetProgress}
      />
    );
  };

  // Extract the unique identifier from a prefecture question
  const getItemId = (question: PrefectureData) => question.id;

  return (
    <BaseDeck
      id="prefecture"
      items={prefectureQuestions}
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
