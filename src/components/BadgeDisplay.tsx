'use client';

interface Badge {
  name: string;
  description: string;
}

const badgeConfig: Record<string, { color: string; icon: string }> = {
  'Top Seller': {
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: '🏆',
  },
  'Sustainable Hero': {
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: '🌱',
  },
  'Quick Responder': {
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: '⚡',
  },
  'Trusted Trader': {
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: '✅',
  },
  'Community Star': {
    color: 'bg-pink-100 text-pink-800 border-pink-300',
    icon: '⭐',
  },
};

interface BadgeDisplayProps {
  badges: string[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export default function BadgeDisplay({ badges, size = 'md', showLabels = false }: BadgeDisplayProps) {
  if (!badges || badges.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badgeName) => {
        const config = badgeConfig[badgeName] || {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: '🎖️',
        };

        return (
          <span
            key={badgeName}
            className={`inline-flex items-center gap-1 rounded-full border ${config.color} ${sizeClasses[size]}`}
            title={badgeName}
          >
            <span>{config.icon}</span>
            {showLabels && <span className="font-medium">{badgeName}</span>}
          </span>
        );
      })}
    </div>
  );
}
