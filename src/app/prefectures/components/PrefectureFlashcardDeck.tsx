'use client';

import PrefectureFlashcard from './PrefectureFlashcard';
import { usePrefectures } from '@/hooks/usePrefectures';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import PrefectureSettingsPanel from './PrefectureSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { PrefectureQuestionData, PrefectureSettings } from '@/types/flashcard';

export default function PrefectureFlashcardDeck() {
  const { prefectureQuestions, isLoading, error } = usePrefectures();

  const [settings, setSettings] = useLocalStorage<PrefectureSettings>('prefecture_settings', {
    randomOrder: true,
    showIncorrectOnly: false,
  });

  // Filter prefecture questions based on settings
  const filterItems = (
    items: (PrefectureQuestionData & { prefecture: string })[],
    incorrectIds: (string | number)[]
  ) => {
    return items.filter(question => incorrectIds.includes(question.id));
  };

  // Render individual prefecture flashcard
  const renderCard = (
    question: PrefectureQuestionData & { prefecture: string },
    onCorrect: () => void,
    onIncorrect: () => void
  ) => {
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
  const getItemId = (question: PrefectureQuestionData & { prefecture: string }) => question.id;

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
