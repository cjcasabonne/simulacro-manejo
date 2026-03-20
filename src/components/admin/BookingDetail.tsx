'use client'

import dynamic from 'next/dynamic'
import { Booking, TimeSlot } from '@/types'
import { formatDate } from '@/lib/utils'

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div className="h-40 bg-gray-100 rounded-xl animate-pulse" /> })

interface BookingDetailProps {
  booking: Booking & { time_slots: TimeSlot | null }
  onBack: () => void
}

export default function BookingDetail({ booking, onBack }: BookingDetailProps) {
  const whatsappUrl = `https://wa.me/51${booking.phone}?text=${encodeURIComponent(
    `Hola ${booking.full_name}, te contactamos de Simulacro de examen de manejo para coordinar tu clase del ${formatDate(booking.time_slots?.start_datetime ?? '')}.`
  )}`

  return (
    <div className="flex flex-col gap-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a reservas
      </button>

      <h2 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
        Detalle de reserva
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Nombre', value: booking.full_name },
          { label: 'Celular', value: <a href={`tel:${booking.phone}`} className="text-blue-700 hover:underline">{booking.phone}</a> },
          { label: 'Experiencia previa', value: booking.prior_experience ? 'Sí' : 'No' },
          { label: 'Clases previas', value: `${booking.driving_lessons_count} clase${booking.driving_lessons_count !== 1 ? 's' : ''}` },
          { label: 'Horario', value: booking.time_slots ? formatDate(booking.time_slots.start_datetime) : '—' },
          { label: 'Reservado el', value: formatDate(booking.created_at) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {booking.pickup_address && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400">Dirección de recojo</p>
          <p className="text-sm text-gray-700">{booking.pickup_address}</p>
          {booking.pickup_lat && booking.pickup_lng && (
            <MapView lat={booking.pickup_lat} lng={booking.pickup_lng} />
          )}
        </div>
      )}

      {booking.notes && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <p className="text-xs text-yellow-700 mb-1 font-semibold">Notas</p>
          <p className="text-sm text-gray-700">{booking.notes}</p>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-green-500 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.057 23.571a.5.5 0 0 0 .614.614l5.757-1.481A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.234-1.384l-.376-.216-3.892 1.001 1.018-3.788-.232-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Contactar por WhatsApp
      </a>
    </div>
  )
}
