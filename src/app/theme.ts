/**
 * Theme configuration for Ink CLI
 */

// Color palette
export const colors = {
  primary: 'yellow',
  secondary: 'cyan',
  success: 'green',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
  muted: 'gray',

  // Tier colors
  tier: {
    default: 'white',
    bronze: 'yellow',
    silver: 'white',
    gold: 'yellow',
  },
} as const;

// Achievement icons
export const icons = {
  'pair-extraordinaire': '👥',
  'pull-shark': '🦈',
  'galaxy-brain': '🧠',
  'quickdraw': '🤠',
  'yolo': '🎲',
} as const;

// Status symbols
export const symbols = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
  arrow: '→',
  arrowRight: '›',
  bullet: '•',
  checkbox: '☐',
  checkboxChecked: '☑',
  radioOn: '◉',
  radioOff: '○',
  star: '★',
  progress: {
    filled: '█',
    empty: '░',
  },
} as const;

// Tier display names
export const tierNames = {
  default: 'Default',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
} as const;

// Achievement tier requirements
export const tierCounts = {
  'pair-extraordinaire': { default: 1, bronze: 10, silver: 24, gold: 48 },
  'pull-shark': { default: 2, bronze: 16, silver: 128, gold: 1024 },
  'galaxy-brain': { default: 2, bronze: 8, silver: 16, gold: 32 },
  'quickdraw': { default: 1, bronze: 1, silver: 1, gold: 1 }, // Single tier
  'yolo': { default: 1, bronze: 1, silver: 1, gold: 1 }, // Single tier
} as const;

// Achievement metadata
export const achievements = {
  'pair-extraordinaire': {
    name: 'Pair Extraordinaire',
    description: 'Coauthored commits on merged pull requests',
    icon: '👥',
    tiers: ['default', 'bronze', 'silver', 'gold'] as const,
    requiresHelper: false,
    requiresDiscussions: false,
  },
  'pull-shark': {
    name: 'Pull Shark',
    description: 'Opened pull requests that have been merged',
    icon: '🦈',
    tiers: ['default', 'bronze', 'silver', 'gold'] as const,
    requiresHelper: false,
    requiresDiscussions: false,
  },
  'galaxy-brain': {
    name: 'Galaxy Brain',
    description: 'Answered discussions (requires helper account)',
    icon: '🧠',
    tiers: ['default', 'bronze', 'silver', 'gold'] as const,
    requiresHelper: true,
    requiresDiscussions: true,
  },
  'quickdraw': {
    name: 'Quickdraw',
    description: 'Closed an issue within 5 minutes of opening',
    icon: '🤠',
    tiers: ['default'] as const,
    requiresHelper: false,
    requiresDiscussions: false,
  },
  'yolo': {
    name: 'YOLO',
    description: 'Merged PR without code review (requires helper account)',
    icon: '🎲',
    tiers: ['default'] as const,
    requiresHelper: true,
    requiresDiscussions: false,
  },
} as const;

export type AchievementId = keyof typeof achievements;
export type TierLevel = 'default' | 'bronze' | 'silver' | 'gold';
