'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { CraftSettings } from '@/types/flashcard';

interface CraftSettingsPanelProps {
  settings: CraftSettings;
  onSettingsChange: (settings: CraftSettings) => void;
  onResetProgress: () => void;
}

export default function CraftSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: CraftSettingsPanelProps) {
  // Render the direction toggle
  const renderDirectionToggle = () => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">カードの方向</label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="prefecture-to-craft"
              name="cardDirection"
              checked={settings.cardDirection === 'prefecture-to-craft'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'prefecture-to-craft',
                })
              }
              className="mr-2"
            />
            <label htmlFor="prefecture-to-craft" className="text-sm">
              都道府県 → 工芸品
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="craft-to-prefecture"
              name="cardDirection"
              checked={settings.cardDirection === 'craft-to-prefecture'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'craft-to-prefecture',
                })
              }
              className="mr-2"
            />
            <label htmlFor="craft-to-prefecture" className="text-sm">
              工芸品 → 都道府県
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
