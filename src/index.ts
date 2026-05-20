#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools, handleToolCall } from './tools/index.js';

const server = new Server(
  {
    name: 'mobile-review-mcp',
    version: '1.0.1',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return handleToolCall(
    request.params.name,
    (request.params.arguments ?? {}) as Record<string, unknown>
  );
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server is running — MCP communicates over stdio
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err}\n`);
  process.exit(1);
});
