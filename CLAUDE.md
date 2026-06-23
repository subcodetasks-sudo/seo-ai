# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

No test runner is configured. There is no single-test command.

## Architecture Overview

This is a **Next.js 16 bilingual SaaS SEO platform** (Arabic/English) using the App Router with server-first rendering and React Query hydration.

### Route Structure

```
app/[locale]/
  (auth)/          # Login, register, reset-password, OTP
  (dashboard)/     # dashboard/, dashboard/overview, dashboard/problems, etc.
  (plans)/         # plans/
  page.tsx         # Redirects to /{locale}/dashboard
app/api/[feature]/[action]/route.ts  # All backend route handlers
```

Locales are always prefixed (`/ar/...`, `/en/...`). Default locale is Arabic (`ar`). i18n is configured in `i18n/routing.ts` via `next-intl`.

### Feature Module Layout

All business logic lives in `features/[name]/` with this structure:

```
features/[name]/
  components/      # UI (one component per file)
  queries/
    query-keys.ts  # Key factory — mandatory, never use inline strings
    api.ts         # Raw apiClient calls
    queries.ts     # queryOptions() definitions
    mutations.ts   # useMutation hooks exported as useXxx()
  services/        # Async functions for business logic / data transforms
  schemas/         # Zod schemas
  types/           # TypeScript interfaces
  hooks/           # Feature-specific hooks
  index.ts         # Barrel export
```

### API Layer

`lib/client.ts` exports `apiClient<T>(endpoint, options)`:
- `endpoint` is relative (e.g. `"projects"` → calls `/api/projects`)
- Throws on non-2xx or `result.status === false`
- Adds `Content-Type: application/json` automatically

All backend calls go through `/api/[feature]/[action]/route.ts` handlers which proxy to the real backend.

### Data Flow (Server → Client)

1. **Server Component** prefetches with `queryClient.prefetchQuery(someQueryOptions())`
2. Wraps output in `<HydrationBoundary state={dehydrate(queryClient)}>`
3. **Client Components** call the matching hook (e.g. `useQuery(someQueryOptions())`) — data is available instantly from the hydrated cache, no extra request

No prop drilling. Query key factories prevent cache key typos.

### Global Error Handling

Errors from queries/mutations are handled centrally via `QueryCache` and `MutationCache` callbacks (configured in the providers). **Do not call `toast.error()` inside components.** Components may use `isError`/`error` only for inline UI feedback (red borders, helper text).

## Coding Standards

- **TypeScript only** — no `.js` files, no `any` types
- **Regular functions** for components and services: `function Name() {}`, not arrow functions
- **Inline default exports**: `export default function ComponentName() { ... }`
- **One component per file**; split when a file exceeds ~200 lines
- **kebab-case** filenames, **PascalCase** component function names (must match)
- **Schema Discovery before typing**: fetch a real API response before writing TypeScript interfaces — check nullability, nesting, and date formats against the actual JSON

## Internationalization

- **Zero hardcoded strings** — always use `t('key.path')` from `messages/en.json` and `messages/ar.json`
- **Update both files simultaneously** when adding new keys
- **RTL layout**: use Tailwind logical properties (`ps-*`, `me-*`, `start-0`) — never `left-*`/`right-*`
- Dates via `date-fns` with `ar-SA` or `en-US` locale; numbers via `Intl.NumberFormat`

## UI & Styling

- `components/ui/` — shadcn/Radix UI primitives (Button, Input, Card, Dialog, …)
- `components/` — App-level shared components (Header, LanguageSelector, Logo)
- Tailwind CSS v4 with `@tailwindcss/postcss`; use `cn()` from `lib/utils.ts` for conditional classes
- All icons from `lucide-react` with the `size` prop
- Prefer Radix UI for interactive elements (modals, dropdowns, tabs) for accessibility
