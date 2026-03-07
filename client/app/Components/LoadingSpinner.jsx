export default function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-rose-200 border-t-rose-600 rounded-full animate-spin`}
      />
    </div>
  );
}
