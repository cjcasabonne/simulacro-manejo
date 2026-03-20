'use client'

import { useState, useEffect, useCallback } from 'react'
import { Booking, TimeSlot } from '@/types'
import { formatDate } from '@/lib/utils'
import BookingForm from './BookingForm'
import BookingSuccess from './BookingSuccess'

interface BookingModalProps {
  slot: TimeSlot | null
  isOpen: boolean
  onClose: () => void
  onBookingSuccess: () => void
}

export default function BookingModal({ slot, isOpen, onClose, onBookingSuccess }: BookingModalProps) {
  const [state, setState] = useState<'form' | 'success'>('form')
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)

  // Reset al abrir con un nuevo slot
  useEffect(() => {
    if (isOpen) {
      setState('form')
      setConfirmedBooking(null)
    }
  }, [isOpen, slot?.id])

  // Cerrar con ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleSuccess = (booking: Booking) => {
    setConfirmedBooking(booking)
    setState('success')
    onBookingSuccess()
  }

  const handleClose = () => {
    setState('form')
    setConfirmedBooking(null)
    onClose()
  }

  if (!isOpen || !slot) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <div
          className="w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="font-extrabold text-gray-900 text-base" style={{ fontFamily: 'var(--font-display)' }}>
                {state === 'form' ? 'Reservar horario' : '¡Reserva exitosa!'}
              </h2>
              {state === 'form' && (
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(slot.start_datetime)}</p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="overflow-y-auto flex-1 px-5 py-5">
            {state === 'form' ? (
              <BookingForm slot={slot} onSuccess={handleSuccess} onClose={handleClose} />
            ) : (
              confirmedBooking && (
                <BookingSuccess booking={confirmedBooking} slot={slot} onClose={handleClose} />
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
