# Atlas — Roadmap (A to Z)

**What Atlas is:** Luke's personal AI agent — a Jarvis-style system that starts as a
daily trades-industry newsletter engine ("Traides") and grows into a full personal
web app: work, health, calendar, projects, and a voice you can actually talk to.

**Core principle governing every phase:** ship the smallest working version of each
layer before adding the next. Every phase should end with something Luke actually
uses daily — not a demo, a habit.

---

## Architecture (locked in from Phase 0 onward)

```
/atlas
  /core            → scheduler, config, shared "memory" (Luke's context/preferences)
  /skills
    /traides       → pain-point pipeline (ingest → extract → verify → cluster → email)
    /tasks         → to-dos + calendar (Phase 2)
    /health         → workouts + diet tracking (Phase 3)
    /work           → Fazio + AI project views (Phase 4)
    /voice          → conversational layer (Phase 5)
  /shared
    /db            → Postgres/Supabase client, shared schema helpers
    /llm           → Claude API client, prompt templates
    /email         → transactional email client (Resend/Postmark)
  /web             → Next.js frontend — the "all-in-one" app surface
```

Every skill is a self-contained module that Atlas core can schedule, call, and
surface data from. Nothing gets hardwired directly to the frontend — the web app
is a *view* on top of Atlas, never the thing Atlas depends on to function.

---

## Phase 0 — Foundation
**Goal:** empty pipeline, real plumbing, nothing useful yet but everything wired.

- [ ] `git init`, repo structure per the tree above
- [ ] Supabase (or Postgres) project — one shared DB for all of Atlas, schemas per skill
- [ ] Core tables: `users` (just you for now), `skill_runs` (log every job execution)
- [ ] API keys collected: Anthropic, Reddit, Resend/Postmark, Supabase
- [ ] Basic scheduler (cron or a job runner like Trigger.dev) that can invoke a skill on a schedule
- [ ] Next.js app scaffolded, deployed empty (Vercel) — proves the web layer works end to end

**Done when:** you can run `atlas run traides` locally and it does nothing but log
"ran successfully" to the DB.

---

## Phase 1 — Traides (skill #1)
**Goal:** the daily grounded pain-point email, fully working.

1. **Ingestion** — Reddit API pull from trade subreddits → `raw_posts` table, deduped
2. **Structured extraction** — Claude call per post, strict JSON schema
   (`pain_point`, `trade`, `role`, `exact_quote`, `confidence`)
3. **Verification layer** — programmatic substring match of `exact_quote` against
   the original raw text; discard anything that doesn't verify. Zero exceptions.
4. **Clustering** — embeddings-based grouping of verified pain points (math, not
   generation — keeps this step hallucination-free)
5. **Scoring** — mention count, recency, cross-trade spread — all computed, not LLM-judged
6. **Digest render** — HTML email template modeled on The Rundown's structure:
   hook intro → TOC bullets → story blocks (pattern / evidence / factual scope note)
   → quick hits → sign-off. No opinion language, ever — only what the data shows.
7. **Send** — daily via Resend/Postmark to your Gmail
8. **Archive** — every run's output stored, queryable later

**Done when:** you're reading a real, trustworthy Traides email every morning
without touching the code.

**Discipline checkpoint:** do not move to Phase 2 until extraction + verification
have run clean for at least a week. This is the trust foundation for all of Atlas.

---

## Phase 2 — Tasks & Calendar (skill #2)
**Goal:** one place for to-dos and events — Fazio work, AI projects, personal — instead
of scattered apps.

- [ ] `tasks` and `events` tables — tagged by domain (Fazio / AI projects / personal)
- [ ] Google Calendar integration (read + write) — pulls in what already exists,
      doesn't force you to re-enter everything
- [ ] Simple task CRUD in the web app
- [ ] Atlas core surfaces "today's tasks + events" as a daily briefing (can piggyback
      on the same email infra as Traides, or live in the web app — your call later)

**Done when:** you stop opening a separate to-do app or calendar app to know what's
on deck.

---

## Phase 3 — Health (workouts + diet)
**Goal:** Atlas actually knows your patterns instead of guessing.

- [ ] `workouts` and `meals`/`diet_logs` tables
- [ ] Manual logging in the web app first — don't block on integrations
- [ ] Optional later: Apple Health / Strava / MyFitnessPal integration once manual
      logging proves you'll actually use it
- [ ] Simple trend views (not full analytics yet — just "here's what you logged this week")

**Done when:** a week of real data exists in the DB, logged by you, not imported.

---

## Phase 4 — Work Layer (Fazio + AI projects)
**Goal:** Atlas becomes the single surface for "what's going on across everything
I'm building/running."

- [ ] Lightweight views into your existing projects: [[fr0st]], [[chadash]],
      [[brotherhood-project]] — status, open items, recent activity
- [ ] Fazio dispatch-relevant info surfaced (scoped to what's useful to see, not a
      rebuild of Fazio's own systems)
- [ ] This phase is mostly *aggregation* — pulling status from systems that already
      exist rather than building new ones

**Done when:** checking Atlas tells you the state of everything you're running,
without opening five other tabs.

---

## Phase 5 — Voice Layer
**Goal:** the actual Jarvis moment — talk to Atlas, get a real conversation.

- [ ] Speech-to-text (e.g. Whisper API or a streaming STT provider)
- [ ] Text-to-speech (e.g. ElevenLabs or similar) for natural-sounding replies
- [ ] Real-time/low-latency pipeline — this is the hard engineering part; budget real time for it
- [ ] Atlas's context here pulls from everything built in Phases 1-4 (your tasks,
      health data, project status) so it's not just a generic chatbot with a voice bolted on
- [ ] Personality/breadth layer — system prompt tuned for golf, video games, anime,
      movies, and AI-career talk — this part is cheap once the pipeline works

**Done when:** you can talk to Atlas out loud about your day, your projects, or just
to shoot the shit, and it responds with actual knowledge of your life, not generic chat.

---

## Phase 6 — Polish & Expansion (ongoing, no fixed end)
- Expand Traides sources (G2/Capterra, YouTube comments)
- Searchable archive UI across all historical Traides data
- Mobile-friendly web app / potential native wrapper
- Whatever new skill you want to hand Atlas next — it just slots into `/skills`

---

## The one rule that protects the whole roadmap

**Don't start a phase until the previous one is boring.** Boring means: it runs
without you thinking about it, the data it produces is trustworthy, and you're
actually relying on it day to day. A shaky Phase 1 becomes a shaky foundation for
everything built on top of it — especially Phase 5, which depends on every earlier
phase's data being real and clean.
