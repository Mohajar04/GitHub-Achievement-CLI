/**
 * Custom error classes for GitHub Achievements Manager
 * Each error type provides specific context and suggested solutions
 */

// Base error class with additional context
export class AchievementError extends Error {
  public readonly code: string;
  public readonly suggestion: string;
  public readonly recoverable: boolean;

  constructor(message: string, code: string, suggestion: string, recoverable = false) {
    super(message);
    this.name = 'AchievementError';
    this.code = code;
    this.suggestion = suggestion;
    this.recoverable = recoverable;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication errors
export class AuthenticationError extends AchievementError {
  constructor(message = 'GitHub authentication failed') {
    super(
      message,
      'AUTH_FAILED',
      'Check your GITHUB_TOKEN in .env file. Generate a new token at https://github.com/settings/tokens with "repo" scope.',
      false
    );
    this.name = 'AuthenticationError';
  }
}

// Token permission errors
export class InsufficientPermissionsError extends AchievementError {
  constructor(permission: string, resource: string) {
    super(
      `Insufficient permissions: Cannot ${permission} on ${resource}`,
      'INSUFFICIENT_PERMISSIONS',
      `Your token needs additional permissions. Generate a new token at https://github.com/settings/tokens with "repo" scope for full repository access.`,
      false
    );
    this.name = 'InsufficientPermissionsError';
  }
}

// Rate limiting errors
export class RateLimitError extends AchievementError {
  public readonly resetTime: Date;
  public readonly remaining: number;

  constructor(resetTime: Date, remaining: number) {
    const waitMinutes = Math.ceil((resetTime.getTime() - Date.now()) / 60000);
    super(
      `GitHub API rate limit exceeded. Resets in ${waitMinutes} minutes.`,
      'RATE_LIMITED',
      `Wait ${waitMinutes} minutes before retrying, or use a token with higher rate limits.`,
      true
    );
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
    this.remaining = remaining;
  }
}

// Repository not found
export class RepositoryNotFoundError extends AchievementError {
  constructor(repo: string) {
    super(
      `Repository not found: ${repo}`,
      'REPO_NOT_FOUND',
      `Check that the repository "${repo}" exists and your token has access to it. Format should be "owner/repo".`,
      false
    );
    this.name = 'RepositoryNotFoundError';
  }
}

// No write access to repository
export class NoWriteAccessError extends AchievementError {
  constructor(repo: string) {
    super(
      `No write access to repository: ${repo}`,
      'NO_WRITE_ACCESS',
      `You need push access to "${repo}". Either fork the repository or request write access from the owner.`,
      false
    );
    this.name = 'NoWriteAccessError';
  }
}

// Branch already exists
export class BranchExistsError extends AchievementError {
  constructor(branch: string) {
    super(
      `Branch already exists: ${branch}`,
      'BRANCH_EXISTS',
      `Delete the existing branch "${branch}" or use a different branch prefix.`,
      true
    );
    this.name = 'BranchExistsError';
  }
}

// Branch not found
export class BranchNotFoundError extends AchievementError {
  constructor(branch: string) {
    super(
      `Branch not found: ${branch}`,
      'BRANCH_NOT_FOUND',
      `The branch "${branch}" does not exist. It may have already been deleted.`,
      true
    );
    this.name = 'BranchNotFoundError';
  }
}

// PR already merged
export class PRAlreadyMergedError extends AchievementError {
  constructor(prNumber: number) {
    super(
      `Pull request #${prNumber} is already merged`,
      'PR_ALREADY_MERGED',
      'This PR was already merged. Skipping to the next operation.',
      true
    );
    this.name = 'PRAlreadyMergedError';
  }
}

// PR merge conflict
export class MergeConflictError extends AchievementError {
  constructor(prNumber: number) {
    super(
      `Pull request #${prNumber} has merge conflicts`,
      'MERGE_CONFLICT',
      'There are merge conflicts that need manual resolution. Try deleting the branch and recreating.',
      true
    );
    this.name = 'MergeConflictError';
  }
}

// Configuration errors
export class ConfigurationError extends AchievementError {
  constructor(field: string, message: string) {
    super(
      `Configuration error for ${field}: ${message}`,
      'CONFIG_ERROR',
      `Run "npm run setup" to reconfigure, or manually edit your .env file.`,
      false
    );
    this.name = 'ConfigurationError';
  }
}

// Missing configuration
export class MissingConfigError extends AchievementError {
  constructor(field: string) {
    super(
      `Missing required configuration: ${field}`,
      'MISSING_CONFIG',
      `Set ${field} in your .env file or run "npm run setup" for interactive configuration.`,
      false
    );
    this.name = 'MissingConfigError';
  }
}

// Network errors
export class NetworkError extends AchievementError {
  constructor(message = 'Network request failed') {
    super(
      message,
      'NETWORK_ERROR',
      'Check your internet connection and try again. If the problem persists, GitHub may be experiencing issues.',
      true
    );
    this.name = 'NetworkError';
  }
}

// Database errors
export class DatabaseError extends AchievementError {
  constructor(operation: string, message: string) {
    super(
      `Database error during ${operation}: ${message}`,
      'DB_ERROR',
      'Try deleting achievements.db and restarting. Your progress will be lost.',
      false
    );
    this.name = 'DatabaseError';
  }
}

// Discussions not enabled
export class DiscussionsNotEnabledError extends AchievementError {
  constructor(repo: string) {
    super(
      `Discussions are not enabled for repository: ${repo}`,
      'DISCUSSIONS_DISABLED',
      `Enable Discussions in the repository settings (Settings > Features > Discussions) to use Galaxy Brain achievement.`,
      false
    );
    this.name = 'DiscussionsNotEnabledError';
  }
}

// Operation cancelled by user
export class OperationCancelledError extends AchievementError {
  constructor(operation = 'Operation') {
    super(
      `${operation} was cancelled by user`,
      'CANCELLED',
      'No further action needed. You can resume later with "npm run resume".',
      true
    );
    this.name = 'OperationCancelledError';
  }
}

// Generic API error
export class GitHubAPIError extends AchievementError {
  public readonly statusCode: number;
  public readonly endpoint: string;

  constructor(statusCode: number, endpoint: string, message: string) {
    super(
      `GitHub API error (${statusCode}): ${message}`,
      'API_ERROR',
      `An error occurred calling ${endpoint}. Check the error details and try again.`,
      statusCode >= 500
    );
    this.name = 'GitHubAPIError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

// Helper to wrap unknown errors
export function wrapError(error: unknown): AchievementError {
  if (error instanceof AchievementError) {
    return error;
  }

  if (error instanceof Error) {
    // Check for common error patterns
    const msg = error.message.toLowerCase();

    if (msg.includes('bad credentials') || msg.includes('unauthorized')) {
      return new AuthenticationError(error.message);
    }

    if (msg.includes('rate limit')) {
      // Extract reset time if available
      const resetTime = new Date(Date.now() + 60 * 60 * 1000); // Default to 1 hour
      return new RateLimitError(resetTime, 0);
    }

    if (msg.includes('not found')) {
      return new AchievementError(
        error.message,
        'NOT_FOUND',
        'The requested resource was not found. Check that it exists and you have access.',
        false
      );
    }

    if (msg.includes('network') || msg.includes('econnrefused') || msg.includes('etimedout')) {
      return new NetworkError(error.message);
    }

    return new AchievementError(
      error.message,
      'UNKNOWN',
      'An unexpected error occurred. Try running with --verbose for more details.',
      false
    );
  }

  return new AchievementError(
    String(error),
    'UNKNOWN',
    'An unexpected error occurred.',
    false
  );
}
