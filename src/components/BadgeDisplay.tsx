'use client';

import { useState } from 'react';
import { Award, Trophy, Star, Medal, Crown, Zap, Heart, Shield, Trees } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
  category: 'sustainability' | 'trading' | 'community' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  xpReward: number;
}

interface BadgeDisplayProps {
  badges: string[];
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const BADGE_CONFIG: Record<string, Badge> = {
  // Sustainability Badges
  'Eco Starter': {
    id: 'eco_starter',
    name: 'Eco Starter',
    description: 'List your first sustainable item',
    icon: '🌱',
    color: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    category: 'sustainability',
    rarity: 'common',
    requirement: 'List 1+ sustainable item',
    xpReward: 10,
  },
  'Sustainable Hero': {
    id: 'sustainable_hero',
    name: 'Sustainable Hero',
    description: 'List 10+ sustainable items',
    icon: '🌿',
    color: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
    category: 'sustainability',
    rarity: 'uncommon',
    requirement: 'List 10+ sustainable items',
    xpReward: 50,
  },
  'Planet Protector': {
    id: 'planet_protector',
    name: 'Planet Protector',
    description: 'Help save 100kg of CO2',
    icon: '🌍',
    color: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
    category: 'sustainability',
    rarity: 'rare',
    requirement: 'Prevent 100kg CO2 emissions',
    xpReward: 100,
  },
  'Earth Guardian': {
    id: 'earth_guardian',
    name: 'Earth Guardian',
    description: 'Save 500kg of CO2',
    icon: '🌳',
    color: { bg: 'bg-green-200', text: 'text-green-900', border: 'border-green-400' },
    category: 'sustainability',
    rarity: 'epic',
    requirement: 'Prevent 500kg CO2 emissions',
    xpReward: 250,
  },
  
  // Trading Badges
  'Top Seller': {
    id: 'top_seller',
    name: 'Top Seller',
    description: 'Complete 10+ successful sales',
    icon: '🏆',
    color: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
    category: 'trading',
    rarity: 'rare',
    requirement: 'Complete 10+ sales',
    xpReward: 100,
  },
  'Super Seller': {
    id: 'super_seller',
    name: 'Super Seller',
    description: 'Complete 50+ successful sales',
    icon: '👑',
    color: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    category: 'trading',
    rarity: 'epic',
    requirement: 'Complete 50+ sales',
    xpReward: 250,
  },
  'Quick Responder': {
    id: 'quick_responder',
    name: 'Quick Responder',
    description: 'Respond to messages within 1 hour consistently',
    icon: '⚡',
    color: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    category: 'trading',
    rarity: 'uncommon',
    requirement: 'Maintain 1hr response time',
    xpReward: 30,
  },
  'Trusted Trader': {
    id: 'trusted_trader',
    name: 'Trusted Trader',
    description: 'Maintain a 4.8+ rating with 10+ reviews',
    icon: '✅',
    color: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    category: 'trading',
    rarity: 'rare',
    requirement: '4.8+ rating with 10+ reviews',
    xpReward: 75,
  },
  
  // Community Badges
  'Community Star': {
    id: 'community_star',
    name: 'Community Star',
    description: 'Receive 50+ positive reviews',
    icon: '⭐',
    color: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
    category: 'community',
    rarity: 'epic',
    requirement: 'Receive 50+ reviews',
    xpReward: 200,
  },
  'Helpful Neighbor': {
    id: 'helpful_neighbor',
    name: 'Helpful Neighbor',
    description: 'Help 5 different community members',
    icon: '🤝',
    color: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
    category: 'community',
    rarity: 'uncommon',
    requirement: 'Help 5+ different users',
    xpReward: 40,
  },
  'Mentor': {
    id: 'mentor',
    name: 'Mentor',
    description: 'Guide 10 new members on their first trade',
    icon: '📚',
    color: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
    category: 'community',
    rarity: 'rare',
    requirement: 'Guide 10+ new traders',
    xpReward: 100,
  },
  
  // Special Badges
  'First Listing': {
    id: 'first_listing',
    name: 'First Listing',
    description: 'Create your first listing',
    icon: '📦',
    color: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    category: 'special',
    rarity: 'common',
    requirement: 'Create 1 listing',
    xpReward: 5,
  },
  'First Sale': {
    id: 'first_sale',
    name: 'First Sale',
    description: 'Complete your first successful sale',
    icon: '🎉',
    color: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    category: 'special',
    rarity: 'uncommon',
    requirement: 'Complete 1 sale',
    xpReward: 25,
  },
  'Streak Master': {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 30-day activity streak',
    icon: '🔥',
    color: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    category: 'special',
    rarity: 'epic',
    requirement: '30-day activity streak',
    xpReward: 150,
  },
  'Review Master': {
    id: 'review_master',
    name: 'Review Master',
    description: 'Leave 20+ helpful reviews',
    icon: '✍️',
    color: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
    category: 'community',
    rarity: 'rare',
    requirement: 'Leave 20+ reviews',
    xpReward: 80,
  },
  'Bundle Boss': {
    id: 'bundle_boss',
    name: 'Bundle Boss',
    description: 'Create 5 Move-Out bundles',
    icon: '📦',
    color: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    category: 'special',
    rarity: 'uncommon',
    requirement: 'Create 5 bundles',
    xpReward: 50,
  },
  'Freebie Friend': {
    id: 'freebie_friend',
    name: 'Freebie Friend',
    description: 'Give away 10+ items for free',
    icon: '🎁',
    color: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    category: 'sustainability',
    rarity: 'uncommon',
    requirement: 'Give 10+ free items',
    xpReward: 40,
  },
};

const rarityOrder = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

const rarityGlow: Record<string, string> = {
  legendary: 'shadow-lg shadow-yellow-400/50',
  epic: 'shadow-lg shadow-purple-400/50',
  rare: 'shadow-md shadow-blue-400/30',
  uncommon: 'shadow-sm',
  common: '',
};

export default function BadgeDisplay({ 
  badges, 
  showDetails = false, 
  size = 'md',
  compact = false 
}: BadgeDisplayProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  if (!badges || badges.length === 0) {
    return compact ? (
      <span className="text-sm text-gray-500">No badges yet</span>
    ) : null;
  }

  const sortedBadges = [...badges].sort((a, b) => {
    const rarityA = BADGE_CONFIG[a]?.rarity || 'common';
    const rarityB = BADGE_CONFIG[b]?.rarity || 'common';
    return rarityOrder[rarityB] - rarityOrder[rarityA];
  });

  const sizeClasses = {
    sm: {
      badge: 'px-2 py-0.5 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    md: {
      badge: 'px-3 py-1 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
    },
    lg: {
      badge: 'px-4 py-2 text-base',
      icon: 'w-6 h-6',
      gap: 'gap-2',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className="flex flex-wrap gap-2">
      {sortedBadges.map((badgeName) => {
        const badge = BADGE_CONFIG[badgeName];
        if (!badge) return null;

        return (
          <div
            key={badgeName}
            className={`relative ${rarityGlow[badge.rarity]}`}
            onMouseEnter={() => setHoveredBadge(badgeName)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <span
              className={`inline-flex items-center ${sizes.gap} rounded-full border ${badge.color.bg} ${badge.color.text} ${badge.color.border} ${sizes.badge} cursor-pointer transition-all hover:scale-105`}
            >
              <span className={sizes.icon}>{badge.icon}</span>
              {!compact && <span className="font-medium">{badgeName}</span>}
            </span>

            {/* Tooltip */}
            {showDetails && hoveredBadge === badgeName && (
              <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white rounded-xl shadow-xl border border-gray-100">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{badge.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                        badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                        badge.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {badge.rarity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{badge.requirement}</p>
                    <p className="text-xs font-medium text-amber-600 mt-1">+{badge.xpReward} XP</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Badge Collection View Component
export function BadgeCollection({ earnedBadges, allBadges = false }: { earnedBadges: string[], allBadges?: boolean }) {
  const displayBadges = allBadges 
    ? Object.values(BADGE_CONFIG) 
    : Object.values(BADGE_CONFIG).filter(b => earnedBadges.includes(b.name));

  const earnedCount = displayBadges.filter(b => earnedBadges.includes(b.name)).length;
  const totalCount = displayBadges.length;

  // Group by category
  const groupedBadges = displayBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) acc[badge.category] = [];
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, typeof displayBadges>);

  const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    sustainability: { label: 'Sustainability', icon: <Trees className="w-4 h-4" /> },
    trading: { label: 'Trading', icon: <Trophy className="w-4 h-4" /> },
    community: { label: 'Community', icon: <Heart className="w-4 h-4" /> },
    special: { label: 'Special', icon: <Award className="w-4 h-4" /> },
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-primary to-ubc-blue rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Badge Collection</h3>
            <p className="text-sm text-white/80">{earnedCount} of {totalCount} badges earned</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round((earnedCount / totalCount) * 100)}%</div>
            <div className="text-xs text-white/80">Complete</div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(earnedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Badges by Category */}
      {Object.entries(groupedBadges).map(([category, badges]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-500">{categoryLabels[category]?.icon}</span>
            <h4 className="font-semibold text-gray-900">{categoryLabels[category]?.label}</h4>
            <span className="text-sm text-gray-500">
              ({badges.filter(b => earnedBadges.includes(b.name)).length}/{badges.length})
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map((badge) => {
              const isEarned = earnedBadges.includes(badge.name);
              return (
                <div
                  key={badge.id}
                  className={`relative p-3 rounded-xl border transition-all ${
                    isEarned
                      ? `${badge.color.bg} ${badge.color.border} hover:shadow-md`
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-3xl block mb-1">{badge.icon}</span>
                    <span className={`text-sm font-medium ${isEarned ? badge.color.text : 'text-gray-500'}`}>
                      {badge.name}
                    </span>
                  </div>
                  {!isEarned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-xl">
                      <span className="text-xs text-gray-400">Locked</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
