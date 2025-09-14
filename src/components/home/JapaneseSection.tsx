import SubjectSection from './SubjectSection';
import SubjectSubsection from './SubjectSubsection';
import StudyLink from './StudyLink';

export default function JapaneseSection() {
  return (
    <SubjectSection title="国語" titleColor="text-purple-600 dark:text-purple-400">
      {/* 言語 */}
      <SubjectSubsection title="言語" className="">
        <StudyLink href="/idioms" title="慣用句" color="bg-purple-500 hover:bg-purple-600" />
      </SubjectSubsection>
    </SubjectSection>
  );
}
