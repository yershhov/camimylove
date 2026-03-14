# Product Requirements Document

## Product Summary
Camimylove is a private memory journal for a romantic relationship. It is designed as a mobile-first, emotionally expressive space to store, revisit, and browse shared memories through photos and lightweight metadata.

The app is intentionally private, intimate, and focused. It is not a social product and is not intended to support broad multi-user collaboration, sharing, or public discovery.

## Product Goals
- Make it easy to save meaningful shared memories with as little friction as possible
- Make revisiting memories feel warm, personal, and emotionally polished
- Keep the app simple, private, and reliable on mobile devices
- Preserve continuity between old memories and new memories without turning the product into a generic gallery app

## Non-Goals
- Social sharing
- Public profiles or public galleries
- Multi-user collaboration features
- Complex tagging, album, or search systems unless explicitly added later
- Turning the product into a general-purpose photo manager

## Primary User
The product is built for a single private relationship context rather than a broad anonymous audience.

Practical implications:
- The app can assume a personal tone
- Flows can be optimized for one known user journey rather than a generic mass-market setup
- Product decisions should favor emotional clarity and simplicity over configurability

## UX Principles
- Mobile-first is the default experience
- The app should feel intimate, light, and polished rather than dense or utilitarian
- Core actions should stay obvious and low-friction
- Memory browsing should feel immediate and pleasant
- The product should maintain a consistent romantic visual identity unless a feature explicitly changes that direction

## Core User Flows

### 1. Authentication
The user lands on a private login screen and answers relationship-specific prompts.

Requirements:
- Access is gated behind session-based authentication
- Successful auth creates a short-lived secure session cookie
- Unauthenticated users should not access app routes other than the login flow

### 2. Home
The home screen is the central navigation hub.

Requirements:
- It should expose the main product destinations clearly
- It should remain lightweight and mobile-friendly
- It may show limited celebratory or seasonal variations when feature flags enable them

### 3. Upload Memory
The user adds a new memory by selecting an image and optionally keeping or editing metadata.

Requirements:
- Supported file types include HEIC/HEIF, JPG/JPEG, and PNG
- EXIF date and location should be used when available
- Date and location remain editable before save
- Upload should create one Blob image object and one Postgres metadata record
- Newly uploaded memories should become visible in downstream browsing flows without needing manual hard refresh

### 4. Edit Memory
The user edits metadata for an existing memory.

Requirements:
- Current edit flow updates metadata only
- Editing should preserve the existing image unless the product explicitly adds image replacement later
- Saved changes should appear in gallery/random-memory flows immediately after update

### 5. Gallery
The gallery provides a grid view of saved memories.

Requirements:
- Memories appear in a browseable visual grid
- Opening a memory should show a larger detail view
- Infinite loading/pagination should continue to work smoothly as memory count grows
- Delete and edit actions should stay reachable from memory detail views
- Uploads, edits, and deletes should be reflected promptly

### 6. Random Memories
The random-memory flow is a lightweight, playful way to revisit memories one at a time.

Requirements:
- The user can request another random memory repeatedly
- The flow should stay fast and low-friction
- Delete and edit actions should remain available where supported
- Mutation results should be reflected immediately in subsequent views
- Some loader and transition delays in the memories flow are intentionally longer than the minimum technically required in order to create more anticipation and emotional polish
- These waits are deliberate product behavior, not accidental inefficiency, though the exact timing values may be tuned in the future

### 7. Legacy Flow
The legacy flow preserves a more guided, narrative, anniversary-style experience.

Requirements:
- It should continue to work as a special guided flow
- It may contain step-based pages such as welcome, quiz, prep, and memories
- Product changes elsewhere should avoid accidentally breaking this experience

### 8. Quiz Flow
The quiz is a themed relationship-specific interaction rather than a general feature.

Requirements:
- It should remain playful and clearly separate from core CRUD memory flows
- It may unlock or lead into emotional/narrative moments

## Current Feature Set
- Private login
- Home navigation hub
- Upload memory
- Edit memory metadata
- Delete memory
- Gallery browsing
- Random memory browsing
- Legacy guided flow
- Quiz flow
- Maintenance gate
- Feature-flag-driven seasonal welcome behavior
- Localization for the main app shell and core non-legacy, non-quiz flows in English, Italian, Spanish, Ukrainian, Russian, German, French, and Dutch

## Data Model
Each memory consists of:
- an image stored in Vercel Blob
- a metadata row stored in Neon Postgres

Current metadata fields:
- `id`
- `date`
- `location`
- `image_url`
- timestamps in the DB schema

Operational rules:
- Blob image identity and metadata identity must stay aligned
- Upload creates both image and metadata
- Delete removes both image and metadata
- Metadata edits currently update Postgres only

## Technical Product Constraints
- App is deployed on Vercel
- Frontend is React-based and mobile-first
- Authentication is session-cookie-based
- The app supports English, Italian, Spanish, Ukrainian, Russian, German, French, and Dutch in the main non-legacy, non-quiz flows
- Initial language should default from the browser language when there is no saved user preference: use the supported browser locale when available, otherwise English
- The user should be able to change language from settings, and that explicit choice should persist on the client
- Legacy flow pages and quiz pages intentionally remain Italian-only for a tiny pre-selected user group and are outside the localization scope
- The app should remain functional on desktop/tablet, but phone UX is the priority

## Quality Requirements
- Product behavior should prioritize correctness in upload, edit, delete, gallery, and random-memory flows
- Changes should avoid stale data after mutations
- The app should remain responsive and emotionally polished on mobile
- Auth gating and maintenance gating must stay reliable
- Important UI and flow behavior should be protected by unit tests, with particular attention to differences between legacy and standalone variants of shared flows
- When intended behavior changes, the corresponding tests should be updated to match the new requirement rather than being loosened only to restore a passing suite

## Open Product Edges
These are product areas that may evolve but are not yet defined as broad requirements:
- Richer organization/search for memories
- Broader settings functionality
- Replacing existing memory images during edit
- More event/season-specific experiences

## Documentation Rule
Treat this file as the product source of truth for current goals, flows, and non-goals.

Update this document when major changes land in:
- product behavior
- core flows
- user-facing feature scope
- important UX principles
- memory lifecycle rules

Do not leave important product requirements only in chat or commit messages.
