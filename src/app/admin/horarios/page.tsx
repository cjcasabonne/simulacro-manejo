'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TimeSlot } from '@/types'
import AdminCalendar from '@/components/admin/AdminCalendar'
import SlotManager from '@/components/admin/SlotManager'

export default function HorariosPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null | undefined>(undefined)
  // undefined = modal closed, null = new slot mode, TimeSlot = edit mode

  const fetchSlots = async () => {
    const { data } = await supabase
      .from('time_slots')
      .select('*, booking:bookings(full_name, phone)')
      .order('start_datetime', { ascending: true })
    setSlots((data as TimeSlot[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchSlots() }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
        Horarios
      </h1>

      {loading ? (
        <div className="h-[520px] rounded-2xl bg-gray-100 animate-pulse" />
      ) : (
        <AdminCalendar
          slots={slots}
          onSlotClick={(slot) => setSelectedSlot(slot)}
          onNewSlot={() => setSelectedSlot(null)}
        />
      )}

      <SlotManager
        slot={selectedSlot ?? null}
        isOpen={selectedSlot !== undefined}
        onClose={() => setSelectedSlot(undefined)}
        onRefresh={fetchSlots}
      />
    </div>
  )
}
