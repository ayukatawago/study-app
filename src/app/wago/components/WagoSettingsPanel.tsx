'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { WagoSettings } from '@/types/flashcard';

interface WagoSettingsPanelProps {
  settings: WagoSettings;
  onSettingsChange: (settings: WagoSettings) => void;
  onResetProgress: () => void;
}

export default function WagoSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: WagoSettingsPanelProps) {
  // Render the direction toggle
  const renderDirectionToggle = () => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
          カードの方向
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="word-to-meaning"
              name="cardDirection"
              checked={settings.cardDirection === 'word-to-meaning'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'word-to-meaning',
                })
              }
              className="mr-2"
            />
            <label htmlFor="word-to-meaning" className="text-sm text-gray-700 dark:text-gray-300">
              和語 → 意味
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="meaning-to-word"
              name="cardDirection"
              checked={settings.cardDirection === 'meaning-to-word'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'meaning-to-word',
                })
              }
              className="mr-2"
            />
            <label htmlFor="meaning-to-word" className="text-sm text-gray-700 dark:text-gray-300">
              意味 → 和語
            </label>
          </div>
        </div>
      </div>
    );
  };

  // No additional settings needed since examples are always shown on back card
  const renderAdditionalSettings = () => {
    return null;
  };

  return (
    <BaseSettingsPanel
      settings={settings}
      onSettingsChange={onSettingsChange}
      onResetProgress={onResetProgress}
      renderDirectionToggle={renderDirectionToggle}
      renderAdditionalSettings={renderAdditionalSettings}
    />
  );
}
