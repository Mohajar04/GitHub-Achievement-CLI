/**
 * Pair Extraordinaire achievement implementation
 * Creates coauthored commits on merged PRs
 */

import { BaseAchievement } from './base.js';
import type { AppConfig, TierLevel, OperationType } from '../types/index.js';
import { createBranch, deleteBranch, getDefaultBranchSha } from '../github/branch.js';
import { createAchievementCommit, initAchievementsFile } from '../github/commit.js';
import { createAndMergePR } from '../github/pr.js';
import { generateSimpleBranchName } from '../utils/helpers.js';
import logger from '../utils/logger.js';

export class PairExtraordinaireAchievement extends BaseAchievement {
  private defaultBranch: string = 'main';
  private initialized: boolean = false;

  constructor(config: AppConfig, tier: TierLevel, targetCount: number) {
    super(config, 'pair-extraordinaire', 'Pair Extraordinaire', tier, targetCount);
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
      'pair',
      number
    );

    logger.debug(`Creating branch ${branchName} for Pair Extraordinaire #${number}`);

    try {
      // Step 1: Create branch
      await createBranch(this.owner, this.repo, branchName, { force: true });

      // Step 2: Create coauthored commit
      const commit = await createAchievementCommit(this.owner, this.repo, {
        branch: branchName,
        achievementName: 'Pair Extraordinaire',
        number,
        tier: this.tier,
        coauthor: {
          name: this.config.coauthorName,
          email: this.config.coauthorEmail,
        },
      });

      // Step 3: Create and merge PR
      const pr = await createAndMergePR(this.owner, this.repo, {
        title: `Achievement: Pair Extraordinaire #${number}`,
        body: `## Pair Extraordinaire Achievement

This PR was created as part of the Pair Extraordinaire achievement (${this.tier} tier).

**Coauthored with:** ${this.config.coauthorName} <${this.config.coauthorEmail}>

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

      logger.verbose(`Completed Pair Extraordinaire #${number} (PR #${pr.number})`);

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
    const prefix = `${this.config.branchPrefix}-pair`;

    const deleted = await deleteAllBranchesWithPrefix(this.owner, this.repo, prefix);
    if (deleted > 0) {
      logger.info(`Cleaned up ${deleted} orphaned branches`);
    }
  }
}

export default PairExtraordinaireAchievement;
