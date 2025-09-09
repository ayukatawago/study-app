'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { PoliticsSettings } from '@/hooks/usePolitics';

type PoliticsSettingsPanelProps = {
  settings: PoliticsSettings;
  onSettingsChange: (settings: PoliticsSettings) => void;
  onResetProgress: () => void;
};

export default function PoliticsSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: PoliticsSettingsPanelProps) {
  const renderAdditionalSettings = () => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          カテゴリー
        </label>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value="all"
              checked={settings.category === 'all'}
              onChange={e =>
                onSettingsChange({
                  ...settings,
                  category: e.target.value as 'all' | 'diet' | 'cabinet' | 'court',
                })
              }
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">すべて</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value="diet"
              checked={settings.category === 'diet'}
              onChange={e =>
                onSettingsChange({
                  ...settings,
                  category: e.target.value as 'all' | 'diet' | 'cabinet' | 'court',
                })
              }
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">国会</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value="cabinet"
              checked={settings.category === 'cabinet'}
              onChange={e =>
                onSettingsChange({
                  ...settings,
                  category: e.target.value as 'all' | 'diet' | 'cabinet' | 'court',
                })
              }
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">内閣</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value="court"
              checked={settings.category === 'court'}
              onChange={e =>
                onSettingsChange({
                  ...settings,
                  category: e.target.value as 'all' | 'diet' | 'cabinet' | 'court',
                })
              }
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">裁判所</span>
          </label>
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
