import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { openUrlTool, handleOpenUrl } from './open-url.js';
import { snapshotTool, handleSnapshot } from './snapshot.js';
import {
  clickTool,
  typeTool,
  scrollTool,
  backTool,
  navigateTool,
  getUrlTool,
  handleClick,
  handleType,
  handleScroll,
  handleBack,
  handleNavigate,
  handleGetUrl,
} from './interact.js';
import { screenshotTool, handleScreenshot } from './screenshot.js';
import {
  addIssueTool,
  generateReportTool,
  checkDependenciesTool,
  handleAddIssue,
  handleGenerateReport,
  handleCheckDependencies,
} from './review.js';

export const tools: Tool[] = [
  checkDependenciesTool,
  openUrlTool,
  snapshotTool,
  clickTool,
  typeTool,
  scrollTool,
  backTool,
  navigateTool,
  getUrlTool,
  screenshotTool,
  addIssueTool,
  generateReportTool,
];

export async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  let text: string;

  try {
    switch (name) {
      case 'mobile_check_dependencies':
        text = await handleCheckDependencies();
        break;
      case 'mobile_open_url':
        text = await handleOpenUrl(args as Parameters<typeof handleOpenUrl>[0]);
        break;
      case 'mobile_snapshot':
        text = await handleSnapshot(args as Parameters<typeof handleSnapshot>[0]);
        break;
      case 'mobile_click':
        text = await handleClick(args as Parameters<typeof handleClick>[0]);
        break;
      case 'mobile_type':
        text = await handleType(args as Parameters<typeof handleType>[0]);
        break;
      case 'mobile_scroll':
        text = await handleScroll(args as Parameters<typeof handleScroll>[0]);
        break;
      case 'mobile_back':
        text = await handleBack();
        break;
      case 'mobile_navigate':
        text = await handleNavigate(args as Parameters<typeof handleNavigate>[0]);
        break;
      case 'mobile_get_url':
        text = await handleGetUrl();
        break;
      case 'mobile_screenshot':
        text = await handleScreenshot(args as Parameters<typeof handleScreenshot>[0]);
        break;
      case 'mobile_add_issue':
        text = handleAddIssue(args as Parameters<typeof handleAddIssue>[0]);
        break;
      case 'mobile_generate_report':
        text = handleGenerateReport(args as Parameters<typeof handleGenerateReport>[0]);
        break;
      default:
        text = `Unknown tool: ${name}`;
    }
  } catch (err) {
    text = `Error in ${name}: ${err instanceof Error ? err.message : String(err)}`;
  }

  return { content: [{ type: 'text', text }] };
}
