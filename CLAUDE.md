# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a flashcard web application built with Next.js and TailwindCSS to help users memorize important points in social studies and science subjects. The application (暗記学習) uses JSON data from various files in `public/data/` to create interactive flashcards and stores user progress in local storage.

## Development Setup

### Technologies

- Next.js (React framework)
- TailwindCSS (styling)
- next-themes (theme management with SSR support)
- Local Storage (data persistence)
- React Leaflet & Leaflet (interactive maps)
- Natural Earth GeoJSON data (world country boundaries)
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
│       ├── history/              # History data directory
│       │   ├── events.json      # History events data
│       │   └── culture.json     # Cultural figures data
│       ├── civics/               # Civics data directory
│       │   ├── constitution.json # Japanese constitution data
│       │   └── united_nations.json # United Nations and international organizations data
│       ├── geography/            # Geography data directory
│       │   ├── world_countries.json # World countries data with zoom levels
│       │   ├── prefectures.json     # Prefecture quiz data
│       │   └── crafts.json          # Traditional crafts data
│       ├── science/              # Science data directory
│       │   ├── animals.json      # Animal quiz data
│       │   └── human.json        # Human biology quiz data
│       └── japanese/             # Japanese language data directory
│           └── idioms.json       # Japanese idioms data
├── src/
│   ├── app/          # Next.js app router pages
│   │   ├── page.tsx  # Home page
│   │   ├── history/  # History flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── culture/  # Culture flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── constitution/ # Constitution flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── world-country/ # World countries flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── international-community/ # International community quiz page
│   │   │   └── components/ # Page-specific components
│   │   ├── animals/ # Animal quiz flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── human/   # Human biology quiz flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── prefectures/ # Prefecture flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── crafts/  # Traditional crafts flashcards page
│   │   │   └── components/ # Page-specific components
│   │   ├── idioms/  # Japanese idioms flashcards page
│   │   │   └── components/ # Page-specific components
│   │   └── activity/ # Daily activity tracking page
│   ├── components/   # React components
│   │   ├── common/   # Common UI components
│   │   ├── flashcard/ # Common flashcard related components
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

### UI/UX Consistency Rules

#### Settings Panel Requirements

**MANDATORY**: All flashcard pages MUST use collapsible settings panels for consistent user experience.

**Implementation Rules:**

1. **Use BaseSettingsPanel component** - All settings panels must extend `@/components/flashcard/BaseSettingsPanel`
2. **Collapsible by default** - Settings should be hidden behind a clickable settings button (gear icon)
3. **Consistent naming** - Settings panel components should follow the pattern `[PageName]SettingsPanel.tsx`
4. **Radio buttons for options** - Use radio buttons instead of dropdowns for single-choice selections
5. **Proper state handling** - Settings changes must reset card navigation (currentIndex and key)

**Example Implementation:**

```typescript
// Create [PageName]SettingsPanel.tsx
export default function MyPageSettingsPanel({
  settings,
  onSettingsChange,
  onResetProgress,
}: MyPageSettingsPanelProps) {
  const renderAdditionalSettings = () => {
    // Custom settings using radio buttons
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Option</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="option" value="value1" />
            <span>Label 1</span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <BaseSettingsPanel
      settings={settings}
      onSettingsChange={onSettingsChange}
      onResetProgress={onResetProgress}
      renderAdditionalSettings={renderAdditionalSettings}
    />
  );
}

// In deck component, handle settings changes properly
const handleSettingsChange = (newSettings: typeof settings) => {
  setSettings(newSettings);
  setCurrentIndex(0); // Reset to first card
  setKey(prevKey => prevKey + 1); // Force re-render
};
```

**Current Compliant Pages:**

- History, Culture, Constitution, World Country, International Community, Animals, Human, Prefectures, Crafts, Idioms

**Prohibited Patterns:**

- ❌ Always-visible settings buttons
- ❌ Dropdown selectors for category/option selection
- ❌ Custom settings implementations without BaseSettingsPanel
- ❌ Settings that don't reset card navigation

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
   - Display Japanese cultural keywords/figures and their descriptions
   - Allow flipping between keyword and description content
   - Show era information and description count on cards
   - Category filtering: all, culture only, figures only
   - Track correct/incorrect responses in local storage using numeric IDs

3. **Constitution Quiz System**
   - Display Japanese constitution articles with hidden quiz elements
   - Interactive text revealing - tap on placeholder text to reveal answers
   - Show article summaries when all answers are revealed
   - Display paragraph numbers for multi-paragraph articles
   - Track correct/incorrect responses in local storage

4. **World Countries Flashcard System**
   - Display interactive React Leaflet maps highlighting various countries
   - Show country information on card flip
   - Zoom in/out functionality for better map visibility
   - Country-specific zoom levels stored in JSON data
   - Uses Natural Earth GeoJSON data for complete world coverage including Russia's eastern regions
   - Track correct/incorrect responses in local storage

5. **Animal Quiz System**
   - Display question and answer pairs about animal science
   - Category filtering between different sets of questions
   - Track correct/incorrect responses in local storage
   - Adaptable card height based on content length

6. **Human Biology Quiz System**
   - Display question and answer pairs about human biology
   - Track correct/incorrect responses in local storage
   - Adaptable card height based on content length

7. **International Community Quiz System**
   - Display interactive quiz content about United Nations and international organizations
   - Interactive text revealing - tap on placeholder text to reveal answers
   - Category filtering between different topics (general, agencies, human rights, global environment)
   - Track correct/incorrect responses in local storage
   - Adaptable card height based on content length

8. **Prefecture Flashcard System**
   - Display Japanese prefecture names and associated specialties/products
   - Comprehensive data including 192 prefecture entries, 5 ranking items, and 5 cities items
   - Category filtering: all, prefectures only, ranking only, cities only
   - Array-based answers for better organization of multiple items
   - Collapsible settings panel with radio button selection
   - Track correct/incorrect responses in local storage

9. **Traditional Crafts Flashcard System**
   - Display Japanese prefectures and their traditional crafts
   - Bidirectional card modes: prefecture-to-craft and craft-to-prefecture
   - Show number of crafts when multiple items exist for a prefecture
   - Track correct/incorrect responses in local storage

10. **Japanese Idioms Flashcard System**

- Display Japanese idioms and their meanings with usage examples
- Bidirectional card modes: idiom-to-meaning and meaning-to-idiom
- Always show usage examples on answer cards for better understanding
- Track correct/incorrect responses in local storage
- Adaptable card height based on content length

11. **Data Management**

- Uses local storage to persist user progress
- Pulls history flashcard data from history/events.json
- Pulls culture flashcard data from history/culture.json
- Pulls constitution quiz data from civics/constitution.json
- Pulls world country data from geography/world_countries.json
- Pulls animal quiz data from science/animals.json
- Pulls human quiz data from science/human.json
- Pulls international community quiz data from civics/united_nations.json
- Pulls prefecture quiz data from geography/prefectures.json
- Pulls traditional crafts data from geography/crafts.json
- Pulls Japanese idioms data from japanese/idioms.json

12. **User Interface**

- Responsive design using TailwindCSS
- Dark/light theme switching with system preference support (next-themes)
- Simple and intuitive flashcard interaction
- Settings panel for customizing study experience
- Interactive world map for geography learning
- Organized by subject category (社会, 理科, and 国語)

13. **Daily Activity Tracking**

- Automatically tracks daily quiz attempts and correct answers
- Visual histogram showing last 14 days of activity
- Interactive chart with click-to-view daily details
- Shows attempts count, correct answers, and accuracy rate
- Stacked bar chart displaying correct/incorrect ratio
- Filterable by specific study pages
- Persistent data storage in local storage

## Data Structure

### History Events

The application uses the following JSON structure for history flashcard data (from `public/data/history/events.json`):

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

The application also uses the following JSON structure for culture flashcard data (from `public/data/history/culture.json`):

```json
{
  "culture": [
    {
      "id": 1,
      "keyword": "井原西鶴",
      "era": "元禄文化",
      "descriptions": ["浮世草子"]
    },
    {
      "id": 2,
      "keyword": "近松門左衛門",
      "era": "元禄文化",
      "descriptions": ["人形浄瑠璃の脚本", "「曽根崎心中」"]
    }
    // More culture entries
  ],
  "figures": [
    {
      "id": 1,
      "keyword": "卑弥呼",
      "era": "弥生時代",
      "descriptions": ["邪馬台国の女王", "まじないで人々を支配した"]
    }
    // More historical figures
  ]
}
```

### Constitution Articles

The application uses the following JSON structure for constitution quiz data (from `public/data/civics/constitution.json`):

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

The application uses the following JSON structure for world countries data (from `public/data/geography/world_countries.json`):

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

### Animal Quiz

The application uses the following JSON structure for animal quiz data (from `public/data/science/animals.json`):

```json
{
  "animal_1": [
    {
      "id": 1,
      "question": "メダカを飼うとき、水そうはどのようなところに置きますか",
      "answer": "直射日光のあたらない明るいところ"
    }
    // More animal questions
  ],
  "animal_2": [
    {
      "id": 1,
      "question": "昆虫の体は3つの部分に分かれていますが、それぞれ何といいますか",
      "answer": "頭部、胸部、腹部（頭、胸、腹）"
    }
    // More insect questions
  ]
}
```

### Human Quiz

The application uses the following JSON structure for human biology quiz data (from `public/data/science/human.json`):

```json
{
  "human": [
    {
      "id": 1,
      "question": "食物が消化されるときに通る管のことを何といいますか",
      "answer": "消化管"
    },
    {
      "id": 2,
      "question": "胆汁をつくる器官は何ですか",
      "answer": "肝臓"
    }
    // More human biology questions
  ]
}
```

### Prefecture Quiz

The application uses the following JSON structure for prefecture quiz data (from `public/data/geography/prefectures.json`):

```json
{
  "prefectures": [
    {
      "id": 1,
      "prefecture": "北海道",
      "keyword": "稲作",
      "answer": ["石狩平野・上川盆地", "石狩川"]
    },
    {
      "id": 2,
      "prefecture": "北海道",
      "keyword": "特産物",
      "answer": ["じゃがいも", "とうもろこし", "小麦", "大豆", "てんさい", "酪農"]
    }
    // More prefecture-specialty pairs (192 total)
  ],
  "ranking": [
    {
      "id": 1,
      "keyword": "面積の大きい都道府県",
      "answer": ["北海道", "岩手県", "福島県"]
    }
    // More ranking data (5 total)
  ],
  "cities": [
    {
      "id": 1,
      "keyword": "政令指定都市",
      "answer": ["札幌市", "仙台市", "さいたま市", "千葉市", "横浜市"]
    }
    // More cities data (5 total)
  ]
}
```

### Traditional Crafts

The application uses the following JSON structure for traditional crafts data (from `public/data/geography/crafts.json`):

```json
{
  "traditional_crafts": [
    {
      "id": 1,
      "prefecture": "青森県",
      "answer": ["津軽塗"]
    },
    {
      "id": 12,
      "prefecture": "石川県",
      "answer": ["輪島塗", "九谷焼", "加賀友禅"]
    }
    // More prefecture-craft pairs
  ]
}
```

### Japanese Idioms

The application uses the following JSON structure for Japanese idioms data (from `public/data/japanese/idioms.json`):

```json
{
  "idioms": [
    {
      "id": 1,
      "idiom": "石の上にも三年",
      "meaning": "どんなに辛くても、辛抱強く努力を続ければ、必ず成功することのたとえ",
      "example": "この仕事は大変だが、石の上にも三年というから頑張ろう"
    },
    {
      "id": 2,
      "idiom": "猫に小判",
      "meaning": "価値のわからない者に貴重なものを与えても無駄であること",
      "example": "彼に高級なワインを贈るなんて猫に小判だ"
    }
    // More idiom entries
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
    "seen": [1, 2, 3],
    "correct": [1, 2],
    "incorrect": [3]
  },
  "culture_flashcard_settings": {
    "cardDirection": "keyword-to-desc",
    "showMemorize": true,
    "randomOrder": true,
    "showIncorrectOnly": false,
    "category": "all"
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

### Animal Quiz Flashcards

User progress and settings for animal quiz flashcards are stored in local storage with the following structure:

```json
{
  "animal_quiz_progress": {
    "seen": [1, 2, 3],
    "correct": [1, 2],
    "incorrect": [3]
  },
  "animal_quiz_settings": {
    "randomOrder": true,
    "showIncorrectOnly": false,
    "category": "all"
  }
}
```

### Human Quiz Flashcards

User progress and settings for human quiz flashcards are stored in local storage with the following structure:

```json
{
  "human_quiz_progress": {
    "seen": [1, 2, 3],
    "correct": [1, 2],
    "incorrect": [3]
  },
  "human_quiz_settings": {
    "randomOrder": true,
    "showIncorrectOnly": false
  }
}
```

### Prefecture Flashcards

User progress and settings for prefecture flashcards are stored in local storage with the following structure:

```json
{
  "prefecture_progress": {
    "seen": [1, 2, 3],
    "correct": [1, 2],
    "incorrect": [3]
  },
  "prefecture_settings": {
    "randomOrder": true,
    "showIncorrectOnly": false,
    "category": "all"
  }
}
```

### Traditional Crafts Flashcards

User progress and settings for traditional crafts flashcards are stored in local storage with the following structure:

```json
{
  "craft_progress": {
    "seen": [1, 2, 3],
    "correct": [1, 2],
    "incorrect": [3]
  },
  "craft_settings": {
    "randomOrder": true,
    "showIncorrectOnly": false,
    "cardDirection": "prefecture-to-craft"
  }
}
```

### Japanese Idioms Flashcards

User progress and settings for Japanese idioms flashcards are stored in local storage with the following structure:

```json
{
  "idiom_progress": {
    "seen": [1, 2, 3],
    "correct": [1, 2],
    "incorrect": [3]
  },
  "idiom_settings": {
    "cardDirection": "idiom-to-meaning",
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
8. Organize content by subject categories
9. Add new subject areas as needed

## Features

1. **Responsive Design**: Optimized for both desktop and mobile devices
2. **Study Progress Tracking**: Tracks cards seen, correct, and incorrect
3. **Study Modes**: Option to study all cards or only incorrect cards
4. **Card Direction**:
   - For history: Switch between year-to-event and event-to-year directions
   - For culture: Switch between keyword-to-description and description-to-keyword directions
   - For crafts: Switch between prefecture-to-craft and craft-to-prefecture directions
   - For idioms: Switch between idiom-to-meaning and meaning-to-idiom directions
5. **Random Order**: Option to study cards in random or sequential order
6. **Reset Progress**: Clear study history when needed
7. **Dynamic Card Height**: Adjusts card height based on content length
8. **Smart Card Selection**: In random mode, prioritizes showing cards not yet answered correctly
9. **Progress Display**: Shows statistics on correctly and incorrectly answered cards
10. **Completion Message**: Displays congratulatory message when all cards are answered correctly
11. **Interactive Quiz**: For constitution content, clickable placeholders reveal answers when tapped
12. **Contextual Information**: Shows article summaries when all quiz answers are revealed
13. **Paragraph Numbering**: Automatically numbers paragraphs in multi-paragraph articles
14. **Interactive World Map**: Shows countries on an interactive React Leaflet map with zoom controls
15. **Dynamic Zoom Levels**: Country-specific zoom levels for optimal map viewing
16. **Complete World Coverage**: Uses Natural Earth GeoJSON data ensuring all country territories are properly displayed
17. **Subject Categorization**: Organized by subject areas (社会, 理科, and 国語)
18. **Category Filtering**: For animal quiz questions between different sets
19. **Theme Switching**: Dark/light mode toggle with system preference detection
20. **Daily Activity Tracking**: Track daily quiz attempts and correct answers with visual histogram
21. **Activity History**: View detailed daily study statistics with interactive charts
