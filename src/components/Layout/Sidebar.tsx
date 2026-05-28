import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Building2,
  Newspaper,
  BookOpen,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: 'Обзор', icon: LayoutDashboard, end: true },
  { to: '/multiples', label: 'Мультипликаторы', icon: BarChart3, end: false },
  { to: '/deals', label: 'Сделки', icon: Briefcase, end: false },
  { to: '/companies', label: 'Компании', icon: Building2, end: false },
  { to: '/news', label: 'Новости', icon: Newspaper, end: false },
  { to: '/ipo-calendar', label: 'Календарь IPO', icon: TrendingUp, end: false },
  { to: '/methodology', label: 'Методология', icon: BookOpen, end: false },
]

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-border-subtle bg-surface-1 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border-subtle">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">PE</span>
        </div>
        <div>
          <div className="text-text-primary font-semibold text-sm leading-none">PE Russia</div>
          <div className="text-text-muted text-xs mt-0.5">Live · MOEX ISS</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group',
                isActive
                  ? 'bg-accent-muted text-accent font-medium'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={clsx(isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary')} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-accent" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border-subtle space-y-1">
        <div className="text-text-muted text-xs">
          <div>Источники данных:</div>
          <div className="mt-1 text-text-secondary">MOEX ISS · РБК · Коммерсантъ</div>
          <div className="text-text-secondary">Forbes · Ведомости · Interfax</div>
        </div>
      </div>
    </aside>
  )
}
