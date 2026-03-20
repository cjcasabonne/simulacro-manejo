import StatsCards from '@/components/admin/StatsCards'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
        Dashboard
      </h1>
      <StatsCards />
    </div>
  )
}
