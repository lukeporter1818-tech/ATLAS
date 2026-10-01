create table raw_posts (
  id             uuid        primary key default gen_random_uuid(),
  reddit_id      text        not null unique,
  subreddit      text        not null,
  topic_day      text        not null check (topic_day in ('mon','tue','wed','thu','fri','sat','sun')),
  title          text        not null,
  body           text,
  url            text,
  score          int,
  num_comments   int,
  posted_at      timestamptz,
  fetched_at     timestamptz not null default now()
);

alter table raw_posts enable row level security;

create index raw_posts_topic_day_fetched_at_idx on raw_posts (topic_day, fetched_at);


create table pain_points (
  id             uuid        primary key default gen_random_uuid(),
  raw_post_id    uuid        not null references raw_posts (id) on delete cascade,
  pain_point     text        not null,
  role           text,
  exact_quote    text        not null,
  confidence     numeric,
  verified       boolean     not null,
  reject_reason  text,
  prompt_version text        not null,
  created_at     timestamptz not null default now()
);

alter table pain_points enable row level security;

create index pain_points_raw_post_id_idx on pain_points (raw_post_id);


create table pipeline_runs (
  id             uuid        primary key default gen_random_uuid(),
  topic_day      text        not null,
  started_at     timestamptz not null default now(),
  finished_at    timestamptz,
  status         text        not null default 'running' check (status in ('running','success','error')),
  posts_fetched  int         not null default 0,
  extracted      int         not null default 0,
  verified       int         not null default 0,
  rejected       int         not null default 0,
  error          text
);

alter table pipeline_runs enable row level security;
