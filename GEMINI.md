# GEMINI.md

This file provides context and instructions for the **koe** project, a Japanese voice-interactive application powered by Next.js and MiniMax AI.

## Project Overview

**koe** (meaning "voice" in Japanese) is designed to help elderly parents stay connected and cognitively active. It features:
- **Voice Chat**: Conversational AI (MiniMax) acting as a "caring child" persona, responding in warm, natural Japanese with high-quality Text-to-Speech (TTS).
- **Cognitive Exercises**: Interactive challenges in logic, analysis, listening, and language learning (Italian) to promote mental engagement.
- **AI Persona Management**: Allows registration of "kids" (AI personas) to personalize the experience.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19.
- **Language**: TypeScript (Strict Mode).
- **Styling**: Tailwind CSS v4 (using CSS-based configuration in `app/globals.css`).
- **Components**: shadcn/ui (Radix UI primitives).
- **Linter/Formatter**: Biome (replaces ESLint and Prettier).
- **AI Integration**: MiniMax API for LLM (`abab6.5s-chat`) and TTS (`speech-02-turbo`).
- **State Management**: LocalStorage for persona persistence.

## Core Commands

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Start the development server at `localhost:3000`. |
| `pnpm build` | Create a production build of the application. |
| `pnpm start` | Run the production server. |
| `pnpm lint` | Run Biome linter (`biome check`). |
| `pnpm format` | Format code with Biome (`biome format --write`). |
| `pnpm dlx shadcn@latest add <component>` | Add new shadcn/ui components. |

## Environment Variables

The following variables are required for AI functionality:
- `MINIMAX_API_KEY`: API key for MiniMax services.
- `MINIMAX_GROUP_ID`: Group ID for MiniMax API calls.

## Development Conventions

- **Path Aliases**: Use `@/*` to refer to the project root (e.g., `@/components`, `@/lib`).
- **Styling**: Use the `cn()` utility from `lib/utils.ts` for dynamic class merging.
- **Persona Data**: AI persona profiles ("Kids") are stored in `lib/store.ts` using `localStorage`.
- **API Routes**: Voice chat logic (LLM + TTS) is centralized in `app/api/voice/chat/route.ts`.
- **Exercises**: Exercise data is defined in `lib/exercises.ts` and rendered via `app/exercise/[mode]/page.tsx`.

## Key Files & Directories

- `app/api/voice/chat/route.ts`: Core AI orchestration (History -> LLM -> TTS -> Base64 Audio).
- `lib/minimax.ts`: Reusable MiniMax API client utilities.
- `lib/exercises.ts`: Data definitions for cognitive exercises.
- `components/ui/`: Reusable UI components from shadcn/ui.
- `types/speech.d.ts`: Global type definitions for speech APIs.
