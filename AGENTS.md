# AGENTS.md

Overview of the project for AI agents and developers working on this codebase.

## Project Overview

MedAgenda — a medical appointment scheduling app. A patient logs in, books a consultation (specialty, doctor, date and time), sees a confirmation screen with the booking details, and can review or cancel appointments from "Meus agendamentos".

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Icons | lucide-react |
| Database | Netlify Database (Postgres) via Drizzle ORM |
| Validation | Zod |
| Deployment | Netlify |

## Directory Structure

```
├── db
│   ├── schema.ts        # Drizzle schema: `appointments` table
│   └── index.ts          # Drizzle client (Netlify Database adapter)
├── drizzle.config.ts      # Drizzle Kit config, migrations output to netlify/database/migrations
├── netlify/database/migrations  # Generated SQL migrations (run automatically at deploy time)
├── src
│   ├── components
│   │   └── AppHeader.tsx  # Shared nav header (Agendar / Meus agendamentos / logout)
│   ├── lib
│   │   └── session.ts     # localStorage-backed "logged in patient" helper (usePatientName)
│   ├── server
│   │   └── appointments.functions.ts  # Server functions: create/list/get/cancel appointments, static DOCTORS/TIME_SLOTS
│   ├── routes
│   │   ├── __root.tsx                       # Root layout
│   │   ├── index.tsx                         # Login screen (/)
│   │   ├── agendamento.tsx                   # Booking form (/agendamento)
│   │   ├── agendamento-confirmado.$id.tsx    # Confirmation screen (/agendamento-confirmado/:id)
│   │   └── meus-agendamentos.tsx             # Patient's appointment list (/meus-agendamentos)
│   └── styles.css
└── netlify.toml
```

## Key Concepts

### Authentication
There is no full auth system. The login screen accepts any e-mail/usuário + senha and stores the entered name in `localStorage` (`src/lib/session.ts`) as the "patient identity" used to scope appointments. This keeps the flow functional without extra infra; swap in real auth (e.g. Netlify Identity) if needed later.

### Data model
A single `appointments` table (`db/schema.ts`) stores `patientName`, `specialty`, `doctorName`, `appointmentDate`, `appointmentTime`, `status` (`confirmado` / `cancelado`), `notes`, `createdAt`. Doctors/specialties are a static list in `appointments.functions.ts` (`DOCTORS`), not stored in the DB.

### Server functions
All reads/writes go through TanStack Start server functions in `src/server/appointments.functions.ts`, using `.inputValidator` (Zod or plain validators) per the `tanstack-start-server-functions` convention.

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Conventions

- Routes: kebab-case files, one screen per file under `src/routes/`.
- UI text is in Portuguese (pt-BR), matching the original product design.
- Tailwind utility classes for styling; teal/emerald as the brand accent, slate for neutrals.
- Any schema change under `db/schema.ts` requires a new migration: `npx drizzle-kit generate --name <change>`.
