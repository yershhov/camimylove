# A personal memory journal app — a private space to store and revisit cherished photos and moments together.

**Live:** [www.camimylove.com](https://www.camimylove.com)

**Want to try it out yourself?** Please contact me for access credentials.

> The app now supports English, Italian, Spanish, Ukrainian, German, French, and Dutch in the main app flows. It defaults to a supported browser language when available and otherwise falls back to English. The language can be changed later from settings.

> A few special pages are intentionally not localized. They are only meant for a tiny pre-selected user group and are not part of the general experience.

> The app is mobile-first — using a phone is recommended for the best experience, though desktop or tablet works well too.

---

## Features

- **Gallery** — browse memories in a gallery-like grid, see detailed preview on click
- **Random memories** — randomly shuffle through memories
- **Upload, edit, delete** — add new photos with date and location, edit them and delete if you don't like them anymore
- **Localization** — English, Italian, Spanish, Ukrainian, German, French, and Dutch support for the main app shell and core non-legacy, non-quiz flows, with browser-based defaulting, manual language switching in settings, and lazy-loaded locale bundles

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Chakra UI, React Router
- **Backend:** Vercel serverless API routes
- **Storage:** Vercel Blob (images) + Neon Postgres (metadata)
- **Auth:** Session-based authentication
- **Testing:** Jest + React Testing Library for unit coverage of core flow behavior, including legacy/standalone variants

Unit tests are part of the normal repo workflow and run in pre-commit checks together with linting.

---

## Architecture

Memories use a split storage model:

- **Images** → Vercel Blob (`images/{memoryId}.{ext}`)
- **Metadata** → Neon Postgres `memories` table (date, location, image_url, etc.)

Both stay in sync when creating or deleting memories, for random memory pick query is performed on memories table in Neon Postgres.
