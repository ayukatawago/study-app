'use client';

import { useState } from 'react';

type Settings = {
  cardDirection: 'year-to-event' | 'event-to-year';
  showMemorize: boolean;
  randomOrder: boolean;
  showIncorrectOnly: boolean;
};

type SettingsPanelProps = {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onResetProgress?: () => void;
};

export default function SettingsPanel({ 
  settings, 
  onSettingsChange,
  onResetProgress
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleDirectionChange = (direction: 'year-to-event' | 'event-to-year') => {
    onSettingsChange({
      ...settings,
      cardDirection: direction,
    });
  };

  const handleShowMemorizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      showMemorize: event.target.checked,
    });
  };

  const handleRandomOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      randomOrder: event.target.checked,
    });
  };

  const handleShowIncorrectOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Get the new value
    const showIncorrectOnly = event.target.checked;
    
    // Update the settings with the new showIncorrectOnly value
    onSettingsChange({
      ...settings,
      showIncorrectOnly,
    });
    
    // Close the panel after changing this setting to show the refreshed cards immediately
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={togglePanel}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="設定"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
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
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 p-4">
          <h3 className="font-medium mb-4 border-b pb-2">設定</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">カードの方向</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="year-to-event"
                    name="cardDirection"
                    checked={settings.cardDirection === 'year-to-event'}
                    onChange={() => handleDirectionChange('year-to-event')}
                    className="mr-2"
                  />
                  <label htmlFor="year-to-event" className="text-sm">
                    年号 → 出来事
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="event-to-year"
                    name="cardDirection"
                    checked={settings.cardDirection === 'event-to-year'}
                    onChange={() => handleDirectionChange('event-to-year')}
                    className="mr-2"
                  />
                  <label htmlFor="event-to-year" className="text-sm">
                    出来事 → 年号
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-memorize"
                  checked={settings.showMemorize}
                  onChange={handleShowMemorizeChange}
                  className="mr-2"
                />
                <label htmlFor="show-memorize" className="text-sm">
                  覚え方を表示する
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="random-order"
                  checked={settings.randomOrder}
                  onChange={handleRandomOrderChange}
                  className="mr-2"
                />
                <label htmlFor="random-order" className="text-sm">
                  カードをランダム表示
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-incorrect-only"
                  checked={settings.showIncorrectOnly === true}
                  onChange={handleShowIncorrectOnlyChange}
                  className="mr-2"
                />
                <label htmlFor="show-incorrect-only" className="text-sm">
                  不正解のカードのみ表示
                </label>
              </div>
            </div>
          </div>
          
          {onResetProgress && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => {
                  if (window.confirm('学習状況をリセットします。よろしいですか？')) {
                    onResetProgress();
                    setIsOpen(false);
                  }
                }}
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
              >
                学習状況をリセット
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}