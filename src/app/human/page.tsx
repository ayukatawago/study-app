'use client';

import { useEffect, useState } from 'react';
import HumanFlashcardDeck from './components/HumanFlashcardDeck';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function HumanPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer title="人体">
      <HumanFlashcardDeck />
    </PageContainer>
  );
}
