import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Calendar, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'
import { fetchShareCandles, type Candle } from '../../lib/moex-shares'
import { formatPct } from '../../lib/format'
import type { Deal } from '../../types'

interface Props {
  ticker: string
  dealsAsTarget: Deal[]
}

type Period = '30' | '90' | '180' | '365'
const PERIODS: { key: Period; label: string }[] = [
  { key: '30', label: '1 мес' },
  { key: '90', label: '3 мес' },
  { key: '180', label: '6 мес' },
  { key: '365', label: '1 год' },
]

function TooltipContent({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-3 border border-border-default rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-text-muted mb-1">{label}</div>
      <div className="text-text-primary font-mono font-semibold">
        {payload[0].value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽
      </div>
    </div>
  )
}

export default function CompanyPriceChart({ ticker, dealsAsTarget }: Props) {
  const [period, setPeriod] = useState<Period>('180')
  const [data, setData] = useState<Candle[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchShareCandles(ticker, parseInt(period, 10))
      .then(c => { if (!cancelled) setData(c) })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : 'Не удалось загрузить котировки') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [ticker, period])

  // Сделки попадающие на график
  const dealMarkers = data
    ? dealsAsTarget
        .filter(d => {
          if (!data.length) return false
          return d.date >= data[0].date && d.date <= data[data.length - 1].date
        })
        .slice(0, 8)
    : []

  // Тренд (close первого vs последнего)
  const trend = data && data.length >= 2
    ? ((data[data.length - 1].close - data[0].close) / data[0].close) * 100
    : null

  return (
    <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-text-primary font-semibold">Динамика цены акции</div>
            {trend !== null && (
              <span className={clsx(
                'text-xs font-mono flex items-center gap-0.5',
                trend >= 0 ? 'text-success' : 'text-danger',
              )}>
                {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {formatPct(trend)}
              </span>
            )}
          </div>
          <div className="text-text-muted text-xs mt-0.5">
            {ticker} · дневные свечи MOEX
            {dealMarkers.length > 0 && ` · отмечены ${dealMarkers.length} сделок`}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={clsx(
                'text-xs px-2.5 py-1 rounded-md transition-colors',
                period === p.key
                  ? 'bg-accent text-white'
                  : 'bg-surface-3 text-text-secondary hover:text-text-primary border border-border-subtle',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64 text-text-muted text-sm">
          Загрузка котировок MOEX…
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-64 text-warn text-sm gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {!loading && !error && data && data.length === 0 && (
        <div className="flex items-center justify-center h-64 text-text-muted text-sm">
          За выбранный период котировки отсутствуют
        </div>
      )}

      {!loading && !error && data && data.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => {
                  const d = new Date(v)
                  return d.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })
                }}
                minTickGap={40}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={50}
                domain={['auto', 'auto']}
                tickFormatter={v => `${v.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}`}
              />
              <Tooltip content={<TooltipContent />} />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
              {dealMarkers.map(d => (
                <ReferenceLine
                  key={d.id}
                  x={d.date}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>

          {dealMarkers.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-subtle">
              <div className="text-text-muted text-xs mb-2 flex items-center gap-1.5">
                <Calendar size={11} />
                Сделки на графике (оранжевые линии)
              </div>
              <div className="flex flex-wrap gap-2">
                {dealMarkers.map(d => (
                  <div key={d.id} className="text-xs px-2 py-1 bg-warn/10 border border-warn/30 rounded-md text-warn">
                    <span className="font-mono">{new Date(d.date).toLocaleDateString('ru-RU')}</span>
                    <span className="text-warn/70 mx-1">·</span>
                    {d.dealType}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
