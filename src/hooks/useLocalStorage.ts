'use client';

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { getFromStorage, setToStorage } from '@/utils/localStorage';
import { createLogger } from '@/utils/logger';

// Create logger for debugging localStorage issues
const _logger = createLogger({ prefix: 'useLocalStorage' });

type SetValue<T> = Dispatch<SetStateAction<T>>;

/**
 * Custom hook that works like useState but persists the value in localStorage
 *
 * @param key - localStorage key
 * @param initialValue - Initial value if not found in localStorage
 * @returns [storedValue, setValue] - Just like useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Only after mount, get from localStorage (server-side rendering safe)
  // Use a ref to track if we've already read from localStorage to prevent
  // infinite loops when key or initialValue changes
  const initialLoadRef = React.useRef(false);

  useEffect(() => {
    // Only load from localStorage on first mount or when key changes
    if (!initialLoadRef.current) {
      const item = getFromStorage(key, initialValue);
      setStoredValue(item);
      initialLoadRef.current = true;
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue: SetValue<T> = value => {
    // Allow value to be a function like React's useState
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    // Save state
    setStoredValue(valueToStore);

    // Save to localStorage
    setToStorage(key, valueToStore);
  };

  return [storedValue, setValue];
}
