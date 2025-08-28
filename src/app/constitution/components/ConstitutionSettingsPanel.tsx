'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';

interface ConstitutionSettings {
  randomOrder: boolean;
  showIncorrectOnly: boolean;
}

interface ConstitutionSettingsPanelProps {
  settings: ConstitutionSettings;
  onSettingsChange: (settings: ConstitutionSettings) => void;
  onResetProgress: () => void;
}

export default function ConstitutionSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: ConstitutionSettingsPanelProps) {
  // No additional settings needed for constitution
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
