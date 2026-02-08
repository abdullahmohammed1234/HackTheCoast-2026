'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

  const variantStyles = {
    text: 'rounded-lg',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
    animation: 'shimmer 1.5s infinite',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card-modern overflow-hidden">
      <Skeleton variant="rectangular" height="208px" className="w-full" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width="18px" height="18px" />
          <Skeleton variant="text" width="70px" height="14px" />
        </div>
        <Skeleton variant="text" width="85%" height="20px" />
        <div className="flex items-center gap-4">
          <Skeleton variant="text" width="90px" height="16px" />
          <Skeleton variant="text" width="70px" height="16px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonListings({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Add shimmer animation style
const shimmerStyle = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

// Inject the style
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shimmerStyle;
  document.head.appendChild(styleSheet);
}
