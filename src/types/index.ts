export type SlotStatus = 'available' | 'reserved' | 'blocked'

export interface TimeSlot {
  id: string
  start_datetime: string
  end_datetime: string
  status: SlotStatus
  created_at: string
  booking?: Booking
}

export interface Booking {
  id: string
  full_name: string
  phone: string
  prior_experience: boolean
  driving_lessons_count: number
  pickup_address: string
  pickup_lat?: number | null
  pickup_lng?: number | null
  slot_id: string
  notes?: string | null
  created_at: string
}
