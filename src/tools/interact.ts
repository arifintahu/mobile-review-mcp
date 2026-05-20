import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AgentBrowser } from '../utils/browser.js';

export const clickTool: Tool = {
  name: 'mobile_click',
  description:
    'Click an element on the current mobile page using its reference ID from a snapshot (e.g. @e4). Use mobile_snapshot first to get element IDs.',
  inputSchema: {
    type: 'object',
    properties: {
      ref: {
        type: 'string',
        description: 'Element reference ID from snapshot output (e.g. @e4, @e12)',
      },
    },
    required: ['ref'],
  },
};

export const typeTool: Tool = {
  name: 'mobile_type',
  description: 'Type text into a focusable element by its reference ID.',
  inputSchema: {
    type: 'object',
    properties: {
      ref: {
        type: 'string',
        description: 'Element reference ID from snapshot output',
      },
      text: {
        type: 'string',
        description: 'Text to type into the element',
      },
    },
    required: ['ref', 'text'],
  },
};

export const scrollTool: Tool = {
  name: 'mobile_scroll',
  description: 'Scroll the mobile page in a given direction.',
  inputSchema: {
    type: 'object',
    properties: {
      direction: {
        type: 'string',
        enum: ['up', 'down', 'left', 'right'],
        description: 'Scroll direction',
      },
      amount: {
        type: 'number',
        description: 'Scroll amount in pixels. Defaults to 300.',
      },
    },
    required: ['direction'],
  },
};

export const backTool: Tool = {
  name: 'mobile_back',
  description: 'Navigate back to the previous page in the mobile browser.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const navigateTool: Tool = {
  name: 'mobile_navigate',
  description: 'Navigate to a new URL in the existing mobile browser session.',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'URL to navigate to',
      },
    },
    required: ['url'],
  },
};

export const getUrlTool: Tool = {
  name: 'mobile_get_url',
  description: 'Get the current URL of the open mobile browser page.',
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export async function handleClick(args: { ref: string }): Promise<string> {
  const browser = new AgentBrowser();
  const { stdout, stderr } = await browser.click(args.ref);
  return stdout.trim() || stderr.trim() || `Clicked ${args.ref}.`;
}

export async function handleType(args: { ref: string; text: string }): Promise<string> {
  const browser = new AgentBrowser();
  const { stdout, stderr } = await browser.type(args.ref, args.text);
  return stdout.trim() || stderr.trim() || `Typed into ${args.ref}.`;
}

export async function handleScroll(args: {
  direction: 'up' | 'down' | 'left' | 'right';
  amount?: number;
}): Promise<string> {
  const browser = new AgentBrowser();
  const { stdout, stderr } = await browser.scroll(args.direction, args.amount);
  return stdout.trim() || stderr.trim() || `Scrolled ${args.direction}.`;
}

export async function handleBack(): Promise<string> {
  const browser = new AgentBrowser();
  const { stdout, stderr } = await browser.back();
  return stdout.trim() || stderr.trim() || 'Navigated back.';
}

export async function handleNavigate(args: { url: string }): Promise<string> {
  const browser = new AgentBrowser();
  const { stdout, stderr } = await browser.navigate(args.url);
  return stdout.trim() || stderr.trim() || `Navigated to ${args.url}.`;
}

export async function handleGetUrl(): Promise<string> {
  const browser = new AgentBrowser();
  return browser.getUrl();
}
