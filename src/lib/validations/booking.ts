import { z } from 'zod'

export const BookingFormSchema = z.object({
  full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  phone: z.string().regex(/^9\d{8}$/, 'Ingresa un celular peruano válido (9 dígitos)'),
  prior_experience: z.boolean({ error: 'Selecciona una opción' }),
  driving_lessons_count: z.number().min(0, 'El número de clases no puede ser negativo'),
  pickup_address: z.string().min(5, 'Ingresa una dirección válida'),
  pickup_lat: z.number().optional(),
  pickup_lng: z.number().optional(),
})

export type BookingFormData = z.infer<typeof BookingFormSchema>
