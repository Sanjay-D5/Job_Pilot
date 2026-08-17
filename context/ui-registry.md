# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Navbar

`components/layout/Navbar.tsx`

Top navbar used on every page. White background, bottom border, 64px height, max-w-360 (1440px) centered container. **Async Server Component** — calls `createInsforgeServer()` + `insforge.auth.getCurrentUser()` itself (self-contained, so it works unchanged on any future page that renders it) to decide its CTA state.

- Container: `w-full border-b border-border bg-surface`
- Inner: `mx-auto flex h-16 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8`
- Logo: `/logo.png` via `next/image` with `fill sizes="128px"`, wrapped in `relative h-8 w-32` — `sizes` is required on every `fill` image or Next logs a console warning; size the string to the fixed container width (128px here, 112px for Footer's `h-7 w-28`)
- Nav links (hidden below `md`): `text-sm font-medium text-text-dark transition-colors hover:text-accent`
- CTA button: `<MarketingCta variant="dark" location="navbar">` (see "Marketing buttons" below) — label/href toggle: "Start for free" → `/login` when unauthenticated, "Go to Dashboard" → `/dashboard` when authenticated. No sign-out UI here yet (out of Feature 02's scope — `actions/auth.ts`'s `signOut()` exists but has no trigger surface yet).

### Login page

`app/(auth)/login/page.tsx`

Centered auth card, not built from the marketing "dark CTA" pattern below — this is an in-app form surface, so it uses the standard card + outline-button tokens instead.

- Page: `flex min-h-screen flex-1 items-center justify-center bg-background px-4 py-12`
- Card: `w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]` — the standard card shadow from ui-rules.md, written out explicitly since no shadow utility class is defined for it yet
- Heading block: centered logo (`relative h-8 w-32`, `sizes="128px"`), `text-lg font-semibold text-text-primary` title, `text-sm text-text-secondary` subtitle
- Error banner (`?error=oauth`): `<OAuthErrorNotice>` (`components/auth/OAuthErrorNotice.tsx`) — client component, same classes as before (`rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm text-text-secondary`), now also fires the `oauth_sign_in_failed` PostHog event on mount via `useEffect`
- Already-authenticated visitors are redirected to `/dashboard` server-side before the card renders (`insforge.auth.getCurrentUser()` + `redirect()` at the top of the page component) — `/login` never shows the OAuth buttons to a signed-in user
- OAuth buttons: `<OAuthSubmitButton>` (see its own entry below) rendered inside each `<form action={signInWithGoogle}>`/`<form action={signInWithGithub}>`
- Brand icons: `lucide-react@1.31.0` has no `Github` export and no Google icon (brand icons were dropped from the package). Both are inlined as local (non-exported) `GoogleIcon`/`GithubIcon` SVG functions in the page file, `className="size-4"`, using verified official path data (Google's 4-color "G", GitHub's mark) — not hand-drawn. GitHub's uses `fill="currentColor"` (inherits button text color). Google's four paths use `className="fill-google-blue"` etc. — dedicated `@theme` tokens in `globals.css`/`ui-tokens.md`, not raw hex, following the same pattern as `--color-linkedin`: third-party brand colors still get named tokens even though they're not part of the app's own palette. If a second page ever needs these icons, promote them to a shared file then.

### OAuthSubmitButton

`components/auth/OAuthSubmitButton.tsx`

Last updated: 2026-08-17

The outline-button pattern (see "Marketing buttons" below) adapted into a reusable client component, needed because `useFormStatus` only works in a component nested inside the `<form>` it reads state from — the page/Server Component rendering the `<form>` can't call the hook itself.

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-md` |
| Text — default | `text-text-primary`, `text-sm font-medium` |
| Spacing | `px-4 py-2`, `gap-2` between icon and label |
| Hover state | `hover:bg-surface-secondary` |
| Disabled state | `disabled:cursor-not-allowed disabled:opacity-60`, applied while `pending` |
| Shadow | none |
| Accent usage | none — this is the outline/secondary variant, not the primary purple button |

**Pattern notes:** Full-width (`w-full justify-center`) — this variant is only used stacked in a narrow card, unlike the marketing outline button which sits inline next to a dark button. Props are `{ icon: ReactNode; label: string }`; while `pending` (via `useFormStatus`), the button disables and its label swaps to "Redirecting…" instead of rendering a spinner. `"use client"` is required — this is the only client component in the auth flow; everything else (`login/page.tsx`, `Navbar`) stays a Server Component. Reuse this for any future button that submits a form-bound Server Action ending in `redirect()`, not just OAuth — write a new component only if the pending-state treatment needs to differ (e.g. an icon-only spinner instead of a text swap).

### Footer

`components/layout/Footer.tsx`

- Container: `mt-auto border-t border-border bg-surface`
- Inner: `mx-auto flex max-w-360 flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8`
- Logo: same pattern as Navbar, `relative h-7 w-28`
- Link text: `text-sm text-text-secondary transition-colors hover:text-text-primary`
- Non-navigable items (Privacy Policy, Terms & Condition — no page in scope yet) render as plain `<span>` with the same classes minus hover, not `<Link>`, to avoid dead links.

### Marketing buttons ("dark" / "outline" pattern)

`components/shared/MarketingCta.tsx` — promoted from inline markup to a shared **client component** (used in Navbar, Hero, CtaBanner) so every marketing CTA fires the `cta_clicked` PostHog event on click without duplicating the handler three times. Props: `{ href, label, variant: "dark" | "outline", location: "navbar" | "hero" | "cta_banner", icon?: boolean }`. `location` + `label` + `destination` (the resolved `href`) go on the event as properties. If a 3rd style variant is ever needed, extend `variantClasses` in the same file rather than forking a new component.

- **Dark (primary marketing CTA):** `inline-flex items-center gap-1.5 rounded-md bg-overlay px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-overlay-dark` — uses `--color-overlay` (#111827) as the near-black button fill, not `--color-accent`. The purple accent token is reserved for in-app primary actions per ui-rules.md; the marketing site in the design uses a dark/near-black CTA instead, so `overlay`/`overlay-dark` tokens were reused for this rather than inventing a new one. (Navbar's single dark CTA now also carries `gap-1.5` for consistency — a no-op visually since it has no icon and only one flex child.)
- **Outline (secondary marketing CTA):** `inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary`
- Trailing icon on the dark button: `lucide-react` `ChevronRight`, `className="size-4"`, rendered when `icon` prop is `true` (Hero/CtaBanner's "Get Started" button only — Navbar's CTA has no icon)

### Hero

`components/homepage/Hero.tsx`

- Gradient card: `.gradient-mesh` utility (defined in `app/globals.css`, built from `--color-accent-light`, `--color-info-light`, `--color-accent-muted` radial gradients — no new hex) + `mx-auto max-w-360 rounded-2xl border border-border px-6 py-20 text-center sm:py-24`
- H1: `text-4xl font-bold leading-tight text-text-primary sm:text-5xl`, manual `<br />` for the two-line headline (matches design's intentional break, not a natural reflow)
- Subhead: `text-base text-text-secondary`
- Dashboard preview image (`/images/dashboard-demo.png`, 4788×2416) sits directly below, overlapping the gradient card via `-mt-10 sm:-mt-16` to match the "peeking" effect in the design. The PNG already includes its own browser-chrome framing and shadow — no extra wrapper card needed.

### FeatureSection (reusable)

`components/homepage/FeatureSection.tsx`

Two-column alternating image/text block. Used twice on the homepage with different content, `reverse` (image side) and `tinted` (background) props.

- Section bg: `tinted ? "bg-surface-secondary" : "bg-surface"`
- Grid: `mx-auto grid max-w-360 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24`
- Heading prop is `ReactNode` (not `string`) specifically so callers can force a `<br />` line break to match the design's exact wrap — natural reflow didn't match the mock at this column width.
- Feature list item: `border-l-2 pl-4`, border color `border-accent` when `highlighted`, else `border-border`. Title `text-sm font-semibold text-text-primary`, description `mt-1 text-sm text-text-secondary`.
- Image: plain `next/image`, `rounded-2xl`, no added shadow — source PNGs (`jobs-lists.png`, `agnet-log.png`) already have their own card/terminal chrome and shadow baked in.

### Testimonial

`components/homepage/Testimonial.tsx`

- Eyebrow label: `text-xs font-semibold tracking-wide text-accent uppercase`
- Quote: `text-xl font-medium leading-relaxed text-text-primary sm:text-2xl`
- Avatar: `/images/user-icon.png`, `size-10 rounded-full object-cover`

### CtaBanner

`components/homepage/CtaBanner.tsx`

Same gradient-card pattern and button styles as Hero, no image. Reuse Hero's structure if a third gradient CTA is ever needed instead of duplicating a third time.

---

## Shared Patterns

- **Page container width:** `mx-auto max-w-360` (= 1440px, Tailwind's canonical scale class — not `max-w-[1440px]`) with `px-4 sm:px-6 lg:px-8` for the 32px desktop side padding from ui-rules.md.
- **Card image assets:** Several homepage PNGs in `public/images/` are pre-composed screenshots that already include their own card chrome, shadow, and/or terminal window styling (`dashboard-demo.png`, `jobs-lists.png`, `agnet-log.png`). Don't re-wrap these in another card/shadow — just `rounded-2xl` and place them.
- Shadcn/ui is **not** initialized yet (no `components.json`, no `components/ui/`). Homepage needed no form primitives, so buttons were hand-styled `next/link` elements instead of pulling in shadcn's Button + its dependencies (`class-variance-authority`, `@radix-ui/react-slot`, etc. — not yet on the approved dependency list). Set up shadcn properly when the first form-heavy page (Profile) needs real inputs/selects.
