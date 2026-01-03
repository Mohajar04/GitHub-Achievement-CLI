/**
 * Galaxy Brain achievement implementation
 * Creates discussions with accepted answers
 */

import { BaseAchievement } from './base.js';
import type { AppConfig, TierLevel, OperationType } from '../types/index.js';
import { createGalaxyBrainDiscussion, areDiscussionsEnabled } from '../github/discussion.js';
import { DiscussionsNotEnabledError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class GalaxyBrainAchievement extends BaseAchievement {
  private discussionsEnabled: boolean | null = null;

  constructor(config: AppConfig, tier: TierLevel, targetCount: number) {
    super(config, 'galaxy-brain', 'Galaxy Brain', tier, targetCount);
  }

  protected getOperationType(): OperationType {
    return 'create_discussion';
  }

  /**
   * Check if discussions are enabled
   */
  private async checkDiscussions(): Promise<void> {
    if (this.discussionsEnabled === null) {
      this.discussionsEnabled = await areDiscussionsEnabled(this.owner, this.repo);

      if (!this.discussionsEnabled) {
        throw new DiscussionsNotEnabledError(`${this.owner}/${this.repo}`);
      }
    }
  }

  protected async executeOperation(number: number): Promise<{
    discussionId?: string;
  }> {
    await this.checkDiscussions();

    logger.debug(`Creating Galaxy Brain discussion #${number}`);

    // Create a discussion with an accepted answer
    const discussion = await createGalaxyBrainDiscussion(this.owner, this.repo, number);

    logger.verbose(`Completed Galaxy Brain #${number} (Discussion #${discussion.number})`);

    return {
      discussionId: discussion.id,
    };
  }
}

export default GalaxyBrainAchievement;
