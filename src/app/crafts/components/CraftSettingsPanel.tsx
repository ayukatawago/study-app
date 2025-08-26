'use client';

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
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">設定</h3>

      {/* Random Order Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span>ランダム順序</span>
        <input
          type="checkbox"
          checked={settings.randomOrder}
          onChange={e =>
            onSettingsChange({
              ...settings,
              randomOrder: e.target.checked,
            })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      {/* Show Incorrect Only Toggle */}
      <div className="flex items-center justify-between mb-4">
        <span>不正解のみ表示</span>
        <input
          type="checkbox"
          checked={settings.showIncorrectOnly}
          onChange={e =>
            onSettingsChange({
              ...settings,
              showIncorrectOnly: e.target.checked,
            })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      {/* Reset Progress Button */}
      <button
        onClick={onResetProgress}
        className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
      >
        学習状況をリセット
      </button>
    </div>
  );
}
