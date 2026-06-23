# API Integration Guide - SEO AI Dashboard

## Overview
This document outlines the complete API integration for the seo-ai project, including the project management flow (dashboard, add project, etc.) and all connected API endpoints.

---

## 🏗️ Architecture Stack

### Layers (Bottom to Top)

```
┌────────────────────────────────────────────────────────┐
│  UI Components (Steps, Projects, Dashboard)            │
├────────────────────────────────────────────────────────┤
│  React Context (AddProjectProvider)                    │
├────────────────────────────────────────────────────────┤
│  React Query (Queries & Mutations)                     │
├────────────────────────────────────────────────────────┤
│  API Client Utility (apiClient)                        │
├────────────────────────────────────────────────────────┤
│  Next.js Route Handlers (/api/projects/...)            │
├────────────────────────────────────────────────────────┤
│  Backend API (with authentication)                     │
└────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints Reference

### Projects - List & Create

**GET** `/api/projects`
- Lists all projects for the authenticated user
- Returns: `{ projects: ProjectListItem[] }`
- Used by: Dashboard page (server-side fetch)
- Query option: `allProjectsQueryOptions()`

**POST** `/api/projects`
- Creates a new project
- Payload: `CreateProjectRequest`
- Returns: `{ id, name, domain, ... }`
- Mutation: `useCreateProject()`

### Projects - Single Project

**GET** `/api/projects/[project_id]`
- Fetches single project details
- Returns: `Project`
- Query option: `projectQueryOptions(projectId)`

**PATCH** `/api/projects/[project_id]`
- Updates project settings
- Payload: `UpdateProjectRequest`
- Mutation: `useUpdateProject()`

**DELETE** `/api/projects/[project_id]`
- Deletes a project
- Mutation: `useDeleteProject()`

### Project Dashboard

**GET** `/api/projects/[project_id]/dashboard`
- Fetches project dashboard metrics
- Returns: `ProjectDashboard`
- Query option: `projectDashboardQueryOptions(projectId)`

### Site Sections

**POST** `/api/projects/sections`
- Fetches site sections/crawl paths
- Payload: `{ domain: string }`
- Returns: `ProjectSections { sections: Section[] }`
- Used in: Step3 of add-project flow
- Query option: `siteSectionsQueryOptions(domain)`

### Domain Verification

**GET** `/api/projects/[project_id]/verify/token`
- Gets verification token for domain
- Returns: `{ token: string }`
- Query option: `verificationTokenQueryOptions(projectId)`

**POST** `/api/projects/[project_id]/verify`
- Verifies domain ownership
- Payload: `{ method: string, token?: string }`
- Used in: Step2 of add-project flow
- Mutation: `useVerifyDomain()`

### Language Detection

**POST** `/api/projects/detect-language`
- Detects primary language of website
- Payload: `{ domain: string }`
- Returns: `{ language: string }`
- Query option: `languageDetectionQueryOptions(domain)`

### Pages & Issues

**GET** `/api/projects/[project_id]/pages/[domain]`
- Gets pages for specific domain/section
- Query option: `pageDetailsQueryOptions(projectId, domain)`

**GET** `/api/projects/[project_id]/broken-pages`
- Gets broken pages (404s, errors, etc.)
- Query params: `status=new&page=1&page_size=20`
- Query option: `brokenPagesQueryOptions(projectId)`

---

## 🔄 Add Project Flow (Complete Integration)

### Step 1: Website URL & Type
**File**: `features/home/components/add-project/Step1.tsx`

```
User Input:
  - Website URL: "example.com"
  - Project Type: "wordpress" | "salla" | "custom"

Actions:
  ✓ Validates URL format
  ✓ Saves to AddProjectContext via updateFormData()

No API calls yet - local validation only
```

### Step 2: Domain Verification
**File**: `features/home/components/add-project/Step2.tsx`

```
User Input:
  - Verification token from setup process

API Calls:
  ✓ POST /api/projects/[project_id]/verify
    Body: { domain, token, method: "token" }

Context Update:
  ✓ Saves token, verification_method, domain
  ✓ Updates formData in AddProjectContext

Success → Move to Step 3
```

### Step 3: Section Selection
**File**: `features/home/components/add-project/Step3.tsx`

```
Initialization (useEffect):
  ✓ POST /api/projects/sections
    Body: { domain: formData.websiteUrl }
    Returns: { sections: Section[] }

User Input:
  ✓ Select sections/crawl paths
  ✓ At least one section required

Context Update:
  ✓ selectedSections: Set<string> of chosen prefixes
  ✓ sections: Section[] from API

On Submit (handleScan):
  ✓ Calls onFinish() → finishAddProject() from context
```

### Finish: Create Project
**File**: `features/home/components/add-project/add-project-provider.tsx`

```
finishAddProject() Function:
  1. Validates all required data present
  2. POST /api/projects
     Body: CreateProjectRequest {
       name: extracted domain
       domain: from formData.websiteUrl
       platform: from formData.projectType
       sitemap_url: ""
       url_filter: selectedSections.join("|")
     }
  3. Invalidates React Query cache (allProjectsQueryOptions)
  4. Shows success toast
  5. Redirects to /dashboard
```

---

## 🎯 Component & Provider Structure

### AddProjectProvider (Context)
**File**: `features/home/components/add-project/add-project-provider.tsx`

State:
```typescript
type AddProjectFormData = {
  websiteUrl: string;
  projectType: "wordpress" | "salla" | "custom";
  token: string;
  domain: string;
  sections: Section[];
  selectedSections: Set<string>;
  verificationMethod?: string;
};
```

Methods:
- `startAddProject()` - Initialize flow (step = 1)
- `nextStep()` - Move to next step
- `backStep()` - Go back (if on step > 1)
- `exitAddProject()` - Cancel and return to dashboard
- `finishAddProject()` - Create project and invalidate queries
- `setFormData()` / `updateFormData()` - Update form state

### Dashboard Layout
**File**: `app/[locale]/(dashboard)/layout.tsx`

Orchestrates:
- Shows add-project UI when `step !== null`
- Manages step transitions
- Passes callbacks to Step components
- Wraps everything in `<AddProjectProvider>`

### Dashboard Page
**File**: `app/[locale]/(dashboard)/dashboard/page.tsx`

Fetches (Server-side):
- `allProjectsQueryOptions()` via React Query
- Determines empty state vs. projects list
- Renders `<Projects />` or `<EmptyProjects />`

---

## 🔐 Authentication

All API routes check for `access_token` cookie:
```typescript
function getAuthHeaders(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return { Authorization: `Bearer ${accessToken}` };
}
```

Automatic: The `apiClient()` utility in `/lib/client.ts` sends all requests to `/api/*` with cookies.

---

## 📊 Data Flow Diagram

```
Dashboard Page (Server)
    ↓
    ├─→ QueryClient.fetchQuery(allProjectsQueryOptions())
    │   ↓
    │   apiClient() → GET /api/projects
    │   ↓
    │   Backend API
    │   ↓
    │   Returns ProjectListItem[]
    ↓
[hasProjects check]
    ├─→ if true: <Projects /> component
    │   ├─→ Displays project list
    │   └─→ "Add Project" button → startAddProject()
    └─→ if false: <EmptyProjects /> component
        └─→ "Add Project" button → startAddProject()

startAddProject() sets step = 1 (in AddProjectContext)
    ↓
Layout detects step !== null
    ↓
Shows Step1 (URL input)
    ↓
onNext() → Step2 (Verification)
    ├─→ POST /api/projects/[id]/verify
    └─→ onNext() → Step3 (Sections)
        ├─→ POST /api/projects/sections (fetch)
        └─→ onFinish() → finishAddProject()
            ├─→ POST /api/projects (create)
            ├─→ Invalidate queries
            ├─→ Redirect to /dashboard
            └─→ Query refetch → Dashboard updates with new project
```

---

## 🛠️ Key Implementation Details

### Client-Side Utilities

**`apiClient(endpoint, options, errorMessage)`** - `/lib/client.ts`
```typescript
- Constructs full URL: `/api/${endpoint}`
- Adds Content-Type header
- Checks response.ok and result.status
- Throws error with custom message if needed
```

**React Query Setup** - `/features/home/queries/`
- `api.ts`: Raw fetch functions using apiClient
- `queries.ts`: Query options for useQuery
- `query-keys.ts`: Standardized cache keys
- `mutations.ts`: useMutation hooks with automatic invalidation

### Server-Side Route Handlers

All files in `/app/api/projects/**/route.ts`:
- Extract auth token from cookies
- Proxy requests to backend API
- Handle errors and return JSON responses
- No business logic - pure pass-through with auth

---

## ✅ Testing Checklist

- [ ] Dashboard loads and fetches projects
- [ ] Empty state shows "Add Project" button
- [ ] Projects list displays correctly
- [ ] "Add Project" button opens Step1
- [ ] Step1 validates URL and moves to Step2
- [ ] Step2 verifies domain successfully
- [ ] Step3 fetches and displays site sections
- [ ] Step3 allows selecting sections
- [ ] Creating project succeeds and redirects
- [ ] New project appears in dashboard
- [ ] Projects refresh after creation (no manual refresh needed)
- [ ] All errors show toast notifications

---

## 🔗 File Structure Summary

```
features/home/
  ├── index.ts (exports all public APIs)
  ├── types/
  │   └── index.ts (ProjectListItem, Project, etc.)
  ├── queries/
  │   ├── api.ts (apiClient calls)
  │   ├── queries.ts (useQuery options)
  │   ├── mutations.ts (useMutation hooks)
  │   └── query-keys.ts (cache keys)
  └── components/
      ├── Projects.tsx
      ├── empty-projects.tsx
      └── add-project/
          ├── add-project-provider.tsx (Context)
          ├── AddProject.tsx (Orchestrator)
          ├── Progress.tsx (Visual indicator)
          ├── Step1.tsx (URL input)
          ├── Step2.tsx (Verification)
          ├── Step3.tsx (Section selection)
          └── index.ts (Exports)

app/
  └── [locale]/
      ├── (dashboard)/
      │   ├── layout.tsx (AddProjectProvider wrapper)
      │   └── dashboard/
      │       └── page.tsx (Dashboard page)
      └── api/
          └── projects/
              ├── route.ts (GET, POST)
              └── [project_id]/
                  ├── route.ts (GET, PATCH, DELETE)
                  ├── dashboard/route.ts (GET)
                  ├── verify/
                  │   ├── route.ts (POST)
                  │   └── token/route.ts (GET)
                  ├── pages/[domain]/route.ts (GET)
                  ├── broken-pages/route.ts (GET)
                  ├── crawls/... (more endpoints)
                  └── ...
              ├── detect-language/route.ts (POST)
              └── sections/route.ts (POST)

lib/
  └── client.ts (apiClient utility)
```

---

## 📝 Notes

- All mutations automatically invalidate related queries and trigger refetches
- Error messages are user-friendly via toast notifications
- Loading states prevent double-submissions
- Form data persists across steps via context (survives back navigation)
- All API errors are caught and displayed appropriately
- No hardcoded delays - real API calls only
