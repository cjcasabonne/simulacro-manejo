'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { TimeSlot } from '@/types'
import { formatDate } from '@/lib/utils'

interface SlotManagerProps {
  slot: TimeSlot | null        // null = modo creación
  isOpen: boolean
  onClose: () => void
  onRefresh: () => void
}

export default function SlotManager({ slot, isOpen, onClose, onRefresh }: SlotManagerProps) {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const isNew = slot === null

  const handleCreate = async () => {
    if (!date || !startTime || !endTime) {
      toast.error('Completa todos los campos.')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('time_slots').insert({
      start_datetime: `${date}T${startTime}:00`,
      end_datetime: `${date}T${endTime}:00`,
      status: 'available',
    })
    setLoading(false)
    if (error) { toast.error('Error al crear el horario.'); return }
    toast.success('Horario creado.')
    setDate(''); setStartTime(''); setEndTime('')
    onRefresh(); onClose()
  }

  const handleToggleStatus = async () => {
    if (!slot) return
    const newStatus = slot.status === 'available' ? 'blocked' : 'available'
    setLoading(true)
    const { error } = await supabase.from('time_slots').update({ status: newStatus }).eq('id', slot.id)
    setLoading(false)
    if (error) { toast.error('Error al actualizar.'); return }
    toast.success(newStatus === 'blocked' ? 'Horario bloqueado.' : 'Horario liberado.')
    onRefresh(); onClose()
  }

  const handleDelete = async () => {
    if (!slot) return
    setLoading(true)
    const { error } = await supabase.from('time_slots').delete().eq('id', slot.id)
    setLoading(false)
    if (error) { toast.error('Error al eliminar.'); return }
    toast.success('Horario eliminado.')
    onRefresh(); onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
              {isNew ? 'Nuevo horario' : 'Gestionar horario'}
            </h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isNew ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Fecha</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Hora inicio</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Hora fin</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button onClick={handleCreate} disabled={loading}
                className="w-full py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors mt-2">
                {loading ? 'Creando...' : 'Crear horario'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700">
                <p className="font-semibold mb-1">{formatDate(slot!.start_datetime)}</p>
                <p className="text-gray-500 capitalize">Estado: <span className="font-medium">{slot!.status}</span></p>
              </div>

              {slot!.booking && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm">
                  <p className="text-blue-700 font-semibold mb-0.5">Reservado por:</p>
                  <p className="text-blue-800">{slot!.booking.full_name}</p>
                  <p className="text-blue-600">{slot!.booking.phone}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {slot!.status === 'reserved' ? (
                  <p className="text-sm text-gray-400 text-center py-2">Tiene una reserva activa — no se puede cambiar el estado.</p>
                ) : (
                  <button onClick={handleToggleStatus} disabled={loading}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${
                      slot!.status === 'available'
                        ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}>
                    {loading ? '...' : slot!.status === 'available' ? 'Bloquear horario' : 'Liberar horario'}
                  </button>
                )}

                {!slot!.booking && (
                  <button onClick={handleDelete} disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-60">
                    {loading ? '...' : 'Eliminar horario'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
