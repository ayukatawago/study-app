'use client';

import { useEffect, useState } from 'react';
import HistoryFlashcardDeck from './components/HistoryFlashcardDeck';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function HistoryPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer title="年代">
      <HistoryFlashcardDeck />
    </PageContainer>
  );
}
