# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Foundation
**Last completed:** 01 Homepage (UI only — no auth-aware redirect logic yet)
**Next:** 02 Auth (InsForge Google + GitHub OAuth)

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [ ] 02 Auth
- [ ] 03 PostHog Initialization
- [ ] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- Switched root layout font from the scaffolded Geist to Inter via `next/font/google` with `variable: "--font-sans"`, per ui-rules.md. Metadata title/description updated from the default "Create Next App" placeholder to JobPilot's.
- Added `.gradient-mesh` utility class to `app/globals.css` (`@layer utilities`) for the hero/CTA soft mesh background, built entirely from existing `--color-accent-light` / `--color-info-light` / `--color-accent-muted` tokens via layered `radial-gradient()` — no new hex values introduced.
- Installed `lucide-react` (already on the approved dependency list in code-standards.md, just not yet installed) for the CTA button's chevron icon.
- Did **not** initialize shadcn/ui yet. Homepage is link/text only, no form inputs, so hand-styled `next/link` buttons were used instead of pulling in shadcn's Button and its transitive deps (cva, radix-slot) which aren't on the approved list yet. Revisit when Profile page (form-heavy) is built — see ui-registry.md "Shared Patterns".
- Homepage CTAs ("Get Started", "Start for free", "Find Your First Match") all currently link to `/login` unconditionally. Build-plan's auth-aware redirect (logged-in → `/dashboard`) needs a server-side InsForge session check, which doesn't exist until Phase 1/02 Auth is built — will wire this up then.
- Footer's "Privacy Policy" and "Terms & Condition" render as plain non-interactive text, not links — those pages aren't in scope per project-overview.md and there's nowhere for them to point yet.
- Verified with a real headless-browser render (Playwright, run from an isolated scratchpad install — not added to the project's dependencies) against `context/designs/landing-page.png`; screenshots matched closely. One follow-up fix applied: `FeatureSection`'s `heading` prop was changed from `string` to `ReactNode` so the two feature-section headings could get the same manual two-line break the design shows (natural reflow wrapped them differently at this column width).

---

## Notes

- Source image dimensions (for `next/image` width/height props): `dashboard-demo.png` 4788×2416, `jobs-lists.png` 2364×1778, `agnet-log.png` 2144×1656, `user-icon.png` 192×192, `logo.png` 496×168.
- `dashboard-demo.png`, `jobs-lists.png`, and `agnet-log.png` are pre-composed screenshots — they already bake in their own card/terminal chrome and drop shadow. Don't wrap them in another card.
