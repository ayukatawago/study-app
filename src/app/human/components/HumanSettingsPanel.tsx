'use client';

import BaseSettingsPanel from '@/components/flashcard/BaseSettingsPanel';
import { HumanQuizSettings } from '@/types/flashcard';

interface HumanSettingsPanelProps {
  settings: HumanQuizSettings;
  onSettingsChange: (settings: HumanQuizSettings) => void;
  onResetProgress: () => void;
}

export default function HumanSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: HumanSettingsPanelProps) {
  // No additional settings needed for human quiz
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
