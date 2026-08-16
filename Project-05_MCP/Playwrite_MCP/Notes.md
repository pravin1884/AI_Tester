# Playwright MCP — Setup Guide for Antigravity IDE

## What is Playwright MCP?

The **Playwright MCP server** (`@playwright/mcp`) exposes browser automation capabilities to AI agents via the [Model Context Protocol](https://modelcontextprotocol.io/). Once connected, the agent can navigate websites, click elements, fill forms, take screenshots, and more — all using the page's **accessibility tree** (not pixels), which is fast and efficient for LLMs.

---

## Prerequisites

- **Node.js 20+** installed — verify with:
  ```bash
  node --version
  ```
- **Antigravity IDE** installed and running.

---

## Method 1 — MCP Store (Easiest)

1. Open **Antigravity IDE**.
2. Click the **gear icon** (⚙️) at the bottom-left → **Customizations**.
3. Scroll to the **Installed MCP Servers** section.
4. Click **Add MCP** to open the **MCP Store**.
5. Search for **"Playwright"** and click **Install**.
6. The IDE automatically adds the config entry and starts the server.

> ✅ This is the recommended approach for most users.

---

## Method 2 — Manual Configuration via `mcp_config.json`

If Playwright is not available in the MCP Store, or you need custom options, configure it manually.

### Step 1: Locate the config file

The MCP config file is typically at:

| Platform | Path |
|----------|------|
| Windows  | `%USERPROFILE%\.gemini\antigravity-ide\mcp_config.json` |
| macOS / Linux | `~/.gemini/antigravity-ide/mcp_config.json` |

> **Tip:** You can also open it from the IDE: **Settings → Customizations → Installed MCP Servers → Open Config File**.

### Step 2: Add the Playwright entry

Open `mcp_config.json` and add the following inside the `mcpServers` object:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

> **Note:** If the file already has other servers defined, just add the `"playwright": { ... }` block alongside them.

### Step 3: Restart the MCP connection

- Go to **Settings → Customizations → Installed MCP Servers**.
- Click the **refresh / restart** button next to the Playwright entry.
- The server status should turn **green** (connected).

---

## Configuration Options

You can customize behavior by adding flags to the `args` array:

### Headless Mode (no browser window)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless"]
    }
  }
}
```

### Choose a Different Browser

```json
"args": ["@playwright/mcp@latest", "--browser=firefox"]
```

Supported values: `chromium` (default), `firefox`, `webkit`.

### Device Emulation

```json
"args": ["@playwright/mcp@latest", "--device=iPhone 15"]
```

### Standalone HTTP Server (Advanced)

Run the server on a port and connect via URL:

```bash
npx @playwright/mcp@latest --port 8931
```

Then in `mcp_config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/mcp"
    }
  }
}
```

---

## Available Tools (After Setup)

Once connected, the agent gains access to tools like:

| Tool | Description |
|------|-------------|
| `browser_navigate` | Navigate to a URL |
| `browser_click` | Click an element on the page |
| `browser_type` | Type text into an input field |
| `browser_snapshot` | Capture the accessibility tree |
| `browser_screenshot` | Take a screenshot of the page |
| `browser_hover` | Hover over an element |
| `browser_select_option` | Select an option from a dropdown |
| `browser_go_back` | Go back in history |
| `browser_go_forward` | Go forward in history |
| `browser_wait` | Wait for a specified time |
| `browser_run_code_unsafe` | Execute arbitrary JavaScript (⚠️ use with caution) |

---

## Verification

After setup, ask the agent something like:

> "Navigate to https://example.com and tell me what's on the page."

If it successfully opens the browser and returns the page content, the Playwright MCP is working correctly. 🎉

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Server won't start | Ensure Node.js 20+ is installed and `npx` is in your PATH |
| Browser doesn't open | Try removing `--headless` flag to see the browser window |
| "Connection refused" errors | Check if another process is using the same port (for HTTP mode) |
| Tools not showing up | Restart the IDE and re-check the MCP server status |
| `stdout` corruption (custom servers) | Write logs to `stderr` only — `stdout` is reserved for JSON-RPC |

---

## References

- [Playwright MCP — Official Docs](https://playwright.dev/docs/mcp)
- [Playwright MCP — GitHub](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol — Spec](https://modelcontextprotocol.io/)
