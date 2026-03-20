import { z } from 'zod'

export const CreateSlotSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  start_time: z.string().min(1, 'La hora de inicio es requerida'),
  end_time: z.string().min(1, 'La hora de fin es requerida'),
})

export type CreateSlotData = z.infer<typeof CreateSlotSchema>
