'use client';

import { useEffect, useState } from 'react';
import PoliticsDeck from './components/PoliticsDeck';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function PoliticsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer title="政治">
      <PoliticsDeck showNextButton={true} />
    </PageContainer>
  );
}
