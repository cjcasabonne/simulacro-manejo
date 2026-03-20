'use client'

export const dynamic = 'force-static'

import { useState } from 'react'
import { useSlots } from '@/hooks/useSlots'
import { TimeSlot } from '@/types'
import { getWhatsAppLink } from '@/lib/utils'
import BookingCalendar from '@/components/calendar/BookingCalendar'
import BookingModal from '@/components/booking/BookingModal'

export default function AgendarPage() {
  const { slots, loading, error, refetch } = useSlots()
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setSelectedSlot(null)
  }

  const handleBookingSuccess = () => {
    refetch()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Elige tu horario
        </h1>
        <p className="text-gray-500 text-base max-w-xl">
          Selecciona el horario que mejor te acomode. Los horarios en verde están disponibles.
        </p>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { color: '#16a34a', label: 'Disponible' },
          { color: '#6b7280', label: 'Reservado' },
          { color: '#dc2626', label: 'Bloqueado' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          No se pudieron cargar los horarios. Intenta recargar la página.
        </div>
      )}

      {/* Estado vacío */}
      {!loading && !error && slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-1">No hay horarios disponibles por el momento</p>
            <p className="text-gray-500 text-sm">Consulta por WhatsApp para más opciones.</p>
          </div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-green-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.057 23.571a.5.5 0 0 0 .614.614l5.757-1.481A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.234-1.384l-.376-.216-3.892 1.001 1.018-3.788-.232-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm p-2 sm:p-4">
          <BookingCalendar
            slots={slots}
            onSlotSelect={handleSlotSelect}
            loading={loading}
          />
        </div>
      )}

      {/* Modal de reserva */}
      <BookingModal
        slot={selectedSlot}
        isOpen={modalOpen}
        onClose={handleClose}
        onBookingSuccess={handleBookingSuccess}
      />
    </main>
  )
}
