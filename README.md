# DSCOVR - NASA API

<img width="1512" height="822" alt="Screenshot 2026-09-16 at 21 04 45" src="https://github.com/user-attachments/assets/ceb04d93-1086-43fb-82b8-0a0e6223336e" />


<br/>
<br/>

Web app for exploring NASA public data, plus a moderation backoffice.
Single Next.js codebase: the public site lives in `(frontend)` and Payload CMS
in `(payload)` (`/admin`, REST, GraphQL).

## Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | **Next.js 16** (App Router, React 19, Cache Components) |
| CMS / API | **Payload 3.88** + MongoDB (`@payloadcms/db-mongodb`) |
| Front auth | **Auth.js / NextAuth v5** (Google + GitHub, JWT session) |
| UI | **Tailwind CSS v4** + **shadcn/ui** (`new-york` style, `neutral` base) |
| Primitives | Radix UI, CVA, `tailwind-merge`, Lucide |
| 3D / visuals | **Three.js**, **globe.gl**, Embla Carousel |
| Validation | Zod |
| Admin editor | Lexical (`@payloadcms/richtext-lexical`) |
| Package manager | pnpm |
| Local DB | MongoDB 7 via Docker Compose |

### Key libraries

**Runtime**

- `next`, `react`, `react-dom` — app and RSC
- `payload`, `@payloadcms/next`, `@payloadcms/ui`, `@payloadcms/db-mongodb`, `@payloadcms/richtext-lexical` — CMS and admin
- `next-auth` — reader OAuth login
- `next-themes` — light / dark
- `zod` — front env and schemas
- `vaul` — drawers
- `sonner` — toasts
- `embla-carousel-react` — carousels
- `globe.gl` + `three` — 3D Earth / EPIC and scenes
- `lite-youtube-embed` — live stream player
- `usehooks-ts` — utility hooks
- `class-variance-authority`, `clsx`, `tailwind-merge`, `cn` — variants and classnames
- `lucide-react` — icons
- `graphql` — Payload GraphQL

**Dev**

- TypeScript 5.7, ESLint 9, Prettier, Sass, `@tailwindcss/postcss`

## Features

**Front (reader)**

- Home with APOD, NEO close approaches, TechPort missions, and upcoming launches
- News (`nasa.gov` WP REST), article detail, and nested comments
- Asteroids (NeoWs browse / detail)
- Natural events (EONET) with map
- Latest Frontiers (Image & Video Library)
- Daily APOD, NASA Live (YouTube), favorites, and notifications

**Backoffice (moderator)**

- Payload panel at `/admin`
- Comment moderation (`pending` → `approved` / `rejected` / `spam`)
- OAuth readers, favorites, and notifications

## Front routes

| Route | Description |
| ----- | ----------- |
| `/` | Home |
| `/news`, `/news/[id]` | News archive and article detail |
| `/asteroids`, `/asteroids/[id]` | NEO catalog and detail |
| `/events`, `/events/[id]` | EONET events and detail |
| `/latest-frontiers` | Image Library search |
| `/apod` | Astronomy Picture of the Day |
| `/live` | NASA live stream (YouTube) |
| `/comments` | Signed-in user's comments |
| `/favorites` | User favorites |
| `/notifications` | Notifications (e.g. replies) |
| `/design` | Design system sandbox |
| `/admin` | Payload CMS |
| `/api/auth/*` | Auth.js (NextAuth) |
| `/api/*` | Payload REST |
| `/api/graphql` | Payload GraphQL |

## External APIs

Base URLs are centralized in `src/shared/constants/nasa-endpoints.ts`.

| Source | Base / URL | Used for |
| ------ | ---------- | -------- |
| **EPIC** | `https://epic.gsfc.nasa.gov/api` | Earth imagery (`/enhanced`) — home 3D explorer |
| **APOD (WP)** | `https://science.nasa.gov/wp-json/wp/v2` | Picture of the Day (`/apod-basic`) |
| **News (WP)** | `https://www.nasa.gov/wp-json/wp/v2` | Feed and detail (`/posts`, `/posts/:id`) |
| **EONET** | `https://eonet.gsfc.nasa.gov/api/v3` | Natural events (`/events`, `/events/:id`) |
| **NeoWs** | `https://api.nasa.gov/neo/rest/v1` | Asteroids (`/neo/browse`, `/neo/:id`, `/feed`) |
| **Image Library** | `https://images-api.nasa.gov` | Latest Frontiers and project media (`/search`) |
| **TechPort** | `https://api.nasa.gov/techport/api` | Featured home missions (`/projects`, `/projects/:id`) |
| **The Space Devs** | `https://ll.thespacedevs.com/2.2.0` | Next launch (`/launch/upcoming`) |
| **YouTube** | `https://www.youtube.com/@NASA/live` | Live status / embed |

> NeoWs and TechPort need `NASA_API_KEY` / `NEXT_PUBLIC_NASA_API_KEY`
> ([api.nasa.gov](https://api.nasa.gov)). Without a key the server falls back to
> `DEMO_KEY` (low rate limit).

### Internal endpoints (Payload REST)

Standard Payload pattern on `/api/<collection>`.

| Collection | Example | Notes |
| ---------- | ------- | ----- |
| `comments` | `GET /api/comments?where[articleId][equals]=<id>&limit=200&depth=0&sort=createdAt` | Anonymous users only see `approved` |
| `comments` | `POST /api/comments` | Public create; `status` always starts as `pending` |
| `site-users` | `/api/site-users` | OAuth readers (authenticated access) |
| `favorites` | `/api/favorites` | Reader saves |
| `notifications` | `/api/notifications` | Alerts (e.g. reply) |
| `users` | `/api/users` | Admin staff |

The front also uses Payload's **Local API** (server actions / RSC) and bypasses
HTTP access control when running in the same process.

GraphQL: `/api/graphql` (playground at `/api/graphql-playground`).

## Structure

```
src/
  app/
    (frontend)/          # Public app (Tailwind + design tokens)
      (home)/page.tsx
      news/ asteroids/ events/ apod/ live/ …
      api/auth/[...nextauth]/
    (payload)/           # Admin + REST + GraphQL
      admin/[[...segments]]/
      api/[...slug]/
  features/              # Front domains (services, components, types)
    home/ news/ asteroids/ events/ apod/ comments/ …
  shared/                # UI kit, tokens, http client, NASA constants
  collections/           # Comments, SiteUsers, Favorites, Notifications, Users
  access/                # Payload access-control helpers
  auth.ts                # Auth.js config
  payload.config.ts
```

Each route group has its **own root layout**: Tailwind is only imported in
`(frontend)`. The admin uses Payload CSS and is not overridden by Tailwind
preflight.

The group is named `(payload)` because Payload looks for the import map at
`app/(payload)/admin/importMap.js`. If you rename it, set
`admin.importMap.importMapFile` in `payload.config.ts`.

## Payload collections

### `comments`

| Field | Type | Notes |
| ----- | ---- | ----- |
| `articleId` | text | Article id. Required and indexed. |
| `articleUrl` / `articleTitle` | text | Optional, for the admin UI. |
| `authorName` / `authorEmail` | text / email | Email only readable when authenticated. |
| `author` | relationship → `site-users` | OAuth reader (empty if created manually). |
| `content` | textarea | Max 5000 characters. |
| `parent` / `replies` | relationship / join | Reply tree. |
| `status` | select | `pending` (default), `approved`, `rejected`, `spam`. |

Rules: no `parent` cycles, replies inherit `articleId`, cascading delete of
replies and related notifications.

### `site-users`

Blog readers (OAuth). Separate from `users` (admin staff).
Stable key: `authKey` = `<provider>:<id>`.

### `favorites`

Denormalized saves (`kind`: `news` | `apod`) so listing does not re-hit
external APIs.

### `notifications`

Today: comment replies (`type: reply`), with a denormalized payload.

### `users`

Backoffice staff. Native Payload auth, no roles.

## Access (comments)

| Operation | Anonymous | Authenticated (admin / Local API) |
| --------- | --------- | --------------------------------- |
| create | yes → always `pending` | yes |
| read | `approved` only, no email | everything |
| update / delete | no | yes |

`status` cannot be set from the blog: if sent in the POST, it is ignored.

## Front auth

- Providers: Google and GitHub (`src/auth.ts`)
- JWT session in an httpOnly cookie (`AUTH_SECRET`)
- Callbacks: `http://localhost:3000/api/auth/callback/google` (and `/github`)
- The `site-users` document is created the first time identity is needed
  (comment, favorite, etc.)

## Getting started

```bash
cp .env.example .env
docker compose up -d    # Mongo on localhost:27017
pnpm install
pnpm dev
```

- Front: http://localhost:3000  
- Admin: http://localhost:3000/admin (create the first user there)

### Environment variables

| Variable | Purpose |
| -------- | ------- |
| `DATABASE_URL` | Mongo connection |
| `PAYLOAD_SECRET` | CMS session token signing (`openssl rand -hex 32`) |
| `CORS_ORIGINS` | External origins allowed to call the REST API |
| `CSRF_ORIGINS` | Origins that may use the session cookie (must include admin) |
| `AUTH_SECRET` | Auth.js JWT signing |
| `AUTH_TRUST_HOST` | `true` outside Vercel |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | GitHub OAuth |
| `NASA_API_KEY` | `api.nasa.gov` key (server) |
| `NEXT_PUBLIC_NASA_API_KEY` | Same key for front calls validated with Zod |
| `NEXT_PUBLIC_ENVIRONMENT` | Front environment (`development`, etc.) |

## Scripts

| Command | What it does |
| ------- | ------------ |
| `pnpm dev` | Dev server |
| `pnpm devsafe` | Wipe `.next` and start again |
| `pnpm build` / `pnpm start` | Production build and serve |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Regenerate the admin import map |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm payload` | Payload CLI |

## UI / design system

Tokens and components live in `src/shared/styles` and `src/shared/components`
(button, card, badge, drawer, carousel, etc.). shadcn is already initialized
(`components.json`); to add primitives:

```bash
npx shadcn@latest add dialog table dropdown-menu
```
