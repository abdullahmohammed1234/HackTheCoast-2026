// Badge and Achievement Calculation Utilities

export interface UserStats {
  totalSales: number;
  sustainableListings: number;
  reviewCount: number;
  rating: number;
  followersCount: number;
  followingCount: number;
  itemsReused: number;
  co2Prevented: number;
  waterSaved: number;
  energySaved: number;
  streak: number;
  daysActive: number;
  reviewsGiven: number;
  bundlesCreated: number;
  freeItemsGiven: number;
}

// XP values for different actions
export const XP_VALUES = {
  LISTING_CREATED: 5,
  LISTING_SOLD: 15,
  REVIEW_RECEIVED: 3,
  REVIEW_GIVEN: 2,
  FOLLOWER_GAINED: 1,
  BUNDLE_CREATED: 10,
  FREE_ITEM_GIVEN: 8,
  STREAK_BONUS: 5,
  SUSTAINABLE_ITEM: 3,
};

// Badge definitions with thresholds
interface BadgeDefinition {
  name: string;
  description: string;
  threshold: number;
  stat: string;
  xpReward: number;
  comparison?: '>=';
}

export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  // Trading badges
  firstSale: {
    name: 'First Sale',
    description: 'Complete your first successful sale',
    threshold: 1,
    stat: 'totalSales',
    xpReward: 25,
  },
  topSeller: {
    name: 'Top Seller',
    description: 'Complete 10 successful sales',
    threshold: 10,
    stat: 'totalSales',
    xpReward: 100,
  },
  superSeller: {
    name: 'Super Seller',
    description: 'Complete 50 successful sales',
    threshold: 50,
    stat: 'totalSales',
    xpReward: 250,
  },
  
  // Sustainability badges
  ecoStarter: {
    name: 'Eco Starter',
    description: 'List your first sustainable item',
    threshold: 1,
    stat: 'sustainableListings',
    xpReward: 10,
  },
  sustainableHero: {
    name: 'Sustainable Hero',
    description: 'List 10 sustainable items',
    threshold: 10,
    stat: 'sustainableListings',
    xpReward: 50,
  },
  planetProtector: {
    name: 'Planet Protector',
    description: 'Help save 100kg of CO2',
    threshold: 100,
    stat: 'co2Prevented',
    xpReward: 100,
  },
  earthGuardian: {
    name: 'Earth Guardian',
    description: 'Save 500kg of CO2',
    threshold: 500,
    stat: 'co2Prevented',
    xpReward: 250,
  },
  
  // Community badges
  communityStar: {
    name: 'Community Star',
    description: 'Receive 50 positive reviews',
    threshold: 50,
    stat: 'reviewCount',
    xpReward: 200,
  },
  helpfulNeighbor: {
    name: 'Helpful Neighbor',
    description: 'Get 10 followers',
    threshold: 10,
    stat: 'followersCount',
    xpReward: 40,
  },
  reviewMaster: {
    name: 'Review Master',
    description: 'Leave 20 helpful reviews',
    threshold: 20,
    stat: 'reviewsGiven',
    xpReward: 80,
  },
  
  // Special badges
  bundleBoss: {
    name: 'Bundle Boss',
    description: 'Create 5 Move-Out bundles',
    threshold: 5,
    stat: 'bundlesCreated',
    xpReward: 50,
  },
  freebieFriend: {
    name: 'Freebie Friend',
    description: 'Give away 10 items for free',
    threshold: 10,
    stat: 'freeItemsGiven',
    xpReward: 40,
  },
  streakMaster: {
    name: 'Streak Master',
    description: 'Maintain a 30-day activity streak',
    threshold: 30,
    stat: 'streak',
    xpReward: 150,
  },
  trustedTrader: {
    name: 'Trusted Trader',
    description: 'Maintain a 4.8+ rating',
    threshold: 4.8,
    stat: 'rating',
    xpReward: 75,
    comparison: '>=',
  },
};

// Calculate total XP for a user
export function calculateTotalXP(stats: UserStats): number {
  let totalXP = 0;
  
  // XP from completed sales
  totalXP += stats.totalSales * XP_VALUES.LISTING_SOLD;
  
  // XP from listings
  totalXP += stats.sustainableListings * XP_VALUES.SUSTAINABLE_ITEM;
  
  // XP from reviews received
  totalXP += stats.reviewCount * XP_VALUES.REVIEW_RECEIVED;
  
  // XP from reviews given
  totalXP += stats.reviewsGiven * XP_VALUES.REVIEW_GIVEN;
  
  // XP from followers
  totalXP += stats.followersCount * XP_VALUES.FOLLOWER_GAINED;
  
  // XP from bundles
  totalXP += stats.bundlesCreated * XP_VALUES.BUNDLE_CREATED;
  
  // XP from free items
  totalXP += stats.freeItemsGiven * XP_VALUES.FREE_ITEM_GIVEN;
  
  // XP from streak (simplified)
  totalXP += Math.floor(stats.streak / 7) * XP_VALUES.STREAK_BONUS;
  
  return totalXP;
}

// Calculate user level from XP
export function calculateLevel(xp: number): { level: number; xpInCurrentLevel: number; xpToNextLevel: number } {
  let level = 1;
  let xpNeeded = 100;
  let remainingXP = xp;
  
  while (remainingXP >= xpNeeded && level < 100) {
    remainingXP -= xpNeeded;
    level++;
    
    // Increase XP requirement based on level
    if (level <= 10) {
      xpNeeded = 100;
    } else if (level <= 25) {
      xpNeeded = 200;
    } else if (level <= 50) {
      xpNeeded = 400;
    } else if (level <= 75) {
      xpNeeded = 800;
    } else {
      xpNeeded = 1600;
    }
  }
  
  return {
    level,
    xpInCurrentLevel: remainingXP,
    xpToNextLevel: xpNeeded,
  };
}

// Calculate progress percentage for a badge
export function calculateBadgeProgress(stats: UserStats, badgeKey: keyof typeof BADGE_DEFINITIONS): number {
  const badge = BADGE_DEFINITIONS[badgeKey];
  const statValue = stats[badge.stat as keyof UserStats] as number;
  
  if (badge.comparison === '>=') {
    return Math.min((statValue / badge.threshold) * 100, 100);
  }
  
  return Math.min((statValue / badge.threshold) * 100, 100);
}

// Check if user has earned a badge
export function hasEarnedBadge(stats: UserStats, badgeKey: keyof typeof BADGE_DEFINITIONS): boolean {
  const badge = BADGE_DEFINITIONS[badgeKey];
  const statValue = stats[badge.stat as keyof UserStats] as number;
  
  if (badge.comparison === '>=') {
    return statValue >= badge.threshold;
  }
  
  return statValue >= badge.threshold;
}

// Get all earned badges for a user
export function getEarnedBadges(stats: UserStats): { name: string; xpReward: number }[] {
  const earnedBadges: { name: string; xpReward: number }[] = [];
  
  for (const [key, badge] of Object.entries(BADGE_DEFINITIONS)) {
    if (hasEarnedBadge(stats, key as keyof typeof BADGE_DEFINITIONS)) {
      earnedBadges.push({
        name: badge.name,
        xpReward: badge.xpReward,
      });
    }
  }
  
  return earnedBadges;
}

// Calculate impact metrics
export function calculateImpactStats(stats: UserStats) {
  return {
    itemsReused: stats.itemsReused,
    wasteSaved: stats.itemsReused * 2.5, // kg
    co2Prevented: stats.itemsReused * 5.0, // kg
    waterSaved: stats.itemsReused * 100, // liters
    energySaved: stats.itemsReused * 10, // kWh
    treesEquivalent: (stats.itemsReused * 5.0) / 21, // CO2 / tree absorption rate
  };
}

// Get level title based on level
export function getLevelTitle(level: number): string {
  if (level >= 75) return 'Sustainability Legend';
  if (level >= 50) return 'Eco Champion';
  if (level >= 35) return 'Green Guardian';
  if (level >= 25) return 'Eco Warrior';
  if (level >= 15) return 'Sustainability Champion';
  if (level >= 10) return 'Green Apprentice';
  if (level >= 5) return 'Eco Learner';
  return 'Newcomer';
}

// Calculate streak bonus XP
export function calculateStreakBonus(streak: number): number {
  if (streak >= 30) return 150; // Monthly streak bonus
  if (streak >= 14) return 75; // Two-week streak
  if (streak >= 7) return 35; // Weekly streak
  if (streak >= 3) return 10; // Small streak
  return 0;
}

// Generate daily challenge
export function getDailyChallenge(stats: UserStats): { title: string; description: string; xpReward: number; completed: boolean } {
  const challenges = [
    {
      title: 'List an Item',
      description: 'Create a new listing today',
      xpReward: 10,
      completed: false,
      check: () => stats.sustainableListings > 0,
    },
    {
      title: 'Leave a Review',
      description: 'Write a helpful review for another user',
      xpReward: 5,
      completed: stats.reviewsGiven > 0,
      check: () => true,
    },
    {
      title: 'Check Messages',
      description: 'Respond to any pending messages',
      xpReward: 5,
      completed: false,
      check: () => true,
    },
    {
      title: 'Create a Bundle',
      description: 'List a Move-Out bundle',
      xpReward: 15,
      completed: stats.bundlesCreated > 0,
      check: () => true,
    },
    {
      title: 'Give Free',
      description: 'List an item as free',
      xpReward: 10,
      completed: stats.freeItemsGiven > 0,
      check: () => true,
    },
  ];
  
  return challenges[Math.floor(Math.random() * challenges.length)];
}
