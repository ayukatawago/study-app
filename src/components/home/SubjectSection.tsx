import { ReactNode } from 'react';

interface SubjectSectionProps {
  title: string;
  titleColor: string;
  children: ReactNode;
}

export default function SubjectSection({ title, titleColor, children }: SubjectSectionProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h2 className={`text-2xl font-bold ${titleColor} mb-4`}>{title}</h2>
      {children}
    </div>
  );
}
