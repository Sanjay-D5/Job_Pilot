# Memory — 03 PostHog Event Tracking + Review

Last updated: 2026-08-18

## What was built

Phase 1 / Feature 03 (PostHog Initialization) completed. Browser init (`instrumentation-client.ts`) and `posthog.identify()` already existed from a prior session (set up via the **PostHog Wizard**, per the user — that's why it deviated from `build-plan.md`'s literal `lib/posthog-client.ts` spec). This session added the rest:

- `lib/posthog-server.ts` — `createPostHogServer()`, `posthog-node`, `flushAt: 1`/`flushInterval: 0`, reads `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`/`NEXT_PUBLIC_POSTHOG_HOST`
- `components/shared/MarketingCta.tsx` — new shared client component (replaced duplicated `<Link>` markup in `Navbar.tsx`, `Hero.tsx`, `CtaBanner.tsx`); fires `cta_clicked` with `{ location, label, destination }`
- `components/auth/OAuthErrorNotice.tsx` — new client component, replaced the inline `?error=oauth` banner in `app/(auth)/login/page.tsx`; fires `oauth_sign_in_failed` (anonymous, no properties) on mount
- `app/api/auth/callback/route.ts` — now fires `oauth_sign_in_completed` (`distinctId`/`userId` = `data.user.id`, `provider` = `data.user.providers?.[0]`) after a successful `exchangeOAuthCode`
- `oauth_sign_in_started` (pre-existing in `OAuthSubmitButton.tsx`, undocumented) was registered retroactively
- Registered all four new events in `context/code-standards.md`'s PostHog Events table (8 total now — 4 live, 4 still reserved for unbuilt Phase 2-4 features)
- Corrected stale doc references found along the way: `code-standards.md`/`library-docs.md` said the env var was `NEXT_PUBLIC_POSTHOG_KEY` and client init lived in `lib/posthog-client.ts` — real var is `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, real init file is root-level `instrumentation-client.ts`. Fixed in `library-docs.md`, `code-standards.md`, `architecture.md` (folder tree + the `layout.tsx` "PostHog provider" line, which was never true — there's no provider, just the instrumentation hook)
- `context/ui-registry.md` updated: "Marketing buttons" section now documents `MarketingCta` as the shared component (previously said "no shared component — small enough to inline"); Navbar/Login-page entries updated to reference the new components
- `context/progress-tracker.md`: Phase 1 checklist item 03 marked done, decision log entry added

Ran `/review` after building. Findings below were reported to the user but **not fixed yet** — review skill's rule is report-only, wait for the developer to decide.

## Decisions made

- **`cta_clicked` promoted from inline markup to a shared `components/shared/MarketingCta.tsx`** (new folder) rather than adding onClick separately in three places — matches the existing `OAuthSubmitButton` pattern of a small client component doing one focused job. `variant`/`location`/`icon` props keep it visually identical to the old inline classes (verified with `tsc`/`eslint`/`next build`).
- **`oauth_sign_in_failed` captured client-side (anonymous, no `userId`)** rather than server-side in the callback route's failure paths — no user identity exists yet at that point, and this mirrors how `oauth_sign_in_started` already works (continuity with posthog-js's own anonymous distinct_id). Documented as the one allowed exception to "always include userId" in `library-docs.md`.
- **`oauth_sign_in_completed` captured server-side with `distinctId = data.user.id` directly** (not the browser's anonymous id) — confirmed via `@insforge/sdk`'s bundled `.d.ts` that `exchangeOAuthCode` returns `CreateSessionResponse` with `user.id`/`user.providers`. No person-merge conflict with the later client-side `identify()` call since both use the same real user id.

## Problems solved

- Verified via Playwright that PostHog's own bot-detection (`_is_bot()` check inside `capture()`) silently drops events from a headless-without-stealth browser — a real "no network request fired" result during testing was PostHog correctly filtering bot traffic, not a bug in the click handler. Confirmed the handler itself does fire (temporarily added a `console.log`, saw it fire with correct args, then removed it) before concluding this.
- Traced through `posthog-node`'s actual source (`@posthog/core/dist/posthog-core-stateless.js`) rather than assuming: `shutdown()` re-throws non-`PostHogFetchError` errors and can block up to a 30s default timeout — this is what grounds Review Finding #1 below, not a guess.

## Current state

`tsc`/`eslint`/`next build` all pass. `/review` was run against this session's changes and found:

1. **Critical, unfixed:** `app/api/auth/callback/route.ts` — `posthog.capture()` + `await posthog.shutdown()` run inside the same try block as the OAuth exchange. If PostHog is unreachable/slow, `shutdown()` can reject or hang (traced through `posthog-node`'s source), causing a **successfully authenticated user to be redirected to `/login?error=oauth`** and firing a spurious `oauth_sign_in_failed`. Recommended fix: wrap in Next.js 16's `after()` (`next/server`) so it runs post-response and can never gate the redirect — confirmed `after()` exists and is stable via `node_modules/next/dist/docs/.../after.md`.
2. **Important, unfixed:** `oauth_sign_in_completed`'s `provider` property reads `data.user.providers?.[0]` — this is the user's *full list* of linked providers, not necessarily the one used for *this* sign-in. A user with both Google and GitHub linked, signing in via GitHub, could get mislabeled `provider: "google"`. Fix requires threading the provider through a cookie in `actions/auth.ts`'s `signInWithProvider()` (alongside the existing `insforge_code_verifier` cookie) and reading it back in the callback route instead of guessing.

Neither fix has been applied — user has not yet decided what to do about them.

## Next session starts with

Ask the user whether to fix the two `/review` findings above (both isolated to `app/api/auth/callback/route.ts`, and #2 also touches `actions/auth.ts`). If yes: wrap the PostHog call in `after()` for #1, add a provider cookie for #2. Otherwise, Phase 1 is fully complete — next planned work is **Phase 1 / Feature 04 — Database Schema** per `context/build-plan.md`.

## Open questions

- Should the two `/review` findings be fixed now or deferred? Not decided — user ran `/remember save` immediately after the review without responding to the findings yet.
- `posthog.reset()` on logout (documented rule in `library-docs.md`) still has no UI trigger to attach to — `actions/auth.ts`'s `signOut()` exists but nothing calls it yet. Pre-existing gap from the 02 Auth session, not introduced now; revisit whenever a sign-out UI is built.
