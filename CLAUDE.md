# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal habit-tracking web app for morning and evening routines. The user wants to complete daily habits (e.g., wake up by 6am, go to bed by 9:30pm, read before bed) and gain insights/trends over time through data visualizations.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma ORM
- **Charts/Insights**: Recharts
- **Language**: TypeScript

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Prisma: generate client after schema changes
npx prisma generate

# Prisma: create and apply a new migration
npx prisma migrate dev --name <migration-name>

# Prisma: open database GUI
npx prisma studio

# Lint
npm run lint
```

## Architecture

### Data Model (Prisma)
- **Habit** — a defined routine item (e.g., "Wake up by 6am", "Read 20 minutes"). Has a `period` field: `MORNING` or `EVENING`.
- **HabitLog** — a daily completion record linking a `Habit` to a `date` with a boolean `completed` field. This is the core table for all insights.

### App Structure (Next.js App Router)
- `app/` — all routes and layouts
  - `app/page.tsx` — today's dashboard: morning and evening checklists
  - `app/insights/page.tsx` — charts and streaks based on HabitLog history
  - `app/api/habits/` — REST API routes for habit CRUD
  - `app/api/logs/` — REST API routes for logging completions
- `components/` — shared UI (HabitChecklist, HabitCard, charts wrappers)
- `prisma/schema.prisma` — database schema
- `lib/prisma.ts` — singleton Prisma client

### Key Design Decisions
- All data is stored locally in SQLite (`prisma/dev.db`) — no external services or auth needed.
- The dashboard is date-aware: it always shows today's habits and today's completion state.
- Insights are derived from HabitLog aggregations (streak counts, weekly completion rates, etc.).
- Morning and evening routines are displayed separately, ordered by a `sortOrder` field on Habit.
