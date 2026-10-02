-- ============================================================================
-- Panel de administración (/admin)
-- ----------------------------------------------------------------------------
-- Correr DESPUÉS de supabase/events.sql, pegándolo completo en el SQL Editor
-- de Supabase. Es idempotente: se puede volver a correr sin duplicar nada.
--
-- Cómo funciona el acceso:
--   * Cada encargado entra con su propia cuenta de Supabase Auth (correo y
--     contraseña).
--   * Solo las cuentas que estén en public.admin_users pueden entrar al panel
--     y escribir. Tener una cuenta de Auth NO basta.
--   * public.is_admin() es la regla única que usan las políticas de abajo y
--     la que deben reutilizar las secciones futuras (body kits, blog...).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Lista de administradores
-- ----------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Cada quien solo puede ver su propia fila (para saber si es admin). Nadie
-- puede insertar/editar desde la app: las altas se hacen en el SQL Editor.
drop policy if exists "Cada admin ve su propia fila" on public.admin_users;
create policy "Cada admin ve su propia fila"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

grant select on public.admin_users to authenticated;

-- ¿El usuario de la sesión actual es administrador?
-- security definer: consulta admin_users sin depender de sus políticas.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Eventos: los admins ven todo (borradores incluidos) y pueden escribir.
-- La política pública de solo lectura de events.sql se queda igual.
-- ----------------------------------------------------------------------------
drop policy if exists "Admins ven todos los eventos" on public.events;
create policy "Admins ven todos los eventos"
  on public.events
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins crean eventos" on public.events;
create policy "Admins crean eventos"
  on public.events
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins editan eventos" on public.events;
create policy "Admins editan eventos"
  on public.events
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins borran eventos" on public.events;
create policy "Admins borran eventos"
  on public.events
  for delete
  to authenticated
  using (public.is_admin());

grant select, insert, update, delete on public.events to authenticated;

-- ----------------------------------------------------------------------------
-- Fotos de eventos (bucket público "events", creado en events.sql).
-- Cualquiera puede VER las fotos por su URL pública; solo los admins pueden
-- subir, reemplazar o borrar.
-- ----------------------------------------------------------------------------
drop policy if exists "Admins ven fotos de eventos" on storage.objects;
create policy "Admins ven fotos de eventos"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'events' and public.is_admin());

drop policy if exists "Admins suben fotos de eventos" on storage.objects;
create policy "Admins suben fotos de eventos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'events' and public.is_admin());

drop policy if exists "Admins actualizan fotos de eventos" on storage.objects;
create policy "Admins actualizan fotos de eventos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'events' and public.is_admin())
  with check (bucket_id = 'events' and public.is_admin());

drop policy if exists "Admins borran fotos de eventos" on storage.objects;
create policy "Admins borran fotos de eventos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'events' and public.is_admin());

notify pgrst, 'reload schema';

-- ============================================================================
-- DAR DE ALTA A UN ENCARGADO (hacerlo una vez por persona)
-- ----------------------------------------------------------------------------
-- 1. En Supabase: Authentication > Users > Add user > Create new user.
--    Escribir su correo y una contraseña, y marcar "Auto Confirm User".
-- 2. Aquí en el SQL Editor, cambiar el correo y correr:
--
--      insert into public.admin_users (user_id, email)
--      select id, email from auth.users where email = 'correo@ejemplo.com'
--      on conflict (user_id) do nothing;
--
-- 3. Recomendado: Authentication > Sign In / Providers > desactivar
--    "Allow new users to sign up", para que nadie pueda crearse una cuenta
--    por su cuenta. (Aunque se la crearan, no entrarían al panel sin el
--    paso 2.)
--
-- DAR DE BAJA: borrar al usuario en Authentication > Users (su fila de
-- admin_users se borra sola), o solo quitarle el acceso al panel con:
--      delete from public.admin_users where email = 'correo@ejemplo.com';
-- ============================================================================
