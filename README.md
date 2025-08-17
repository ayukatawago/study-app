# 社会学習 (Social Studies Learning App)

A Next.js application to help users memorize Japanese history, cultural figures, and constitution articles using interactive flashcards.

## Features

- Interactive flashcards for studying Japanese historical events, cultural figures, and constitution articles
- Multiple study modes:
  - History: Toggle between year-to-event and event-to-year modes
  - Culture: Toggle between person-to-description and description-to-person modes
  - Constitution: Interactive quiz with tap-to-reveal answers
- Track learning progress with local storage
- Show/hide memorization aids and summaries
- Card-by-card navigation with options for random or sequential order
- Focus on incorrect answers with filtering options
- Responsive design with TailwindCSS

## Tech Stack

- Next.js
- React
- TypeScript
- TailwindCSS
- Prettier (code formatting)
- ESLint (code linting)
- Husky & lint-staged (pre-commit hooks)
- Local Storage for data persistence
- Structured logging system for debugging

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/study-app.git
   cd study-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Run the development server

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
study-app/
├── public/            # Static files
│   └── data/         # JSON data for flashcards
│       ├── history_events.json # History events data
│       ├── history_culture.json # Cultural figures data
│       └── constitution.json # Constitution articles data
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── history/  # History flashcards page
│   │   ├── culture/  # Culture flashcards page
│   │   └── constitution/ # Constitution flashcards page
│   ├── components/   # React components
│   │   └── flashcard/ # Flashcard related components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   │   └── logger.ts # Debug logging utility
│   └── styles/       # Global styles
├── CLAUDE.md        # Development guide for Claude AI
├── README.md        # Project documentation (this file)
└── package.json     # Project dependencies and scripts
```

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
    }
    // More year-event pairs
  ]
}
```

### Culture Figures

The application uses the following JSON structure for culture flashcard data (from `public/data/history_culture.json`):

```json
{
  "culture": [
    {
      "person": "井原西鶴",
      "period": "元禄文化",
      "descriptions": ["浮世草子"]
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

Text within `<span>` tags becomes interactive quiz elements that can be revealed by tapping.

## Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without making changes

## Code Formatting and Linting

This project uses:

- **Prettier** for code formatting
- **ESLint** for code linting (with modern flat config)
- **Husky** for Git hooks
- **lint-staged** for running linters on staged Git files
- **Structured logging** for debugging with different log levels

### Formatting Code

Format all files:

```bash
npm run format
```

Check formatting without making changes:

```bash
npm run format:check
```

### Pre-commit Hooks

The project is configured with pre-commit hooks that automatically:

- Run ESLint to fix linting issues
- Format code with Prettier

These hooks ensure that all committed code follows the project's formatting and linting rules.

## Logging System

The application includes a structured logging utility for debugging:

```typescript
import { createLogger } from '@/utils/logger';

// Create a logger with a component prefix
const logger = createLogger({ prefix: 'ComponentName' });

// Use different log levels
logger.debug('Detailed information useful during development');
logger.info('General information about application flow');
logger.warn("Warning that doesn't break the application");
logger.error('Error that affects functionality', errorObject);
```

Logging features:

- Automatic disabling in production environment
- Configurable log levels (debug, info, warn, error)
- Component prefixes for easy identification
- Support for error objects

## License

This project is licensed under the ISC License.
