'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
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

  // No capital toggle needed anymore

  // No direction toggle needed for world countries

  // No additional settings needed for world countries
  const renderAdditionalSettings = () => {
    return null;
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
