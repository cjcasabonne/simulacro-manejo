-- ============================================================
-- 002_rpc.sql
-- Función reserve_slot — reserva atómica con lock de fila
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
