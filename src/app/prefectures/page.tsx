'use client';

import { useEffect, useState } from 'react';
import PrefectureFlashcardDeck from './components/PrefectureFlashcardDeck';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function PrefecturePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer title="都道府県">
      <PrefectureFlashcardDeck />
    </PageContainer>
  );
}
