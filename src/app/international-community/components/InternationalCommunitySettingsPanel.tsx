'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';

interface InternationalCommunitySettings {
  randomOrder: boolean;
  showIncorrectOnly: boolean;
  selectedCategory: 'all' | 'general' | 'agencies' | 'human_rights' | 'global_environment';
}

interface InternationalCommunitySettingsPanelProps {
  settings: InternationalCommunitySettings;
  onSettingsChange: (settings: InternationalCommunitySettings) => void;
  onResetProgress: () => void;
}

export default function InternationalCommunitySettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: InternationalCommunitySettingsPanelProps) {
  const handleCategoryChange = (category: InternationalCommunitySettings['selectedCategory']) => {
    onSettingsChange({
      ...settings,
      selectedCategory: category,
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
              checked={settings.selectedCategory === 'all'}
              onChange={() => handleCategoryChange('all')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">すべて</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="general"
              checked={settings.selectedCategory === 'general'}
              onChange={() => handleCategoryChange('general')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">基本情報</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="agencies"
              checked={settings.selectedCategory === 'agencies'}
              onChange={() => handleCategoryChange('agencies')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">機関・組織</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="human_rights"
              checked={settings.selectedCategory === 'human_rights'}
              onChange={() => handleCategoryChange('human_rights')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">人権条約</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="global_environment"
              checked={settings.selectedCategory === 'global_environment'}
              onChange={() => handleCategoryChange('global_environment')}
              className="mr-2"
            />
            <span className="text-gray-700 dark:text-gray-300">地球環境</span>
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
