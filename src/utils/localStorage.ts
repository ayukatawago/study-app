// Local Storage utility functions
import { createLogger } from './logger';

const logger = createLogger({ prefix: 'localStorage' });

/**
 * Get an item from local storage and parse it as JSON
 * @param key - The storage key
 * @param defaultValue - Default value if key doesn't exist
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    // Log the error and return default value
    logger.debug(`Failed to get item from storage: ${key}`, error);
    return defaultValue;
  }
}

/**
 * Set an item in local storage as JSON string
 * @param key - The storage key
 * @param value - The value to store
 */
export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logger.debug(`Failed to set item to storage: ${key}`, error);
  }
}

/**
 * Remove an item from local storage
 * @param key - The storage key to remove
 */
export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    logger.debug(`Failed to remove item from storage: ${key}`, error);
  }
}

/**
 * Clear all items from local storage
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.clear();
  } catch (error) {
    logger.debug('Failed to clear storage', error);
  }
}
