'use client';

import { useEffect, useState } from 'react';
import IdiomFlashcardDeck from './components/IdiomFlashcardDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function IdiomsPage() {
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
        <PageHeader title="慣用句" />
        <IdiomFlashcardDeck />
      </div>
    </main>
  );
}
