# PixelForge Architecture

PixelForge is structured as a modular, local-first application separated into five core layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    Local React Web UI                       │
│  (Sidebar, Dashboard, Crawl, Design.md, Visual Diff, Logs) │
├─────────────────────────────────────────────────────────────┤
│                    Express API Server                       │
│  (REST Endpoints, Workspace Management, ZIP Export)         │
├──────────────────────┬──────────────────────────────────────┤
│  Browser Engine      │  LLM Abstraction & Agent Engine      │
│  (Playwright)        │  (OpenAI / Custom Compatible Engine) │
├──────────────────────┴──────────────────────────────────────┤
│               Visual Regression & Image Diff Engine         │
│               (pixelmatch, PNGJS, Overlay Generation)       │
├─────────────────────────────────────────────────────────────┤
│               Node SQLite Database & Storage Persistence    │
│               (.pixelforge/pixelforge.db, Workspaces)       │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

- `src/backend/`: Server, SQLite database initialization, and pipeline services.
  - `server.ts`: Express REST API server.
  - `db.ts`: `node:sqlite` database initialization and schema setup.
  - `services/workspace.ts`: Persistent workspace and project management.
  - `services/llm.ts`: Generic OpenAI-compatible LLM client and latency tester.
  - `services/crawler.ts`: Playwright headless browser crawler and DOM extractor.
  - `services/design.ts`: Design system token parser, Wise system generator, and `design.md` builder.
  - `services/generator.ts`: React + Vite + Tailwind project code generator.
  - `services/diff.ts`: `pixelmatch` visual comparison and diff classification engine.
  - `services/agent.ts`: Autonomous pipeline runner and task logger.
- `src/frontend/`: React + Vite Web UI components.
  - `App.tsx`: Main developer tool interface with tabs, modals, and preview tools.
- `src/cli/`: Command-line executable (`pixelforge`).
- `src/shared/`: Shared TypeScript type definitions.
- `tests/`: Automated unit and integration tests.

## Storage Hierarchy

Workspaces are saved persistently in:
`workspaces/<WORKSPACE_ID>/`
  ├── `.pixelforge/config.json`
  ├── `screenshots/`
  ├── `extracted/`
  ├── `design/` (`tokens.json`, `design.md`, `wise-tokens.css`)
  ├── `project/` (Standalone React + Vite codebase)
  ├── `diffs/`
  └── `artifacts/` (`final-report.md`)
