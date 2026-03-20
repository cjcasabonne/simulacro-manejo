import { Booking, TimeSlot } from '@/types'
import { formatDate, getWhatsAppLink } from '@/lib/utils'

interface BookingSuccessProps {
  booking: Booking
  slot: TimeSlot
  onClose: () => void
}

export default function BookingSuccess({ booking, slot, onClose }: BookingSuccessProps) {
  const waMessage = `Hola, acabo de separar un horario en Simulacro de examen de manejo y quiero confirmar mi reserva. Mi nombre es ${booking.full_name}.`

  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      {/* Check */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          ¡Reserva confirmada!
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Tu horario ha sido separado. Te contactaremos pronto para coordinar los detalles.
        </p>
      </div>

      {/* Detalle */}
      <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 p-4 text-left flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Nombre</span>
          <span className="font-semibold text-gray-800">{booking.full_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Horario</span>
          <span className="font-semibold text-gray-800">{formatDate(slot.start_datetime)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Celular</span>
          <span className="font-semibold text-gray-800">{booking.phone}</span>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-3 w-full">
        <a
          href={getWhatsAppLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-green-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.857L.057 23.571a.5.5 0 0 0 .614.614l5.757-1.481A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.234-1.384l-.376-.216-3.892 1.001 1.018-3.788-.232-.389A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Escribir por WhatsApp
        </a>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
