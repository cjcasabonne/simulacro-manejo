-- ============================================================
-- 003_seed.sql
-- Horarios de ejemplo para las próximas 4 semanas
-- Lunes a domingo, turnos: 5-7am y 7-11pm (bloques de 1 hora)
-- ============================================================

do $$
declare
  v_slot_ids uuid[] := '{}';
  v_id       uuid;
  v_count    integer := 0;
begin
  -- Generar todos los slots: próximas 4 semanas, todos los días
  -- Turnos: 5:00, 6:00, 19:00, 20:00, 21:00, 22:00
  insert into time_slots (start_datetime, end_datetime, status)
  select
    ((d::text || ' ' || lpad(h::text, 2, '0') || ':00:00')::timestamp AT TIME ZONE 'America/Lima'),
    ((d::text || ' ' || lpad((h+1)::text, 2, '0') || ':00:00')::timestamp AT TIME ZONE 'America/Lima'),
    'available'
  from
    generate_series(current_date, current_date + interval '27 days', interval '1 day') as d,
    unnest(array[5, 6, 19, 20, 21, 22]) as h
  returning id
  into v_id;

  -- Recolectar todos los IDs insertados para marcar ejemplos
  select array_agg(id order by start_datetime)
  into v_slot_ids
  from time_slots;

  v_count := array_length(v_slot_ids, 1);

  -- Marcar 4 slots como 'reserved' (slots 1, 2, 3, 4)
  update time_slots set status = 'reserved'
  where id = any(v_slot_ids[1:4]);

  -- Marcar 2 slots como 'blocked' (slots 5, 6)
  update time_slots set status = 'blocked'
  where id = any(v_slot_ids[5:6]);

  raise notice 'Seed completado: % slots (4 reserved, 2 blocked, resto available)', v_count;
end;
$$;
