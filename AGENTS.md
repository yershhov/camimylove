# AGENTS.md

## Project Overview
This repository contains a private memory journal app deployed on Vercel.

Current product shape:
- Mobile-first React app in Italian
- Session-gated private access
- Core flows: login, home, upload, edit, gallery, random memory, settings, quiz, legacy flow
- Memories use split storage: image binaries in Vercel Blob, metadata in Neon Postgres

Primary goals:
- Keep the app emotionally polished, lightweight, and reliable on mobile
- Preserve the existing visual tone unless a task explicitly changes product/design direction
- Avoid regressions in authentication, memory CRUD, and gallery/random-memory flows

## Source Of Truth
Use these sources in this order:
1. `docs/product.md` for product goals, flows, and non-goals
2. This file for repo workflow and agent behavior
3. `README.md` for current product summary and storage architecture
4. Existing code for implementation patterns and actual behavior

## Stack
- Frontend: React 19, TypeScript, Vite, React Router 7, Chakra UI 3
- Backend: Vercel serverless functions under `api/`
- Storage: Vercel Blob for images, Postgres/Neon for metadata
- Auth: cookie-based session validation via serverless routes
- Deployment: Vercel

## Repo Map
- `src/` client application
- `src/components/app/` route-level UI and feature flows
- `src/components/ui/` shared UI primitives and wrappers
- `src/router/ProtectedRoute.tsx` authenticated route gate and session refresh behavior
- `api/` Vercel serverless endpoints
- `api/_lib/` shared auth, Postgres, and memory repository helpers
- `vercel.json` SPA rewrite behavior

## File And Folder Conventions
- In `src/components/app/`, keep single-file pages directly under `app/`
- Only create a page subfolder when the main page has supporting components or closely related files next to it
- In `src/components/ui/`, files whose primary export is a React component should use `PascalCase.tsx`
- Use lowercase-style naming only for non-component helper modules
- Prefer local imports without explicit `.ts` or `.tsx` extensions
- Remove obsolete empty folders and stray system files such as `.DS_Store` when cleaning up structure

## Required Workflow
For any non-trivial task:
1. Read the relevant implementation first
2. Make the smallest correct change that fits current patterns
3. Validate the changed area with the smallest useful checks and keep existing automated tests passing
4. Update documentation when product behavior, architecture, or workflow meaningfully changes
5. After major feature implementation or refactors, proactively clean up obsolete files, dead code, stale helpers, and outdated paths when they are no longer used and removal is safe
6. Before creating local types, helpers, wrappers, or utilities, check whether an existing project dependency already provides a suitable built-in version and prefer that when it fits cleanly

When changing code that already has unit tests:
- Update the tests when requirements or behavior change
- Keep the assertions honest to the intended behavior; do not weaken or rewrite tests only to make them pass
- If a behavior change is intentional, make the tests describe the new requirement clearly

Do not answer codebase questions from memory when the code can be inspected directly.

## React And UI Guidelines
- Use functional components and match the local style before introducing new patterns
- Preserve the current Chakra-first styling approach unless the task explicitly changes it
- Keep mobile behavior in scope for every UI change
- Maintain the current pink-themed visual language unless directed otherwise
- For app localization, keep all supported app languages in sync for non-legacy, non-quiz user-facing flows unless a task explicitly narrows scope
- Legacy flow pages and quiz pages are intentionally not localized for the main app audience; treat them as a small pre-selected-user exception unless a task explicitly changes that product scope
- Default app language should be chosen from the browser language when no explicit user preference has been saved: use the supported browser locale when available and otherwise default to English
- Persist an explicit user language choice in client storage and expose language switching from settings
- Keep translation resources in-repo, structured by locale, and loaded through a single app-wide localization layer rather than ad hoc per-page string maps
- Prefer split per-locale modules with lazy loading as the number of supported languages grows
- When adding or changing user-facing copy in localized areas, update every supported locale in the same change
- Respect the existing route/layout split in `src/App.tsx`
- Prefer composition over adding more boolean props when component APIs start branching
- Do not add memoization hooks by default unless there is a demonstrated need
- Keep loading, error, empty, hover, focus, and disabled states coherent when editing interactive UI
- Preserve accessibility basics: semantic elements, keyboard interaction, focus visibility, and readable contrast
- Prefer built-in library primitives from installed dependencies over custom wrappers when the dependency already solves the need cleanly

## Routing And App Behavior
- Public access is effectively limited to `/login`; application routes are guarded by `ProtectedRoute`
- `src/App.tsx` owns top-level routing, feature-flag fetch, and maintenance gate logic
- Be careful with fixed-height layout behavior driven by `AppContext`
- `src/components/app/MemoriesPage/MemoriesPage.tsx` includes intentional artificial loading/transition delays used for emotional pacing; do not remove or “optimize away” those waits unless the task explicitly changes that product behavior
- Preserve route intent when editing:
  - `/home` main landing flow
  - `/upload` create memory
  - `/memories/edit/:id` edit memory
  - `/random-memories` random memory viewer
  - `/gallery` gallery browsing
  - `/quiz` quiz flow
  - `/legacy` legacy experience
  - `/settings` settings and app controls

## API And Data Rules
- Treat `api/` files as Vercel serverless functions; keep them stateless
- Memory metadata lives in Postgres via `api/_lib/memory-repository.ts`
- Memory images live in Vercel Blob; when changing upload/delete/update flows, keep Blob and Postgres behavior aligned
- The `memories` table is auto-initialized through `ensureMemoriesTable`; schema changes must be deliberate and backward-compatible
- Existing queries assume descending `id` order
- Avoid introducing API contracts that diverge from current frontend expectations unless you update both sides in the same change

## Auth And Security Rules
- Session auth is cookie-based and refreshed through `/api/session`
- Keep auth cookie handling server-side; do not move secrets or trust decisions into the client
- Current auth depends on environment-provided answers and session secrets
- Be careful with changes to:
  - `/api/validate-auth`
  - `/api/session`
  - `api/_lib/auth.ts`
  - `src/router/ProtectedRoute.tsx`
- Preserve secure cookie behavior and session refresh semantics unless the task explicitly changes auth behavior

## Vercel And Environment Assumptions
Assume preview and production deployments both matter.

Environment variables currently used in the repo include:
- `AUTH_SESSION_SECRET`
- `AUTH_DATE_ANSWER`
- `AUTH_PET_NAME_ANSWER`
- `BLOB_READ_WRITE_TOKEN`
- `POSTGRES_URL`
- `DATABASE_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL_UNPOOLED`
- `UPLOAD_FEATURE_ENABLED`
- `FF_WOMENS_DAY_FORCE`
- `FF_WOMENS_DAY_UNTIL`
- `FF_MAINTENANCE_FORCE`
- `FF_MAINTENANCE_UNTIL`
- `MAINTENANCE_ADMIN_PASSWORD`

When making changes:
- Call out any new, renamed, or removed env vars
- Be explicit about changes that affect Vercel runtime behavior, rewrites, cookies, caching, or deployment assumptions
- Preserve SPA rewrite behavior in `vercel.json` unless routing requirements change intentionally

## Validation
Use the smallest relevant checks available in this repo:
- `npm run lint`
- `npm run test`
- `npm run build`

Jest + React Testing Library are now part of the normal engineering baseline for this repo.

Testing expectations:
- Keep existing unit tests passing when changing tested code
- Add or update tests alongside behavior changes, especially for legacy/standalone mode differences
- Do not edit tests merely to silence failures; align them with the real product requirement
- Prefer thorough unit coverage for flow logic, branching behavior, and route/component mode differences when touching those areas

Pre-commit enforcement:
- A Husky pre-commit hook runs `npm run lint && npm test`
- Keep the hook working when changing scripts or test tooling

## Documentation Maintenance
Keep these files updated when major changes land in:
- product behavior or core flows
- product requirements or non-goals
- route structure
- auth/session model
- storage architecture
- deployment/runtime assumptions
- engineering workflow
- Cursor-facing durable rules that should stay aligned with repo behavior

Files in scope:
- `docs/product.md`
- `AGENTS.md`
- `.cursor/rules/*.mdc`

Do not leave major architectural or product requirements only in chat.

## Safe Change Rules
- Never overwrite unrelated local changes
- Never revert user work unless explicitly asked
- Avoid destructive commands unless explicitly approved
- If you encounter unexpected conflicting edits in files relevant to the task, stop and surface the conflict
- Feel free to remove obsolete code and files that are clearly unused after major feature work or refactors, but verify references first and avoid deleting anything with uncertain ownership or active usage

## When Unsure
- Infer from existing code before inventing new patterns
- Prefer simple, reversible changes
- Preserve production behavior over cleanup-driven refactors unless the task calls for deeper restructuring
