import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AgentBrowser, type Platform } from '../utils/browser.js';

export const openUrlTool: Tool = {
  name: 'mobile_open_url',
  description:
    'Open a URL in a mobile browser emulator (iOS or Android). Must be called before using snapshot, click, or screenshot tools.',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'The full URL to open (e.g. https://example.com)',
      },
      platform: {
        type: 'string',
        enum: ['ios', 'android', 'desktop'],
        description: 'Device platform to emulate. Defaults to ios.',
      },
      device: {
        type: 'string',
        description:
          'Specific device name (e.g. "iPhone 16 Pro", "Pixel 7"). Uses platform default if omitted.',
      },
    },
    required: ['url'],
  },
};

export async function handleOpenUrl(args: {
  url: string;
  platform?: Platform;
  device?: string;
}): Promise<string> {
  const browser = new AgentBrowser({ platform: args.platform, device: args.device });

  const installed = await AgentBrowser.checkInstalled();
  if (!installed) {
    return [
      'agent-browser is not installed. Run the following to install it:',
      '',
      '  npm install -g agent-browser',
      '  agent-browser install',
    ].join('\n');
  }

  const { stdout, stderr } = await browser.open(args.url);
  const out = stdout.trim() || stderr.trim();
  return out || `Opened ${args.url} with ${args.device ?? args.platform ?? 'iOS'} emulation.`;
}
