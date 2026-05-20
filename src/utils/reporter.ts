import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type IssueCategory =
  | 'layout'
  | 'overflow'
  | 'text'
  | 'tap-target'
  | 'navigation'
  | 'accessibility'
  | 'performance'
  | 'visual';

export interface ReviewIssue {
  id: string;
  page: string;
  url: string;
  severity: IssueSeverity;
  category: IssueCategory;
  description: string;
  element?: string;
  screenshot?: string;
  suggestion?: string;
}

export interface PageReview {
  url: string;
  title: string;
  screenshotPath?: string;
  issues: ReviewIssue[];
  reviewedAt: string;
}

export interface ReviewReport {
  url: string;
  device: string;
  platform: string;
  startedAt: string;
  completedAt: string;
  pagesReviewed: number;
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  pages: PageReview[];
  summary: string;
}

let issueCounter = 0;

export function createIssue(
  partial: Omit<ReviewIssue, 'id'>
): ReviewIssue {
  return { id: `issue-${++issueCounter}`, ...partial };
}

export function buildReport(
  params: Pick<ReviewReport, 'url' | 'device' | 'platform' | 'startedAt'>,
  pages: PageReview[]
): ReviewReport {
  const allIssues = pages.flatMap((p) => p.issues);
  return {
    ...params,
    completedAt: new Date().toISOString(),
    pagesReviewed: pages.length,
    totalIssues: allIssues.length,
    criticalIssues: allIssues.filter((i) => i.severity === 'critical').length,
    highIssues: allIssues.filter((i) => i.severity === 'high').length,
    pages,
    summary: generateSummary(pages, allIssues),
  };
}

function generateSummary(pages: PageReview[], issues: ReviewIssue[]): string {
  const bySeverity = groupBy(issues, (i) => i.severity);
  const byCategory = groupBy(issues, (i) => i.category);
  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 3)
    .map(([cat, items]) => `${cat} (${items.length})`)
    .join(', ');

  return [
    `Reviewed ${pages.length} page(s).`,
    `Found ${issues.length} issue(s) total:`,
    Object.entries(bySeverity)
      .map(([sev, items]) => `  ${sev}: ${items.length}`)
      .join('\n'),
    topCategories ? `Top categories: ${topCategories}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

export function saveReport(report: ReviewReport, outputDir = 'reports'): string {
  mkdirSync(outputDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = join(outputDir, `mobile-review-${timestamp}.json`);
  const mdPath = join(outputDir, `mobile-review-${timestamp}.md`);

  writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
  writeFileSync(mdPath, toMarkdown(report), 'utf-8');

  return jsonPath;
}

function toMarkdown(report: ReviewReport): string {
  const severityEmoji: Record<IssueSeverity, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢',
    info: 'ℹ️',
  };

  const lines: string[] = [
    `# Mobile Review Report`,
    ``,
    `| | |`,
    `|---|---|`,
    `| **URL** | ${report.url} |`,
    `| **Device** | ${report.device} |`,
    `| **Platform** | ${report.platform} |`,
    `| **Pages reviewed** | ${report.pagesReviewed} |`,
    `| **Total issues** | ${report.totalIssues} |`,
    `| **Critical** | ${report.criticalIssues} |`,
    `| **High** | ${report.highIssues} |`,
    `| **Started** | ${report.startedAt} |`,
    `| **Completed** | ${report.completedAt} |`,
    ``,
    `## Summary`,
    ``,
    report.summary,
    ``,
    `## Pages`,
  ];

  for (const page of report.pages) {
    lines.push(``, `### ${page.title || page.url}`, ``, `**URL:** ${page.url}`);
    if (page.screenshotPath) {
      lines.push(``, `![Screenshot](${page.screenshotPath})`);
    }
    if (page.issues.length === 0) {
      lines.push(``, `No issues found on this page.`);
    } else {
      lines.push(``, `#### Issues (${page.issues.length})`, ``);
      for (const issue of page.issues) {
        lines.push(
          `**${severityEmoji[issue.severity]} [${issue.severity.toUpperCase()}]** \`${issue.id}\` — ${issue.category}`,
          ``,
          issue.description,
          ...(issue.element ? [`- **Element:** \`${issue.element}\``] : []),
          ...(issue.suggestion ? [`- **Suggestion:** ${issue.suggestion}`] : []),
          ``
        );
      }
    }
  }

  return lines.join('\n');
}
