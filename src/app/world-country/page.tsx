'use client';

import { useEffect, useState } from 'react';
import WorldCountryFlashcardDeck from './components/WorldCountryFlashcardDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function WorldCountryPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PageHeader title="世界地図" />
      <WorldCountryFlashcardDeck />
    </PageContainer>
  );
}
