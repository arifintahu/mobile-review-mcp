# mobile-review-mcp

A Claude Code MCP server that gives Claude the tools to autonomously crawl your web app and review its mobile layout — finding overflow, broken tap targets, font issues, nav problems, and more.

Built on [agent-browser](https://github.com/vercel-labs/agent-browser) by Vercel Labs for compact, token-efficient mobile snapshots.

---

## What it does

Claude opens your site in an iOS or Android emulator, walks through every page it can find, takes screenshots, and files structured issues for anything that looks broken — then generates a JSON + Markdown report.

**Detected issue categories:** layout · overflow · text · tap-target · navigation · accessibility · performance · visual

---

## Prerequisites

Install [agent-browser](https://github.com/vercel-labs/agent-browser):

```bash
npm install -g agent-browser
agent-browser install   # downloads Chrome for Testing
```

---

## Installation

### Option A — Claude Code marketplace

Search for **mobile-review-mcp** in the Claude Code extension marketplace and click Install.

### Option B — via `claude mcp add` (npx, no global install)

```bash
claude mcp add mobile-review-mcp -- npx -y mobile-review-mcp
```

### Option C — global npm install

```bash
npm install -g mobile-review-mcp
claude mcp add mobile-review-mcp -- mobile-review-mcp
```

### Option D — from source

```bash
git clone https://github.com/arifintahu/mobile-review-mcp
cd mobile-review-mcp
npm install
npm run build
claude mcp add mobile-review-mcp -- node /path/to/mobile-review-mcp/dist/index.js
```

After adding, restart Claude Code or run `/mcp` to confirm it loaded.

---

## Tools

| Tool | Description |
|---|---|
| `mobile_check_dependencies` | Verify agent-browser is installed |
| `mobile_open_url` | Open a URL in iOS/Android emulator |
| `mobile_snapshot` | Get accessibility-tree snapshot of current page |
| `mobile_click` | Click an element by ref ID (from snapshot) |
| `mobile_type` | Type into a focusable element |
| `mobile_scroll` | Scroll the page |
| `mobile_back` | Navigate back |
| `mobile_navigate` | Navigate to a new URL |
| `mobile_get_url` | Get the current page URL |
| `mobile_screenshot` | Take a screenshot (returns path + base64) |
| `mobile_add_issue` | Record a found issue (severity + category) |
| `mobile_generate_report` | Save JSON + Markdown report of all issues |

---

## Usage

Once the MCP server is registered, paste a prompt like this into Claude Code:

```
Use the mobile review tools to QA the mobile view of https://yourapp.com.

1. Check dependencies are ready.
2. Open the site with iOS iPhone 16 Pro emulation.
3. Take a snapshot and screenshot on each page.
4. Navigate all main sections via the menu.
5. On each page, analyze the layout for:
   - Text overflow or clipping
   - Tap targets smaller than 44×44px
   - Horizontal scroll caused by wide elements
   - Font sizes below 16px
   - Overlapping or hidden elements
6. Record every issue with mobile_add_issue.
7. Generate a final report with mobile_generate_report.
```

Reports are saved as:
- `reports/mobile-review-<timestamp>.json`
- `reports/mobile-review-<timestamp>.md`

See [`examples/review-prompt.md`](examples/review-prompt.md) for more prompt templates.

---

## Issue severity guide

| Severity | When to use |
|---|---|
| `critical` | Feature completely broken / unusable on mobile |
| `high` | Major UX problem — users will struggle |
| `medium` | Noticeable issue, workaround exists |
| `low` | Minor polish issue |
| `info` | Suggestion / observation |

---

## Project structure

```
src/
  index.ts           MCP server entry point
  tools/
    open-url.ts      mobile_open_url
    snapshot.ts      mobile_snapshot
    interact.ts      mobile_click, mobile_type, mobile_scroll, ...
    screenshot.ts    mobile_screenshot
    review.ts        mobile_add_issue, mobile_generate_report
    index.ts         Tool registry + dispatcher
  utils/
    browser.ts       agent-browser CLI wrapper
    reporter.ts      Report builder + Markdown renderer
examples/
  review-prompt.md   Prompt templates
```

---

## Contributing

PRs welcome. Please open an issue first for significant changes.

```bash
npm run dev       # run with tsx (no build needed)
npm run build     # compile TypeScript
npm run typecheck # type check only
```

---

## License

MIT
