# Memory — 04 Database Schema

Last updated: 2026-08-18

## What was built

Phase 1 / Feature 04 (Database Schema) completed — pure InsForge backend infrastructure, no application code changes besides a new types file:

- Ran DDL via the InsForge `run-raw-sql` MCP tool (against the live backend, not a local migration file) to create `profiles`, `agent_runs`, `jobs`, `agent_logs` — exact columns from `context/architecture.md`
- RLS enabled on all four tables, one `FOR ALL USING (...) WITH CHECK (...)` policy per table
- `set_updated_at()` trigger function + trigger on `profiles` (only table with `updated_at`)
- Five indexes: `jobs(user_id, found_at desc)`, `jobs(user_id, match_score desc)`, `agent_runs(user_id, started_at desc)`, `agent_logs(run_id)`, `agent_logs(user_id, created_at desc)`
- Private `resumes` storage bucket created via `create-bucket` (`isPublic: false`)
- New file `types/index.ts` — `Profile`, `AgentRun`, `Job`, `AgentLog` types, their enum unions, and jsonb payload shapes (`WorkExperienceEntry`, `Education`, `CompanyResearch`)
- `context/build-plan.md` — removed a stale "tailored fields" bullet from Feature 04's section
- `context/progress-tracker.md` — Feature 04 checked off, phase advanced to Phase 2, full decision-log entry added

## Decisions made

- **`profiles.id` is the user id itself** (PK, FK to `auth.users(id)`, no separate `user_id` column) — RLS there checks `id = auth.uid()`; the other three tables check `user_id = auth.uid()`.
- **`profiles` rows are created lazily** — no `auth.users` insert trigger. Feature 06's Server Action will upsert on first profile save.
- **`ON DELETE` behavior**: every `user_id`/`id` → `profiles(id)` FK cascades; `jobs.run_id` → `agent_runs` is `SET NULL`; `agent_logs.run_id` → `agent_runs` cascades; `agent_logs.job_id` → `jobs` is `SET NULL`.
- **CHECK constraints only on internally-controlled enums** (`source`, `status`, `level`, and the profile dropdown columns) — deliberately **not** on `jobs.job_type`, since it's populated from Adzuna's uncontrolled `contract_type` string and a rigid CHECK there risks real insert failures.
- **One `FOR ALL` RLS policy per table**, not separate policies per command — every write in this app is already scoped to the caller's own row.
- **`types/index.ts` field casing is intentionally mixed**: table-column fields are `snake_case` (matches InsForge's PostgREST SDK output directly — confirmed no camelCase mapping layer exists anywhere in this codebase, e.g. `library-docs.md`'s Adzuna→jobs insert example uses raw snake_case keys). Nested jsonb shapes (`WorkExperienceEntry`, `Education`) are camelCase since they're app-authored structures, not raw column results. `CompanyResearch` is camelCase because that's GPT-4o's own documented JSON contract in build-plan.md's Feature 13 — not a casing choice made this session.
- **`resumes` bucket privacy is bucket-level only, not per-user.** Confirmed via `pg_policies` that InsForge's `storage.objects` table has zero RLS policies wired up — a private bucket blocks anonymous access but doesn't cryptographically stop one authenticated user from fetching another's file if they knew the exact path. Isolation relies entirely on the `resumes/{user_id}/resume.pdf` path convention. This is a platform limitation, not something built around this session — worth remembering if a real security requirement around this ever surfaces.

## Problems solved

- `run-raw-sql` rejected explicit `BEGIN`/`COMMIT` ("Transaction control statements are not allowed") — retried the identical multi-statement DDL without the transaction wrapper and it executed fine as a single call.
- Confirmed InsForge exposes Supabase-style `auth.uid()`/`auth.role()`/`auth.jwt()` functions by querying `pg_proc` directly (not assumed from general InsForge knowledge) — this is what grounded the whole RLS design being `auth.uid()`-based.
- `build-plan.md`'s Feature 04 section listed "tailored fields" as a `jobs` column group with no matching column anywhere in `architecture.md`, and it directly contradicted `project-overview.md`'s Features Out of Scope list ("Resume tailoring per job" is explicitly out). Confirmed with the user this was stale wording left over from before that scope cut, then removed it.

## Current state

All four tables, RLS policies, indexes, and the trigger exist live on the InsForge backend and were re-verified via `get-table-schema` after creation (columns, FKs, RLS, indexes, trigger all confirmed present and correct). The `resumes` bucket exists and is private. `types/index.ts` exists and `tsc --noEmit` passes clean. `context/build-plan.md` and `context/progress-tracker.md` are both up to date. **Phase 1 — Foundation is now fully complete** (all 4 features done).

## Next session starts with

Phase 2 / Feature 05 — Profile Page, Full UI, per `context/build-plan.md`: build the complete profile page UI with mock data only (no save logic yet) — needs-attention banner, resume upload section, the full Profile Information form (Personal/Professional/Work Experience/Education/Job Preferences sections), Save Profile button. The user was asked whether to kick this off with `/architect` again or dive straight in — no answer given yet before this session ended.

## Open questions

None left over from Feature 04 itself. Only open item is how the user wants to start Feature 05.
