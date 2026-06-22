# AI Coding Agent Instructions

This Next.js 16 bilingual (AR/EN) SaaS platform uses a feature-based architecture with server-first rendering and React Query. Read `.cursor/` rules before implementing features.

## Architecture & Project Structure

**Feature-Based Organization:**
- Each feature lives in `features/[feature-name]/` with mandatory subdirectories:
  - `components/` — UI units (one component per file, PascalCase function + kebab-case filename)
  - `services/` — Data fetching and business logic using regular `async function` syntax
  - `queries/` — React Query mutations and data fetching via `apiClient`
  - `hooks/` — Feature-specific custom hooks (e.g., `useLogin`, `useRegister`)
  - `types/` — TypeScript interfaces
  - `schemas/` — Zod validation schemas
  - `query-keys.ts` — Query key factory (mandatory to prevent key typos)

**Shared Components:**
- `components/ui/` — Low-level UI primitives (Button, Input, Card) from shadcn/radix
- `components/` — App-level components (Header, LanguageSelector, Logo)
- `hooks/` — Global hooks (e.g., `use-mobile.ts`, `use-sidebar-motion.ts`)

**Data Layer:**
- `lib/client.ts` — `apiClient<T>(endpoint, options)` wrapper with error handling
- `lib/server.ts` — Server-side utilities
- All API calls route through `/api/[feature]/[action]` (e.g., `/api/auth/login`)

## Server-First & Hydration Pattern

**RSC Default:** All components are Server Components unless state/events require client interactivity.

**Pattern:**
1. **Server Component** → fetch data via `QueryClient.prefetchQuery()`
2. **Dehydrate** → wrap with `<HydrationBoundary state={dehydrate(queryClient)}>`
3. **Client Component** → use custom hooks (e.g., `useLogin()`) to access hydrated cache instantly

This eliminates prop drilling and enables instant data access without refetching.

## React Query Standards

**Query Keys (Mandatory Factory Pattern):**
Every feature must have `queries/query-keys.ts`:
```typescript
export const authKeys = {
  all: ['auth'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  user: (id: string) => [...authKeys.all, 'user', id] as const,
};
```
Never use inline key strings like `['users']`.

**Global Error Handling:**
- Errors are handled centrally via `QueryCache` and `MutationCache` callbacks (no `toast.error()` in components)
- Components use `isError` or `error` state only for inline UI feedback (red borders, error text)

**Mutations:**
- Export as custom hooks in `queries/mutations.ts` (e.g., `useLogin()`)
- Use `onSuccess`/`onError` for component-level state only, not notifications

## Naming & Coding Standards

**File & Component Naming:**
- Files: `kebab-case.tsx` (e.g., `login-form.tsx`)
- Components: `PascalCase` function (e.g., `export default function LoginForm() {}`)
- Match kebab-case filename to component name

**Language & Syntax:**
- TypeScript only (no `.js`, no `any` types)
- Regular functions for components and services: `function Name() {}` (not arrow functions)
- Inline default exports: `export default function ComponentName() { ... }`
- One component per file; split if exceeds ~200 lines

**Schema Discovery (Before Type Definition):**
1. Identify the API endpoint (e.g., `/api/auth/login`)
2. Fetch real data via `apiClient` or curl
3. Validate actual JSON response (nullability, nesting, date formats)
4. Generate TypeScript interfaces only after confirming real response

## Internationalization (AR/EN)

**Zero Hardcoding:**
- All UI text must use `t('key.path')` from `messages/en.json` and `messages/ar.json`
- Use descriptive keys: `t('auth.login.submit_button')`, `t('errors.invalid_email')`

**RTL Support:**
- Use Tailwind logical properties: `ps-*` (padding-start), `me-*` (margin-end), `start-0` (not `left-0`)
- Dates: Use `date-fns` with locale (`ar-SA` or `en-US`)
- Numbers: Format via `Intl.NumberFormat` helper (handles Eastern Arabic numerals in AR mode)

**Simultaneous Updates:**
When adding text, update both `messages/en.json` and `messages/ar.json` at the same time.

## Component & UI Standards

**Hierarchy:**
- **UI Primitives** (`@/components/ui`) — Buttons, Inputs, Cards via Radix UI
- **Feature Components** (`@/features/[name]/components`) — Business-logic-heavy UI
- **Large Pages** — Compose from Feature Components

**Accessibility:**
- Prefer Radix UI for complex interactive elements (Modals, Dropdowns, Tabs)
- Use `lucide-react` for all icons with `size` prop for consistency
- Ensure keyboard navigation and screen reader support

## Development Workflow

**Commands:**
```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Run ESLint
```

**External Libraries:**
- **State & Queries:** React Query v5.99.2
- **Styling:** Tailwind CSS v4 + Lucide icons
- **Forms:** React Hook Form + Zod validation
- **UI:** Radix UI + shadcn components
- **i18n:** next-intl (configured in `next.config.ts`)
- **Auth/DB:** Firebase
- **Animations:** Motion (v12.40.0)
- **Charts:** Recharts

## Key Integration Points

- **Firebase:** Handle via auth services in `features/auth/services/`
- **API Routes:** New endpoints in `app/api/[feature]/[action]/` → call via `apiClient` in services
- **Theme:** Managed by `next-themes` (check `app/providers.tsx`)
- **Locale Routing:** Configured via `next-intl` in `i18n/` folder

## Common Tasks

**Adding a Feature:**
1. Create `features/new-feature/` with subdirectories above
2. Generate `query-keys.ts` factory
3. Create API service functions in `services/`
4. Build components using hydration pattern if server data needed
5. Add translations to `messages/en.json` and `messages/ar.json`

**Adding a Page:**
1. Create route in `app/[locale]/[page]/page.tsx`
2. Construct as Server Component, prefetch data if needed
3. Hydrate boundary around content
4. Import and compose Feature Components

**Adding a Form:**
1. Create Zod schema in `features/[name]/schemas/`
2. Build form component with React Hook Form
3. Create mutation hook in `queries/mutations.ts`
4. Connect via custom hook in component
