import clsx from 'clsx'
import type { MoexIndexQuote } from '../../lib/moex'
import { formatPct } from '../../lib/format'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  quotes: MoexIndexQuote[]
  loading?: boolean
}

export default function MoexTicker({ quotes, loading }: Props) {
  if (!quotes.length && loading) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-surface-2 border border-border-subtle rounded-lg text-text-muted text-xs">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Загрузка котировок MOEX…
      </div>
    )
  }

  if (!quotes.length) return null

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-surface-2 border border-border-subtle rounded-lg overflow-x-auto scrollbar-none">
      {quotes.map(q => {
        const change = q.changePct
        const sign = change === null ? 0 : change > 0.05 ? 1 : change < -0.05 ? -1 : 0
        return (
          <div key={q.ticker} className="flex items-center gap-2 shrink-0">
            <span className="text-text-muted text-xs font-medium">{q.ticker}</span>
            <span className="text-text-primary text-xs font-mono font-semibold">
              {q.last !== null ? q.last.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) : '—'}
            </span>
            {change !== null && (
              <span className={clsx(
                'text-xs font-mono flex items-center gap-0.5',
                sign > 0 ? 'text-success' : sign < 0 ? 'text-danger' : 'text-text-muted',
              )}>
                {sign > 0 ? <TrendingUp size={10} /> : sign < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                {formatPct(change)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
