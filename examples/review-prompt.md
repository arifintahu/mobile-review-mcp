# Example Review Prompt

Use this prompt with Claude Code after installing mobile-review-mcp.

## Full site review

```
Use the mobile review tools to QA the mobile view of https://example.com.

Steps:
1. Run mobile_check_dependencies to confirm agent-browser is ready.
2. Open the site with mobile_open_url using platform=ios and device="iPhone 16 Pro".
3. Take a snapshot with mobile_snapshot to map the page structure.
4. Take a screenshot and analyze the layout for visual issues.
5. Find and click through every main navigation link, repeating snapshot + screenshot on each page.
6. On each page, look for:
   - Text overflowing or clipping
   - Buttons or tap targets smaller than 44x44px
   - Horizontal scroll caused by wide elements
   - Content hidden behind fixed headers/footers
   - Broken images or missing icons
   - Font sizes below 16px
   - Overlapping elements
7. For every issue found, call mobile_add_issue with the correct severity and category.
8. After reviewing all pages, call mobile_generate_report with the full page + issue data.
9. Return a summary of findings with the report file paths.
```

## Quick single-page review

```
Use mobile_open_url to open https://example.com/checkout on an Android Pixel 7 device.
Take a snapshot and screenshot, analyze the checkout form for mobile usability issues,
then generate a report with mobile_generate_report.
```

## Compare iOS vs Android

```
First, review https://example.com on iOS (iPhone 16 Pro) and collect issues.
Then review the same URL on Android (Pixel 7) and collect issues.
Generate a single report comparing both sets of findings.
```
