create table if not exists public.toast_rankings (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 12),
  score integer not null default 0 check (score >= 0),
  breads integer not null default 0 check (breads >= 0),
  combo integer not null default 0 check (combo >= 0),
  good integer not null default 0 check (good >= 0),
  hinatta integer not null default 0 check (hinatta >= 0),
  undercooked integer not null default 0 check (undercooked >= 0),
  overcooked integer not null default 0 check (overcooked >= 0),
  created_at timestamptz not null default now()
);

create index if not exists toast_rankings_order_idx
  on public.toast_rankings (score desc, combo desc, breads desc, created_at asc);

alter table public.toast_rankings enable row level security;

drop policy if exists "Anyone can read toast rankings" on public.toast_rankings;
create policy "Anyone can read toast rankings"
  on public.toast_rankings
  for select
  to anon
  using (true);

drop policy if exists "Anyone can submit toast rankings" on public.toast_rankings;
create policy "Anyone can submit toast rankings"
  on public.toast_rankings
  for insert
  to anon
  with check (
    char_length(name) between 1 and 12
    and score between 0 and 9999999
    and breads between 0 and 999
    and combo between 0 and 999
    and good between 0 and 999
    and hinatta between 0 and 999
    and undercooked between 0 and 999
    and overcooked between 0 and 999
  );
