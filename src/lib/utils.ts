import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return format(new Date(date), "EEEE d 'de' MMMM, HH:mm", { locale: es })
}

export function getWhatsAppLink(message?: string): string {
  const text = message ?? 'Hola, quiero información sobre el Simulacro de examen de manejo'
  return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
