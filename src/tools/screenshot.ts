import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { AgentBrowser } from '../utils/browser.js';

export const screenshotTool: Tool = {
  name: 'mobile_screenshot',
  description:
    'Take a screenshot of the current mobile page. Returns the path to the saved PNG file and a base64 representation for visual analysis.',
  inputSchema: {
    type: 'object',
    properties: {
      outputDir: {
        type: 'string',
        description: 'Directory to save the screenshot. Defaults to "screenshots".',
      },
      filename: {
        type: 'string',
        description:
          'Filename for the screenshot (without extension). Auto-generated from URL + timestamp if omitted.',
      },
    },
  },
};

export async function handleScreenshot(args: {
  outputDir?: string;
  filename?: string;
}): Promise<string> {
  const dir = resolve(args.outputDir ?? 'screenshots');
  mkdirSync(dir, { recursive: true });

  const name = args.filename ?? `screenshot-${Date.now()}`;
  const outputPath = join(dir, `${name}.png`);

  const browser = new AgentBrowser();
  const { stdout, stderr } = await browser.screenshot(outputPath);

  if (!existsSync(outputPath)) {
    return `Screenshot failed: ${stderr.trim() || stdout.trim() || 'unknown error'}`;
  }

  const base64 = readFileSync(outputPath).toString('base64');
  return JSON.stringify({
    path: outputPath,
    base64,
    message: `Screenshot saved to ${outputPath}`,
  });
}
