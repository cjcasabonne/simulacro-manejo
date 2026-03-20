'use client'

import { Booking, TimeSlot } from '@/types'
import { formatDate } from '@/lib/utils'

interface BookingTableProps {
  bookings: (Booking & { time_slots: TimeSlot | null })[]
  loading: boolean
  onSelect: (booking: Booking & { time_slots: TimeSlot | null }) => void
}

export default function BookingTable({ bookings, loading, onSelect }: BookingTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm text-gray-400 font-medium">Sin reservas aún</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Celular</th>
              <th className="px-4 py-3 text-left font-semibold">Horario</th>
              <th className="px-4 py-3 text-left font-semibold">Reservado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onSelect(b)}>
                <td className="px-4 py-3 font-medium text-gray-800">{b.full_name}</td>
                <td className="px-4 py-3 text-gray-600">{b.phone}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">
                  {b.time_slots ? formatDate(b.time_slots.start_datetime) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(b.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {bookings.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b)}
            className="text-left w-full bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{b.full_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{b.phone}</p>
                <p className="text-xs text-gray-400 mt-1 capitalize">
                  {b.time_slots ? formatDate(b.time_slots.start_datetime) : '—'}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-300 mt-1 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
