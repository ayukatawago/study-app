'use client';

import { useEffect, useState } from 'react';
import HistoryFlashcardDeck from '@/components/flashcard/HistoryFlashcardDeck';

export default function HistoryPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">歴史年代</h1>
        <HistoryFlashcardDeck />
      </div>
    </main>
  );
}