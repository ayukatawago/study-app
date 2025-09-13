'use client';

import { useEffect, useState } from 'react';
import CultureFlashcardDeck from './components/CultureFlashcardDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function CulturePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PageHeader title="文化・人物" />
      <CultureFlashcardDeck />
    </PageContainer>
  );
}
