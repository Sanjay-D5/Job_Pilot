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

Top navbar used on every page. White background, bottom border, 64px height, max-w-360 (1440px) centered container.

- Container: `w-full border-b border-border bg-surface`
- Inner: `mx-auto flex h-16 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8`
- Logo: `/logo.png` via `next/image` with `fill`, wrapped in `relative h-8 w-32`
- Nav links (hidden below `md`): `text-sm font-medium text-text-dark transition-colors hover:text-accent`
- CTA button ("dark" variant — see below): `inline-flex items-center rounded-md bg-overlay px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-overlay-dark`

### Footer

`components/layout/Footer.tsx`

- Container: `mt-auto border-t border-border bg-surface`
- Inner: `mx-auto flex max-w-360 flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8`
- Logo: same pattern as Navbar, `relative h-7 w-28`
- Link text: `text-sm text-text-secondary transition-colors hover:text-text-primary`
- Non-navigable items (Privacy Policy, Terms & Condition — no page in scope yet) render as plain `<span>` with the same classes minus hover, not `<Link>`, to avoid dead links.

### Marketing buttons ("dark" / "outline" pattern)

No shared component — small enough to inline (used in Navbar, Hero, CtaBanner). If a 3rd style variant is ever needed, promote to a shared component then.

- **Dark (primary marketing CTA):** `inline-flex items-center gap-1.5 rounded-md bg-overlay px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-overlay-dark` — uses `--color-overlay` (#111827) as the near-black button fill, not `--color-accent`. The purple accent token is reserved for in-app primary actions per ui-rules.md; the marketing site in the design uses a dark/near-black CTA instead, so `overlay`/`overlay-dark` tokens were reused for this rather than inventing a new one.
- **Outline (secondary marketing CTA):** `inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary`
- Trailing icon on the dark button: `lucide-react` `ChevronRight`, `className="size-4"`

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
