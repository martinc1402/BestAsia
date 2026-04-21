# ADR 0007: Deploy on Vercel (not Railway)

**Status:** Accepted · April 2026
**Deciders:** Martin Casey

## Context

The stack is Next.js + TypeScript + Tailwind + Supabase. The deployment target needed to support:

- Next.js App Router with Server Components and ISR
- Scheduled functions for the weekly algorithm recompute
- Image optimization for venue photography
- Edge caching for high read-throughput pages (lists, venue entries)
- Preview deployments per PR

Two options were considered: **Vercel** and **Railway**.

## Decision

**Deploy on Vercel.**

## Consequences

- Next.js features (ISR, streaming, Server Actions, `<Image>`) work zero-config.
- Weekly algorithm recompute runs via Vercel Scheduled Functions defined in `vercel.json`.
- If recompute exceeds Vercel function timeouts (60s on Pro), the batch is chunked across multiple invocations OR offloaded to a Supabase Edge Function. Either pattern is acceptable.
- Environment variables managed in Vercel dashboard, with distinct sets for Preview and Production.
- Supabase remains the database, auth, and storage layer — Vercel handles compute and CDN.
- Preview deployments on every PR for design and editorial review.

## Rejected alternatives

- **Railway.** Rejected because the project has no long-running workers, no custom Postgres needs (Supabase handles it), and would not benefit from Railway's strengths. Vercel is purpose-built for this stack.

## Open questions

- If we outgrow Vercel's function timeouts even with chunking, revisit by moving the recompute fully to Supabase Edge Functions or a dedicated worker on Fly.io. Not a near-term concern.
