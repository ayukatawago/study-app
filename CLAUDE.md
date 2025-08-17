# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a flashcard web application built with Next.js and TailwindCSS to help users memorize Japanese history, culture, constitution, and world countries. The application (社会学習) uses JSON data from various files in `public/data/` to create interactive flashcards and stores user progress in local storage.

## Development Setup

### Technologies

- Next.js (React framework)
- TailwindCSS (styling)
- Local Storage (data persistence)
- react-simple-maps (for world map visualization)
- Prettier (code formatting)
- ESLint (code linting)
- Husky & lint-staged (pre-commit hooks)

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

# Format code with Prettier
npm run format

# Check formatting without making changes
npm run format:check
```

## Architecture

### Directory Structure

```
study-app/
├── public/            # Static files
│   └── data/         # JSON data for flashcards
│       ├── history_events.json    # History events data
│       ├── history_culture.json   # Cultural figures data
│       ├── constitution.json      # Japanese constitution data
│       └── world_countries.json   # World countries data with zoom levels
├── src/
│   ├── app/          # Next.js app router pages
│   │   ├── page.tsx  # Home page
│   │   ├── history/  # History flashcards page
│   │   ├── culture/  # Culture flashcards page
│   │   ├── constitution/ # Constitution flashcards page
│   │   └── world-country/ # World countries flashcards page
│   ├── components/   # React components
│   │   ├── flashcard/ # Flashcard related components
│   │   └── map/      # Map related components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   │   └── logger.ts  # Debug logging utility
│   └── styles/       # Global styles
└── .next/           # Next.js build output
```

### Code Quality

### ESLint Configuration

The project uses ESLint for code quality with the following configuration:

- ESLint with modern flat config format (eslint.config.js)
- Integration with Prettier for formatting
- No-unused-vars warnings are disabled to avoid false positives with TypeScript interfaces
- Console logs are only allowed in the logger utility

### Debug Logging

The application includes a structured logging utility (`src/utils/logger.ts`) with the following features:

- Different log levels (debug, info, warn, error)
- Log prefixes for easy identification
- Automatic disabling in production
- Example usage:

```typescript
import { createLogger } from '@/utils/logger';

// Create a logger with a component prefix
const logger = createLogger({ prefix: 'ComponentName' });

// Log at different levels
logger.debug('Detailed debug info');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error occurred', errorObject);
```

## Core Features

1. **History Flashcard System**
   - Display Japanese year numbers and associated historical events
   - Allow flipping between year and event content
   - Track correct/incorrect responses in local storage
   - Use the "memorize" field for memory aids

2. **Culture Flashcard System**
   - Display Japanese cultural figures and their contributions
   - Allow flipping between person and description content
   - Show period information on flipped cards
   - Track correct/incorrect responses in local storage

3. **Constitution Quiz System**
   - Display Japanese constitution articles with hidden quiz elements
   - Interactive text revealing - tap on placeholder text to reveal answers
   - Show article summaries when all answers are revealed
   - Display paragraph numbers for multi-paragraph articles
   - Track correct/incorrect responses in local storage

4. **World Countries Flashcard System**
   - Display interactive maps highlighting various countries
   - Show country information on card flip
   - Zoom in/out functionality for better map visibility
   - Country-specific zoom levels stored in JSON data
   - Track correct/incorrect responses in local storage

5. **Data Management**
   - Uses local storage to persist user progress
   - Pulls history flashcard data from history_events.json
   - Pulls culture flashcard data from history_culture.json
   - Pulls constitution quiz data from constitution.json
   - Pulls world country data from world_countries.json

6. **User Interface**
   - Responsive design using TailwindCSS
   - Simple and intuitive flashcard interaction
   - Settings panel for customizing study experience
   - Interactive world map for geography learning

## Data Structure

### History Events

The application uses the following JSON structure for history flashcard data (from `public/data/history_events.json`):

```json
{
  "history": [
    {
      "year": 1603,
      "events": ["徳川家康が征夷大将軍になる"],
      "memorize": "家康 征夷大将軍だ 人群れさわぐ 江戸幕府"
    },
    {
      "year": 1615,
      "events": [
        "大阪夏の陣（豊臣氏滅亡）",
        "武家諸法度を制定（大名統制）",
        "禁中並公家諸法度を制定（朝廷統制）"
      ],
      "memorize": "秀忠のころ 制定されて 異論以後ダメ 武家諸法度"
    }
    // More year-event pairs
  ]
}
```

### Culture Figures

The application also uses the following JSON structure for culture flashcard data (from `public/data/history_culture.json`):

```json
{
  "culture": [
    {
      "person": "井原西鶴",
      "period": "元禄文化",
      "descriptions": ["浮世草子"]
    },
    {
      "person": "近松門左衛門",
      "period": "元禄文化",
      "descriptions": ["人形浄瑠璃の脚本", "「曽根崎心中」"]
    }
    // More person-description pairs
  ]
}
```

### Constitution Articles

The application uses the following JSON structure for constitution quiz data (from `public/data/constitution.json`):

```json
{
  "constitution": {
    "title": "日本国憲法",
    "sections": [
      {
        "section": 1,
        "title": "天皇",
        "articles": [
          {
            "article": 1,
            "summary": "天皇の地位と主権在民",
            "paragraphs": [
              "天皇は、日本国の<span>象徴</span>であり日本国民統合の象徴であつて、この地位は、<span>主権</span>の存する日本国民の総意に基く。"
            ]
          }
        ]
      }
    ]
  }
}
```

### World Countries

The application uses the following JSON structure for world countries data (from `public/data/world_countries.json`):

```json
{
  "countries": [
    {
      "countryCode": "156",
      "countryName": "中華人民共和国",
      "capitalCity": "北京",
      "descriptions": [
        "漢民族を中心とする、50を超える民族からなる国",
        "かつては人口を抑制する一人っ子政策を実施していた"
      ],
      "isoCode": "CHN",
      "zoomLevel": 2.0
    },
    {
      "countryCode": "643",
      "countryName": "ロシア連邦",
      "capitalCity": "モスクワ",
      "descriptions": [
        "日本と国交はあるが、北方領土問題があるため、いまだ平和条約を結んでいない",
        "面積は日本の45倍"
      ],
      "isoCode": "RUS",
      "zoomLevel": 1.2
    }
    // More country entries
  ]
}
```

## Local Storage

### History Flashcards

User progress and settings for history flashcards are stored in local storage with the following structure:

```json
{
  "progress": {
    "seen": [1603, 1615, 1853],
    "correct": [1603, 1615],
    "incorrect": [1853]
  },
  "settings": {
    "cardDirection": "year-to-event",
    "showMemorize": true,
    "randomOrder": true,
    "showIncorrectOnly": false
  }
}
```

### Culture Flashcards

User progress and settings for culture flashcards are stored in local storage with the following structure:

```json
{
  "culture_flashcard_progress": {
    "seen": ["井原西鶴", "近松門左衛門", "松尾芭蕉"],
    "correct": ["井原西鶴", "近松門左衛門"],
    "incorrect": ["松尾芭蕉"]
  },
  "culture_flashcard_settings": {
    "cardDirection": "person-to-desc",
    "showMemorize": true,
    "randomOrder": true,
    "showIncorrectOnly": false
  }
}
```

### Constitution Flashcards

User progress and settings for constitution flashcards are stored in local storage with the following structure:

```json
{
  "constitution_progress": {
    "seen": [
      { "section": 1, "article": 1 },
      { "section": 2, "article": 9 }
    ],
    "correct": [{ "section": 1, "article": 1 }],
    "incorrect": [{ "section": 2, "article": 9 }]
  },
  "constitution_settings": {
    "randomOrder": true,
    "showIncorrectOnly": false
  }
}
```

### World Country Flashcards

User progress and settings for world country flashcards are stored in local storage with the following structure:

```json
{
  "world_country_progress": {
    "seen": ["156", "643", "392"],
    "correct": ["156", "643"],
    "incorrect": ["392"]
  },
  "world_country_settings": {
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
7. Add interactive map functionality for world countries

## Features

1. **Responsive Design**: Optimized for both desktop and mobile devices
2. **Study Progress Tracking**: Tracks cards seen, correct, and incorrect
3. **Study Modes**: Option to study all cards or only incorrect cards
4. **Card Direction**:
   - For history: Switch between year-to-event and event-to-year directions
   - For culture: Switch between person-to-description and description-to-person directions
5. **Random Order**: Option to study cards in random or sequential order
6. **Reset Progress**: Clear study history when needed
7. **Dynamic Card Height**: Adjusts card height based on content length
8. **Smart Card Selection**: In random mode, prioritizes showing cards not yet answered correctly
9. **Progress Display**: Shows statistics on correctly and incorrectly answered cards
10. **Completion Message**: Displays congratulatory message when all cards are answered correctly
11. **Interactive Quiz**: For constitution content, clickable placeholders reveal answers when tapped
12. **Contextual Information**: Shows article summaries when all quiz answers are revealed
13. **Paragraph Numbering**: Automatically numbers paragraphs in multi-paragraph articles
14. **Interactive World Map**: Shows countries on an interactive map with zoom controls
15. **Dynamic Zoom Levels**: Country-specific zoom levels for optimal map viewing
