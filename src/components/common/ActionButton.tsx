interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  variant: 'correct' | 'incorrect';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function ActionButton({
  onClick,
  variant,
  children,
  className = '',
  size = 'md',
  disabled = false,
}: ActionButtonProps) {
  const baseClasses = 'rounded-md transition-colors font-medium';

  const variantClasses = {
    correct: disabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-green-500 hover:bg-green-600 text-white',
    incorrect: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
