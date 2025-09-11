'use client';

import { useEffect, useState } from 'react';
import AnimalFlashcardDeck from './components/AnimalFlashcardDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AnimalsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <PageHeader title="動物" />
        <AnimalFlashcardDeck />
      </div>
    </main>
  );
}
