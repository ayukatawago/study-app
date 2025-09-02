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
  // Render additional settings
  const renderAdditionalSettings = () => {
    return (
      <>
        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            カテゴリ
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="category-all"
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
              <label htmlFor="category-all" className="text-sm text-gray-700 dark:text-gray-300">
                すべて
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="category-culture"
                name="category"
                checked={settings.category === 'culture'}
                onChange={() =>
                  onSettingsChange({
                    ...settings,
                    category: 'culture',
                  })
                }
                className="mr-2"
              />
              <label
                htmlFor="category-culture"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                文化のみ
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="category-figures"
                name="category"
                checked={settings.category === 'figures'}
                onChange={() =>
                  onSettingsChange({
                    ...settings,
                    category: 'figures',
                  })
                }
                className="mr-2"
              />
              <label
                htmlFor="category-figures"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                人物のみ
              </label>
            </div>
          </div>
        </div>

        {/* Card Direction */}
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
      </>
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
