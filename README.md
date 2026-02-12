<p align="center">
  <img src="public/meridian-logo.png" alt="Meridian Logo" width="120" height="120" />
</p>

<h1 align="center">Meridian</h1>

<p align="center">
  The open-source, all-in-one productivity suite.
  <br />
  Tasks, habits, focus sessions, and a unified dashboard — one app to manage your entire workflow.
</p>

<p align="center">
  <a href="https://github.com/axiidotsh/meridian"><img src="https://img.shields.io/github/stars/axiidotsh/meridian?style=flat&label=Stars" alt="GitHub Stars" /></a>
  <a href="https://github.com/axiidotsh/meridian/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
</p>

---

## Features

- **Task Management** — Organize your work with list and Kanban views, projects, priorities, and drag & drop reordering.
- **Habit Tracking** — Build better habits with daily tracking, streaks, completion history, and progress insights.
- **Focus Timer** — Stay in the zone with Pomodoro sessions, session history, and productivity metrics.
- **Command Menu** — Cmd+K quick actions to navigate, create tasks, and control the entire app instantly.
- **Unified Dashboard** — See everything at a glance in one central view.

## Tech Stack

- **Framework** — [Next.js](https://nextjs.org) (App Router)
- **Language** — [TypeScript](https://www.typescriptlang.org)
- **Database** — [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io)
- **Auth** — [Better Auth](https://www.better-auth.com)
- **Styling** — [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **State** — [Jotai](https://jotai.org) + [TanStack Query](https://tanstack.com/query)
- **Animations** — [Motion](https://motion.dev)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io)
- [Docker](https://www.docker.com) (for PostgreSQL)

### Setup

```bash
# Clone the repo
git clone https://github.com/axiidotsh/meridian.git
cd meridian

# Install dependencies
pnpm install

# Start the database
pnpm db:start

# Run migrations
pnpm db:migrate

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Open Source

Meridian is fully open source under the MIT license. Star the repo, contribute, or self-host your own instance.

## License

[MIT](LICENSE)
