/**
 * Achievement registry and factory
 */

import type { AchievementId, TierLevel, AppConfig, AchievementDefinition } from '../types/index.js';
import { BaseAchievement } from './base.js';
import { PairExtraordinaireAchievement } from './pairExtraordinaire.js';
import { PullSharkAchievement } from './pullShark.js';
import { QuickdrawAchievement } from './quickdraw.js';
import { GalaxyBrainAchievement } from './galaxyBrain.js';
import { YOLOAchievement } from './yolo.js';

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'pair-extraordinaire',
    name: 'Pair Extraordinaire',
    description: 'Coauthored commits on merged pull requests',
    icon: '👥',
    tiers: [
      { level: 'default', targetCount: 1, displayName: 'Default' },
      { level: 'bronze', targetCount: 10, displayName: 'Bronze' },
      { level: 'silver', targetCount: 24, displayName: 'Silver' },
      { level: 'gold', targetCount: 48, displayName: 'Gold' },
    ],
    estimatedTimePerUnit: 3000,
  },
  {
    id: 'pull-shark',
    name: 'Pull Shark',
    description: 'Opened pull requests that have been merged',
    icon: '🦈',
    tiers: [
      { level: 'default', targetCount: 2, displayName: 'Default' },
      { level: 'bronze', targetCount: 16, displayName: 'Bronze' },
      { level: 'silver', targetCount: 128, displayName: 'Silver' },
      { level: 'gold', targetCount: 1024, displayName: 'Gold' },
    ],
    estimatedTimePerUnit: 5000,
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    description: 'Answered discussions (requires helper account)',
    icon: '🧠',
    tiers: [
      { level: 'default', targetCount: 2, displayName: 'Default' },
      { level: 'bronze', targetCount: 8, displayName: 'Bronze' },
      { level: 'silver', targetCount: 16, displayName: 'Silver' },
      { level: 'gold', targetCount: 32, displayName: 'Gold' },
    ],
    estimatedTimePerUnit: 4000,
  },
  {
    id: 'quickdraw',
    name: 'Quickdraw',
    description: 'Closed an issue within 5 minutes of opening',
    icon: '🤠',
    tiers: [
      { level: 'default', targetCount: 1, displayName: 'Default' },
    ],
    estimatedTimePerUnit: 2000,
  },
  {
    id: 'yolo',
    name: 'YOLO',
    description: 'Merged PR without code review (requires helper account)',
    icon: '🎲',
    tiers: [
      { level: 'default', targetCount: 1, displayName: 'Default' },
    ],
    estimatedTimePerUnit: 5000,
  },
];

export function getAchievementDefinition(id: AchievementId): AchievementDefinition | undefined {
  return ACHIEVEMENT_DEFINITIONS.find(d => d.id === id);
}

export {
  BaseAchievement,
  PairExtraordinaireAchievement,
  PullSharkAchievement,
  QuickdrawAchievement,
  GalaxyBrainAchievement,
  YOLOAchievement,
};

/**
 * Create an achievement instance by ID
 */
export function createAchievement(
  config: AppConfig,
  achievementId: AchievementId,
  tier: TierLevel,
  targetCount: number
): BaseAchievement {
  switch (achievementId) {
    case 'pair-extraordinaire':
      return new PairExtraordinaireAchievement(config, tier, targetCount);

    case 'pull-shark':
      return new PullSharkAchievement(config, tier, targetCount);

    case 'quickdraw':
      return new QuickdrawAchievement(config, tier, targetCount);

    case 'galaxy-brain':
      return new GalaxyBrainAchievement(config, tier, targetCount);

    case 'yolo':
      return new YOLOAchievement(config, tier, targetCount);

    default:
      throw new Error(`Unknown achievement: ${achievementId}`);
  }
}

/**
 * Get target count for a tier
 */
export function getTargetCountForTier(
  achievementId: AchievementId,
  tier: TierLevel
): number {
  const definition = getAchievementDefinition(achievementId);
  if (!definition) {
    throw new Error(`Unknown achievement: ${achievementId}`);
  }

  const tierConfig = definition.tiers.find((t: { level: TierLevel }) => t.level === tier);
  if (!tierConfig) {
    throw new Error(`Unknown tier ${tier} for achievement ${achievementId}`);
  }

  return tierConfig.targetCount;
}

/**
 * Get list of available achievement IDs
 */
export function getAvailableAchievements(): AchievementId[] {
  return ACHIEVEMENT_DEFINITIONS.map((d: AchievementDefinition) => d.id);
}

/**
 * Check if an achievement ID is valid
 */
export function isValidAchievement(id: string): id is AchievementId {
  return getAvailableAchievements().includes(id as AchievementId);
}

/**
 * Get available tiers for an achievement
 */
export function getAvailableTiers(achievementId: AchievementId): TierLevel[] {
  const definition = getAchievementDefinition(achievementId);
  if (!definition) {
    return [];
  }

  return definition.tiers.map((t: { level: TierLevel }) => t.level);
}

export default {
  createAchievement,
  getTargetCountForTier,
  getAvailableAchievements,
  isValidAchievement,
  getAvailableTiers,
  ACHIEVEMENT_DEFINITIONS,
  getAchievementDefinition,
};
