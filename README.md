# UME Loans - Loan Application Portal

A single-page loan application dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Loan officers can view application details, track status history, and progress applications through a strict workflow.

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
npm run test         # Unit tests (Vitest)
npx playwright test  # E2E tests (Playwright)
npm run lint         # ESLint
```

## Architecture

```
Server Component (page.tsx)
  -> fetches data from mock-db at render time
  -> passes to Client Component (LoanDashboard)

Server Action (actions/update-status.ts)
  -> validates transitions via status-machine.ts
  -> updates mock-db
  -> returns typed ActionResult

Client (LoanDashboard + child components)
  -> manages selection, UI state, toasts
  -> syncs selected application to URL query param (?app=APP-xxx)
  -> calls Server Action for mutations
```

This architecture means swapping mock-db for a real database requires zero changes to the UI layer.

## Design Decisions

**Status Machine Pattern:** All transition logic lives in a pure `status-machine.ts` module, used by both the Server Action (validation) and UI (rendering controls). Business rules are defined once, enforced in both layers.

**Server Components + Server Actions:** Data is fetched server-side (no loading spinner needed for initial render). Mutations use Server Actions with `useTransition` for pending state - type-safe, no API route boilerplate. Since there are no REST API routes, error handling is application-level rather than HTTP status codes (200/400/500). The server action returns a typed `{ success, error, application }` result object directly to the client. This is the idiomatic Next.js App Router pattern.

**Efficiency - Sorted List with Timestamps:** The application list is sorted by most recent status update, so the most actively worked-on applications always appear at the top. Each list card displays a relative timestamp (e.g., "2 hours ago") so officers can quickly gauge recency without opening the detail view.

**URL-synced Selection:** Clicking an application updates the URL to `/?app=APP-xxx`. This means selections are shareable and survive page refreshes. Invalid IDs in the URL (e.g., a typo or deleted application) show a clear "not found" state with a button to clear the selection.

**Dashboard Summary:** A metrics row shows Total, Pending, Under Review, and Finalized counts. Metrics update in real-time as statuses change.

**Inline Confirmation Panel:** Approve/Reject show an inline confirmation with optional notes textarea. Protects against accidental irreversible actions and supports audit trail documentation.

**Defensive Programming:** All displayed fields use nullish coalescing fallbacks (e.g., `?? "N/A"`). The UI handles missing or malformed data gracefully without crashing.

**Accessibility:** Semantic HTML elements, `aria-live="polite"` regions for status changes, keyboard-navigable controls, color is never the only indicator.

**Responsive Layout:** Desktop: sidebar + detail panel. Mobile: single-panel view with back navigation.

## Testing & Code Quality

- **Unit tests (Vitest):** 79 tests covering the status machine, mock-db, server action, and all UI components (ApplicationList, DashboardSummary, StatusBadge, StatusActions).
- **E2E tests (Playwright):** Full workflow tests against the running application.
- **ESLint:** Enforced with `@typescript-eslint` rules for type safety.

## Assumptions & Limitations

- User is authenticated as an admin loan officer.
- Data is in-memory (`mock-db.ts`), resets on server restart - filtering/search is not implemented as the dataset is small and static. With a real database, server-side filtering and pagination would be the natural next step.
- Single officer view - no concurrent editing concerns.
- Currency is AUD.
