/**
 * YOLO achievement implementation
 * Merges own pull request without code review
 * Single tier only (default)
 */

import { BaseAchievement } from './base.js';
import type { AppConfig, TierLevel, OperationType } from '../types/index.js';
import { createBranch, deleteBranch, getDefaultBranchSha } from '../github/branch.js';
import { createAchievementCommit } from '../github/commit.js';
import { createPR, mergePR, requestReview } from '../github/pr.js';
import { getHelperClient } from '../github/client.js';
import { generateSimpleBranchName } from '../utils/helpers.js';
import { delay } from '../utils/timing.js';
import logger from '../utils/logger.js';

export class YOLOAchievement extends BaseAchievement {
  private defaultBranch: string = 'main';
  private helperUsername: string | null = null;
  private initialized: boolean = false;

  constructor(config: AppConfig, tier: TierLevel, targetCount: number) {
    super(config, 'yolo', 'YOLO', tier, targetCount);
  }

  protected getOperationType(): OperationType {
    return 'merge_own_pr';
  }

  /**
   * Initialize - get default branch and helper username
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Get default branch
    const { branch } = await getDefaultBranchSha(this.owner, this.repo);
    this.defaultBranch = branch;

    // Get helper username for review request
    const helper = getHelperClient();
    if (helper) {
      try {
        const helperUser = await helper.validateToken();
        this.helperUsername = helperUser.login;
        logger.debug(`Using helper account ${this.helperUsername} as reviewer`);
      } catch {
        logger.warn('Helper account not available for YOLO - achievement may not trigger');
      }
    }

    if (!this.helperUsername) {
      throw new Error(
        'YOLO requires a helper account to request review from. Configure HELPER_TOKEN in your .env file.'
      );
    }

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
      'yolo',
      number
    );

    logger.debug(`Creating branch ${branchName} for YOLO #${number}`);

    try {
      // Step 1: Create branch
      await createBranch(this.owner, this.repo, branchName, { force: true });

      // Step 2: Create commit (no coauthor, no review)
      const commit = await createAchievementCommit(this.owner, this.repo, {
        branch: branchName,
        achievementName: 'YOLO',
        number,
        tier: this.tier,
      });

      // Step 3: Create PR
      const pr = await createPR(this.owner, this.repo, {
        title: `YOLO: Quick merge #${number}`,
        body: `## YOLO Achievement

This PR was merged without waiting for code review.

Operation #${number}

> *Living on the edge!* 🎲

---
*Created by GitHub Achievements Manager*`,
        head: branchName,
        base: this.defaultBranch,
      });

      // Step 4: Request review from helper account (CRITICAL for YOLO!)
      await requestReview(this.owner, this.repo, pr.number, [this.helperUsername!]);
      logger.debug(`Requested review from ${this.helperUsername}`);

      // Step 5: Small delay then merge WITHOUT waiting for review (YOLO!)
      await delay(200);
      await mergePR(this.owner, this.repo, pr.number, { method: 'squash' });

      // Step 6: Delete the branch
      try {
        await deleteBranch(this.owner, this.repo, branchName);
      } catch {
        logger.debug(`Could not delete branch ${branchName}`);
      }

      logger.verbose(`Completed YOLO #${number} (PR #${pr.number})`);

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
    const prefix = `${this.config.branchPrefix}-yolo`;

    const deleted = await deleteAllBranchesWithPrefix(this.owner, this.repo, prefix);
    if (deleted > 0) {
      logger.info(`Cleaned up ${deleted} orphaned branches`);
    }
  }
}

export default YOLOAchievement;
