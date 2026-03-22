# ArtistHub

ArtistHub is a Next.js app for discovering independent music projects and generating mood-based playlists with Gemini AI + the iTunes Search API.

## Features

- **Projects**: browse all projects, view details, and send inquiries (submissions).
- **AI Playlist Generator**: type a prompt (any language) → Gemini extracts `genre` + `mood` → iTunes results are ranked and returned.
- **Blog + News**: public pages for posts and announcements.
- **Contact**: public contact form + admin inbox in the dashboard.
- **Dashboard**: role-based navigation (ADMIN / EDITOR / ARTIST) with managers for projects, blog, news, submissions, site content, and users.

## Tech Stack

- Next.js (App Router)
- React
- Prisma + PostgreSQL
- NextAuth (Credentials provider)
- Gemini API (`@google/generative-ai`)
- Tailwind CSS

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a local `.env` (do not commit it):

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_URL` — usually `http://localhost:3000`
- `NEXTAUTH_SECRET` — a long random string
- `GEMINI_API_KEY` — required for `/api/playlist`

### 3) Set up the database (Prisma)

This repo does not include Prisma migrations, so the simplest local setup is:

```bash
npx prisma db push
```

Then generate the client:

```bash
npx prisma generate
```

### 4) (Optional) Seed sample data

```bash
npm run seed
```

Note: the seed script creates a user with a placeholder password. If you want to log in via `/login`, make sure the stored password is a **bcrypt hash** that matches what you type (see `src/lib/auth.ts`).

### 5) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` — build production bundle
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run seed` — seed sample data (`prisma/seed.ts`)

## API Endpoints (App Router)

All routes live under `src/app/api/*`.

- `POST /api/playlist` — AI playlist generator (Gemini → iTunes)
- `GET /api/itunes?term=...` — iTunes search wrapper
- `GET/POST /api/projects` — list + create projects
- `GET/PUT/DELETE /api/projects/:id` — project detail + update + delete
- `GET/POST /api/blog` — list + create blog posts
- `GET/POST /api/contact` — list + create contact messages
- `GET/POST /api/submissions` — list + create inquiries
- `POST /api/content` — upsert JSON site content by `page`
- `PUT /api/users/:id` — update user role

## Project Structure

- `src/app/*` — pages (Home, Projects, Blog, News, Contact, Dashboard)
- `src/app/api/*` — API routes
- `src/components/*` — UI components (home, dashboard, projects, layout)
- `src/lib/*` — integrations (Prisma, NextAuth, Gemini, iTunes)
- `prisma/schema.prisma` — database schema

## Security Notes

- Never commit `.env` files. Use `.env.example` as a template.
- If secrets were ever shared publicly, rotate them immediately (database credentials, `NEXTAUTH_SECRET`, Gemini API key).
