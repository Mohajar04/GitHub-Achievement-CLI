/**
 * Pull Shark achievement implementation
 * Creates and merges PRs (without coauthor requirement)
 */

import { BaseAchievement } from './base.js';
import type { AppConfig, TierLevel, OperationType } from '../types/index.js';
import { createBranch, deleteBranch, getDefaultBranchSha } from '../github/branch.js';
import { createAchievementCommit, initAchievementsFile } from '../github/commit.js';
import { createAndMergePR } from '../github/pr.js';
import { generateSimpleBranchName } from '../utils/helpers.js';
import logger from '../utils/logger.js';

export class PullSharkAchievement extends BaseAchievement {
  private defaultBranch: string = 'main';
  private initialized: boolean = false;

  constructor(config: AppConfig, tier: TierLevel, targetCount: number) {
    super(config, 'pull-shark', 'Pull Shark', tier, targetCount);
  }

  protected getOperationType(): OperationType {
    return 'create_pr';
  }

  /**
   * Initialize - ensure ACHIEVEMENTS.md exists
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Get default branch
    const { branch } = await getDefaultBranchSha(this.owner, this.repo);
    this.defaultBranch = branch;

    // Ensure ACHIEVEMENTS.md exists
    await initAchievementsFile(this.owner, this.repo, this.defaultBranch);

    this.initialized = true;
  }

  protected async executeOperation(number: number): Promise<{
    prNumber?: number;
    branchName?: string;
    commitSha?: string;
  }> {
    await this.initialize();

    const branchName = generateSimpleBranchName(
      this.config.branchPrefix,
      'shark',
      number
    );

    logger.debug(`Creating branch ${branchName} for Pull Shark #${number}`);

    try {
      // Step 1: Create branch
      await createBranch(this.owner, this.repo, branchName, { force: true });

      // Step 2: Create commit (no coauthor for Pull Shark)
      const commit = await createAchievementCommit(this.owner, this.repo, {
        branch: branchName,
        achievementName: 'Pull Shark',
        number,
        tier: this.tier,
        // No coauthor for Pull Shark
      });

      // Step 3: Create and merge PR
      const pr = await createAndMergePR(this.owner, this.repo, {
        title: `Achievement: Pull Shark #${number}`,
        body: `## Pull Shark Achievement

This PR was created as part of the Pull Shark achievement (${this.tier} tier).

Operation #${number}/${this.targetCount}

---
*Created by GitHub Achievements Manager*`,
        head: branchName,
        base: this.defaultBranch,
        mergeMethod: 'squash',
        delayBeforeMerge: 500,
      });

      // Step 4: Delete the branch
      try {
        await deleteBranch(this.owner, this.repo, branchName);
      } catch {
        // Branch deletion is optional
        logger.debug(`Could not delete branch ${branchName}`);
      }

      logger.verbose(`Completed Pull Shark #${number} (PR #${pr.number})`);

      return {
        prNumber: pr.number,
        branchName,
        commitSha: commit.sha,
      };
    } catch (error) {
      // Cleanup on failure
      try {
        await deleteBranch(this.owner, this.repo, branchName);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    const { deleteAllBranchesWithPrefix } = await import('../github/branch.js');
    const prefix = `${this.config.branchPrefix}-shark`;

    const deleted = await deleteAllBranchesWithPrefix(this.owner, this.repo, prefix);
    if (deleted > 0) {
      logger.info(`Cleaned up ${deleted} orphaned branches`);
    }
  }
}

export default PullSharkAchievement;
