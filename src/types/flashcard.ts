'use client';

/**
 * Common interfaces for flashcard components
 */

// Base flashcard data interface
export interface BaseFlashcardData {
  id: string | number; // Unique identifier for the flashcard
}

// History event data
export interface HistoryEventData extends BaseFlashcardData {
  year: number; // Used as the unique id for history events
  events: string[];
  memorize?: string;
}

// Culture event data
export interface CultureEventData extends BaseFlashcardData {
  person: string; // Used as the unique id for culture events
  period: string;
  descriptions: string[];
}

// World country data
export interface WorldCountryData extends BaseFlashcardData {
  countryCode: string; // Used as the unique id for countries (ISO Alpha-2 code)
  countryName: string; // Name of the country
  capitalCity: string; // Capital city of the country
  isoCode: string; // ISO Alpha-3 country code for map highlighting
  descriptions?: string[]; // Optional descriptions about the country
}

// Base settings interface
export interface BaseFlashcardSettings {
  randomOrder: boolean;
  showIncorrectOnly: boolean;
}

// History settings
export interface HistoryFlashcardSettings extends BaseFlashcardSettings {
  cardDirection: 'year-to-event' | 'event-to-year';
  showMemorize: boolean;
}

// Culture settings
export interface CultureFlashcardSettings extends BaseFlashcardSettings {
  cardDirection: 'person-to-desc' | 'desc-to-person';
  showMemorize: boolean;
}

// World country settings
export interface WorldCountrySettings extends BaseFlashcardSettings {
  // No additional settings needed
}

// Base progress interface
export interface BaseFlashcardProgress<T> {
  seen: T[];
  correct: T[];
  incorrect: T[];
}

// Common props for flashcard components
export interface BaseFlashcardProps<T extends BaseFlashcardData> {
  event: T;
  onCorrect: () => void;
  onIncorrect: () => void;
}
