# Memory — 01 Homepage Build

Last updated: 2026-08-17

## What was built

Full homepage (`app/page.tsx`) matching `context/designs/landing-page.png`, using images from `public/images/`:

- `app/layout.tsx` — switched from scaffolded Geist to Inter via `next/font/google` (`variable: "--font-sans"`), updated metadata to JobPilot title/description
- `app/globals.css` — added `.gradient-mesh` utility (`@layer utilities`) for the hero/CTA soft mesh background, built from existing `--color-accent-light` / `--color-info-light` / `--color-accent-muted` tokens, no new hex
- `components/layout/Navbar.tsx` — logo, Dashboard/Find Jobs/Profile links, "Start for free" dark CTA
- `components/layout/Footer.tsx` — logo, Dashboard link, Privacy Policy/Terms & Condition as plain non-linked text (no pages exist for them)
- `components/homepage/Hero.tsx` — gradient card headline/subhead/CTAs + `dashboard-demo.png` preview overlapping below it
- `components/homepage/FeatureSection.tsx` — reusable two-column alternating image/text block (props: `heading: ReactNode`, `items`, `imageSrc/Alt/Width/Height`, `reverse`, `tinted`), used twice in `app/page.tsx` with `jobs-lists.png` and `agnet-log.png`
- `components/homepage/Testimonial.tsx` — success story quote + `user-icon.png` avatar
- `components/homepage/CtaBanner.tsx` — bottom gradient CTA, same pattern as Hero minus the image
- Installed `lucide-react` (already pre-approved in code-standards.md, just not yet installed) for the CTA chevron icon

Updated `context/ui-registry.md` (full component pattern log) and `context/progress-tracker.md` (Phase 1 → 01 Homepage checked off) per project rules.

## Decisions made

- Marketing CTA buttons use `bg-overlay`/`hover:bg-overlay-dark` (near-black, #111827) not `bg-accent` (purple) — the design's homepage buttons are dark, not purple. Purple accent stays reserved for in-app primary actions per ui-rules.md. Reused existing `--color-overlay` token rather than inventing a new one.
- Did **not** initialize shadcn/ui yet. Homepage is link/text only, so buttons are hand-styled `next/link` elements instead of pulling in shadcn's Button + transitive deps (cva, radix-slot — not yet on the approved dependency list). Set it up properly when Profile (form-heavy) is built.
- Homepage CTAs ("Get Started", "Start for free", "Find Your First Match") all link unconditionally to `/login` for now — the build-plan's auth-aware redirect (logged-in → `/dashboard`) needs a server-side InsForge session check that doesn't exist until Auth is built.
- `FeatureSection`'s `heading` prop is typed `ReactNode`, not `string`, specifically so callers can force the same manual two-line `<br />` break the design shows (natural text reflow didn't match the mock at this column width).
- Page container width standardized on Tailwind v4's canonical `max-w-360` (= 1440px) instead of the arbitrary `max-w-[1440px]` — IDE linter flagged this as the canonical class.

## Problems solved

- Verified the build with a real headless-browser screenshot (Playwright) instead of just trusting the code, since `chromium-cli` wasn't available in this environment. Installed Playwright into an isolated scratchpad directory (NOT added to the project's own dependencies) purely for one-off visual verification against the design PNG.
- Confirmed `dashboard-demo.png`, `jobs-lists.png`, and `agnet-log.png` are pre-composed screenshots that already bake in their own card/terminal chrome and drop shadow — don't wrap them in another card in future work.
- Source image pixel dimensions (for `next/image` width/height): `dashboard-demo.png` 4788×2416, `jobs-lists.png` 2364×1778, `agnet-log.png` 2144×1656, `user-icon.png` 192×192, `logo.png` 496×168.

## Current state

Homepage is complete and visually verified against the design (close match, screenshots compared side by side). `npm run lint` passes clean, zero console errors in the browser render. Dev server was stopped after verification. No auth, no other pages built yet — only `/` is functional; `/dashboard`, `/find-jobs`, `/profile`, `/login` routes referenced by links don't exist yet (404 until their phases are built).

## Next session starts with

Phase 1 / Feature **02 — Auth**: InsForge Google + GitHub OAuth, login page UI, OAuth callback handler, session management, middleware protecting `/dashboard`, `/profile`, `/find-jobs`, `/find-jobs/[id]`, redirect to `/dashboard` after login. Once auth exists, circle back to wire the homepage CTA buttons to the auth-aware redirect (logged-in → `/dashboard`, logged-out → `/login`) noted as a decision above.

## Open questions

None blocking — next phase (Auth) is clearly scoped in `context/build-plan.md`.
