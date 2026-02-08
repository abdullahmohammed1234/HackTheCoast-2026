import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate completed transactions as seller and buyer
    const sellerTransactions = await Transaction.find({
      sellerId: user._id,
      status: 'completed'
    });

    const buyerTransactions = await Transaction.find({
      buyerId: user._id,
      status: 'completed'
    });

    const totalCompleted = sellerTransactions.length + buyerTransactions.length;

    // Calculate impact metrics
    const itemsReused = totalCompleted;
    const itemsPurchased = buyerTransactions.length;
    const wasteSaved = itemsReused * 2.5; // kg
    const co2Prevented = itemsReused * 5.0; // kg
    const waterSaved = itemsReused * 100; // liters
    const energySaved = itemsReused * 10; // kWh
    const treesEquivalent = co2Prevented / 21; // Average tree absorbs ~21kg CO2/year

    // Calculate XP and Level
    const levelXp = calculateLevelXp(totalCompleted, user.sustainableListings || 0, user.reviewCount || 0);
    
    const { level, xp, xpToNextLevel } = calculateLevel(levelXp);

    // Calculate streak (simplified - would need activity tracking in production)
    const streak = calculateStreak(user.createdAt, totalCompleted);

    // Calculate achievements
    const achievements = calculateAchievements({
      itemsReused,
      co2Prevented,
      streak,
      totalSales: sellerTransactions.length,
      sustainableListings: user.sustainableListings || 0,
      reviews: user.reviewCount || 0,
      rating: user.rating || 0,
    });

    // Determine earned badges based on achievements
    const earnedBadges = determineEarnedBadges({
      itemsReused,
      co2Prevented,
      streak,
      totalSales: sellerTransactions.length,
      sustainableListings: user.sustainableListings || 0,
      reviews: user.reviewCount || 0,
      rating: user.rating || 0,
    });

    return NextResponse.json({
      stats: {
        itemsReused,
        itemsPurchased,
        wasteSaved: Math.round(wasteSaved * 10) / 10,
        co2Prevented: Math.round(co2Prevented * 10) / 10,
        waterSaved: Math.round(waterSaved),
        energySaved: Math.round(energySaved * 10) / 10,
        treesEquivalent: Math.round(treesEquivalent * 100) / 100,
        level,
        xp,
        xpToNextLevel,
        streak,
        totalSales: sellerTransactions.length,
        sustainableListings: user.sustainableListings || 0,
        reviewCount: user.reviewCount || 0,
        rating: user.rating || 0,
      },
      achievements,
      badges: earnedBadges,
    });
  } catch (error) {
    console.error('Error fetching impact stats:', error);
    return NextResponse.json({ error: 'Failed to fetch impact statistics' }, { status: 500 });
  }
}

function calculateLevelXp(completedTransactions: number, sustainableListings: number, reviews: number): number {
  // XP calculations
  const transactionXp = completedTransactions * 10; // 10 XP per completed transaction
  const sustainabilityXp = sustainableListings * 5; // 5 XP per sustainable listing
  const reviewXp = reviews * 2; // 2 XP per review received
  
  return transactionXp + sustainabilityXp + reviewXp;
}

interface LevelResult {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

function calculateLevel(totalXp: number): LevelResult {
  // Level progression: each level requires more XP
  let level = 1;
  let remainingXp = totalXp;
  let xpNeeded = 100;
  
  while (remainingXp >= xpNeeded && level < 100) {
    remainingXp -= xpNeeded;
    level++;
    
    // Increase XP requirement as level increases
    if (level <= 10) {
      xpNeeded = 100;
    } else if (level <= 25) {
      xpNeeded = 200;
    } else if (level <= 50) {
      xpNeeded = 400;
    } else {
      xpNeeded = 800;
    }
  }
  
  return {
    level,
    xp: Math.round(remainingXp),
    xpToNextLevel: xpNeeded,
  };
}

function calculateStreak(createdAt: Date, totalCompleted: number): number {
  // Simplified streak calculation
  const memberSince = new Date(createdAt);
  const now = new Date();
  const daysSinceJoin = Math.floor((now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
  
  // Max streak can't exceed days since joining
  const activityDays = Math.min(daysSinceJoin, totalCompleted * 2);
  
  return Math.min(activityDays, 365); // Cap at 365 days
}

interface AchievementStats {
  itemsReused: number;
  co2Prevented: number;
  streak: number;
  totalSales: number;
  sustainableListings: number;
  reviews: number;
  rating: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  achieved: boolean;
}

interface Achievements {
  firstReuse: Achievement;
  ecoWarrior5: Achievement;
  ecoWarrior10: Achievement;
  ecoWarrior25: Achievement;
  ecoWarrior50: Achievement;
  co2Hero: Achievement;
  co2Champion: Achievement;
  weeklyStreak: Achievement;
  monthlyStreak: Achievement;
  topSeller: Achievement;
  trustedTrader: Achievement;
}

function calculateAchievements(stats: AchievementStats): Achievements {
  return {
    firstReuse: {
      id: 'first_reuse',
      title: 'First Step',
      description: 'Reuse your first item',
      progress: Math.min(stats.itemsReused, 1),
      target: 1,
      achieved: stats.itemsReused >= 1,
    },
    ecoWarrior5: {
      id: 'eco_warrior_5',
      title: 'Eco Warrior',
      description: 'Reuse 5 items',
      progress: Math.min(stats.itemsReused, 5),
      target: 5,
      achieved: stats.itemsReused >= 5,
    },
    ecoWarrior10: {
      id: 'eco_warrior_10',
      title: 'Sustainability Champion',
      description: 'Reuse 10 items',
      progress: Math.min(stats.itemsReused, 10),
      target: 10,
      achieved: stats.itemsReused >= 10,
    },
    ecoWarrior25: {
      id: 'eco_warrior_25',
      title: 'Planet Protector',
      description: 'Reuse 25 items',
      progress: Math.min(stats.itemsReused, 25),
      target: 25,
      achieved: stats.itemsReused >= 25,
    },
    ecoWarrior50: {
      id: 'eco_warrior_50',
      title: 'Earth Guardian',
      description: 'Reuse 50 items',
      progress: Math.min(stats.itemsReused, 50),
      target: 50,
      achieved: stats.itemsReused >= 50,
    },
    co2Hero: {
      id: 'co2_hero',
      title: 'CO₂ Hero',
      description: 'Prevent 50kg of CO₂',
      progress: Math.min(stats.co2Prevented, 50),
      target: 50,
      achieved: stats.co2Prevented >= 50,
    },
    co2Champion: {
      id: 'co2_champion',
      title: 'CO₂ Champion',
      description: 'Prevent 100kg of CO₂',
      progress: Math.min(stats.co2Prevented, 100),
      target: 100,
      achieved: stats.co2Prevented >= 100,
    },
    weeklyStreak: {
      id: 'streak_week',
      title: 'Weekly Warrior',
      description: '7-day activity streak',
      progress: Math.min(stats.streak, 7),
      target: 7,
      achieved: stats.streak >= 7,
    },
    monthlyStreak: {
      id: 'streak_month',
      title: 'Monthly Master',
      description: '30-day activity streak',
      progress: Math.min(stats.streak, 30),
      target: 30,
      achieved: stats.streak >= 30,
    },
    topSeller: {
      id: 'top_seller',
      title: 'Top Seller',
      description: 'Complete 10 sales',
      progress: Math.min(stats.totalSales, 10),
      target: 10,
      achieved: stats.totalSales >= 10,
    },
    trustedTrader: {
      id: 'trusted_trader',
      title: 'Trusted Trader',
      description: 'Achieve 4.8+ rating',
      progress: stats.rating >= 4.8 ? 1 : stats.rating / 4.8,
      target: 1,
      achieved: stats.rating >= 4.8,
    },
  };
}

function determineEarnedBadges(stats: AchievementStats): string[] {
  const earnedBadges: string[] = [];

  // Map achievements to badges
  if (stats.itemsReused >= 1) earnedBadges.push('First Sale');
  if (stats.itemsReused >= 5) earnedBadges.push('Sustainable Hero');
  if (stats.itemsReused >= 10) earnedBadges.push('Planet Protector');
  if (stats.itemsReused >= 25) earnedBadges.push('Earth Guardian');
  if (stats.co2Prevented >= 100) earnedBadges.push('Planet Protector');
  if (stats.totalSales >= 10) earnedBadges.push('Top Seller');
  if (stats.totalSales >= 50) earnedBadges.push('Super Seller');
  if (stats.rating >= 4.8) earnedBadges.push('Trusted Trader');
  if (stats.streak >= 7) earnedBadges.push('Streak Master');
  if (stats.streak >= 30) earnedBadges.push('Streak Master');
  if (stats.reviews >= 20) earnedBadges.push('Review Master');

  // Remove duplicates
  const uniqueBadges = Array.from(new Set(earnedBadges));
  return uniqueBadges;
}
