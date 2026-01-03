/**
 * Quickdraw achievement implementation
 * Creates and immediately closes issues
 */

import { BaseAchievement } from './base.js';
import type { AppConfig, TierLevel, OperationType } from '../types/index.js';
import { createQuickdrawIssue } from '../github/issue.js';
import logger from '../utils/logger.js';

export class QuickdrawAchievement extends BaseAchievement {
  constructor(config: AppConfig, tier: TierLevel, targetCount: number) {
    super(config, 'quickdraw', 'Quickdraw', tier, targetCount);
  }

  protected getOperationType(): OperationType {
    return 'create_issue';
  }

  protected async executeOperation(number: number): Promise<{
    issueNumber?: number;
  }> {
    logger.debug(`Creating Quickdraw issue #${number}`);

    // Create and immediately close an issue
    const issue = await createQuickdrawIssue(this.owner, this.repo, number);

    logger.verbose(`Completed Quickdraw #${number} (Issue #${issue.number})`);

    return {
      issueNumber: issue.number,
    };
  }
}

export default QuickdrawAchievement;
