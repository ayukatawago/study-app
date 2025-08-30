'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { IdiomSettings } from '@/types/flashcard';

interface IdiomSettingsPanelProps {
  settings: IdiomSettings;
  onSettingsChange: (settings: IdiomSettings) => void;
  onResetProgress: () => void;
}

export default function IdiomSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: IdiomSettingsPanelProps) {
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
              id="idiom-to-meaning"
              name="cardDirection"
              checked={settings.cardDirection === 'idiom-to-meaning'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'idiom-to-meaning',
                })
              }
              className="mr-2"
            />
            <label htmlFor="idiom-to-meaning" className="text-sm text-gray-700 dark:text-gray-300">
              慣用句 → 意味
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="meaning-to-idiom"
              name="cardDirection"
              checked={settings.cardDirection === 'meaning-to-idiom'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'meaning-to-idiom',
                })
              }
              className="mr-2"
            />
            <label htmlFor="meaning-to-idiom" className="text-sm text-gray-700 dark:text-gray-300">
              意味 → 慣用句
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
