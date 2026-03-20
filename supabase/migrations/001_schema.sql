-- ============================================================
-- 001_schema.sql
-- Tablas, enum, índices, RLS y helper is_admin()
-- ============================================================

-- 1. Enum de estado de slot
create type slot_status as enum ('available', 'reserved', 'blocked');

-- 2. Tabla time_slots
create table time_slots (
  id             uuid        primary key default gen_random_uuid(),
  start_datetime timestamptz not null,
  end_datetime   timestamptz not null,
  status         slot_status not null default 'available',
  created_at     timestamptz not null default now()
);

-- 3. Tabla profiles (admins)
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- 4. Tabla bookings
create table bookings (
  id                    uuid    primary key default gen_random_uuid(),
  full_name             text    not null,
  phone                 text    not null,
  prior_experience      boolean not null,
  driving_lessons_count integer not null default 0,
  pickup_address        text    not null,
  pickup_lat            double precision,
  pickup_lng            double precision,
  slot_id               uuid    unique references time_slots(id) on delete set null,
  notes                 text,
  created_at            timestamptz not null default now()
);

-- 5. Índices
create index on time_slots (status);
create index on time_slots (start_datetime);
create index on bookings (slot_id);
create index on bookings (created_at);
create index on bookings (full_name);
create index on bookings (phone);

-- 6. Habilitar RLS
alter table time_slots enable row level security;
alter table bookings    enable row level security;
alter table profiles    enable row level security;

-- 7. Helper is_admin()
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- 8. Políticas RLS

-- Público anónimo: solo lee slots disponibles
create policy "público lee slots disponibles"
  on time_slots for select
  to anon
  using (status = 'available');

-- Admin: gestión completa de slots
create policy "admin gestiona slots"
  on time_slots for all
  to authenticated
  using (is_admin());

-- Admin: leer reservas
create policy "admin lee reservas"
  on bookings for select
  to authenticated
  using (is_admin());

-- Admin: modificar reservas
create policy "admin modifica reservas"
  on bookings for update
  to authenticated
  using (is_admin());

-- Usuario autenticado: lee su propio perfil
create policy "usuario lee su perfil"
  on profiles for select
  to authenticated
  using (id = auth.uid());
