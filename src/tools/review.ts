import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AgentBrowser, type Platform } from '../utils/browser.js';
import {
  buildReport,
  saveReport,
  createIssue,
  type PageReview,
  type ReviewIssue,
  type IssueSeverity,
  type IssueCategory,
} from '../utils/reporter.js';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export const addIssueTool: Tool = {
  name: 'mobile_add_issue',
  description:
    'Record a mobile layout/UX issue found during review. Call this whenever you spot a problem while analyzing a page.',
  inputSchema: {
    type: 'object',
    properties: {
      page: {
        type: 'string',
        description: 'Short page name (e.g. "Home", "Product Detail")',
      },
      url: {
        type: 'string',
        description: 'Full URL of the page where the issue was found',
      },
      severity: {
        type: 'string',
        enum: ['critical', 'high', 'medium', 'low', 'info'],
        description:
          'Issue severity. critical=broken/unusable, high=major UX problem, medium=noticeable issue, low=minor, info=suggestion',
      },
      category: {
        type: 'string',
        enum: ['layout', 'overflow', 'text', 'tap-target', 'navigation', 'accessibility', 'performance', 'visual'],
        description: 'Issue category',
      },
      description: {
        type: 'string',
        description: 'Clear description of the issue',
      },
      element: {
        type: 'string',
        description: 'Element ref or CSS selector where the issue occurs (optional)',
      },
      suggestion: {
        type: 'string',
        description: 'Suggested fix (optional)',
      },
    },
    required: ['page', 'url', 'severity', 'category', 'description'],
  },
};

export const generateReportTool: Tool = {
  name: 'mobile_generate_report',
  description:
    'Generate and save the final mobile review report (JSON + Markdown) from all collected page data and issues. Call this at the end of a review session.',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'Root URL that was reviewed',
      },
      device: {
        type: 'string',
        description: 'Device name used for the review',
      },
      platform: {
        type: 'string',
        description: 'Platform used (ios/android/desktop)',
      },
      pages: {
        type: 'array',
        description: 'Array of page review objects collected during the session',
        items: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            title: { type: 'string' },
            screenshotPath: { type: 'string' },
            issues: {
              type: 'array',
              items: { type: 'object' },
            },
          },
          required: ['url', 'issues'],
        },
      },
      outputDir: {
        type: 'string',
        description: 'Directory to save reports. Defaults to "reports".',
      },
    },
    required: ['url', 'device', 'platform', 'pages'],
  },
};

export const checkDependenciesTool: Tool = {
  name: 'mobile_check_dependencies',
  description:
    'Check whether agent-browser is installed and ready. Run this before starting a review to confirm the environment is set up.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

const sessionIssues = new Map<string, ReviewIssue[]>();
const sessionStartTimes = new Map<string, string>();

export function handleAddIssue(args: {
  page: string;
  url: string;
  severity: IssueSeverity;
  category: IssueCategory;
  description: string;
  element?: string;
  suggestion?: string;
}): string {
  const issue = createIssue(args);
  const key = args.url;
  if (!sessionIssues.has(key)) sessionIssues.set(key, []);
  sessionIssues.get(key)!.push(issue);
  if (!sessionStartTimes.has(args.url)) {
    sessionStartTimes.set(args.url, new Date().toISOString());
  }
  return `Issue recorded: [${issue.id}] ${issue.severity.toUpperCase()} — ${issue.description}`;
}

export function handleGenerateReport(args: {
  url: string;
  device: string;
  platform: string;
  pages: Array<{
    url: string;
    title?: string;
    screenshotPath?: string;
    issues: ReviewIssue[];
  }>;
  outputDir?: string;
}): string {
  const pages: PageReview[] = args.pages.map((p) => ({
    url: p.url,
    title: p.title ?? p.url,
    screenshotPath: p.screenshotPath,
    issues: p.issues,
    reviewedAt: new Date().toISOString(),
  }));

  const report = buildReport(
    {
      url: args.url,
      device: args.device,
      platform: args.platform,
      startedAt: sessionStartTimes.get(args.url) ?? new Date().toISOString(),
    },
    pages
  );

  const jsonPath = saveReport(report, args.outputDir ?? 'reports');
  const mdPath = jsonPath.replace('.json', '.md');

  return JSON.stringify({
    jsonPath,
    mdPath,
    summary: report.summary,
    totalIssues: report.totalIssues,
    criticalIssues: report.criticalIssues,
    highIssues: report.highIssues,
    pagesReviewed: report.pagesReviewed,
  });
}

export async function handleCheckDependencies(): Promise<string> {
  const installed = await AgentBrowser.checkInstalled();
  if (installed) {
    return 'agent-browser is installed and ready.';
  }
  return [
    'agent-browser is NOT installed.',
    '',
    'Install it with:',
    '  npm install -g agent-browser',
    '  agent-browser install',
    '',
    'This installs the CLI and downloads Chrome for Testing.',
  ].join('\n');
}
