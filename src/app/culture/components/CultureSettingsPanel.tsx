'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { CultureFlashcardSettings } from '@/types/flashcard';

type CultureSettingsPanelProps = {
  settings: CultureFlashcardSettings;
  onSettingsChange: (settings: CultureFlashcardSettings) => void;
  onResetProgress?: () => void;
};

export default function CultureSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress = () => {},
}: CultureSettingsPanelProps) {
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
              id="keyword-to-desc"
              name="cardDirection"
              checked={settings.cardDirection === 'keyword-to-desc'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'keyword-to-desc',
                })
              }
              className="mr-2"
            />
            <label htmlFor="keyword-to-desc" className="text-sm text-gray-700 dark:text-gray-300">
              キーワード → 説明
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="desc-to-keyword"
              name="cardDirection"
              checked={settings.cardDirection === 'desc-to-keyword'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'desc-to-keyword',
                })
              }
              className="mr-2"
            />
            <label htmlFor="desc-to-keyword" className="text-sm text-gray-700 dark:text-gray-300">
              説明 → キーワード
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseSettingsPanel
      settings={settings}
      onSettingsChange={onSettingsChange}
      onResetProgress={onResetProgress}
      renderDirectionToggle={renderDirectionToggle}
    />
  );
}
