'use client';

import { useEffect, useState } from 'react';
import WagoFlashcardDeck from './components/WagoFlashcardDeck';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function WagoPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer title="和語">
      <WagoFlashcardDeck />
    </PageContainer>
  );
}
