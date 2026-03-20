'use client'

import { useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { TimeSlot } from '@/types'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
})

const MIN_TIME = new Date(2024, 0, 1, 5, 0)
const MAX_TIME = new Date(2024, 0, 1, 23, 0)

const STATUS_COLORS: Record<string, string> = {
  available: '#16a34a',
  reserved: '#1d4ed8',
  blocked: '#dc2626',
}

interface AdminCalendarProps {
  slots: TimeSlot[]
  onSlotClick: (slot: TimeSlot) => void
  onNewSlot: () => void
}

export default function AdminCalendar({ slots, onSlotClick, onNewSlot }: AdminCalendarProps) {
  const [view, setView] = useState<View>('week')
  const [date, setDate] = useState(new Date())

  const events = useMemo(() =>
    slots.map((slot) => ({
      id: slot.id,
      title: slot.status === 'reserved' && slot.booking
        ? slot.booking.full_name
        : slot.status === 'available' ? 'Disponible' : 'Bloqueado',
      start: new Date(slot.start_datetime),
      end: new Date(slot.end_datetime),
      resource: slot,
    })), [slots])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Vista de horarios</h3>
        <button
          onClick={onNewSlot}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo horario
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: 520 }}>
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          views={['day', 'week', 'agenda']}
          min={MIN_TIME}
          max={MAX_TIME}
          step={60}
          timeslots={1}
          culture="es"
          messages={{
            today: 'Hoy',
            previous: 'Anterior',
            next: 'Siguiente',
            day: 'Día',
            week: 'Semana',
            agenda: 'Agenda',
            noEventsInRange: 'Sin horarios en este rango.',
          }}
          onSelectEvent={(event) => onSlotClick(event.resource as TimeSlot)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: STATUS_COLORS[(event.resource as TimeSlot).status] ?? '#6b7280',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              padding: '2px 6px',
            },
          })}
          style={{ height: '100%' }}
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        {[
          { color: '#16a34a', label: 'Disponible' },
          { color: '#1d4ed8', label: 'Reservado' },
          { color: '#dc2626', label: 'Bloqueado' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
