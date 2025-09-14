import SubjectSection from './SubjectSection';
import SubjectSubsection from './SubjectSubsection';
import StudyLink from './StudyLink';
import ComingSoon from './ComingSoon';

export default function ScienceSection() {
  return (
    <SubjectSection title="理科" titleColor="text-green-600 dark:text-green-400">
      {/* 生物 */}
      <SubjectSubsection title="生物">
        <StudyLink href="/animals" title="動物" color="bg-emerald-500 hover:bg-emerald-600" />
        <StudyLink href="/human" title="人体" color="bg-teal-500 hover:bg-teal-600" />
      </SubjectSubsection>

      {/* 地学・物理・化学 - 将来の予定 */}
      <div className="space-y-4">
        <ComingSoon title="地学" />
        <ComingSoon title="物理" />
        <ComingSoon title="化学" />
      </div>
    </SubjectSection>
  );
}
