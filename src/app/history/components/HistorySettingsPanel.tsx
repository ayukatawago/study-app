'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { HistoryFlashcardSettings } from '@/types/flashcard';

interface HistorySettingsPanelProps {
  settings: HistoryFlashcardSettings;
  onSettingsChange: (settings: HistoryFlashcardSettings) => void;
  onResetProgress?: () => void;
}

export default function HistorySettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress = () => {},
}: HistorySettingsPanelProps) {
  // Render the direction toggle
  const renderDirectionToggle = () => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">カードの方向</label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="year-to-event"
              name="cardDirection"
              checked={settings.cardDirection === 'year-to-event'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'year-to-event',
                })
              }
              className="mr-2"
            />
            <label htmlFor="year-to-event" className="text-sm">
              年号 → 出来事
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="event-to-year"
              name="cardDirection"
              checked={settings.cardDirection === 'event-to-year'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  cardDirection: 'event-to-year',
                })
              }
              className="mr-2"
            />
            <label htmlFor="event-to-year" className="text-sm">
              出来事 → 年号
            </label>
          </div>
        </div>
      </div>
    );
  };

  // Render additional settings
  const renderAdditionalSettings = () => {
    return (
      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.showMemorize}
            onChange={e =>
              onSettingsChange({
                ...settings,
                showMemorize: e.target.checked,
              })
            }
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-300">覚え方を表示する</span>
        </label>
      </div>
    );
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
