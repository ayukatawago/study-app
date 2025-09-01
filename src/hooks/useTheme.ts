'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useIsDarkMode() {
  const { theme, resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const currentTheme = theme === 'system' ? resolvedTheme : theme;
      setIsDarkMode(currentTheme === 'dark');
    }
  }, [theme, resolvedTheme, mounted]);

  return mounted ? isDarkMode : false;
}
