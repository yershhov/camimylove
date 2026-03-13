# A personal memory journal app — a private space to store and revisit cherished photos and moments together.

**Live:** [www.camimylove.com](https://www.camimylove.com)

**Want to try it out yourself?** Please contact me for access credentials.

> English localization coming soon. The app is currently in Italian.

> The app is mobile-first — using a phone is recommended for the best experience, though desktop or tablet works well too.

---

## Features

- **Gallery** — browse memories in a gallery-like grid, see detailed preview on click
- **Random memories** — randomly shuffle through memories
- **Upload, edit, delete** — add new photos with date and location, edit them and delete if you don't like them anymore

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Chakra UI, React Router
- **Backend:** Vercel serverless API routes
- **Storage:** Vercel Blob (images) + Neon Postgres (metadata)
- **Auth:** Session-based authentication

---

## Architecture

Memories use a split storage model:

- **Images** → Vercel Blob (`images/{memoryId}.{ext}`)
- **Metadata** → Neon Postgres `memories` table (date, location, image_url, etc.)

Both stay in sync when creating or deleting memories, for random memory pick query is performed on memories table in Neon Postgres.
