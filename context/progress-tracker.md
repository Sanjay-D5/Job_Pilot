# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 04 Database Schema
**Next:** 05 Profile Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

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
- **`architecture.md` and `library-docs.md` had a stale InsForge auth pattern** (a nonexistent `@insforge/ssr` package). Verified via the live InsForge MCP docs, the npm registry, and the actually-installed `@insforge/sdk@1.5.2`'s own bundled `SDK-REFERENCE.md`/`.d.ts` files that the real package is `@insforge/sdk`, with SSR helpers at the `@insforge/sdk/ssr` and `@insforge/sdk/ssr/middleware` subpaths (`createBrowserClient`, `createServerClient`, `createAuthActions`, `createRefreshAuthRouter`, `updateSession`). Both docs corrected — see their InsForge sections. While correcting the Storage snippet under the same doc pass, also fixed `upload()`'s real signature (no options object, no `upsert` flag, takes a `File | Blob`) and `getPublicUrl()` (returns a plain string, not `{ data }`) — verified against the same bundled `.d.ts`, not assumed.
- **Next.js 16 deprecated `middleware.ts` → `proxy.ts`** (`export function proxy`, not `middleware`) — confirmed via `node_modules/next/dist/docs`. Built `proxy.ts` accordingly; `architecture.md`'s folder tree and Authentication section updated to match.
- **OAuth callback is a Route Handler** (`app/api/auth/callback/route.ts`), not the page path (`app/(auth)/callback/page.tsx`) architecture.md previously listed — required because the code/verifier exchange needs to set cookies on the response, which a page component can't do. `architecture.md`'s folder tree corrected.
- Scope choices confirmed with the user before building: `proxy.ts` is the sole auth gate (no redundant page-level checks yet); login page is Google/GitHub OAuth buttons only, no email/password form (matches build-plan.md's stated UI exactly); `signOut()` exists as a Server Action (`actions/auth.ts`) but has no dedicated UI trigger yet — no page in this feature's scope needs one.
- All CTA buttons that previously pointed unconditionally to `/login` (Navbar's "Start for free", Hero's "Get Started"/"Find Your First Match", CtaBanner's "Get Started"/"Find Your First Match") now resolve to `/dashboard` when authenticated — generalized from build-plan.md's literal "Get Started and Start for free" wording to every instance of those buttons, since leaving some inconsistent would send a logged-in user back to `/login`. Navbar fetches auth state itself (self-contained, reusable on future pages); `app/page.tsx` fetches it once and passes `isAuthenticated` down to `Hero`/`CtaBanner` as a prop.
- `lucide-react@1.31.0` (the version on the approved dependency list) has **no brand/logo icons** (`Github` doesn't exist, and there's no Google icon by design — trademark reasons). Login page uses inline SVGs instead: GitHub's official mark and Google's official 4-color "G", both extracted from verified real sources (`simple-icons` and `react-google-button` packages, pulled via `npm pack` into scratchpad, not added as project dependencies) rather than hand-drawn/guessed paths.
- **Manual step still required, outside this session's reach:** the InsForge backend's `allowedRedirectUrls` was empty at the time of building (confirmed via `get-backend-metadata`), and no MCP tool exists to set it. Add `http://localhost:3000/api/auth/callback` (and the production equivalent when deployed) to Auth Methods → Redirect URLs in the InsForge dashboard, or the OAuth callback will fail after the provider redirects back.
- End-to-end verified with a real headless-browser Playwright run (same isolated scratchpad install as the homepage check): unauthenticated homepage CTAs all resolve to `/login`; visiting `/dashboard` directly redirects to `/login` (proxy protection confirmed); login page renders both buttons and the `?error=oauth` banner; clicking "Continue with Google" correctly drives the Server Action through cookie-setting and lands on Google's real OAuth consent screen with the correct `client_id`/callback chain. The final code-exchange step wasn't completed (would require a real Google account login), so `exchangeOAuthCode` itself is unverified against a live session — everything up to that boundary is confirmed working.
- **PostHog event tracking added for Phase 1's actual surface area (homepage + auth)**, ahead of the Phase 2-4 events already reserved in `code-standards.md`. Browser init (`instrumentation-client.ts`) and the client-side `oauth_sign_in_started` capture already existed from the 02 Auth session but were undocumented; this session added `lib/posthog-server.ts` (per build-plan's Item 03 spec: `posthog-node`, `flushAt: 1`, `flushInterval: 0`), `oauth_sign_in_completed` (fired server-side in `app/api/auth/callback/route.ts` after a successful `exchangeOAuthCode`, using the real `userId`/`provider` from the returned session), `oauth_sign_in_failed` (fired client-side via a new `components/auth/OAuthErrorNotice.tsx`, extracted from the inline `?error=oauth` banner — anonymous, no user identity exists yet at that point), and `cta_clicked` (fired by a new shared `components/shared/MarketingCta.tsx`, replacing the duplicated `<Link>` markup in Navbar/Hero/CtaBanner so all three marketing CTAs report `location`/`label`/`destination` instead of only being reachable via undocumented one-off handlers). All four new event names registered in `code-standards.md`'s PostHog Events table per its own "never invent without adding here first" rule.
- **`/review` run against the PostHog event work above, both findings fixed same session:** (1) `app/api/auth/callback/route.ts` awaited `posthog.capture()`/`shutdown()` inline before redirecting — traced through `posthog-node`'s source and confirmed `shutdown()` can reject or block up to 30s on a slow/unreachable PostHog endpoint, which would have turned a *successful* login into a redirect to `/login?error=oauth` (plus a spurious `oauth_sign_in_failed`). Fixed by moving the capture+shutdown into Next.js 16's `after()` (`next/server`), wrapped in its own try/catch, so PostHog's availability can never affect the auth redirect. (2) `oauth_sign_in_completed`'s `provider` property read `data.user.providers?.[0]`, which lists every provider ever linked to the account rather than the one used for this sign-in — a user with both Google and GitHub linked could get mislabeled. Fixed by threading the provider through a new `insforge_oauth_provider` cookie, set in `actions/auth.ts`'s `signInWithProvider()` alongside the existing `insforge_code_verifier` cookie and read back (then deleted) in the callback route instead of guessing.
- **Corrected two stale PostHog doc references** found while adding the events above: `code-standards.md`/`library-docs.md` referenced `NEXT_PUBLIC_POSTHOG_KEY` and a `lib/posthog-client.ts` module — the real `.env.local` var is `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, and browser init actually lives in root-level `instrumentation-client.ts` (Next.js 16's client instrumentation hook), not an imported client module. `architecture.md`'s folder tree and `library-docs.md`'s PostHog section both corrected to match the real code.
- **04 Database Schema built directly against the live InsForge backend** via `run-raw-sql`/`create-bucket` MCP tools — `profiles`, `agent_runs`, `jobs`, `agent_logs` created with the exact columns from `architecture.md`, verified empty beforehand via `get-backend-metadata`. Confirmed via a direct query that InsForge exposes Supabase-style `auth.uid()`/`auth.role()`/`auth.jwt()` functions (not assumed) — RLS on all four tables uses a single `FOR ALL USING (...) WITH CHECK (...)` policy per table: `id = auth.uid()` on `profiles` (its PK *is* the user id, no separate `user_id` column), `user_id = auth.uid()` on the other three. `profiles` rows are created lazily (no `auth.users` insert trigger) — Feature 06's Server Action will upsert on first save. Added a `set_updated_at()` trigger on `profiles` only (the one table with that column), `ON DELETE CASCADE` from all `user_id`/`id` → `profiles(id)` FKs, `SET NULL` on `jobs.run_id` and `agent_logs.job_id`, `CASCADE` on `agent_logs.run_id`, and five indexes for the query patterns Features 10/11/15/16 will run (`jobs(user_id, found_at desc)`, `jobs(user_id, match_score desc)`, `agent_runs(user_id, started_at desc)`, `agent_logs(run_id)`, `agent_logs(user_id, created_at desc)`). CHECK constraints only on internally-controlled enums (`source`, `status`, `level`, and the profile dropdown columns) — deliberately **not** on `jobs.job_type`, since it's populated from Adzuna's uncontrolled `contract_type` string per `library-docs.md`'s mapping, and a rigid CHECK there would risk real insert failures. `resumes` storage bucket created private (`isPublic: false`); confirmed via `pg_policies` that InsForge's `storage.objects` has zero RLS policies wired up, so "authenticated access only" is enforced at the bucket level (blocks anonymous access) rather than per-user — true owner-only isolation isn't available at this layer yet, isolation relies on the `resumes/{user_id}/...` path convention. All four tables re-verified with `get-table-schema` after creation (columns, FKs, RLS, indexes, trigger all confirmed present).
- **Created `types/index.ts`** (didn't exist before this session) — `Profile`/`AgentRun`/`Job`/`AgentLog` types plus the enum unions and jsonb payload shapes. Table-column fields are `snake_case` to match InsForge's PostgREST SDK output directly (no camelCase mapping layer exists anywhere in this codebase — confirmed against `library-docs.md`'s Adzuna→jobs insert example, which uses raw `snake_case` keys). Nested jsonb shapes (`WorkExperienceEntry`, `Education`) use camelCase since they're app-authored structures, not raw column results; `CompanyResearch` also camelCase since that exact shape is GPT-4o's own documented JSON contract in build-plan.md's Feature 13. `tsc --noEmit` passes.
- **Fixed a stale `build-plan.md` line**: Feature 04's `jobs` table bullet listed "tailored fields" as a column group, which doesn't correspond to anything in `architecture.md`'s schema and directly contradicts `project-overview.md`'s Features Out of Scope list ("Resume tailoring per job", "Score recalculation after tailoring"). Removed as leftover wording from before that scope cut — confirmed with the user before removing.
- **`/review` run after building, 7 of 8 findings fixed same session** (8th — verifying a real OAuth completion and building `/dashboard` — is genuinely out of reach: needs a real account login, and Dashboard is Phase 5 scope): Google icon's raw hex fills replaced with `--color-google-*` tokens (see ui-tokens.md, same brand-color-gets-a-token pattern as `--color-linkedin`); `code-standards.md` amended with explicit documented exceptions for redirect-terminated Server Actions (`actions/auth.ts`) and browser-navigation API routes (callback/refresh), since both were real, necessary deviations from its written contract that hadn't been reconciled; added `sizes` to every `fill` logo `Image` (Navbar, Footer, login) — Playwright's console listener had caught a real Next.js warning on `/login`; added `components/auth/OAuthSubmitButton.tsx` (client component, `useFormStatus`) so OAuth buttons show a "Redirecting…" pending state instead of looking unresponsive; login page now redirects an already-authenticated visitor straight to `/dashboard` instead of showing the OAuth buttons again; `proxy.ts`'s matcher now also excludes `robots.txt`/`sitemap.xml`. Re-verified with the same Playwright checks (console warnings gone, screenshots unchanged, redirect behavior unchanged) plus a fresh `tsc`/`eslint` pass after every fix.

---

## Notes

- Source image dimensions (for `next/image` width/height props): `dashboard-demo.png` 4788×2416, `jobs-lists.png` 2364×1778, `agnet-log.png` 2144×1656, `user-icon.png` 192×192, `logo.png` 496×168.
- `dashboard-demo.png`, `jobs-lists.png`, and `agnet-log.png` are pre-composed screenshots — they already bake in their own card/terminal chrome and drop shadow. Don't wrap them in another card.
