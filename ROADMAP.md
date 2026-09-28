# Atlas — Roadmap

**What Atlas is:** a problem-to-solution engine delivered as a daily email.
Each day it ingests posts from public sources scoped to that day's topic,
extracts pain points via strict Claude structured output, verifies every
quote by substring match against the raw source text, clusters the verified
pain points, then prescribes AI workflows or software worth building to fix
them. Every prescription cites the specific verified pain points behind it.

**Weekly topic rotation:**
- Mon — Money & cost of living
- Tue — Health & fitness
- Wed — Work & careers
- Thu — Small business & trades
- Fri — Home & family
- Sat — Tech & digital life
- Sun — Wellbeing & relationships *(organizing/tracking prescriptions only, never clinical advice)*

Topic selection is driven by `atlas/src/config/topics.ts` via
`getTodaysTopic()`, which computes the weekday in **America/New_York** (not
UTC / server time).

**Core principle:** ship the smallest working version of each layer before
adding the next. Zero exceptions on quote verification — anything that
doesn't substring-match its raw source is discarded.

> **Note on subreddits:** the initial subreddit lists in `topics.ts` are
> unverified until the first ingestion pull confirms each one exists, is
> public, and produces usable posts. Expect churn in Phase 1.

---

## Architecture

```
/atlas
  /src
    /config      → typed topic rotation + getTodaysTopic()
    /ingest      → Reddit pulls scoped by today's topic → raw_posts
    /extract     → Claude structured extraction of pain points
    /verify      → substring match of exact_quote against raw text
    /cluster     → embeddings-based grouping + scoring
    /prescribe   → Claude AI-workflow/software prescriptions per top cluster
    /digest      → HTML email render + send
    /shared
      /db        → Supabase client, table helpers
      /llm       → Claude API client, prompt templates
      /email     → Resend/Postmark client
  /web           → Next.js dashboard (Phase 5 archive/search surface)
/supabase        → SQL migrations
```

Data flows one direction:
`ingest → extract → verify → cluster → prescribe → digest → send`. Each
stage writes to the DB; the next stage reads from it. No in-memory pipeline
coupling, no scheduler abstraction — a single cron entry point per stage is
enough.

---

## Phase 0 — Foundation ✅
Repo renamed to Atlas, `atlas/src/*` layout with all stage folders,
`config/topics.ts` with all seven weekday topics + `getTodaysTopic()`,
shared DB/LLM/email placeholders, Next.js web scaffold. No pipeline code
yet.

---

## Phase 1 — Ingestion + Extraction + Verification (pilot on Monday's topic)
**Goal:** trustworthy, verified raw material for one topic before
generalizing.

- **Ingestion** — Reddit API pull scoped to Monday's subreddits + keywords
  → `raw_posts`, deduped.
- **Extraction** — Claude call per post with strict JSON schema:
  `pain_point`, `role`, `exact_quote`, `confidence`.
- **Verification** — programmatic substring match of `exact_quote` against
  the raw post text. Anything that fails is discarded. Zero exceptions.

Pilot runs on-demand daily against Monday's topic config.

**Done when:** 5 consecutive daily runs pass verification cleanly — each
run produces a non-empty set of verified pain points and discards failures
without manual intervention.

Once Monday is boring, extend to the remaining six days.

---

## Phase 2 — Clustering + Scoring
**Goal:** turn raw verified pain points into ranked clusters.

- Embeddings-based clustering across posts within a topic (math, not
  generation — hallucination-free).
- Scoring: mention count, recency, cross-subreddit spread — all computed,
  not LLM-judged.
- All seven daily topics live.

**Done when:** each morning there's a ranked list of top pain-point
clusters for that day's topic.

---

## Phase 3 — Prescribe
**Goal:** turn ranked clusters into actionable AI workflow / software
prescriptions.

- Claude generates one prescription per top cluster: what to build, who
  it's for, what problem it solves.
- Each prescription **must cite the specific verified pain point IDs** it
  addresses — no citation, no prescription.
- Sunday scope guard: `prescriptionScope: 'organizing-only'` — prescriptions
  must be organizing/tracking tools, never clinical or therapeutic advice.

**Done when:** every prescription in the day's queue cites ≥1 verified pain
point and Sunday output passes the scope guard consistently.

---

## Phase 4 — Daily Email Send
**Goal:** the actual newsletter in the inbox every morning.

- HTML template: today's topic banner → top clusters with representative
  verified quotes → prescriptions with citations → sign-off.
- Topic selected via `getTodaysTopic()` (America/New_York).
- Daily send via Resend/Postmark to Luke's Gmail.

**Done when:** Luke is reading a real, trustworthy Atlas email every
morning without touching the code.

---

## Phase 5 — Archive + Search
**Goal:** every send is stored and queryable.

- Each digest's clusters + prescriptions archived to DB with citations
  preserved.
- Simple search/browse UI in `atlas/web`.

**Done when:** Luke can look up "what did we prescribe for Monday-money in
March" and get an answer with sources.

---

## The one rule that protects the whole roadmap

**Don't start a phase until the previous one is boring.** Boring means: it
runs without you thinking about it, the data it produces is trustworthy,
and you're actually relying on it day to day.
