# Japanese History Flashcards

A Next.js application to help users memorize Japanese historical events by year using flashcards.

## Features

- Interactive flashcards for studying Japanese historical events
- Toggle between year-to-event and event-to-year modes
- Track learning progress with local storage
- Show/hide memorization aids
- Responsive design with TailwindCSS

## Tech Stack

- Next.js
- React
- TypeScript
- TailwindCSS
- Local Storage for data persistence

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
│   └── data/         # JSON data for flashcards (history_events.json)
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   │   └── flashcard/ # Flashcard related components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── styles/       # Global styles
├── CLAUDE.md        # Development guide for Claude AI
├── README.md        # Project documentation (this file)
└── package.json     # Project dependencies and scripts
```

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
    // More year-event pairs
  ]
}
```

## Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## License

This project is licensed under the ISC License.