'use client';

import { useState } from 'react';
import { BaseFlashcardSettings } from '@/types/flashcard';

interface BaseSettingsPanelProps<T extends BaseFlashcardSettings> {
  settings: T;
  onSettingsChange: (settings: T) => void;
  onResetProgress: () => void;
  renderDirectionToggle?: () => React.ReactNode;
  renderAdditionalSettings?: () => React.ReactNode;
}

export default function BaseSettingsPanel<T extends BaseFlashcardSettings>({
  settings,
  onSettingsChange,
  onResetProgress,
  renderDirectionToggle,
  renderAdditionalSettings,
}: BaseSettingsPanelProps<T>) {
  const [showSettings, setShowSettings] = useState(false);

  const handleRandomOrderChange = () => {
    onSettingsChange({
      ...settings,
      randomOrder: !settings.randomOrder,
    });
  };

  const handleShowIncorrectOnlyChange = () => {
    onSettingsChange({
      ...settings,
      showIncorrectOnly: !settings.showIncorrectOnly,
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        設定
      </button>

      {showSettings && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-100 dark:bg-slate-800 shadow-lg rounded-md p-4 z-50 border border-slate-300 dark:border-slate-600">
          <h3 className="font-medium text-lg mb-3">設定</h3>

          {/* Direction toggle (if provided) */}
          {renderDirectionToggle && renderDirectionToggle()}

          {/* Additional settings (if provided) */}
          {renderAdditionalSettings && renderAdditionalSettings()}

          {/* Common settings */}
          <div className="mt-4">
            <label className="flex items-center cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={settings.randomOrder}
                onChange={handleRandomOrderChange}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">ランダム順に表示</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showIncorrectOnly}
                onChange={handleShowIncorrectOnlyChange}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">不正解のみ表示</span>
            </label>
          </div>

          <button
            onClick={onResetProgress}
            className="w-full py-2 mt-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
          >
            学習状況をリセット
          </button>

          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-2 mt-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm rounded"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
}
