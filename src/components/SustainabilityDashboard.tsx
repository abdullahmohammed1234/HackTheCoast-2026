'use client';

import { useState, useEffect } from 'react';
import { 
  Leaf, 
  Recycle, 
  CloudRain, 
  TreePine, 
  TrendingUp,
  Award,
  Target,
  Flame
} from 'lucide-react';

interface ImpactStats {
  itemsReused: number;
  itemsPurchased: number;
  wasteSaved: number; // in kg
  co2Prevented: number; // in kg
  waterSaved: number; // in liters
  energySaved: number; // in kWh
  treesEquivalent: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
}

interface SustainabilityDashboardProps {
  userId?: string;
  showDetails?: boolean;
}

const IMPACT_MULTIPLIERS = {
  wastePerItem: 2.5, // kg of waste saved per item reused
  co2PerItem: 5.0, // kg CO2 prevented per item reused
  waterPerItem: 100, // liters of water saved per item reused
  energyPerItem: 10, // kWh energy saved per item reused
};

export default function SustainabilityDashboard({ 
  userId, 
  showDetails = true 
}: SustainabilityDashboardProps) {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'impact' | 'achievements' | 'goals'>('impact');

  useEffect(() => {
    fetchImpactStats();
  }, [userId]);

  const fetchImpactStats = async () => {
    try {
      const response = await fetch('/api/profile/impact');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Use default stats if API fails
        setStats({
          itemsReused: 0,
          itemsPurchased: 0,
          wasteSaved: 0,
          co2Prevented: 0,
          waterSaved: 0,
          energySaved: 0,
          treesEquivalent: 0,
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          streak: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch impact stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-green-200 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-green-200 rounded-xl"></div>
          <div className="h-20 bg-green-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const levelProgress = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Your Sustainability Impact</h2>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <Flame className="h-4 w-4 text-orange-300" />
            <span className="text-sm font-medium">{stats.streak} day streak</span>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              Level {stats.level} Eco-Warrior
            </span>
            <span>{stats.xp} / {stats.xpToNextLevel} XP</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      {showDetails && (
        <div className="flex border-b border-green-100">
          {(['impact', 'achievements', 'goals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-green-700 border-b-2 border-green-600 bg-white/50'
                  : 'text-green-600 hover:bg-white/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {activeTab === 'impact' && (
          <ImpactStatsDisplay stats={stats} />
        )}
        {activeTab === 'achievements' && (
          <AchievementsDisplay stats={stats} />
        )}
        {activeTab === 'goals' && (
          <GoalsDisplay stats={stats} />
        )}
      </div>
    </div>
  );
}

function ImpactStatsDisplay({ stats }: { stats: ImpactStats }) {
  const impactItems = [
    {
      label: 'Items Reused',
      value: stats.itemsReused,
      unit: 'items',
      icon: Recycle,
      color: 'text-green-600',
      bg: 'bg-green-100',
      description: 'Items given a second life',
    },
    {
      label: 'Waste Saved',
      value: (stats.wasteSaved || 0).toFixed(1),
      unit: 'kg',
      icon: CloudRain,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: 'Prevented from landfill',
    },
    {
      label: 'CO₂ Prevented',
      value: (stats.co2Prevented || 0).toFixed(1),
      unit: 'kg',
      icon: TreePine,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      description: 'Carbon emissions avoided',
    },
    {
      label: 'Water Saved',
      value: (stats.waterSaved || 0).toFixed(0),
      unit: 'L',
      icon: CloudRain,
      color: 'text-cyan-600',
      bg: 'bg-cyan-100',
      description: 'Conservation impact',
    },
    {
      label: 'Energy Saved',
      value: (stats.energySaved || 0).toFixed(1),
      unit: 'kWh',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      description: 'Reduced production needs',
    },
    {
      label: 'Trees Equivalent',
      value: (stats.treesEquivalent || 0).toFixed(2),
      unit: 'trees',
      icon: TreePine,
      color: 'text-green-700',
      bg: 'bg-green-200',
      description: 'Carbon absorption equivalent',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {impactItems.slice(0, 4).map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-xl p-3 transition-all hover:scale-105 cursor-pointer`}
            title={item.description}
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {item.value}
              <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {impactItems.slice(4).map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-xl p-3 transition-all hover:scale-105 cursor-pointer`}
            title={item.description}
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {item.value}
              <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Environmental Tip */}
      <div className="mt-4 p-3 bg-white/60 rounded-xl text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <Leaf className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          {getEnvironmentalTip(stats.itemsReused)}
        </p>
      </div>
    </div>
  );
}

function AchievementsDisplay({ stats }: { stats: ImpactStats }) {
  const achievements = [
    {
      id: 'first_reuse',
      title: 'First Step',
      description: 'Reuse your first item',
      icon: '🌱',
      progress: Math.min(stats.itemsReused, 1),
      target: 1,
      unlocked: stats.itemsReused >= 1,
    },
    {
      id: 'eco_warrior_5',
      title: 'Eco Warrior',
      description: 'Reuse 5 items',
      icon: '🌿',
      progress: Math.min(stats.itemsReused, 5),
      target: 5,
      unlocked: stats.itemsReused >= 5,
    },
    {
      id: 'eco_warrior_10',
      title: 'Sustainability Champion',
      description: 'Reuse 10 items',
      icon: '🏆',
      progress: Math.min(stats.itemsReused, 10),
      target: 10,
      unlocked: stats.itemsReused >= 10,
    },
    {
      id: 'eco_warrior_25',
      title: 'Planet Protector',
      description: 'Reuse 25 items',
      icon: '🌍',
      progress: Math.min(stats.itemsReused, 25),
      target: 25,
      unlocked: stats.itemsReused >= 25,
    },
    {
      id: 'eco_warrior_50',
      title: 'Earth Guardian',
      description: 'Reuse 50 items',
      icon: '⭐',
      progress: Math.min(stats.itemsReused, 50),
      target: 50,
      unlocked: stats.itemsReused >= 50,
    },
    {
      id: 'streak_week',
      title: 'Weekly Warrior',
      description: '7-day activity streak',
      icon: '🔥',
      progress: Math.min(stats.streak, 7),
      target: 7,
      unlocked: stats.streak >= 7,
    },
    {
      id: 'streak_month',
      title: 'Monthly Master',
      description: '30-day activity streak',
      icon: '💪',
      progress: Math.min(stats.streak, 30),
      target: 30,
      unlocked: stats.streak >= 30,
    },
    {
      id: 'co2_hero',
      title: 'CO₂ Hero',
      description: 'Prevent 50kg of CO₂',
      icon: '🌳',
      progress: Math.min(stats.co2Prevented, 50),
      target: 50,
      unlocked: stats.co2Prevented >= 50,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Achievements Unlocked</span>
        <span className="font-semibold text-green-600">
          {unlockedCount} / {totalCount}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative rounded-xl p-3 transition-all ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200'
                : 'bg-gray-50 border border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                {achievement.unlocked && achievement.target > 1 && (
                  <div className="mt-1 h-1 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            {achievement.unlocked && (
              <div className="absolute top-1 right-1">
                <span className="text-xs">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalsDisplay({ stats }: { stats: ImpactStats }) {
  const goals = [
    {
      title: 'Reach Level 5',
      description: 'Earn 500 XP to reach Level 5',
      icon: '🎯',
      current: stats.level >= 5 ? 500 : stats.xp,
      target: 500,
      achieved: stats.level >= 5,
    },
    {
      title: 'Reuse 100 Items',
      description: 'Give 100 items a second life',
      icon: '♻️',
      current: stats.itemsReused,
      target: 100,
      achieved: stats.itemsReused >= 100,
    },
    {
      title: 'Save 100kg CO₂',
      description: 'Prevent 100kg of carbon emissions',
      icon: '🌍',
      current: stats.co2Prevented,
      target: 100,
      achieved: stats.co2Prevented >= 100,
    },
    {
      title: '30-Day Streak',
      description: 'Maintain a 30-day activity streak',
      icon: '🔥',
      current: stats.streak,
      target: 30,
      achieved: stats.streak >= 30,
    },
  ];

  return (
    <div className="space-y-3">
      {goals.map((goal, index) => (
        <div
          key={index}
          className={`rounded-xl p-4 ${
            goal.achieved
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{goal.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold ${goal.achieved ? 'text-green-800' : 'text-gray-900'}`}>
                  {goal.title}
                </h4>
                {goal.achieved && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                    Achieved!
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
              {!goal.achieved && (
                <div className="relative">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{goal.current} / {goal.target}</span>
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEnvironmentalTip(itemsReused: number): string {
  const tips = [
    "Every item reused saves approximately 2.5kg of waste from entering landfills.",
    "By reusing items, you help reduce the demand for new product manufacturing.",
    "The average person generates about 4kg of waste per day. Your efforts make a difference!",
    "Reusing items is one of the most effective ways to reduce your carbon footprint.",
    "You've saved enough water to fill multiple bathtubs! Keep up the great work!",
    "Your CO₂ savings are equivalent to planting multiple trees!",
    "Thank you for being part of the sustainability movement!",
  ];
  
  if (itemsReused === 0) return tips[0];
  if (itemsReused < 5) return tips[1];
  if (itemsReused < 10) return tips[2];
  if (itemsReused < 25) return tips[3];
  if (itemsReused < 50) return tips[4];
  if (itemsReused < 100) return tips[5];
  return tips[6];
}
