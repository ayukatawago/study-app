'use client';

import { useEffect, useState } from 'react';
import WorldCountryFlashcardDeck from '@/components/flashcard/WorldCountryFlashcardDeck';
import Link from 'next/link';

export default function WorldCountryPage() {
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
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ホームに戻る
          </Link>
          <h1 className="text-3xl font-bold text-center">世界地図</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
        <WorldCountryFlashcardDeck />
      </div>
    </main>
  );
}