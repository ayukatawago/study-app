'use client';

import { useEffect, useState } from 'react';
import AnimalFlashcardDeck from './components/AnimalFlashcardDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function AnimalsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PageHeader title="動物" />
      <AnimalFlashcardDeck />
    </PageContainer>
  );
}
