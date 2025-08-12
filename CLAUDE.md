# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a flashcard web application built with Next.js and TailwindCSS to help users memorize Japanese history, culture, and constitution. The application (社会学習) uses JSON data from various files in `public/data/` to create interactive flashcards and stores user progress in local storage.

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
│   └── data/         # JSON data for flashcards
│       ├── history_events.json # History events data
│       ├── history_culture.json # Cultural figures data
│       └── constitution.json # Japanese constitution data
├── src/
│   ├── app/          # Next.js app router pages
│   │   ├── page.tsx  # Home page
│   │   ├── history/  # History flashcards page
│   │   ├── culture/  # Culture flashcards page
│   │   └── constitution/ # Constitution flashcards page
│   ├── components/   # React components
│   │   └── flashcard/ # Flashcard related components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── styles/       # Global styles
└── .next/           # Next.js build output
```

### Core Features
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

4. **Data Management**
   - Uses local storage to persist user progress
   - Pulls history flashcard data from history_events.json
   - Pulls culture flashcard data from history_culture.json
   - Pulls constitution quiz data from constitution.json

5. **User Interface**
   - Responsive design using TailwindCSS
   - Simple and intuitive flashcard interaction
   - Settings panel for customizing study experience

## Data Structure

### History Events

The application uses the following JSON structure for history flashcard data (from `public/data/history_events.json`):

```json
{
  "history": [
    {
      "year": 1603,
      "events": [
        "徳川家康が征夷大将軍になる"
      ],
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
      "descriptions": [
        "浮世草子"
      ]
    },
    {
      "person": "近松門左衛門",
      "period": "元禄文化",
      "descriptions": [
        "人形浄瑠璃の脚本",
        "「曽根崎心中」"
      ]
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
      {"section": 1, "article": 1},
      {"section": 2, "article": 9}
    ],
    "correct": [
      {"section": 1, "article": 1}
    ],
    "incorrect": [
      {"section": 2, "article": 9}
    ]
  },
  "constitution_settings": {
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