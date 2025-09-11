interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div
            className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600`}
          ></div>
        </div>
      </div>
    </div>
  );
}
