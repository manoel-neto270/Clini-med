# CliniMed

CliniMed is a medical appointment scheduling app. A patient signs in, books a consultation by choosing a specialty, doctor, date and time, sees an instant confirmation with the appointment details, and can review or cancel upcoming consultations from "Meus agendamentos" (My appointments).

## Key technologies

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router) for the app and file-based routing
- Tailwind CSS 4 for styling
- Netlify Database (managed Postgres) with Drizzle ORM for storing appointments
- Zod for input validation on server functions
- Deployed on Netlify

## Running locally

```bash
npm install
npm run dev
```

The dev server runs on port 3000. Netlify Database is provisioned automatically the first time the app connects to it.

## Screens

- **Login** (`/`) — sign in with any e-mail/usuário and senha to start a session.
- **Agendamento** (`/agendamento`) — book a consultation: specialty, doctor, date, time, and optional notes.
- **Agendamento confirmado** (`/agendamento-confirmado/:id`) — confirmation screen with the appointment details just booked.
- **Meus agendamentos** (`/meus-agendamentos`) — list of the signed-in patient's appointments, with the option to cancel.
