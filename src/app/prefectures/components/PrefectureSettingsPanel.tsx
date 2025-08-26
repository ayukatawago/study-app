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
  return (
    <BaseSettingsPanel
      settings={settings}
      onSettingsChange={onSettingsChange}
      onResetProgress={onResetProgress}
    />
  );
}
