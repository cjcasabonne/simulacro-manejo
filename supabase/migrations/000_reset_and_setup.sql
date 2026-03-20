-- ============================================================
-- 000_reset_and_setup.sql
-- Reset completo + schema + RPC + seed
-- Idempotente: puede correrse desde cero o sobre una BD existente
-- ============================================================


-- ============================================================
-- PASO 1 — DROP de todo lo existente
-- ============================================================

drop function if exists public.reserve_slot(uuid, text, text, boolean, integer, text, double precision, double precision, text) cascade;
drop function if exists public.is_admin() cascade;

drop table if exists bookings  cascade;
drop table if exists time_slots cascade;
drop table if exists profiles  cascade;

drop type if exists slot_status cascade;


-- ============================================================
-- PASO 2 — Schema (001_schema.sql)
-- ============================================================

-- Enum de estado de slot
create type slot_status as enum ('available', 'reserved', 'blocked');

-- Tabla time_slots
create table time_slots (
  id             uuid        primary key default gen_random_uuid(),
  start_datetime timestamptz not null,
  end_datetime   timestamptz not null,
  status         slot_status not null default 'available',
  created_at     timestamptz not null default now()
);

-- Tabla profiles (admins)
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

-- Tabla bookings
create table bookings (
  id                    uuid             primary key default gen_random_uuid(),
  full_name             text             not null,
  phone                 text             not null,
  prior_experience      boolean          not null,
  driving_lessons_count integer          not null default 0,
  pickup_address        text             not null,
  pickup_lat            double precision,
  pickup_lng            double precision,
  slot_id               uuid             unique references time_slots(id) on delete set null,
  notes                 text,
  created_at            timestamptz      not null default now()
);

-- Índices
create index on time_slots (status);
create index on time_slots (start_datetime);
create index on bookings (slot_id);
create index on bookings (created_at);
create index on bookings (full_name);
create index on bookings (phone);

-- Habilitar RLS
alter table time_slots enable row level security;
alter table bookings    enable row level security;
alter table profiles    enable row level security;

-- Helper is_admin()
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

-- Políticas RLS

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


-- ============================================================
-- PASO 3 — RPC (002_rpc.sql)
-- ============================================================

create or replace function public.reserve_slot(
  p_slot_id               uuid,
  p_full_name             text,
  p_phone                 text,
  p_prior_experience      boolean,
  p_driving_lessons_count integer,
  p_pickup_address        text,
  p_pickup_lat            double precision default null,
  p_pickup_lng            double precision default null,
  p_notes                 text             default null
)
returns bookings
language plpgsql
security definer
as $$
declare
  v_booking bookings;
begin

  -- Validaciones de datos
  if trim(p_full_name) = '' or length(trim(p_full_name)) < 3 then
    raise exception 'INVALID_FULL_NAME';
  end if;

  if p_phone !~ '^9[0-9]{8}$' then
    raise exception 'INVALID_PHONE';
  end if;

  if p_driving_lessons_count < 0 then
    raise exception 'INVALID_LESSONS_COUNT';
  end if;

  if trim(p_pickup_address) = '' or length(trim(p_pickup_address)) < 5 then
    raise exception 'INVALID_PICKUP_ADDRESS';
  end if;

  -- No permitir reservas en el pasado
  if (select start_datetime from time_slots where id = p_slot_id) <= now() then
    raise exception 'SLOT_IN_THE_PAST';
  end if;

  -- Bloquear el slot (falla si no existe o no está disponible)
  perform 1
    from time_slots
    where id = p_slot_id
      and status = 'available'
    for update;

  if not found then
    raise exception 'SLOT_NOT_AVAILABLE';
  end if;

  -- Insertar reserva
  insert into bookings (
    full_name, phone, prior_experience, driving_lessons_count,
    pickup_address, pickup_lat, pickup_lng, slot_id, notes
  ) values (
    trim(p_full_name), p_phone, p_prior_experience, p_driving_lessons_count,
    trim(p_pickup_address), p_pickup_lat, p_pickup_lng, p_slot_id, p_notes
  )
  returning * into v_booking;

  -- Marcar slot como reservado
  update time_slots set status = 'reserved' where id = p_slot_id;

  return v_booking;

end;
$$;

-- Permisos de ejecución
revoke execute on function public.reserve_slot from public;
grant  execute on function public.reserve_slot to anon;
grant  execute on function public.reserve_slot to authenticated;


-- ============================================================
-- PASO 4 — Seed
-- Todos los días, próximas 4 semanas, solo slots futuros
-- Turnos: 05:00, 06:00, 19:00, 20:00, 21:00, 22:00
-- ============================================================

do $$
declare
  v_slot_ids uuid[];
  v_count    integer;
begin
  insert into time_slots (start_datetime, end_datetime, status)
  select
    (d + (h || ' hours')::interval)::timestamptz,
    (d + ((h + 1) || ' hours')::interval)::timestamptz,
    'available'
  from
    generate_series(current_date, current_date + interval '27 days', interval '1 day') as d,
    unnest(array[5, 6, 19, 20, 21, 22]) as h
  where
    (d + (h || ' hours')::interval)::timestamptz > now();

  -- Recolectar IDs para marcar ejemplos
  select array_agg(id order by start_datetime)
  into v_slot_ids
  from time_slots;

  v_count := array_length(v_slot_ids, 1);

  -- 4 slots de ejemplo como 'reserved'
  update time_slots set status = 'reserved'
  where id = any(v_slot_ids[1:4]);

  -- 2 slots de ejemplo como 'blocked'
  update time_slots set status = 'blocked'
  where id = any(v_slot_ids[5:6]);

  raise notice 'Setup completo: % slots creados (4 reserved, 2 blocked, resto available)', v_count;
end;
$$;
