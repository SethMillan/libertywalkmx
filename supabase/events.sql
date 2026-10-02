-- ============================================================================
-- Eventos de Liberty Walk México
-- ----------------------------------------------------------------------------
-- Pegar completo en el SQL Editor de Supabase y ejecutar. Es idempotente: se
-- puede volver a correr sin duplicar nada.
--
-- Diseño a propósito simple (una sola tabla) para que el futuro panel de
-- administración sea un solo formulario:
--   * Próximo / en curso / pasado NO se guarda: el sitio lo calcula con
--     starts_on / ends_on y la fecha de hoy en CDMX.
--   * La galería es una lista de URLs dentro del mismo evento.
--   * is_published = false funciona como borrador (no aparece en el sitio).
--   * featured_on_home = true hace que el home muestre ese evento en lugar
--     del video de lanzamiento.
-- ============================================================================

create table if not exists public.events (
  id               bigint generated always as identity primary key,
  slug             text not null unique
                   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null,
  event_type       text,                       -- "Rueda de prensa", "Exhibición", "Meet"...
  starts_on        date not null,
  ends_on          date,                       -- solo si dura varios días
  time_label       text,                       -- texto libre: "12:00 PM", "11:00 a 18:00 h"
  venue            text,                       -- nombre del lugar
  city             text not null,
  address          text,
  maps_url         text,
  summary          text,                       -- 1-2 líneas para la tarjeta
  description      text,                       -- texto de la ficha; línea en blanco = párrafo nuevo
  cover_url        text,                       -- póster o foto principal
  gallery_urls     text[] not null default '{}',
  video_url        text,
  external_url     text,                       -- registro, boletos, post de Instagram...
  is_published     boolean not null default false,
  featured_on_home boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint events_dates_check check (ends_on is null or ends_on >= starts_on)
);

create index if not exists events_starts_on_idx
  on public.events (starts_on desc);

-- updated_at automático (función propia de esta tabla para no tocar la del
-- catálogo).
create or replace function public.events_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.events_set_updated_at();

-- Seguridad: el sitio público (llave anon) solo puede LEER eventos
-- publicados. No hay políticas de escritura: insertar/editar queda para el
-- SQL Editor y, más adelante, para el panel de administración con sesión.
alter table public.events enable row level security;

drop policy if exists "Eventos publicados visibles para todos" on public.events;
create policy "Eventos publicados visibles para todos"
  on public.events
  for select
  to anon, authenticated
  using (is_published);

grant select on public.events to anon, authenticated;

-- Bucket público para fotos de eventos (lo usará el panel de administración).
insert into storage.buckets (id, name, public)
values ('events', 'events', true)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Primer evento: la rueda de prensa del lanzamiento en CDMX.
-- ----------------------------------------------------------------------------
insert into public.events (
  slug, title, event_type, starts_on, time_label, city,
  summary, description, cover_url, video_url, is_published
) values (
  'liberty-walk-llega-a-mexico',
  'Liberty Walk llega a México',
  'Rueda de prensa',
  '2026-05-11',
  '12:00 PM',
  'Ciudad de México',
  'Rueda de prensa en la que Liberty Walk anunció su llegada oficial a México de la mano de Ayala Premium.',
  'Liberty Walk, la marca japonesa fundada por Wataru Kato en Nagoya, anunció oficialmente su llegada a México en una rueda de prensa en la Ciudad de México.

La llegada la encabeza Ayala Premium como distribuidor oficial, con Omar Ayala como director general de Liberty Walk México, Gonzalo Dávila como director de ventas y el creador de contenido Vladk Ruso como embajador oficial de la marca.

Desde ese día, los body kits FRP, CFRP y Dry Carbon de Liberty Walk se importan directo de Japón y se instalan en México.',
  '/eventPhoto.jpeg',
  'https://res.cloudinary.com/dkbaexswa/video/upload/q_auto/umboxing_em5rs0.mp4',
  true
)
on conflict (slug) do nothing;

-- Que la API de Supabase vea la tabla nueva de inmediato.
notify pgrst, 'reload schema';
