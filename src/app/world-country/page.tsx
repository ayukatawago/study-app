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
        <div className="relative flex justify-center items-center mb-8">
          <div className="absolute left-0">
            <Link href="/" className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">世界地図</h1>
        </div>
        <WorldCountryFlashcardDeck />
      </div>
    </main>
  );
}