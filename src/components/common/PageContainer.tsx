import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  variant?: 'default' | 'home' | 'wide';
  className?: string;
}

export default function PageContainer({
  children,
  variant = 'default',
  className = '',
}: PageContainerProps) {
  const mainClasses = {
    default: 'min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900',
    home: 'bg-white dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6',
    wide: 'min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900',
  };

  const containerClasses = {
    default: 'max-w-3xl mx-auto',
    home: 'max-w-4xl w-full text-center space-y-8 px-4 sm:px-0',
    wide: 'max-w-6xl mx-auto',
  };

  return (
    <main className={`${mainClasses[variant]} ${className}`}>
      <div className={containerClasses[variant]}>{children}</div>
    </main>
  );
}
