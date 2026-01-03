/**
 * Database schema definitions
 */

// SQL for creating the achievements table
export const CREATE_ACHIEVEMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    target_count INTEGER NOT NULL,
    completed_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

// SQL for creating the operations table
export const CREATE_OPERATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS operations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    achievement_id TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    operation_number INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    pr_number INTEGER,
    branch_name TEXT,
    commit_sha TEXT,
    issue_number INTEGER,
    discussion_id TEXT,
    error_message TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
  )
`;

// SQL for creating the config table
export const CREATE_CONFIG_TABLE = `
  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

// SQL for creating indexes
export const CREATE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_operations_achievement ON operations(achievement_id);
  CREATE INDEX IF NOT EXISTS idx_operations_status ON operations(status);
  CREATE INDEX IF NOT EXISTS idx_achievements_status ON achievements(status);
`;

// All schema creation SQL
export const SCHEMA_SQL = [
  CREATE_ACHIEVEMENTS_TABLE,
  CREATE_OPERATIONS_TABLE,
  CREATE_CONFIG_TABLE,
  CREATE_INDEXES,
];

export default {
  CREATE_ACHIEVEMENTS_TABLE,
  CREATE_OPERATIONS_TABLE,
  CREATE_CONFIG_TABLE,
  CREATE_INDEXES,
  SCHEMA_SQL,
};
