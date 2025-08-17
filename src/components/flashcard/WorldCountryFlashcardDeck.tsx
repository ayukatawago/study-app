'use client';

import { useEffect } from 'react';
import WorldCountryFlashcard from './WorldCountryFlashcard';
import { useWorldCountries } from '@/hooks/useWorldCountries';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import WorldCountrySettingsPanel from './WorldCountrySettingsPanel';
import BaseDeck from './BaseDeck';
import { WorldCountryData, WorldCountrySettings } from '@/types/flashcard';

export default function WorldCountryFlashcardDeck() {
  const { worldCountries, isLoading, error } = useWorldCountries();
  
  const [settings, setSettings] = useLocalStorage<WorldCountrySettings>('world_country_settings', {
    showCapital: true,
    randomOrder: true,
    showIncorrectOnly: false,
  });

  // Filter world countries based on settings
  const filterItems = (items: WorldCountryData[], incorrectIds: (string | number)[]) => {
    return items.filter(country => incorrectIds.includes(country.countryCode));
  };

  // Render individual world country flashcard
  const renderCard = (country: WorldCountryData, onCorrect: () => void, onIncorrect: () => void) => {
    return (
      <WorldCountryFlashcard
        event={country}
        showCapital={settings.showCapital}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  };

  // Render settings panel
  const renderSettingsPanel = () => {
    return (
      <WorldCountrySettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={() => {}}  // This will be handled by BaseDeck
      />
    );
  };

  // Extract the unique identifier from a world country
  const getItemId = (country: WorldCountryData) => country.countryCode;

  return (
    <BaseDeck
      id="world_country"
      items={worldCountries}
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