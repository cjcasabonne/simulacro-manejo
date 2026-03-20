-- ============================================================
-- 003_seed.sql
-- Horarios de ejemplo para las próximas 3 semanas
-- Lunes a sábado, 8:00am a 1:00pm (bloques de 1 hora)
-- ============================================================

do $$
declare
  v_day   date;
  v_hour  integer;
  v_dow   integer; -- 0=domingo, 1=lunes ... 6=sábado
  v_count integer := 0;
  v_slot_ids uuid[] := '{}';
  v_id    uuid;
begin
  -- Generar slots: próximas 3 semanas, lunes a sábado, 8:00-13:00h
  for v_day in
    select generate_series(
      current_date + 1,
      current_date + 21,
      '1 day'::interval
    )::date
  loop
    v_dow := extract(dow from v_day); -- 0=domingo, 6=sábado
    if v_dow between 1 and 6 then     -- lunes a sábado
      for v_hour in 8..12 loop        -- 8:00, 9:00, 10:00, 11:00, 12:00 → 5 slots por día
        insert into time_slots (start_datetime, end_datetime, status)
        values (
          (v_day || ' ' || v_hour || ':00:00')::timestamptz,
          (v_day || ' ' || (v_hour + 1) || ':00:00')::timestamptz,
          'available'
        )
        returning id into v_id;

        v_slot_ids := array_append(v_slot_ids, v_id);
        v_count := v_count + 1;
      end loop;
    end if;
  end loop;

  -- Marcar 5 slots como 'reserved' (los primeros 5)
  update time_slots set status = 'reserved'
  where id = any(v_slot_ids[1:5]);

  -- Marcar 3 slots como 'blocked' (slots 6, 7, 8)
  update time_slots set status = 'blocked'
  where id = any(v_slot_ids[6:8]);

  raise notice 'Seed completado: % slots creados (5 reserved, 3 blocked, resto available)', v_count;
end;
$$;
