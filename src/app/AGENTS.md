# AGENTS.md - App Routes

## Overview
Next.js App Router pages providing the main user interface for CogniDAO site.

## Current Routes

### `/` (page.tsx)
Static homepage with CogniDAO branding and project overview. Contains:
- Hero section with logo and tagline
- "The Goal" explanation of vision
- "The Current" status with DAO link and current capabilities
- Repository showcase grid linking to GitHub projects
- Known Issues transparency table documenting limitations
- Call-to-action section

**Dependencies**: UI components from shadcn/ui, Lucide icons
**Data**: Static content only, no API calls

### `/about` (about/page.tsx)
FAQ page positioning CogniDAO as platform cooperative. Contains:
- Organizational model explanation
- "Are you X?" comparison matrix against common business models
- Platform cooperative definition and positioning

**Dependencies**: Standard React components
**Data**: Static content only

### `/memory` (memory/page.tsx)
Memory management interface moved from root. Contains:
- Chat interface integration
- Featured memory blocks display
- Memory exploration features

**Dependencies**: Chat component, memory hooks, block components
**Data**: Fetches memory blocks via API

## Architecture Notes
- Server components by default (except memory page which uses client components)
- Static content with minimal interactivity
- Follows existing shadcn/ui component patterns