'use client';

import { useEffect, useState } from 'react';
import UNDeck from './components/UNDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function InternationalCommunityPage() {
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
        <PageHeader title="国際社会" />
        <UNDeck showNextButton={true} />
      </div>
    </main>
  );
}
