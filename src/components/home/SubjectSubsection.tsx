import { ReactNode } from 'react';

interface SubjectSubsectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function SubjectSubsection({
  title,
  children,
  className = 'mb-6',
}: SubjectSubsectionProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
      <div className="flex flex-col space-y-2">{children}</div>
    </div>
  );
}
