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
  id: number; // Unique identifier for the culture event
  keyword: string;
  era: string; // Changed from period to era
  descriptions: string[];
  type?: 'culture' | 'figures'; // Optional type field to distinguish between culture and figures
}

// World country data
export interface WorldCountryData extends BaseFlashcardData {
  countryCode: string; // Used as the unique id for countries (ISO Alpha-2 code)
  countryName: string; // Name of the country
  capitalCity: string; // Capital city of the country
  isoCode: string; // ISO Alpha-3 country code for map highlighting
  descriptions?: string[]; // Optional descriptions about the country
}

// Animal quiz data
export interface AnimalQuizData extends BaseFlashcardData {
  id: number; // Unique identifier for the quiz question
  question: string;
  answer: string;
}

// Human quiz data
export interface HumanQuizData extends BaseFlashcardData {
  id: number; // Unique identifier for the quiz question
  question: string;
  answer: string;
}

// Prefecture data (now flattened)
export interface PrefectureData extends BaseFlashcardData {
  id: number; // Unique identifier for the question
  prefecture: string; // Name of the prefecture
  keyword: string;
  answer: string[];
}

// Ranking data
export interface RankingData extends BaseFlashcardData {
  id: number; // Unique identifier for the ranking
  keyword: string; // Name of the ranking category
  answer: string[]; // Array of ranking items
}

// Cities data
export interface CitiesData extends BaseFlashcardData {
  id: number; // Unique identifier for the cities category
  keyword: string; // Name of the cities category
  answer: string[]; // Array of cities
}

// Traditional craft data
export interface CraftData extends BaseFlashcardData {
  id: number; // Unique identifier for the craft
  prefecture: string; // Prefecture name
  answer: string[]; // Traditional crafts of the prefecture
}

// Idiom data
export interface IdiomData extends BaseFlashcardData {
  id: number; // Unique identifier for the idiom
  idiom: string; // The idiom itself
  meaning: string[]; // Meaning explanation (array format)
  example: string; // Usage example
}

// Wago data
export interface WagoData extends BaseFlashcardData {
  id: number; // Unique identifier for the wago
  word: string; // The wago word itself
  meanings: {
    meaning: string; // Meaning explanation
    example: string; // Usage example
  }[]; // Array of meanings with examples
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
  cardDirection: 'keyword-to-desc' | 'desc-to-keyword';
  showMemorize: boolean;
  category: 'all' | 'culture' | 'figures';
}

// World country settings
export interface WorldCountrySettings extends BaseFlashcardSettings {
  // No additional settings needed
}

// Animal quiz settings
export interface AnimalQuizSettings extends BaseFlashcardSettings {
  category: 'animal_1' | 'animal_2' | 'all';
}

// Human quiz settings
export interface HumanQuizSettings extends BaseFlashcardSettings {
  // No additional settings needed for human quiz
}

// Prefecture settings
export interface PrefectureSettings extends BaseFlashcardSettings {
  category: 'all' | 'prefectures' | 'ranking' | 'cities';
}

// Craft settings
export interface CraftSettings extends BaseFlashcardSettings {
  cardDirection: 'prefecture-to-craft' | 'craft-to-prefecture';
}

// Idiom settings
export interface IdiomSettings extends BaseFlashcardSettings {
  cardDirection: 'idiom-to-meaning' | 'meaning-to-idiom';
}

// Wago settings
export interface WagoSettings extends BaseFlashcardSettings {
  cardDirection: 'word-to-meaning' | 'meaning-to-word';
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
