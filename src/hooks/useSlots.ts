'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { TimeSlot } from '@/types'

export function useSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSlots = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('status', 'available')
      .order('start_datetime')

    if (error) {
      setError(error.message)
    } else {
      setSlots(data ?? [])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  return { slots, loading, error, refetch: fetchSlots }
}
