'use client';

/* eslint-disable no-unused-vars */
import BaseSettingsPanel from './BaseSettingsPanel';
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
        <label className="block text-sm font-medium mb-2">カードの方向</label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="person-to-desc"
              name="cardDirection"
              checked={settings.cardDirection === 'person-to-desc'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'person-to-desc',
                })
              }
              className="mr-2"
            />
            <label htmlFor="person-to-desc" className="text-sm">
              人物 → 説明
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="desc-to-person"
              name="cardDirection"
              checked={settings.cardDirection === 'desc-to-person'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'desc-to-person',
                })
              }
              className="mr-2"
            />
            <label htmlFor="desc-to-person" className="text-sm">
              説明 → 人物
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
