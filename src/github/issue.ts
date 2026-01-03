/**
 * Issue operations for GitHub API (used for Quickdraw achievement)
 */

import type { IssueInfo } from '../types/index.js';
import { getGitHubClient } from './client.js';
import logger from '../utils/logger.js';

/**
 * Create an issue
 */
export async function createIssue(
  owner: string,
  repo: string,
  options: {
    title: string;
    body?: string;
    labels?: string[];
  }
): Promise<IssueInfo> {
  const client = getGitHubClient();

  logger.debug(`Creating issue: ${options.title}`);

  const response = await client.api.issues.create({
    owner,
    repo,
    title: options.title,
    body: options.body,
    labels: options.labels,
  });

  logger.verbose(`Created issue #${response.data.number}`);

  return {
    number: response.data.number,
    title: response.data.title,
    url: response.data.html_url,
    state: response.data.state as 'open' | 'closed',
  };
}

/**
 * Close an issue
 */
export async function closeIssue(
  owner: string,
  repo: string,
  issueNumber: number,
  options: {
    comment?: string;
    reason?: 'completed' | 'not_planned';
  } = {}
): Promise<void> {
  const client = getGitHubClient();

  logger.debug(`Closing issue #${issueNumber}`);

  // Add a comment if provided
  if (options.comment) {
    await client.api.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: options.comment,
    });
  }

  // Close the issue
  await client.api.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'closed',
    state_reason: options.reason || 'completed',
  });

  logger.verbose(`Closed issue #${issueNumber}`);
}

/**
 * Create an issue and immediately close it (for Quickdraw)
 */
export async function createAndCloseIssue(
  owner: string,
  repo: string,
  options: {
    title: string;
    body?: string;
    labels?: string[];
    closeReason?: 'completed' | 'not_planned';
  }
): Promise<IssueInfo> {
  // Create the issue
  const issue = await createIssue(owner, repo, {
    title: options.title,
    body: options.body,
    labels: options.labels,
  });

  // Immediately close it
  await closeIssue(owner, repo, issue.number, {
    reason: options.closeReason || 'completed',
  });

  return {
    ...issue,
    state: 'closed',
  };
}

/**
 * Get issue info
 */
export async function getIssue(
  owner: string,
  repo: string,
  issueNumber: number
): Promise<IssueInfo> {
  const client = getGitHubClient();

  const response = await client.api.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  return {
    number: response.data.number,
    title: response.data.title,
    url: response.data.html_url,
    state: response.data.state as 'open' | 'closed',
  };
}

/**
 * List open issues with a title prefix
 */
export async function listOpenIssuesWithPrefix(
  owner: string,
  repo: string,
  titlePrefix: string
): Promise<IssueInfo[]> {
  const client = getGitHubClient();

  const issues: IssueInfo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await client.api.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      per_page: perPage,
      page,
    });

    // Filter to issues only (not PRs) and matching prefix
    const matchingIssues = response.data
      .filter(issue => !issue.pull_request && issue.title.startsWith(titlePrefix))
      .map(issue => ({
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        state: issue.state as 'open' | 'closed',
      }));

    issues.push(...matchingIssues);

    if (response.data.length < perPage) {
      break;
    }

    page++;
  }

  return issues;
}

/**
 * Create a Quickdraw achievement issue
 */
export async function createQuickdrawIssue(
  owner: string,
  repo: string,
  number: number
): Promise<IssueInfo> {
  const timestamp = new Date().toISOString();
  const title = `Quickdraw Achievement #${number} - ${timestamp}`;
  const body = `This issue was created as part of the Quickdraw achievement.
It will be closed immediately.

Timestamp: ${timestamp}

---
*Created by GitHub Achievements Manager*`;

  return createAndCloseIssue(owner, repo, {
    title,
    body,
    labels: ['achievement'],
    closeReason: 'completed',
  });
}

export default {
  createIssue,
  closeIssue,
  createAndCloseIssue,
  getIssue,
  listOpenIssuesWithPrefix,
  createQuickdrawIssue,
};
