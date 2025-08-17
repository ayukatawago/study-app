'use client';

import { useState, useCallback } from 'react';
import { createLogger } from '@/utils/logger';

// Create logger for debugging localStorage issues
const logger = createLogger({ prefix: 'useLocalStorage' });

// This function reads from localStorage, handling all edge cases
function readFromLocalStorage<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch (error) {
    logger.error(`Error reading from localStorage key "${key}"`, error);
    return initialValue;
  }
}

/**
 * Custom hook that works like useState but persists the value in localStorage
 *
 * @param key - localStorage key
 * @param initialValue - Initial value if not found in localStorage
 * @returns [storedValue, setValue] - Just like useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize state with the value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    return readFromLocalStorage(key, initialValue);
  });

  // Define setter with useCallback for stable reference
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Update React state
        setStoredValue(valueToStore);

        // Update localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        logger.error(`Error writing to localStorage key "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
