import { Bell, RefreshCw } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const now = new Date()
  const formatted = now.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-1 sticky top-0 z-10">
      <div>
        <h1 className="text-text-primary font-semibold text-lg leading-none">{title}</h1>
        {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-text-muted text-xs hidden sm:block">{formatted}</span>
        <button
          className="p-2 rounded-lg hover:bg-surface-3 text-text-muted hover:text-text-secondary transition-colors"
          title="Обновить"
        >
          <RefreshCw size={15} />
        </button>
        <button className="p-2 rounded-lg hover:bg-surface-3 text-text-muted hover:text-text-secondary transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>
      </div>
    </header>
  )
}
