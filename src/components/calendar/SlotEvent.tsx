import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SlotStatus } from '@/types'

interface SlotEventProps {
  event: {
    start: Date
    end: Date
    resource: { status: SlotStatus }
  }
}

const statusLabel: Record<SlotStatus, string> = {
  available: 'Disponible',
  reserved: 'Reservado',
  blocked: 'Bloqueado',
}

export default function SlotEvent({ event }: SlotEventProps) {
  const timeStr = `${format(event.start, 'H:mm', { locale: es })} - ${format(event.end, 'H:mm', { locale: es })}`
  const status = event.resource?.status ?? 'available'

  return (
    <div className="flex flex-col gap-0.5 px-1 py-0.5 h-full overflow-hidden">
      <span className="text-xs font-semibold leading-tight truncate">{timeStr}</span>
      <span className="text-xs opacity-80 leading-tight truncate">{statusLabel[status]}</span>
    </div>
  )
}
