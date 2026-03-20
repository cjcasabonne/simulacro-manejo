'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  total: number
  thisWeek: number
  available: number
  blocked: number
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const [total, thisWeek, available, blocked] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString()),
        supabase.from('time_slots').select('id', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('time_slots').select('id', { count: 'exact', head: true }).eq('status', 'blocked'),
      ])

      setStats({
        total: total.count ?? 0,
        thisWeek: thisWeek.count ?? 0,
        available: available.count ?? 0,
        blocked: blocked.count ?? 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total reservas', value: stats?.total, color: 'text-blue-700', bg: 'bg-blue-50', icon: '📋' },
    { label: 'Esta semana', value: stats?.thisWeek, color: 'text-violet-700', bg: 'bg-violet-50', icon: '📅' },
    { label: 'Slots disponibles', value: stats?.available, color: 'text-green-700', bg: 'bg-green-50', icon: '✅' },
    { label: 'Slots bloqueados', value: stats?.blocked, color: 'text-red-700', bg: 'bg-red-50', icon: '🚫' },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} rounded-2xl p-5 flex flex-col gap-2`}>
          <span className="text-2xl">{card.icon}</span>
          <p className={`text-2xl font-extrabold ${card.color}`}>{card.value ?? 0}</p>
          <p className="text-xs text-gray-500 font-medium">{card.label}</p>
        </div>
      ))}
    </div>
  )
}
