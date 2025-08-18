'use client';

import AnimalFlashcard from './AnimalFlashcard';
import { useAnimalQuiz } from '@/hooks/useAnimalQuiz';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AnimalSettingsPanel from './AnimalSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { AnimalQuizData, AnimalQuizSettings } from '@/types/flashcard';

export default function AnimalFlashcardDeck() {
  const [settings, setSettings] = useLocalStorage<AnimalQuizSettings>('animal_quiz_settings', {
    randomOrder: true,
    showIncorrectOnly: false,
    category: 'all',
  });

  // Fetch animal quiz data based on selected category
  const { animalQuizData, isLoading, error } = useAnimalQuiz(settings.category);

  // Filter quiz data based on settings
  const filterItems = (items: AnimalQuizData[], incorrectIds: (string | number)[]) => {
    return items.filter(quiz => incorrectIds.includes(quiz.id));
  };

  // Render individual animal flashcard
  const renderCard = (quiz: AnimalQuizData, onCorrect: () => void, onIncorrect: () => void) => {
    return <AnimalFlashcard quiz={quiz} onCorrect={onCorrect} onIncorrect={onIncorrect} />;
  };

  // Render settings panel
  const renderSettingsPanel = (onResetProgress: () => void) => {
    return (
      <AnimalSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={onResetProgress}
      />
    );
  };

  // Extract the unique identifier from a quiz item
  const getItemId = (quiz: AnimalQuizData) => quiz.id;

  return (
    <BaseDeck
      id="animal_quiz"
      items={animalQuizData}
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
