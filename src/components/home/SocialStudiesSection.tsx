import SubjectSection from './SubjectSection';
import SubjectSubsection from './SubjectSubsection';
import StudyLink from './StudyLink';

export default function SocialStudiesSection() {
  return (
    <SubjectSection title="社会" titleColor="text-blue-600 dark:text-blue-400">
      {/* 地理 */}
      <SubjectSubsection title="地理">
        <StudyLink href="/world-country" title="世界地図" color="bg-cyan-500 hover:bg-cyan-600" />
        <StudyLink href="/prefectures" title="都道府県" color="bg-sky-500 hover:bg-sky-600" />
        <StudyLink href="/crafts" title="伝統工芸品" color="bg-blue-500 hover:bg-blue-600" />
      </SubjectSubsection>

      {/* 歴史 */}
      <SubjectSubsection title="歴史">
        <StudyLink href="/history" title="年代" color="bg-orange-500 hover:bg-orange-600" />
        <StudyLink href="/culture" title="文化・人物" color="bg-yellow-600 hover:bg-yellow-700" />
      </SubjectSubsection>

      {/* 公民 */}
      <SubjectSubsection title="公民" className="">
        <StudyLink
          href="/constitution"
          title="日本国憲法"
          color="bg-violet-600 hover:bg-violet-700"
        />
        <StudyLink
          href="/international-community"
          title="国際社会"
          color="bg-indigo-600 hover:bg-indigo-700"
        />
        <StudyLink href="/politics" title="政治" color="bg-purple-600 hover:bg-purple-700" />
      </SubjectSubsection>
    </SubjectSection>
  );
}
