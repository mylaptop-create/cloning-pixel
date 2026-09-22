# Contributing to PixelForge

Thank you for your interest in contributing to PixelForge!

## Development Guidelines

1. **Keep Architecture Modular**: Separate browser automation, code generation, LLM interfacing, and Web UI logic into their respective service directories.
2. **Type Safety**: Maintain strict TypeScript typing across `src/shared/types.ts`.
3. **No Unneeded External Native Dependencies**: Prefer Node.js native standard APIs (e.g., `node:sqlite`) when possible to ensure portable local execution.
4. **Testing**: Run tests before submitting changes:
   ```bash
   npm test
   npm run build
   ```
