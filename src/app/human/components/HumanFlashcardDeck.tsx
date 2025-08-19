'use client';

import HumanFlashcard from './HumanFlashcard';
import { useHumanQuiz } from '@/hooks/useHumanQuiz';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import HumanSettingsPanel from './HumanSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { HumanQuizData, HumanQuizSettings } from '@/types/flashcard';

export default function HumanFlashcardDeck() {
  const [settings, setSettings] = useLocalStorage<HumanQuizSettings>('human_quiz_settings', {
    randomOrder: true,
    showIncorrectOnly: false,
  });

  // Fetch human quiz data
  const { humanQuizData, isLoading, error } = useHumanQuiz();

  // Filter quiz data based on settings
  const filterItems = (items: HumanQuizData[], incorrectIds: (string | number)[]) => {
    return items.filter(quiz => incorrectIds.includes(quiz.id));
  };

  // Render individual human flashcard
  const renderCard = (quiz: HumanQuizData, onCorrect: () => void, onIncorrect: () => void) => {
    return <HumanFlashcard quiz={quiz} onCorrect={onCorrect} onIncorrect={onIncorrect} />;
  };

  // Render settings panel
  const renderSettingsPanel = (onResetProgress: () => void) => {
    return (
      <HumanSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={onResetProgress}
      />
    );
  };

  // Extract the unique identifier from a quiz item
  const getItemId = (quiz: HumanQuizData) => quiz.id;

  return (
    <BaseDeck
      id="human_quiz"
      items={humanQuizData}
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
