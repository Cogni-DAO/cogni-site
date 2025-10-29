# AGENTS.md - Cogni Site

## Project Overview
**cogni-site** - Next.js frontend application for CogniDAO's memory and knowledge management system. Provides web interface for exploring, managing, and interacting with memory blocks, knowledge graphs, and work items.

## Core Function
Frontend interface that connects to a memory management API to display memory blocks, knowledge relationships, work items, and provides chat functionality for interacting with stored knowledge.

## Architecture Overview
- **Framework**: Next.js 14 with App Router
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: SWR for data fetching and caching
- **Data Visualization**: Cytoscape.js for knowledge graphs
- **API Integration**: Generated TypeScript clients from OpenAPI specs
- **Chat**: AI-powered chat interface for knowledge interaction

## Development Rules

### 1. Rendering
- Use Server Components by default for static content and initial data
- Mark Client Components only when interactivity is required (forms, graphs, chat)
- Fetch data on server first; hydrate minimal state to clients

### 2. Data Fetching  
- Use SWR hooks from `src/hooks/` for client-side data fetching
- Generate API clients with `pnpm gen:api` from OpenAPI specs
- API calls via generated functions in `src/data/`

### 3. Types & Contracts
- Enable strict TypeScript (currently `strict: false` - needs fixing)
- Never hand-write API response types - regenerate via `pnpm gen:api`

### 4. Styling
- Tailwind tokens from `tailwind.config.ts` are the single source of design truth
- No inline styles. Use utility classes and CSS custom properties
- Use existing shadcn/ui components from `src/components/ui/` first
- Leverage predefined classes: `.content-block`, `.unified-interactive-card`

### 5. Imports & Structure
- Use `@/` aliases only (`@/components`, `@/lib`, `@/hooks`)
- Keep components focused and co-located with related files

### 6. Error & Loading States
- Implement proper error boundaries and loading states
- Show skeletons for primary content
- Surface API errors as toasts using existing toast system