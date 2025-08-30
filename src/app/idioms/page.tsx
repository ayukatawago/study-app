'use client';

import { useEffect, useState } from 'react';
import IdiomFlashcardDeck from './components/IdiomFlashcardDeck';
import PageHeader from '@/components/common/PageHeader';

export default function IdiomsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <PageHeader title="慣用句学習" />
        <IdiomFlashcardDeck />
      </div>
    </main>
  );
}
