'use client';

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
  return (
    <div className="space-y-4">
      {/* Random Order Toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor="randomOrder" className="text-sm font-medium text-gray-700">
          ランダム順序
        </label>
        <input
          type="checkbox"
          id="randomOrder"
          checked={settings.randomOrder}
          onChange={e => onSettingsChange({ ...settings, randomOrder: e.target.checked })}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </div>

      {/* Show Incorrect Only Toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor="showIncorrectOnly" className="text-sm font-medium text-gray-700">
          間違えた問題のみ表示
        </label>
        <input
          type="checkbox"
          id="showIncorrectOnly"
          checked={settings.showIncorrectOnly}
          onChange={e => onSettingsChange({ ...settings, showIncorrectOnly: e.target.checked })}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </div>

      {/* Reset Progress Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onResetProgress}
          className="w-full py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
        >
          進捗をリセット
        </button>
      </div>
    </div>
  );
}
