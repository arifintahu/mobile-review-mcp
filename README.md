# mobile-review-mcp

> A Claude Code MCP server that autonomously reviews your web app's mobile layout — crawling every page, taking screenshots, and generating a structured issue report.

[![npm version](https://img.shields.io/npm/v/mobile-review-mcp)](https://www.npmjs.com/package/mobile-review-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

Built on [agent-browser](https://github.com/vercel-labs/agent-browser) by Vercel Labs — returns compact accessibility-tree snapshots instead of raw HTML, keeping Claude's context efficient.

---

## How it works

Claude opens your site in an iOS or Android emulator, walks through every page it can find, takes screenshots, and files structured issues for anything that looks broken — then outputs a JSON + Markdown report.

**Detected issue categories:** `layout` · `overflow` · `text` · `tap-target` · `navigation` · `accessibility` · `performance` · `visual`

---

## Installation

All options below install [agent-browser](https://github.com/vercel-labs/agent-browser) and download Chrome for Testing automatically — no separate prerequisites step needed.

> **Requirements:** Node.js ≥ 18

### Option A — Claude Code marketplace

Search for **mobile-review-mcp** in the Claude Code extension marketplace and click **Install**. Agent-browser and Chrome for Testing are set up automatically.

### Option B — via `claude mcp add` _(recommended)_

No global install needed — npx handles everything in one command:

```bash
claude mcp add mobile-review-mcp -- npx -y mobile-review-mcp
```

> On first run, npx installs the package, which triggers `agent-browser install` to download Chrome for Testing automatically.

### Option C — global npm install

```bash
npm install -g mobile-review-mcp
claude mcp add mobile-review-mcp -- mobile-review-mcp
```

> `postinstall` downloads Chrome for Testing automatically during `npm install`.

### Option D — from source

```bash
git clone https://github.com/arifintahu/mobile-review-mcp.git
cd mobile-review-mcp
npm install        # installs agent-browser + downloads Chrome automatically
npm run build

# Run on the project scope, e.g. in the root of your project
claude mcp add mobile-review-mcp -- node /absolute/path/to/dist/index.js
```

After adding the server, restart Claude Code or run `/mcp` to confirm it loaded.

---

## Usage

Once the MCP server is registered, paste this into Claude Code:

```
Use the mobile review tools to QA the mobile view of https://yourapp.com

Steps:
1. Check that agent-browser is installed and ready.
2. Open the site with iOS iPhone 16 Pro emulation.
3. Take a snapshot and screenshot on each page.
4. Navigate all main sections via the nav menu.
5. On each page, check for:
   - Text overflow or clipping
   - Tap targets smaller than 44×44px
   - Horizontal scroll from oversized elements
   - Font sizes below 16px
   - Overlapping or hidden elements
6. Record each issue using mobile_add_issue.
7. Generate the final report with mobile_generate_report.
```

Reports are saved to:

```
reports/
  mobile-review-<timestamp>.json
  mobile-review-<timestamp>.md
```

See [`examples/review-prompt.md`](examples/review-prompt.md) for more prompt templates.

---

## Tools reference

| Tool | Description |
|---|---|
| `mobile_check_dependencies` | Verify agent-browser is installed |
| `mobile_open_url` | Open a URL in iOS or Android emulator |
| `mobile_snapshot` | Get the accessibility-tree snapshot of the current page |
| `mobile_click` | Click an element by ref ID from the snapshot |
| `mobile_type` | Type text into a focusable element |
| `mobile_scroll` | Scroll the page |
| `mobile_back` | Navigate back |
| `mobile_navigate` | Navigate to a new URL |
| `mobile_get_url` | Get the current page URL |
| `mobile_screenshot` | Take a screenshot (returns path + base64) |
| `mobile_add_issue` | Record a found issue with severity and category |
| `mobile_generate_report` | Save JSON + Markdown report of all recorded issues |

---

## Severity guide

| Severity | When to use |
|---|---|
| `critical` | Feature completely broken or unusable on mobile |
| `high` | Major UX problem — users will struggle |
| `medium` | Noticeable issue, workaround exists |
| `low` | Minor polish issue |
| `info` | Suggestion or observation |

---

## Project structure

```
src/
  index.ts              MCP server entry point (stdio transport)
  tools/
    open-url.ts         mobile_open_url
    snapshot.ts         mobile_snapshot
    interact.ts         mobile_click, mobile_type, mobile_scroll, mobile_back,
                        mobile_navigate, mobile_get_url
    screenshot.ts       mobile_screenshot
    review.ts           mobile_add_issue, mobile_generate_report
    index.ts            Tool registry and dispatcher
  utils/
    browser.ts          agent-browser CLI wrapper
    reporter.ts         Report builder and Markdown renderer
examples/
  review-prompt.md      Ready-to-use prompt templates
```

---

## Contributing

Issues and PRs are welcome. Please open an issue before starting significant work so we can discuss the approach.

```bash
# Run without building
npm run dev

# Build TypeScript
npm run build

# Type check only
npm run typecheck
```

---

## Changelog

### 1.0.0 — Initial stable release
- 13 MCP tools for mobile QA via agent-browser
- iOS and Android device emulation
- JSON and Markdown report output
- Severity and category classification for issues

---

## License

MIT — see [LICENSE](LICENSE) for details.
