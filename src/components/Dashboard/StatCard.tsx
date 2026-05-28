import { type LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatCardProps {
  label: string
  value: string
  change?: number
  changeLabel?: string
  icon: LucideIcon
  accent?: 'blue' | 'green' | 'amber' | 'red'
}

const accentMap = {
  blue: { bg: 'bg-accent-muted', icon: 'text-accent', border: 'border-accent/20' },
  green: { bg: 'bg-success-muted', icon: 'text-success', border: 'border-success/20' },
  amber: { bg: 'bg-warn-muted', icon: 'text-warn', border: 'border-warn/20' },
  red: { bg: 'bg-danger-muted', icon: 'text-danger', border: 'border-danger/20' },
}

export default function StatCard({ label, value, change, changeLabel, icon: Icon, accent = 'blue' }: StatCardProps) {
  const colors = accentMap[accent]

  return (
    <div className={clsx('bg-surface-2 border rounded-xl p-5 flex gap-4 items-start', colors.border)}>
      <div className={clsx('p-2.5 rounded-lg', colors.bg)}>
        <Icon size={18} className={colors.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-text-muted text-xs mb-1">{label}</div>
        <div className="text-text-primary font-semibold text-xl leading-none">{value}</div>
        {change !== undefined && (
          <div className={clsx('text-xs mt-1.5 flex items-center gap-1', change >= 0 ? 'text-success' : 'text-danger')}>
            <span>{change >= 0 ? '▲' : '▼'}</span>
            <span>{Math.abs(change).toFixed(1)}x {changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
