import { ReactNode } from 'react';
import PageHeader from './PageHeader';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  variant?: 'default' | 'home' | 'wide';
  className?: string;
}

export default function PageContainer({
  children,
  title,
  variant = 'default',
  className = '',
}: PageContainerProps) {
  const mainClasses = {
    default: 'min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900',
    home: 'min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900',
    wide: 'min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900',
  };

  const containerClasses = {
    default: 'max-w-3xl mx-auto',
    home: 'max-w-4xl mx-auto',
    wide: 'max-w-6xl mx-auto',
  };

  return (
    <main className={`${mainClasses[variant]} ${className}`}>
      <div className={containerClasses[variant]}>
        {title && <PageHeader title={title} showBackButton={variant !== 'home'} />}
        {variant === 'home' ? <div className="text-center space-y-8">{children}</div> : children}
      </div>
    </main>
  );
}
