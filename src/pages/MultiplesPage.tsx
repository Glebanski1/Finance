import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Layout/Header'
import MultiplesTable from '../components/Multiples/MultiplesTable'
import { SectorBarChart, HistoryLineChart } from '../components/Multiples/MultiplesChart'
import { sectorMultiples, multiplesHistory, globalBenchmarks } from '../data/multiples'
import type { SectorMultiple } from '../types'
import { BarChart3, LineChart, Globe2, Info } from 'lucide-react'
import clsx from 'clsx'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts'

type MetricKey = 'evEbitda' | 'pe' | 'evRevenue' | 'pb'
const metrics: { key: MetricKey; label: string }[] = [
  { key: 'evEbitda', label: 'EV/EBITDA' },
  { key: 'pe', label: 'P/E' },
  { key: 'evRevenue', label: 'EV/Revenue' },
  { key: 'pb', label: 'P/B' },
]

function GlobalBenchmarkChart({ sectorId }: { sectorId: string }) {
  const data = globalBenchmarks[sectorId]
  if (!data) return (
    <div className="flex items-center justify-center h-32 text-text-muted text-sm">
      Данные по глобальным бенчмаркам для этого сектора недоступны
    </div>
  )

  const colors = ['#3b82f6', '#64748b', '#94a3b8', '#cbd5e1', '#475569']

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
        <XAxis dataKey="region" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}x`} width={36} />
        <Tooltip
          contentStyle={{ background: '#141c30', border: '1px solid #2d4270', borderRadius: 8 }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(v: number) => [`${v.toFixed(1)}x`, '']}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
        <Bar dataKey="evEbitda" name="EV/EBITDA" radius={[3, 3, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Bar>
        <Bar dataKey="pe" name="P/E" radius={[3, 3, 0, 0]} fill="#22c55e" opacity={0.6} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function MultiplesPage() {
  const [searchParams] = useSearchParams()
  const initialSector = searchParams.get('sector') ?? null
  const [selected, setSelected] = useState<string | null>(initialSector)
  const [metric, setMetric] = useState<MetricKey>('evEbitda')
  const [tab, setTab] = useState<'chart' | 'history' | 'global'>('chart')

  const selectedSector: SectorMultiple | undefined = sectorMultiples.find(s => s.id === selected)
  const history = selected ? multiplesHistory[selected] : undefined

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Мультипликаторы"
        subtitle="Оценочные мультипликаторы по секторам российского рынка"
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Metric tabs */}
        <div className="flex items-center gap-2">
          {metrics.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                metric === m.key
                  ? 'bg-accent text-white'
                  : 'bg-surface-2 text-text-secondary border border-border-subtle hover:text-text-primary hover:border-border-muted'
              )}
            >
              {m.label}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-auto text-text-muted text-xs">
            <Info size={13} />
            <span>Кликните на строку для детальной информации</span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-accent" />
            <span className="text-text-primary font-semibold">
              {metrics.find(m => m.key === metric)?.label} — сравнение по секторам
            </span>
          </div>
          <SectorBarChart data={sectorMultiples} metric={metric} />
        </div>

        {/* Table */}
        <MultiplesTable
          data={sectorMultiples}
          onSelect={id => setSelected(s => (s === id ? null : id))}
          selectedId={selected ?? undefined}
        />

        {/* Detail panel */}
        {selectedSector && (
          <div className="bg-surface-2 border border-border-muted rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedSector.icon}</span>
                <div>
                  <div className="text-text-primary font-semibold text-lg">{selectedSector.sector}</div>
                  <div className="text-text-muted text-xs mt-0.5">
                    {selectedSector.companiesCount} компаний · Обновлено {new Date(selectedSector.updatedAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-text-muted hover:text-text-secondary text-xs px-3 py-1.5 bg-surface-3 rounded-lg border border-border-subtle"
              >
                Закрыть
              </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 divide-x divide-border-subtle border-b border-border-subtle">
              {[
                { label: 'EV/EBITDA', v: selectedSector.evEbitda, dy: selectedSector.evEbitdaYoY },
                { label: 'P/E', v: selectedSector.pe, dy: selectedSector.peYoY },
                { label: 'EV/Revenue', v: selectedSector.evRevenue, dy: selectedSector.evRevenueYoY },
                { label: 'P/B', v: selectedSector.pb, dy: selectedSector.pbYoY },
              ].map(({ label, v, dy }) => (
                <div key={label} className="px-6 py-4 text-center">
                  <div className="text-text-muted text-xs mb-1">{label}</div>
                  <div className="text-text-primary font-mono font-bold text-2xl">
                    {v > 0 ? `${v.toFixed(1)}x` : '—'}
                  </div>
                  {dy !== 0 && (
                    <div className={clsx('text-xs mt-1', dy > 0 ? 'text-success' : 'text-danger')}>
                      {dy > 0 ? '▲' : '▼'} {Math.abs(dy).toFixed(1)}x YoY
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">
              <div className="flex items-center gap-1 mb-4 border-b border-border-subtle pb-3">
                {[
                  { key: 'chart', label: 'Обзор', icon: BarChart3 },
                  { key: 'history', label: 'Динамика', icon: LineChart },
                  { key: 'global', label: 'Global vs RU', icon: Globe2 },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key as 'chart' | 'history' | 'global')}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                      tab === key
                        ? 'bg-accent-muted text-accent font-medium'
                        : 'text-text-muted hover:text-text-secondary'
                    )}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              {tab === 'chart' && (
                <div className="text-text-secondary text-sm leading-relaxed">
                  <p>
                    Сектор <strong className="text-text-primary">{selectedSector.sector}</strong> торгуется с
                    мультипликаторами EV/EBITDA&nbsp;
                    <strong className="text-text-primary font-mono">{selectedSector.evEbitda > 0 ? `${selectedSector.evEbitda.toFixed(1)}x` : 'н/д'}</strong> и
                    P/E&nbsp;<strong className="text-text-primary font-mono">{selectedSector.pe.toFixed(1)}x</strong>,
                    что отражает&nbsp;
                    {selectedSector.evEbitdaYoY < 0 ? 'сжатие оценок на фоне высоких процентных ставок.' : 'умеренный рост оценок.'}
                  </p>
                  <p className="mt-2">
                    Общая рыночная капитализация сектора составляет&nbsp;
                    <strong className="text-text-primary">
                      ₽{selectedSector.marketCapBn >= 1000
                        ? `${(selectedSector.marketCapBn / 1000).toFixed(1)} трлн`
                        : `${selectedSector.marketCapBn} млрд`}
                    </strong>.
                    В выборке учтено <strong className="text-text-primary">{selectedSector.companiesCount}</strong>&nbsp;компаний.
                  </p>
                </div>
              )}

              {tab === 'history' && history && (
                <HistoryLineChart data={history} />
              )}

              {tab === 'history' && !history && (
                <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                  Историческая динамика для этого сектора пока не добавлена
                </div>
              )}

              {tab === 'global' && (
                <GlobalBenchmarkChart sectorId={selected!} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
