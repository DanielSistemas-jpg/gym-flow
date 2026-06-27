-- ============================================================
-- Gym Evolution — Esquema de base de datos para Supabase
-- Ejecuta este archivo en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Extensiones
create extension if not exists "pgcrypto";

-- ============================================================
-- TIPOS (enums)
-- ============================================================
do $$ begin
  create type role_tipo as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type membership_status as enum ('activa', 'vencida', 'por_vencer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type device_status as enum ('activo', 'mantenimiento', 'caido');
exception when duplicate_object then null; end $$;

do $$ begin
  create type access_result as enum ('permitido', 'vencida', 'denegado', 'pin');
exception when duplicate_object then null; end $$;

-- ============================================================
-- PERFILES (1:1 con auth.users)
-- ============================================================
create table if not exists perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text unique not null,
  dni text,
  telefono text,
  role role_tipo not null default 'user',
  avatar text,
  pin text not null default lpad((floor(random()*9000)+1000)::text, 4, '0'),
  creado_en timestamptz not null default now()
);

-- ============================================================
-- MEMBRESÍAS
-- ============================================================
create table if not exists membresias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references perfiles(id) on delete cascade,
  plan text not null,
  inicio date not null default current_date,
  fin date not null,
  precio numeric(10,2) not null default 0,
  status membership_status not null default 'activa',
  creado_en timestamptz not null default now()
);

-- ============================================================
-- PAGOS
-- ============================================================
create table if not exists pagos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references perfiles(id) on delete set null,
  membresia_id uuid references membresias(id) on delete set null,
  monto numeric(10,2) not null,
  metodo text not null default 'efectivo',
  concepto text,
  fecha timestamptz not null default now()
);

-- ============================================================
-- ASISTENCIAS / CONTROL DE ACCESO
-- ============================================================
create table if not exists asistencias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references perfiles(id) on delete set null,
  nombre text not null,
  fecha timestamptz not null default now(),
  metodo text not null default 'biometrico', -- biometrico | pin | dni
  resultado access_result not null default 'permitido',
  puerta text not null default 'Entrada Recepción'
);

-- ============================================================
-- EVENTOS / CONTENIDO
-- ============================================================
create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fecha timestamptz not null default now(),
  imagen text,
  creado_en timestamptz not null default now()
);

-- ============================================================
-- DISPOSITIVOS BIOMÉTRICOS
-- ============================================================
create table if not exists dispositivos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ubicacion text,
  status device_status not null default 'activo',
  forzar_pin boolean not null default false,
  ultima_conexion timestamptz not null default now()
);

-- ============================================================
-- LOGS DE HARDWARE
-- ============================================================
create table if not exists logs_hardware (
  id uuid primary key default gen_random_uuid(),
  device_id uuid references dispositivos(id) on delete cascade,
  device_nombre text,
  nivel text not null default 'info', -- info | warning | error
  mensaje text not null,
  fecha timestamptz not null default now()
);

-- ============================================================
-- ERRORES (auditoría técnica)
-- ============================================================
create table if not exists errores (
  id uuid primary key default gen_random_uuid(),
  origen text,
  mensaje text not null,
  detalle jsonb,
  fecha timestamptz not null default now()
);

-- ============================================================
-- ALERTAS Y NOTIFICACIONES (admin)
-- ============================================================
create table if not exists alertas (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,          -- dispositivo | contingencia | membresia | sistema
  mensaje text not null,
  canal text not null default 'sistema', -- email | whatsapp | sistema
  leida boolean not null default false,
  fecha timestamptz not null default now()
);

-- ============================================================
-- NOTIFICACIONES (por usuario)
-- ============================================================
create table if not exists notificaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references perfiles(id) on delete cascade,
  titulo text not null,
  mensaje text,
  leida boolean not null default false,
  fecha timestamptz not null default now()
);

-- ============================================================
-- VISITANTES (pase diario)
-- ============================================================
create table if not exists visitantes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  dni text,
  precio numeric(10,2) not null default 0,
  pin text not null default lpad((floor(random()*9000)+1000)::text, 4, '0'),
  fecha timestamptz not null default now()
);

-- ============================================================
-- PINES DE EMERGENCIA
-- ============================================================
create table if not exists pines_emergencia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references perfiles(id) on delete cascade,
  pin text not null,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

-- ============================================================
-- CONFIGURACIONES (clave/valor)
-- ============================================================
create table if not exists configuraciones (
  clave text primary key,
  valor jsonb not null,
  actualizado_en timestamptz not null default now()
);

-- ============================================================
-- FUNCIÓN: crear perfil automáticamente al registrarse
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfiles (id, nombre, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FUNCIÓN AUXILIAR: ¿el usuario actual es admin?
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from perfiles where id = auth.uid() and role = 'admin');
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table perfiles          enable row level security;
alter table membresias        enable row level security;
alter table pagos             enable row level security;
alter table asistencias       enable row level security;
alter table eventos           enable row level security;
alter table dispositivos      enable row level security;
alter table logs_hardware     enable row level security;
alter table errores           enable row level security;
alter table alertas           enable row level security;
alter table notificaciones    enable row level security;
alter table visitantes        enable row level security;
alter table pines_emergencia  enable row level security;
alter table configuraciones   enable row level security;

-- PERFILES: cada usuario ve/edita el suyo; admin ve todo
create policy "perfiles_select" on perfiles for select using (id = auth.uid() or public.is_admin());
create policy "perfiles_update" on perfiles for update using (id = auth.uid() or public.is_admin());
create policy "perfiles_admin_all" on perfiles for all using (public.is_admin()) with check (public.is_admin());

-- MEMBRESÍAS: usuario ve la suya; admin gestiona todas
create policy "membresias_select" on membresias for select using (user_id = auth.uid() or public.is_admin());
create policy "membresias_admin" on membresias for all using (public.is_admin()) with check (public.is_admin());

-- PAGOS
create policy "pagos_select" on pagos for select using (user_id = auth.uid() or public.is_admin());
create policy "pagos_admin" on pagos for all using (public.is_admin()) with check (public.is_admin());

-- ASISTENCIAS: usuario ve las suyas; admin gestiona todas
create policy "asistencias_select" on asistencias for select using (user_id = auth.uid() or public.is_admin());
create policy "asistencias_admin" on asistencias for all using (public.is_admin()) with check (public.is_admin());

-- EVENTOS: lectura pública; admin escribe
create policy "eventos_select" on eventos for select using (true);
create policy "eventos_admin" on eventos for all using (public.is_admin()) with check (public.is_admin());

-- DISPOSITIVOS / LOGS / ERRORES / ALERTAS / VISITANTES / PINES / CONFIG: solo admin
create policy "dispositivos_admin" on dispositivos for all using (public.is_admin()) with check (public.is_admin());
create policy "logs_admin" on logs_hardware for all using (public.is_admin()) with check (public.is_admin());
create policy "errores_admin" on errores for all using (public.is_admin()) with check (public.is_admin());
create policy "alertas_admin" on alertas for all using (public.is_admin()) with check (public.is_admin());
create policy "visitantes_admin" on visitantes for all using (public.is_admin()) with check (public.is_admin());
create policy "pines_admin" on pines_emergencia for all using (public.is_admin()) with check (public.is_admin());
create policy "config_admin" on configuraciones for all using (public.is_admin()) with check (public.is_admin());

-- NOTIFICACIONES: usuario ve/actualiza las suyas; admin todas
create policy "notif_select" on notificaciones for select using (user_id = auth.uid() or public.is_admin());
create policy "notif_update" on notificaciones for update using (user_id = auth.uid() or public.is_admin());
create policy "notif_admin" on notificaciones for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- REALTIME: publica las tablas que el dashboard escucha en vivo
-- ============================================================
alter publication supabase_realtime add table asistencias;
alter publication supabase_realtime add table dispositivos;
alter publication supabase_realtime add table alertas;
alter publication supabase_realtime add table membresias;
alter publication supabase_realtime add table eventos;

-- ============================================================
-- DATOS DE EJEMPLO (opcional)
-- ============================================================
insert into dispositivos (nombre, ubicacion, status) values
  ('Lector Principal', 'Entrada Recepción', 'activo'),
  ('Lector Sala Pesas', 'Zona de máquinas', 'activo'),
  ('Lector Salida', 'Puerta trasera', 'mantenimiento')
on conflict do nothing;

insert into eventos (titulo, descripcion, fecha) values
  ('Reto 30 días', 'Inscríbete al reto de transformación corporal.', now() + interval '7 day'),
  ('Clase de CrossFit', 'Nueva clase grupal los sábados 9am.', now() + interval '3 day')
on conflict do nothing;

-- Para convertir tu usuario en administrador (reemplaza el email):
-- update perfiles set role = 'admin' where email = 'tucorreo@gmail.com';
