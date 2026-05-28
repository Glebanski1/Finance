import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Pause, Play, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { formatDateRel } from '../../lib/format'

interface Props {
  lastUpdated: Date | null
  isLive: boolean
  isLoading: boolean
  error: string | null
  onToggle: () => void
  onRefresh: () => void
}

export default function LiveIndicator({ lastUpdated, isLive, isLoading, error, onToggle, onRefresh }: Props) {
  const [, force] = useState(0)
  useEffect(() => {
    const t = setInterval(() => force(v => v + 1), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          'flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs',
          error
            ? 'bg-danger/10 border-danger/30 text-danger'
            : isLive
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-surface-3 border-border-subtle text-text-muted'
        )}
        title={error ?? (isLive ? 'Поток данных активен' : 'Авто-обновление приостановлено')}
      >
        {error ? <WifiOff size={12} /> : <Wifi size={12} className={clsx(isLive && !isLoading && 'animate-pulse')} />}
        <span className="font-medium">
          {error ? 'OFFLINE' : isLive ? 'LIVE' : 'PAUSED'}
        </span>
        {lastUpdated && !error && (
          <span className="text-text-muted">· {formatDateRel(lastUpdated)}</span>
        )}
      </div>

      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="p-1.5 rounded-lg bg-surface-3 border border-border-subtle hover:border-accent/40 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
        title="Обновить сейчас"
      >
        <RefreshCw size={13} className={clsx(isLoading && 'animate-spin')} />
      </button>

      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg bg-surface-3 border border-border-subtle hover:border-accent/40 text-text-secondary hover:text-text-primary transition-colors"
        title={isLive ? 'Приостановить авто-обновление' : 'Возобновить авто-обновление'}
      >
        {isLive ? <Pause size={13} /> : <Play size={13} />}
      </button>
    </div>
  )
}
