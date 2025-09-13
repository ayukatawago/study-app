'use client';

import { useEffect, useState } from 'react';
import ConstitutionDeck from './components/ConstitutionDeck';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PageContainer from '@/components/common/PageContainer';

export default function ConstitutionPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <PageHeader title="日本国憲法" />
      <ConstitutionDeck showNextButton={true} />
    </PageContainer>
  );
}
