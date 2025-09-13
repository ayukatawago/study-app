'use client';

import { useEffect, useState } from 'react';
import CraftFlashcardDeck from './components/CraftFlashcardDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function CraftsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PageHeader title="伝統工芸品" />
      <CraftFlashcardDeck />
    </PageContainer>
  );
}
