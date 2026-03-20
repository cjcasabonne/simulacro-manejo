'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { BookingFormSchema, BookingFormData } from '@/lib/validations/booking'
import { supabase } from '@/lib/supabase'
import { Booking, TimeSlot } from '@/types'
import { formatDate } from '@/lib/utils'
import MapPicker from './MapPicker'

const ERROR_MESSAGES: Record<string, string> = {
  SLOT_NOT_AVAILABLE:     'Este horario ya fue reservado. Por favor elige otro.',
  SLOT_IN_THE_PAST:       'No se puede reservar un horario que ya pasó.',
  INVALID_FULL_NAME:      'El nombre debe tener al menos 3 caracteres.',
  INVALID_PHONE:          'El teléfono debe ser un celular peruano válido.',
  INVALID_PICKUP_ADDRESS: 'La dirección de recojo no es válida.',
}

interface BookingFormProps {
  slot: TimeSlot
  onSuccess: (booking: Booking) => void
  onClose: () => void
}

export default function BookingForm({ slot, onSuccess, onClose }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: { driving_lessons_count: 0 },
  })

  const priorExperience = watch('prior_experience')

  const handleAddressSelect = (data: { address: string; lat: number; lng: number }) => {
    setValue('pickup_address', data.address, { shouldValidate: true })
    setValue('pickup_lat', data.lat)
    setValue('pickup_lng', data.lng)
  }

  const onSubmit = async (data: BookingFormData) => {
    const { data: booking, error } = await supabase.rpc('reserve_slot', {
      p_slot_id:               slot.id,
      p_full_name:             data.full_name,
      p_phone:                 data.phone,
      p_prior_experience:      data.prior_experience,
      p_driving_lessons_count: data.driving_lessons_count,
      p_pickup_address:        data.pickup_address,
      p_pickup_lat:            data.pickup_lat ?? null,
      p_pickup_lng:            data.pickup_lng ?? null,
    })

    if (error) {
      const code = Object.keys(ERROR_MESSAGES).find((k) => error.message.includes(k))
      toast.error(code ? ERROR_MESSAGES[code] : 'Ocurrió un error inesperado. Intenta de nuevo.')
      return
    }

    onSuccess(booking as Booking)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Info del slot */}
      <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
        <span className="font-semibold">Horario:</span> {formatDate(slot.start_datetime)}
      </div>

      {/* Nombre */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
        <input
          {...register('full_name')}
          type="text"
          placeholder="Ej: María García López"
          className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.full_name && (
          <p className="text-xs text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      {/* Celular */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Número de celular</label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="9XXXXXXXX"
          maxLength={9}
          className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Experiencia previa */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">¿Tienes experiencia previa manejando?</label>
        <div className="flex gap-3">
          {[{ label: 'Sí', value: true }, { label: 'No', value: false }].map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => setValue('prior_experience', value, { shouldValidate: true })}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                priorExperience === value
                  ? 'bg-blue-700 border-blue-700 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.prior_experience && (
          <p className="text-xs text-red-500">{errors.prior_experience.message}</p>
        )}
      </div>

      {/* Clases previas */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">¿Cuántas clases de manejo has tenido?</label>
        <input
          {...register('driving_lessons_count', { valueAsNumber: true })}
          type="number"
          min={0}
          placeholder="0"
          className="px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.driving_lessons_count && (
          <p className="text-xs text-red-500">{errors.driving_lessons_count.message}</p>
        )}
      </div>

      {/* Dirección de recojo */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Dirección de recojo</label>
        <MapPicker onAddressSelect={handleAddressSelect} />
        {/* Campo oculto para validación */}
        <input type="hidden" {...register('pickup_address')} />
        {errors.pickup_address && (
          <p className="text-xs text-red-500">{errors.pickup_address.message}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Confirmando...' : 'Confirmar reserva'}
        </button>
      </div>
    </form>
  )
}
