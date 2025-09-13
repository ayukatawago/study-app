'use client';

import { useEffect, useState } from 'react';
import IdiomFlashcardDeck from './components/IdiomFlashcardDeck';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function IdiomsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer title="慣用句">
      <IdiomFlashcardDeck />
    </PageContainer>
  );
}
