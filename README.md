# PixelForge — Autonomous Website Reverse-Engineering & Cloning Platform

PixelForge is a local AI-powered platform designed to autonomously analyze target websites, extract design systems, build route trees, generate modular React + Vite codebases, and perform iterative visual regression QA.

## Features

- **Local Web UI & Developer Interface**: Clean, dark-mode developer UI inspired by Linear, Vercel, and modern IDEs.
- **Generic LLM Provider Abstraction**: Supports OpenAI, OpenAI-compatible, Anthropic-compatible, or custom endpoints with live connection testing and key redaction.
- **Multi-Pass Playwright Engine**: Discovers routes, extracts DOM structure, measures browser-resolved CSS computed styles, downloads assets, and captures multi-viewport full-page screenshots.
- **Design System Extractor**: Produces `design/tokens.json`, machine-readable design tokens, and a comprehensive `design/design.md` specification. Includes support for explicit design constraints (e.g. Wise Design System).
- **React + Vite Code Generator**: Generates clean, deduplicated React components with routing, Tailwind styling, and asset integration.
- **Visual Regression Diff Engine**: Uses `pixelmatch` and SSIM pixel-comparison to score similarity, classify visual discrepancies (position, size, spacing, font, color), and run iterative AI repairs.
- **Persistent Workspaces**: Saves all project state, sqlite databases, screenshot evidence, diff overlays, and generated artifacts across application restarts.
- **CLI & Export Tools**: Offers a command-line binary (`pixelforge`) and ZIP export for generated projects and reports.

---

## Getting Started

### Prerequisites

- **Node.js**: v20 or higher (Tested on Node v22)
- **npm**: v10 or higher

### Installation

```bash
git clone https://github.com/pixelforge/pixelforge.git
cd pixelforge
npm install
```

### Development Mode

Start both the Express backend API (port 3001) and Vite Web UI (port 3000):

```bash
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000).

### Production Build & Server

Build the TypeScript backend and React Web UI bundle, then run the unified production server:

```bash
npm run build
npm start
```

PixelForge will serve the Web UI on [http://localhost:3001](http://localhost:3001).

---

## Using the Web UI Workflow

1. **First-Run Experience**:
   - Click **"Create Workspace"** in the sidebar.
   - Enter your Workspace Name, Target Website URL (e.g. `https://wise.com`), API Base URL (`https://api.openai.com/v1`), API Key (`sk-...`), and Model (`gpt-4o`).
   - Click **"Test Connection"** to verify latency and model response.

2. **Run Autonomous Pipeline**:
   - Click **"Start Autonomous Pipeline"** in the top header.
   - The agent worker will execute crawling, computed style extraction, token generation, React code generation, live preview startup, and visual regression diffing.

3. **Inspect Output**:
   - **Dashboard**: View summary metrics, discovered routes, token count, and checkpoint progress.
   - **Crawl & Routes**: Inspect discovered page hierarchy and crawl depth.
   - **Design System**: View extracted color tokens, type specimens, and generated `design.md`.
   - **Visual Diff**: Inspect pixel difference masks and regression similarity scores.
   - **Live Preview**: Interact with the embedded clone application.
   - **Agent Console**: Review structured real-time logs.
   - **Export**: Click **"Export ZIP"** to download the complete standalone React codebase and artifact report.

---

## CLI Usage

PixelForge includes a command-line interface:

```bash
# Create a workspace
npx pixelforge create -n "MyClone" -u "https://example.com" -m "gpt-4o"

# Run crawling
npx pixelforge crawl -w <WORKSPACE_ID>

# Extract design system
npx pixelforge analyze -w <WORKSPACE_ID>

# Generate React codebase
npx pixelforge generate -w <WORKSPACE_ID>

# Perform visual diff comparison
npx pixelforge compare -w <WORKSPACE_ID>

# Run full autonomous pipeline
npx pixelforge run -w <WORKSPACE_ID>
```

---

## Testing

Run unit and integration tests using Vitest:

```bash
npm test
```

---

## License

MIT License. Designed for authorized development, testing, migration, research, and design reverse-engineering.
