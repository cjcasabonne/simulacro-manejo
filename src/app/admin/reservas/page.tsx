'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Booking, TimeSlot } from '@/types'
import BookingTable from '@/components/admin/BookingTable'
import BookingDetail from '@/components/admin/BookingDetail'

type BookingWithSlot = Booking & { time_slots: TimeSlot | null }

function ReservasContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('id')

  const [bookings, setBookings] = useState<BookingWithSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      const { data } = await supabase
        .from('bookings')
        .select('*, time_slots(*)')
        .order('created_at', { ascending: false })
      setBookings((data as BookingWithSlot[]) ?? [])
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const selected = bookings.find((b) => b.id === selectedId) ?? null

  const handleSelect = (booking: BookingWithSlot) => {
    router.push(`/admin/reservas?id=${booking.id}`)
  }

  const handleBack = () => {
    router.push('/admin/reservas')
  }

  // ID en URL pero no encontrado tras cargar
  if (!loading && selectedId && !selected) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a reservas
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-sm font-semibold text-gray-500">Reserva no encontrada</p>
          <p className="text-xs text-gray-400">El ID no corresponde a ninguna reserva registrada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {selected ? (
        <BookingDetail booking={selected} onBack={handleBack} />
      ) : (
        <>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            Reservas
          </h1>
          <BookingTable bookings={bookings} loading={loading} onSelect={handleSelect} />
        </>
      )}
    </div>
  )
}

export default function ReservasPage() {
  return (
    <Suspense fallback={<div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />}>
      <ReservasContent />
    </Suspense>
  )
}
