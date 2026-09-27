# Traides — Roadmap

**What Traides is:** a daily email newsletter with two content pillars:
1. AI news relevant to blue collar trades
2. Pain points in blue collar / commercial / residential trades that AI
   systems/software could fix

**Core principle:** ship the smallest working version of each layer before
adding the next. Goal is a real email in Luke's inbox every morning — not a
demo, a habit.

---

## Architecture

```
/traides
  /src
    /ingest      → source pulls (AI news + trade forums) → raw tables
    /extract     → Claude structured extraction (both pillars)
    /verify      → programmatic checks (quote substring match, source URL alive)
    /cluster     → embeddings-based grouping + scoring
    /digest      → HTML email render + send
    /shared
      /db        → Supabase client, table helpers
      /llm       → Claude API client, prompt templates
      /email     → Resend/Postmark client
/atlas/web       → optional future dashboard (not required for v1)
/supabase        → SQL migrations
```

Data flows one direction: ingest → extract → verify → cluster → digest →
send. Each stage writes to the DB; the next stage reads from it. No in-memory
pipeline coupling, no scheduler abstraction — a single cron entry point per
pipeline stage is enough.

---

## Phase 0 — Foundation ✅
Repo layout, Supabase project, shared DB/LLM/email client placeholders,
Next.js scaffold. Nothing useful yet, all plumbing in place.

---

## Phase 1 — Ingestion + Extraction + Verification
**Goal:** trustworthy, verified raw material for both pillars.

- **Ingestion**
  - Trade pain points: Reddit API pull from trade subreddits → `raw_posts`,
    deduped
  - AI news: RSS/HTTP pull from AI news sources (source list TBD) →
    `raw_articles`, deduped
- **Extraction** — Claude call per item, strict JSON schema:
  - Pain point: `pain_point`, `trade`, `role`, `exact_quote`, `confidence`
  - AI news: `headline`, `summary`, `trade_relevance`, `source_url`
- **Verification** — programmatic substring match of `exact_quote` against
  the raw text; discard anything that doesn't verify. Zero exceptions. AI
  news items must have a live source URL.

**Done when:** both pipelines have produced verified output cleanly for a
full week.

---

## Phase 2 — Clustering + Scoring
**Goal:** turn raw verified items into ranked story candidates.

- Embeddings-based clustering of pain points across posts (math, not
  generation — hallucination-free)
- Scoring: mention count, recency, cross-trade spread — all computed, not
  LLM-judged
- Same clustering pass for AI news items to dedupe near-duplicates across
  sources

**Done when:** each morning there's a clear ranked list of top pain-point
clusters + top AI news stories ready to be written up.

---

## Phase 3 — Digest Render + Daily Email Send
**Goal:** the actual newsletter, in the inbox, every day.

- HTML email template modeled on The Rundown's structure: hook intro → TOC
  bullets → story blocks (pattern / evidence / factual scope note) → quick
  hits → sign-off
- Two clearly demarcated sections: AI news + trade pain points
- No opinion language, ever — only what the data shows
- Daily send via Resend/Postmark to Luke's Gmail

**Done when:** Luke is reading a real, trustworthy Traides email every
morning without touching the code.

---

## Phase 4 — Archive + Search (optional, later)
**Goal:** every send is stored and queryable.

- Each digest's story blocks archived to DB
- Simple search/browse UI in `atlas/web` (or a Traides-specific web surface,
  TBD)

**Done when:** Luke can look up "what did we cover about roofing SaaS in
March" and get an answer.

---

## The one rule that protects the whole roadmap

**Don't start a phase until the previous one is boring.** Boring means: it
runs without you thinking about it, the data it produces is trustworthy, and
you're actually relying on it day to day.
