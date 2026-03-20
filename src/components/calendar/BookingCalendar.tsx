'use client'

import { useMemo, useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { TimeSlot, SlotStatus } from '@/types'
import SlotEvent from './SlotEvent'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
})

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay horarios disponibles en este período.',
  showMore: (total: number) => `+${total} más`,
}

// Rango de horas visible: 5:00am – 11:00pm
const MIN_TIME = new Date(2024, 0, 1, 5, 0)
const MAX_TIME = new Date(2024, 0, 1, 23, 0)

const eventStyleGetter = (event: { resource: { status: SlotStatus } }) => {
  const status = event.resource?.status ?? 'available'
  const colors: Record<SlotStatus, string> = {
    available: '#16a34a',
    reserved: '#6b7280',
    blocked: '#dc2626',
  }
  return {
    style: {
      backgroundColor: colors[status],
      opacity: status !== 'available' ? 0.55 : 1,
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: status === 'available' ? 'pointer' : 'default',
      fontSize: '0.85rem',
      padding: '4px 8px',
    },
  }
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: TimeSlot
}

interface BookingCalendarProps {
  slots: TimeSlot[]
  onSlotSelect: (slot: TimeSlot) => void
  loading: boolean
}

export default function BookingCalendar({ slots, onSlotSelect, loading }: BookingCalendarProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [view, setView] = useState<View>('day')
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const events: CalendarEvent[] = useMemo(() =>
    slots.map((slot) => ({
      id: slot.id,
      title: slot.status === 'available' ? 'Disponible' : slot.status === 'reserved' ? 'Reservado' : 'Bloqueado',
      start: new Date(slot.start_datetime),
      end: new Date(slot.end_datetime),
      resource: slot,
    })),
    [slots]
  )

  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.resource.status === 'available') {
      onSlotSelect(event.resource)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-gray-100" style={{ minHeight: isMobile ? 400 : 600 }}>
        <div className="h-12 bg-gray-200 rounded-t-2xl mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mx-4 mb-3 h-10 bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div style={{ minHeight: isMobile ? 400 : 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={['day', 'week', 'agenda']}
        messages={messages}
        culture="es"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        components={{ event: SlotEvent as any }}
        style={{ height: isMobile ? 420 : 660 }}
        min={MIN_TIME}
        max={MAX_TIME}
        step={60}
        timeslots={1}
        formats={{
          dayHeaderFormat: (date: Date) => format(date, "EEEE d 'de' MMMM", { locale: es }),
          dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
            `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM', { locale: es })}`,
          timeGutterFormat: (date: Date) => format(date, 'h:mm a', { locale: es }),
        }}
      />
    </div>
  )
}
