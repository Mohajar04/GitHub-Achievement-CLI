/**
 * Branch operations for GitHub API
 */

import type { BranchInfo } from '../types/index.js';
import { getGitHubClient } from './client.js';
import { BranchExistsError, BranchNotFoundError } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Get the default branch SHA
 */
export async function getDefaultBranchSha(
  owner: string,
  repo: string
): Promise<{ sha: string; branch: string }> {
  const client = getGitHubClient();

  // Get repo info to find default branch
  const repoInfo = await client.getRepository(owner, repo);
  const defaultBranch = repoInfo.defaultBranch;

  // Get the SHA of the default branch
  const response = await client.api.git.getRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
  });

  return {
    sha: response.data.object.sha,
    branch: defaultBranch,
  };
}

/**
 * Create a new branch from the default branch
 */
export async function createBranch(
  owner: string,
  repo: string,
  branchName: string,
  options: { force?: boolean } = {}
): Promise<BranchInfo> {
  const client = getGitHubClient();

  logger.debug(`Creating branch: ${branchName}`);

  // Check if branch already exists
  try {
    const existing = await client.api.git.getRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });

    if (existing.data && !options.force) {
      throw new BranchExistsError(branchName);
    }

    // If force, delete and recreate
    if (options.force) {
      await deleteBranch(owner, repo, branchName);
    }
  } catch (error) {
    // Branch doesn't exist, which is what we want
    if (!(error instanceof BranchExistsError)) {
      // Check for 404, which means branch doesn't exist
      const anyError = error as { status?: number };
      if (anyError.status !== 404) {
        throw error;
      }
    } else {
      throw error;
    }
  }

  // Get the default branch SHA
  const { sha: baseSha } = await getDefaultBranchSha(owner, repo);

  // Create the new branch
  const response = await client.api.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  logger.verbose(`Created branch ${branchName} at ${response.data.object.sha}`);

  return {
    name: branchName,
    sha: response.data.object.sha,
    protected: false,
  };
}

/**
 * Delete a branch
 */
export async function deleteBranch(
  owner: string,
  repo: string,
  branchName: string
): Promise<void> {
  const client = getGitHubClient();

  logger.debug(`Deleting branch: ${branchName}`);

  try {
    await client.api.git.deleteRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });

    logger.verbose(`Deleted branch ${branchName}`);
  } catch (error) {
    const anyError = error as { status?: number };
    if (anyError.status === 404) {
      // Branch already deleted, that's fine
      logger.debug(`Branch ${branchName} already deleted`);
      return;
    }
    throw error;
  }
}

/**
 * Get branch info
 */
export async function getBranch(
  owner: string,
  repo: string,
  branchName: string
): Promise<BranchInfo> {
  const client = getGitHubClient();

  try {
    const response = await client.api.repos.getBranch({
      owner,
      repo,
      branch: branchName,
    });

    return {
      name: response.data.name,
      sha: response.data.commit.sha,
      protected: response.data.protected,
    };
  } catch (error) {
    const anyError = error as { status?: number };
    if (anyError.status === 404) {
      throw new BranchNotFoundError(branchName);
    }
    throw error;
  }
}

/**
 * List all branches matching a prefix
 */
export async function listBranchesWithPrefix(
  owner: string,
  repo: string,
  prefix: string
): Promise<BranchInfo[]> {
  const client = getGitHubClient();

  const branches: BranchInfo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await client.api.repos.listBranches({
      owner,
      repo,
      per_page: perPage,
      page,
    });

    const matchingBranches = response.data
      .filter(b => b.name.startsWith(prefix))
      .map(b => ({
        name: b.name,
        sha: b.commit.sha,
        protected: b.protected,
      }));

    branches.push(...matchingBranches);

    if (response.data.length < perPage) {
      break;
    }

    page++;
  }

  return branches;
}

/**
 * Delete all branches matching a prefix
 */
export async function deleteAllBranchesWithPrefix(
  owner: string,
  repo: string,
  prefix: string
): Promise<number> {
  const branches = await listBranchesWithPrefix(owner, repo, prefix);
  let deleted = 0;

  for (const branch of branches) {
    if (!branch.protected) {
      try {
        await deleteBranch(owner, repo, branch.name);
        deleted++;
      } catch (error) {
        logger.warn(`Failed to delete branch ${branch.name}: ${error}`);
      }
    }
  }

  return deleted;
}

export default {
  getDefaultBranchSha,
  createBranch,
  deleteBranch,
  getBranch,
  listBranchesWithPrefix,
  deleteAllBranchesWithPrefix,
};
