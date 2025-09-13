'use client';

import { useEffect, useState } from 'react';
import UNDeck from './components/UNDeck';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function InternationalCommunityPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer title="国際社会">
      <UNDeck showNextButton={true} />
    </PageContainer>
  );
}
