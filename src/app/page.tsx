import PageContainer from '@/components/common/PageContainer';
import ActivityButton from '@/components/home/ActivityButton';
import SocialStudiesSection from '@/components/home/SocialStudiesSection';
import ScienceSection from '@/components/home/ScienceSection';
import JapaneseSection from '@/components/home/JapaneseSection';

export default function Home() {
  return (
    <PageContainer variant="home" title="暗記学習">
      <div className="flex flex-col items-center space-y-4">
        <ActivityButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <SocialStudiesSection />
        <ScienceSection />
        <JapaneseSection />
      </div>
    </PageContainer>
  );
}
