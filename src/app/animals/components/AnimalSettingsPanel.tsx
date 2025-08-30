'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { AnimalQuizSettings } from '@/types/flashcard';

interface AnimalSettingsPanelProps {
  settings: AnimalQuizSettings;
  onSettingsChange: (settings: AnimalQuizSettings) => void;
  onResetProgress: () => void;
}

export default function AnimalSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: AnimalSettingsPanelProps) {
  // Render category selection
  const renderAdditionalSettings = () => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
          カテゴリー
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="all"
              name="category"
              checked={settings.category === 'all'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  category: 'all',
                })
              }
              className="mr-2"
            />
            <label htmlFor="all" className="text-sm text-gray-700 dark:text-gray-300">
              全て
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="animal_1"
              name="category"
              checked={settings.category === 'animal_1'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  category: 'animal_1',
                })
              }
              className="mr-2"
            />
            <label htmlFor="animal_1" className="text-sm text-gray-700 dark:text-gray-300">
              セット1（メダカと生き物）
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="animal_2"
              name="category"
              checked={settings.category === 'animal_2'}
              onChange={() =>
                onSettingsChange({
                  ...settings,
                  category: 'animal_2',
                })
              }
              className="mr-2"
            />
            <label htmlFor="animal_2" className="text-sm text-gray-700 dark:text-gray-300">
              セット2（昆虫とその他）
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
      renderAdditionalSettings={renderAdditionalSettings}
    />
  );
}
