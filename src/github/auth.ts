/**
 * Authentication and validation utilities
 */

import type { UserInfo, RepoInfo, AppConfig } from '../types/index.js';
import { getGitHubClient, initGitHubClient, isClientInitialized, initHelperClient, getHelperClient } from './client.js';
import { AuthenticationError, NoWriteAccessError } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Initialize and validate authentication
 */
export async function initializeAuth(config: AppConfig): Promise<{
  user: UserInfo;
  repo: RepoInfo;
}> {
  logger.debug('Initializing GitHub authentication...');

  // Initialize the client
  const client = initGitHubClient(config);

  // Validate the token and get user info
  const user = await client.validateToken();
  logger.info(`Authenticated as ${user.login}`);

  // Parse and validate target repository
  const { owner, repo } = client.getTargetRepo();
  const repoInfo = await client.getRepository(owner, repo);

  // Validate write access
  if (!repoInfo.permissions.push) {
    throw new NoWriteAccessError(config.targetRepo);
  }

  logger.info(`Target repository: ${repoInfo.fullName} (${repoInfo.defaultBranch})`);

  // Initialize helper client if configured (for Galaxy Brain)
  if (config.helperToken) {
    try {
      initHelperClient(config.helperToken);
      const helperUser = await getHelperClient()?.validateToken();
      if (helperUser) {
        logger.info(`Helper account: ${helperUser.login} (for Galaxy Brain)`);
      }
    } catch (error) {
      logger.warn('Helper account token is invalid - Galaxy Brain will not work');
    }
  }

  return { user, repo: repoInfo };
}

/**
 * Validate token format (basic check before API call)
 */
export function validateTokenFormat(token: string): boolean {
  // GitHub personal access tokens start with ghp_ or github_pat_
  if (token.startsWith('ghp_') && token.length > 36) {
    return true;
  }

  if (token.startsWith('github_pat_') && token.length > 70) {
    return true;
  }

  return false;
}

/**
 * Quick token validation (just check auth)
 */
export async function quickValidateToken(token: string): Promise<UserInfo> {
  const tempConfig: AppConfig = {
    githubToken: token,
    githubUsername: '',
    targetRepo: 'test/test',
    coauthorName: 'n0',
    coauthorEmail: 'luke@u.software',
    branchPrefix: '',
    delayMs: 200,
    batchSize: 5,
    verbose: false,
    testMode: false,
    logLevel: 'info',
    concurrency: 3,
    maxRequestsPerMinute: 70,
  };

  const client = initGitHubClient(tempConfig);
  return client.validateToken();
}

/**
 * Validate repository access
 */
export async function validateRepoAccess(
  owner: string,
  repo: string
): Promise<{ hasAccess: boolean; hasWriteAccess: boolean; hasDiscussions: boolean }> {
  const client = getGitHubClient();

  try {
    const repoInfo = await client.getRepository(owner, repo);

    return {
      hasAccess: true,
      hasWriteAccess: repoInfo.permissions.push,
      hasDiscussions: repoInfo.hasDiscussions,
    };
  } catch {
    return {
      hasAccess: false,
      hasWriteAccess: false,
      hasDiscussions: false,
    };
  }
}

/**
 * Get authenticated username
 */
export async function getAuthenticatedUsername(): Promise<string> {
  const client = getGitHubClient();
  const user = await client.validateToken();
  return user.login;
}

/**
 * Check rate limit status
 */
export async function checkRateLimitStatus(): Promise<{
  ok: boolean;
  remaining: number;
  resetIn: number;
}> {
  const client = getGitHubClient();
  const rateLimit = await client.getRateLimit();

  const resetIn = Math.max(0, rateLimit.reset.getTime() - Date.now());

  return {
    ok: rateLimit.remaining > 10,
    remaining: rateLimit.remaining,
    resetIn,
  };
}

export default {
  initializeAuth,
  validateTokenFormat,
  quickValidateToken,
  validateRepoAccess,
  getAuthenticatedUsername,
  checkRateLimitStatus,
};
