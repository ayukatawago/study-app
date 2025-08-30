'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { PrefectureSettings } from '@/types/flashcard';

interface PrefectureSettingsPanelProps {
  settings: PrefectureSettings;
  onSettingsChange: (settings: PrefectureSettings) => void;
  onResetProgress: () => void;
}

export default function PrefectureSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: PrefectureSettingsPanelProps) {
  const handleCategoryChange = (category: PrefectureSettings['category']) => {
    onSettingsChange({
      ...settings,
      category,
    });
  };

  // Render the category selection
  const renderCategorySelection = () => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
          カテゴリー
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="all"
              checked={settings.category === 'all'}
              onChange={() => handleCategoryChange('all')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">すべて</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="prefectures"
              checked={settings.category === 'prefectures'}
              onChange={() => handleCategoryChange('prefectures')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">都道府県のみ</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="ranking"
              checked={settings.category === 'ranking'}
              onChange={() => handleCategoryChange('ranking')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">ランキングのみ</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="cities"
              checked={settings.category === 'cities'}
              onChange={() => handleCategoryChange('cities')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">都市のみ</span>
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
      renderAdditionalSettings={renderCategorySelection}
    />
  );
}
