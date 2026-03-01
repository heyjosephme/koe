# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm lint         # Run Biome linter (biome check)
pnpm format       # Format code with Biome (biome format --write)
```

## Architecture

This is a Next.js 16 app using the App Router with React 19.

**Stack:**
- Tailwind CSS v4 with CSS-based configuration (no tailwind.config.js)
- shadcn/ui components (new-york style) with Radix UI primitives
- Biome for linting and formatting (replaces ESLint/Prettier)
- TypeScript with strict mode

**Path aliases:**
- `@/*` maps to project root (e.g., `@/components`, `@/lib`)

**Key files:**
- `app/globals.css` - Tailwind config, CSS variables for theming (light/dark)
- `lib/utils.ts` - `cn()` helper for merging Tailwind classes
- `components/ui/` - shadcn components (add with `pnpm dlx shadcn@latest add <component>`)
