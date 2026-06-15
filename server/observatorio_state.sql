-- Tabla aislada de solo-lectura pública para el Observatorio.
-- La alimenta server/publish.sh (service key, local). La web la lee por el REST
-- público (anon). Tu app de España Transparente NO la consulta.
-- Reversible:  drop table public.observatorio_state;

create table if not exists public.observatorio_state (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.observatorio_state enable row level security;

drop policy if exists "public read observatorio" on public.observatorio_state;
create policy "public read observatorio"
  on public.observatorio_state for select using (true);

grant select on public.observatorio_state to anon, authenticated;

insert into public.observatorio_state(key, value) values
  ('nowplaying', '{"is_playing": false}'::jsonb),
  ('system',     '{}'::jsonb)
on conflict (key) do nothing;

notify pgrst, 'reload schema';
