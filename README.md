# UME Loans - Loan Application Portal

A single-page loan application dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Loan officers can view application details, track status history, and progress applications through a strict workflow.

## Setup

```bash
npm install
npm run dev       # http://localhost:3000
npm run test      # Run unit tests
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
  -> calls Server Action for mutations
```

This architecture means swapping mock-db for a real database requires zero changes to the UI layer.

## Design Decisions

**Status Machine Pattern:** All transition logic lives in a pure `status-machine.ts` module, used by both the Server Action (validation) and UI (rendering controls). Business rules are defined once, enforced in both layers.

**Server Components + Server Actions:** Data is fetched server-side (no loading spinner needed for initial render). Mutations use Server Actions with `useTransition` for pending state - type-safe, no API route boilerplate. This is the recommended Next.js App Router pattern.

**Dashboard Summary:** A metrics row shows Total, Pending, Under Review, and Finalized counts - making it a true dashboard, not just a list view. Metrics update in real-time as statuses change.

**Inline Confirmation Panel:** Approve/Reject show an inline confirmation with optional notes textarea. Protects against accidental irreversible actions and supports audit trail documentation.

**Defensive Programming:** All displayed fields use nullish coalescing fallbacks (e.g., `?? "N/A"`). The UI handles missing or malformed data gracefully without crashing.

**Accessibility:** Semantic HTML elements, `aria-live="polite"` regions for status changes, keyboard-navigable list items and confirmation panels, color is never the only indicator.

**Responsive Layout:** Desktop: sidebar + detail panel. Mobile: single-panel view with back navigation.

## Assumptions

- User is authenticated as an admin loan officer
- Data is in-memory (mock-db.ts), resets on server restart
- Single officer view - no concurrent editing concerns
- Currency is AUD
