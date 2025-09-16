'use client';

import { useState, useEffect } from 'react';
import WagoFlashcard from './WagoFlashcard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import WagoSettingsPanel from './WagoSettingsPanel';
import BaseDeck from '@/components/flashcard/BaseDeck';
import { WagoData, WagoSettings } from '@/types/flashcard';

export default function WagoFlashcardDeck() {
  const [settings, setSettings] = useLocalStorage<WagoSettings>('wago_settings', {
    cardDirection: 'word-to-meaning',
    randomOrder: true,
    showIncorrectOnly: false,
  });

  const [wagoData, setWagoData] = useState<WagoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wago data
  useEffect(() => {
    const fetchWagoData = async () => {
      try {
        const response = await fetch('/data/japanese/wago.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch wago data: ${response.status}`);
        }
        const data = await response.json();
        setWagoData(data.wago);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wago data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWagoData();
  }, []);

  // Filter wago data based on settings
  const filterItems = (items: WagoData[], incorrectIds: (string | number)[]) => {
    return items.filter(wago => incorrectIds.includes(wago.id));
  };

  // Render individual wago flashcard
  const renderCard = (wago: WagoData, onCorrect: () => void, onIncorrect: () => void) => {
    return (
      <WagoFlashcard
        wago={wago}
        settings={settings}
        onCorrect={onCorrect}
        onIncorrect={onIncorrect}
      />
    );
  };

  // Render settings panel
  const renderSettingsPanel = (onResetProgress: () => void) => {
    return (
      <WagoSettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onResetProgress={onResetProgress}
      />
    );
  };

  // Extract the unique identifier from a wago item
  const getItemId = (wago: WagoData) => wago.id;

  return (
    <BaseDeck
      id="wago"
      items={wagoData}
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
