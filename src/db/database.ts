/**
 * JSON file-based database for progress tracking and persistence
 * Uses simple JSON files instead of SQLite for cross-platform compatibility
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import type {
  AchievementId,
  TierLevel,
  OperationStatus,
  OperationType,
  AchievementRecord,
  OperationRecord,
} from '../types/index.js';
import { PROJECT_ROOT } from '../utils/config.js';
import { DatabaseError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import { join } from 'path';

// Database file path (set dynamically based on username)
let DB_PATH = join(PROJECT_ROOT, 'achievements-data.json');
let currentUsername: string | null = null;

/**
 * Set the current username for database isolation
 */
export function setDatabaseUser(username: string): void {
  if (username !== currentUsername) {
    // Save current database if switching users
    if (db && currentUsername) {
      saveDatabase();
    }

    currentUsername = username;
    DB_PATH = join(PROJECT_ROOT, `achievements-data-${username}.json`);
    db = null; // Force reload for new user
    logger.debug(`Database set for user: ${username}`);
  }
}

/**
 * Get current database username
 */
export function getDatabaseUser(): string | null {
  return currentUsername;
}

// Database structure
interface DatabaseData {
  achievements: Record<string, AchievementRecord>;
  operations: OperationRecord[];
  config: Record<string, string>;
  nextOperationId: number;
}

// In-memory database
let db: DatabaseData | null = null;

/**
 * Load database from file
 */
function loadDatabase(): DatabaseData {
  if (existsSync(DB_PATH)) {
    try {
      const content = readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content) as DatabaseData;
    } catch (error) {
      logger.warn('Could not load database, starting fresh');
    }
  }

  return {
    achievements: {},
    operations: [],
    config: {},
    nextOperationId: 1,
  };
}

/**
 * Save database to file
 */
function saveDatabase(): void {
  if (!db) return;

  try {
    const dir = dirname(DB_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    logger.error('Failed to save database:', error);
  }
}

/**
 * Initialize the database
 */
export function initDatabase(): void {
  if (db) return;

  logger.debug(`Initializing database at ${DB_PATH}`);
  db = loadDatabase();
  logger.debug('Database initialized successfully');
}

/**
 * Get the database instance
 */
function getDatabase(): DatabaseData {
  if (!db) {
    initDatabase();
  }
  return db!;
}

/**
 * Close the database (save to file)
 */
export function closeDatabase(): void {
  if (db) {
    saveDatabase();
    db = null;
    logger.debug('Database closed');
  }
}

/**
 * Check if database exists
 */
export function databaseExists(): boolean {
  return existsSync(DB_PATH);
}

// Achievement operations

/**
 * Create or update an achievement record
 */
export function upsertAchievement(
  id: AchievementId,
  name: string,
  tier: TierLevel,
  targetCount: number
): AchievementRecord {
  const database = getDatabase();
  const now = new Date().toISOString();

  const existing = database.achievements[id];

  if (existing) {
    database.achievements[id] = {
      ...existing,
      tier,
      targetCount,
      updatedAt: now,
    };
  } else {
    database.achievements[id] = {
      id,
      name,
      tier,
      targetCount,
      completedCount: 0,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
  }

  saveDatabase();
  return database.achievements[id];
}

/**
 * Get an achievement record
 */
export function getAchievement(id: AchievementId): AchievementRecord | null {
  const database = getDatabase();
  return database.achievements[id] || null;
}

/**
 * Get all achievements
 */
export function getAllAchievements(): AchievementRecord[] {
  const database = getDatabase();
  return Object.values(database.achievements).sort(
    (a, b) => (a.createdAt || '').localeCompare(b.createdAt || '')
  );
}

/**
 * Get achievements by status
 */
export function getAchievementsByStatus(status: OperationStatus): AchievementRecord[] {
  const database = getDatabase();
  return Object.values(database.achievements)
    .filter(a => a.status === status)
    .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
}

/**
 * Update achievement status
 */
export function updateAchievementStatus(
  id: AchievementId,
  status: OperationStatus
): void {
  const database = getDatabase();

  if (database.achievements[id]) {
    database.achievements[id].status = status;
    database.achievements[id].updatedAt = new Date().toISOString();
    saveDatabase();
  }
}

/**
 * Update achievement completed count
 */
export function updateAchievementProgress(
  id: AchievementId,
  completedCount: number
): void {
  const database = getDatabase();

  if (database.achievements[id]) {
    database.achievements[id].completedCount = completedCount;
    database.achievements[id].updatedAt = new Date().toISOString();
    saveDatabase();
  }
}

/**
 * Increment achievement completed count
 */
export function incrementAchievementProgress(id: AchievementId): number {
  const database = getDatabase();

  if (database.achievements[id]) {
    database.achievements[id].completedCount++;
    database.achievements[id].updatedAt = new Date().toISOString();
    saveDatabase();
    return database.achievements[id].completedCount;
  }

  return 0;
}

// Operation operations

/**
 * Create an operation record
 */
export function createOperation(operation: Omit<OperationRecord, 'id'>): number {
  const database = getDatabase();
  const now = new Date().toISOString();

  const id = database.nextOperationId++;
  const newOperation: OperationRecord = {
    ...operation,
    id,
    createdAt: now,
    updatedAt: now,
  };

  database.operations.push(newOperation);
  saveDatabase();

  return id;
}

/**
 * Update an operation record
 */
export function updateOperation(
  id: number,
  updates: Partial<OperationRecord>
): void {
  const database = getDatabase();

  const index = database.operations.findIndex(op => op.id === id);
  if (index !== -1) {
    database.operations[index] = {
      ...database.operations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
  }
}

/**
 * Get operations for an achievement
 */
export function getOperationsForAchievement(achievementId: AchievementId): OperationRecord[] {
  const database = getDatabase();
  return database.operations
    .filter(op => op.achievementId === achievementId)
    .sort((a, b) => a.operationNumber - b.operationNumber);
}

/**
 * Get pending operations for an achievement
 */
export function getPendingOperations(achievementId: AchievementId): OperationRecord[] {
  const database = getDatabase();
  return database.operations
    .filter(op => op.achievementId === achievementId &&
                  (op.status === 'pending' || op.status === 'in_progress'))
    .sort((a, b) => a.operationNumber - b.operationNumber);
}

/**
 * Get last completed operation number for an achievement
 */
export function getLastCompletedOperationNumber(achievementId: AchievementId): number {
  const database = getDatabase();
  const completed = database.operations
    .filter(op => op.achievementId === achievementId && op.status === 'completed');

  if (completed.length === 0) return 0;

  return Math.max(...completed.map(op => op.operationNumber));
}

/**
 * Count completed operations for an achievement
 */
export function countCompletedOperations(achievementId: AchievementId): number {
  const database = getDatabase();
  return database.operations
    .filter(op => op.achievementId === achievementId && op.status === 'completed')
    .length;
}

/**
 * Delete all operations for an achievement
 */
export function deleteOperationsForAchievement(achievementId: AchievementId): void {
  const database = getDatabase();
  database.operations = database.operations.filter(op => op.achievementId !== achievementId);
  saveDatabase();
}

/**
 * Reset stuck 'in_progress' operations back to 'pending'
 */
export function resetStuckOperations(achievementId: AchievementId): number {
  const database = getDatabase();
  let resetCount = 0;

  for (const op of database.operations) {
    if (op.achievementId === achievementId && op.status === 'in_progress') {
      op.status = 'pending';
      op.updatedAt = new Date().toISOString();
      resetCount++;
    }
  }

  if (resetCount > 0) {
    saveDatabase();
    logger.debug(`Reset ${resetCount} stuck operations for ${achievementId}`);
  }

  return resetCount;
}

/**
 * Get completed operation numbers for an achievement
 */
export function getCompletedOperationNumbers(achievementId: AchievementId): Set<number> {
  const database = getDatabase();
  const completed = new Set<number>();

  for (const op of database.operations) {
    if (op.achievementId === achievementId && op.status === 'completed') {
      completed.add(op.operationNumber);
    }
  }

  return completed;
}

/**
 * Delete an achievement and its operations
 */
export function deleteAchievement(id: AchievementId): void {
  const database = getDatabase();
  deleteOperationsForAchievement(id);
  delete database.achievements[id];
  saveDatabase();
}

/**
 * Clear all data (for testing)
 */
export function clearAllData(): void {
  const database = getDatabase();
  database.achievements = {};
  database.operations = [];
  database.config = {};
  database.nextOperationId = 1;
  saveDatabase();
  logger.debug('All data cleared');
}

// Config operations

/**
 * Set a config value
 */
export function setConfigValue(key: string, value: string): void {
  const database = getDatabase();
  database.config[key] = value;
  saveDatabase();
}

/**
 * Get a config value
 */
export function getConfigValue(key: string): string | null {
  const database = getDatabase();
  return database.config[key] || null;
}

/**
 * Get all config values
 */
export function getAllConfigValues(): Record<string, string> {
  const database = getDatabase();
  return { ...database.config };
}

export default {
  initDatabase,
  closeDatabase,
  databaseExists,
  setDatabaseUser,
  getDatabaseUser,
  upsertAchievement,
  getAchievement,
  getAllAchievements,
  getAchievementsByStatus,
  updateAchievementStatus,
  updateAchievementProgress,
  incrementAchievementProgress,
  createOperation,
  updateOperation,
  getOperationsForAchievement,
  getPendingOperations,
  getLastCompletedOperationNumber,
  countCompletedOperations,
  deleteOperationsForAchievement,
  deleteAchievement,
  clearAllData,
  setConfigValue,
  getConfigValue,
  getAllConfigValues,
  resetStuckOperations,
  getCompletedOperationNumbers,
};
