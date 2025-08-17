'use client';

import BaseSettingsPanel from './BaseSettingsPanel';
import { WorldCountrySettings } from '@/types/flashcard';

interface WorldCountrySettingsPanelProps {
  settings: WorldCountrySettings;
  onSettingsChange: (settings: WorldCountrySettings) => void;
  onResetProgress: () => void;
}

export default function WorldCountrySettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: WorldCountrySettingsPanelProps) {
  
  // No direction change needed anymore
  
  // Handle show capital toggle
  const handleShowCapitalChange = () => {
    onSettingsChange({
      ...settings,
      showCapital: !settings.showCapital,
    });
  };
  
  // No direction toggle needed for world countries
  
  // Render additional settings for world countries
  const renderAdditionalSettings = () => {
    return (
      <div>
        <label className="flex items-center cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={settings.showCapital}
            onChange={handleShowCapitalChange}
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            首都を表示
          </span>
        </label>
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