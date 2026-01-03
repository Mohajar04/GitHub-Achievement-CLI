/**
 * Logger utility with colored console output and file logging
 */

import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { LOGS_DIR } from './config.js';
import { dateString, timestamp } from './helpers.js';

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  success: 1,
  warn: 2,
  error: 3,
};

// Logger configuration
let currentLogLevel: LogLevel = 'info';
let fileLoggingEnabled = true;
let verboseMode = false;

// Log file path
let logFilePath: string | null = null;

/**
 * Initialize the logger
 */
export function initLogger(options: {
  level?: LogLevel;
  fileLogging?: boolean;
  verbose?: boolean;
} = {}): void {
  currentLogLevel = options.level || 'info';
  fileLoggingEnabled = options.fileLogging ?? true;
  verboseMode = options.verbose ?? false;

  if (verboseMode) {
    currentLogLevel = 'debug';
  }

  if (fileLoggingEnabled) {
    ensureLogsDir();
    logFilePath = join(LOGS_DIR, `achievement-${dateString()}.log`);
  }
}

/**
 * Ensure logs directory exists
 */
function ensureLogsDir(): void {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
  }
}

/**
 * Write to log file
 */
function writeToFile(level: LogLevel, message: string): void {
  if (!fileLoggingEnabled || !logFilePath) return;

  const logLine = `[${timestamp()}] [${level.toUpperCase()}] ${message}\n`;

  try {
    appendFileSync(logFilePath, logLine, 'utf-8');
  } catch {
    // Silently fail file logging
  }
}

/**
 * Check if a log level should be output
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
}

/**
 * Format log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string): string {
  const time = new Date().toLocaleTimeString();
  const prefix = `[${time}]`;

  switch (level) {
    case 'debug':
      return chalk.gray(`${prefix} ${chalk.dim('[DEBUG]')} ${message}`);
    case 'info':
      return chalk.white(`${prefix} ${chalk.cyan('[INFO]')} ${message}`);
    case 'success':
      return chalk.white(`${prefix} ${chalk.green('[✓]')} ${message}`);
    case 'warn':
      return chalk.white(`${prefix} ${chalk.yellow('[WARN]')} ${message}`);
    case 'error':
      return chalk.white(`${prefix} ${chalk.red('[ERROR]')} ${message}`);
    default:
      return `${prefix} ${message}`;
  }
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, ...args: unknown[]): void {
  // Always write to file regardless of level
  const fullMessage = args.length > 0
    ? `${message} ${args.map(a => String(a)).join(' ')}`
    : message;
  writeToFile(level, fullMessage);

  // Check if should output to console
  if (!shouldLog(level)) return;

  const formatted = formatMessage(level, fullMessage);
  console.log(formatted);
}

// Public logging methods
export const logger = {
  debug(message: string, ...args: unknown[]): void {
    log('debug', message, ...args);
  },

  info(message: string, ...args: unknown[]): void {
    log('info', message, ...args);
  },

  success(message: string, ...args: unknown[]): void {
    log('success', message, ...args);
  },

  warn(message: string, ...args: unknown[]): void {
    log('warn', message, ...args);
  },

  error(message: string, ...args: unknown[]): void {
    log('error', message, ...args);
  },

  // Direct console output (no formatting)
  raw(message: string): void {
    console.log(message);
    writeToFile('info', message);
  },

  // Blank line
  blank(): void {
    console.log('');
  },

  // Horizontal rule
  hr(char = '─', length = 50): void {
    const line = char.repeat(length);
    console.log(chalk.gray(line));
  },

  // Section header
  section(title: string): void {
    console.log('');
    console.log(chalk.bold.hex('#FF8C00')(` ▸ ${title}`));
    console.log(chalk.gray('─'.repeat(50)));
  },

  // Indented info
  bullet(message: string, color = 'white'): void {
    const colorFn = (chalk as unknown as Record<string, (s: string) => string>)[color] || chalk.white;
    console.log(`   ${chalk.gray('•')} ${colorFn(message)}`);
    writeToFile('info', `  • ${message}`);
  },

  // Key-value pair
  keyValue(key: string, value: string): void {
    console.log(`   ${chalk.gray(key + ':')} ${chalk.white(value)}`);
    writeToFile('info', `  ${key}: ${value}`);
  },

  // Step indicator (1. 2. 3. etc)
  step(num: number, message: string): void {
    console.log(chalk.hex('#FF8C00')(`${num}.`) + ` ${message}`);
    writeToFile('info', `${num}. ${message}`);
  },

  // Verbose-only logging
  verbose(message: string, ...args: unknown[]): void {
    if (verboseMode) {
      log('debug', message, ...args);
    }
  },

  // Set log level dynamically
  setLevel(level: LogLevel): void {
    currentLogLevel = level;
  },

  // Enable/disable verbose mode
  setVerbose(enabled: boolean): void {
    verboseMode = enabled;
    if (enabled) {
      currentLogLevel = 'debug';
    }
  },

  // Get log file path
  getLogFile(): string | null {
    return logFilePath;
  },
};

export default logger;
