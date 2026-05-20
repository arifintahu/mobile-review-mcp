import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AgentBrowser } from '../utils/browser.js';

export const snapshotTool: Tool = {
  name: 'mobile_snapshot',
  description:
    'Take an accessibility-tree snapshot of the current mobile page. Returns a compressed text representation with element reference IDs (like @e1, @e2) you can use with mobile_click or mobile_type.',
  inputSchema: {
    type: 'object',
    properties: {
      interactive: {
        type: 'boolean',
        description:
          'Use interactive mode (-i flag) which includes all interactive elements. Defaults to false.',
      },
    },
  },
};

export async function handleSnapshot(args: { interactive?: boolean }): Promise<string> {
  const browser = new AgentBrowser();
  const { stdout, stderr } = await browser.snapshot(args.interactive ?? false);
  const out = stdout.trim();
  if (!out) {
    return stderr.trim() || 'No snapshot output. Make sure you have called mobile_open_url first.';
  }
  return out;
}
