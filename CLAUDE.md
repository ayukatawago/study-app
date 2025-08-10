# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a flashcard web application built with Next.js and TailwindCSS to help users memorize Japanese historical events by year. The application (歴史年代) uses JSON data from `public/data/history_events.json` to create interactive flashcards and stores user progress in local storage.

## Development Setup

### Technologies
- Next.js (React framework)
- TailwindCSS (styling)
- Local Storage (data persistence)

### Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Directory Structure
```
study-app/
├── public/            # Static files
│   └── data/         # JSON data for flashcards (history_events.json)
├── src/
│   ├── app/          # Next.js app router pages
│   │   ├── page.tsx  # Home page
│   │   └── history/  # History flashcards page
│   ├── components/   # React components
│   │   └── flashcard/ # Flashcard related components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── styles/       # Global styles
└── .next/           # Next.js build output
```

### Core Features
1. **Flashcard System**
   - Display Japanese year numbers and associated historical events
   - Allow flipping between year and event content
   - Track correct/incorrect responses in local storage
   - Use the "memorize" field for memory aids

2. **Data Management**
   - Uses local storage to persist user progress
   - Pulls flashcard data from history_events.json

3. **User Interface**
   - Responsive design using TailwindCSS
   - Simple and intuitive flashcard interaction

## Data Structure

The application uses the following JSON structure for flashcard data (from `public/data/history_events.json`):

```json
{
  "history": [
    {
      "id": 1,
      "year": 239,
      "item": "邪馬台国の女王である卑弥呼が魏に使者を送る",
      "memorize": "「親魏倭王」と　銅鏡100枚　２つもサンキュー　魏にペコリ"
    },
    {
      "id": 2,
      "year": 538,
      "item": "百済から公に仏教が伝わる",
      "memorize": "聖明王が　送ってくれた　百済の仏に　ご参拝"
    }
    // More year-event pairs
  ]
}
```

## Local Storage

User progress and settings are stored in local storage with the following structure:

```json
{
  "progress": {
    "seen": [1, 2, 5],
    "correct": [1, 2],
    "incorrect": [5]
  },
  "settings": {
    "cardDirection": "year-to-event",
    "showMemorize": true,
    "randomOrder": true,
    "showIncorrectOnly": false
  }
}
```

## Development Workflow

1. Build out the Next.js application structure
2. Implement flashcard components
3. Create a system for displaying and flipping cards
4. Implement local storage for tracking progress
5. Add TailwindCSS styling for responsive design
6. Implement filters and sorting options for flashcards

## Features

1. **Responsive Design**: Optimized for both desktop and mobile devices
2. **Study Progress Tracking**: Tracks cards seen, correct, and incorrect
3. **Study Modes**: Option to study all cards or only incorrect cards
4. **Card Direction**: Switch between year-to-event and event-to-event directions
5. **Random Order**: Option to study cards in random or sequential order
6. **Reset Progress**: Clear study history when needed