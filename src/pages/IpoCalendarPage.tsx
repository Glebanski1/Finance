import { useState, useMemo } from 'react'
import Header from '../components/Layout/Header'
import { ipoEvents } from '../data/ipo-calendar'
import type { IpoType, IpoStatus } from '../data/ipo-calendar'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Search, X, ExternalLink, BarChart3, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const YEAR_OPTIONS = ['Все', '2025', '2024', '2023', '2022']
const STATUS_OPTIONS: (IpoStatus | 'Все')[] = ['Все', 'Размещено', 'Объявлено', 'Ожидается', 'Перенесено', 'Отменено']
const TYPE_OPTIONS: (IpoType | 'Все')[] = ['Все', 'IPO', 'SPO', 'Pre-IPO']

const MONTH_NAMES = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

const STATUS_STYLE: Record<IpoStatus, string> = {
  'Размещено':  'text-success bg-success/10 border-success/30',
  'Объявлено':  'text-accent bg-accent/10 border-accent/30',
  'Ожидается':  'text-text-secondary bg-surface-3 border-border-subtle',
  'Перенесено': 'text-warn bg-warn/10 border-warn/30',
  'Отменено':   'text-danger bg-danger/10 border-danger/30',
}

const TYPE_STYLE: Record<IpoType, string> = {
  'IPO':     'text-accent bg-accent/10 border-accent/20',
  'SPO':     'text-success bg-success/10 border-success/20',
  'Pre-IPO': 'text-warn bg-warn/10 border-warn/20',
  'Buyback': 'text-text-secondary bg-surface-3 border-border-subtle',
}

const BAR_COLORS: Record<string, string> = {
  IPO:       '#3b82f6',
  SPO:       '#22c55e',
  'Pre-IPO': '#f59e0b',
}

function fmtDate(date: string, approx?: boolean): string {
  const parts = date.split('-')
  if (parts.length === 3) {
    return new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }
  const d = new Date(date + '-01T00:00:00')
  const s = d.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' })
  return approx ? `≈ ${s}` : s
}

type ChartRow = { label: string; IPO: number; SPO: number; 'Pre-IPO': number }

export default function IpoCalendarPage() {
  const [yearFilter, setYearFilter] = useState('Все')
  const [statusFilter, setStatusFilter] = useState<IpoStatus | 'Все'>('Все')
  const [typeFilter, setTypeFilter] = useState<IpoType | 'Все'>('Все')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return ipoEvents
      .filter(e => {
        if (yearFilter !== 'Все' && !e.date.startsWith(yearFilter)) return false
        if (statusFilter !== 'Все' && e.status !== statusFilter) return false
        if (typeFilter !== 'Все' && e.type !== typeFilter) return false
        if (search) {
          const q = search.toLowerCase()
          if (![e.company, e.ticker ?? '', e.sector, e.fullName ?? ''].join(' ').toLowerCase().includes(q)) return false
        }
        return true
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [yearFilter, statusFilter, typeFilter, search])

  const chartData = useMemo((): ChartRow[] => {
    const acc: Record<string, ChartRow> = {}

    if (yearFilter === 'Все') {
      ipoEvents.forEach(e => {
        if (!e.raiseMn) return
        const yr = e.date.slice(0, 4)
        if (!acc[yr]) acc[yr] = { label: yr, IPO: 0, SPO: 0, 'Pre-IPO': 0 }
        if (e.type === 'IPO' || e.type === 'SPO' || e.type === 'Pre-IPO') {
          acc[yr][e.type] += e.raiseMn / 1000
        }
      })
      return Object.entries(acc).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)
    }

    ipoEvents.filter(e => e.date.startsWith(yearFilter)).forEach(e => {
      if (!e.raiseMn) return
      const mo = e.date.split('-')[1] ?? '01'
      const idx = parseInt(mo) - 1
      if (!acc[mo]) acc[mo] = { label: MONTH_NAMES[idx] ?? mo, IPO: 0, SPO: 0, 'Pre-IPO': 0 }
      if (e.type === 'IPO' || e.type === 'SPO' || e.type === 'Pre-IPO') {
        acc[mo][e.type] += e.raiseMn / 1000
      }
    })
    return Object.entries(acc).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)
  }, [yearFilter])

  const stats = useMemo(() => {
    const ipo2024 = ipoEvents.filter(e => e.status === 'Размещено' && e.date.startsWith('2024') && e.type === 'IPO')
    const raised2024 = ipo2024.reduce((s, e) => s + (e.raiseMn ?? 0), 0)
    const upcoming = ipoEvents.filter(e => e.status === 'Ожидается' || e.status === 'Объявлено').length
    return {
      ipoCount: ipo2024.length,
      raisedBn: raised2024 / 1000,
      avgBn: ipo2024.length ? raised2024 / ipo2024.length / 1000 : 0,
      upcoming,
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Календарь IPO / SPO"
        subtitle="История и пайплайн размещений на Московской бирже: 2022–2025"
      />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'IPO в 2024 году', value: String(stats.ipoCount), sub: 'первичных размещений' },
            { label: 'Привлечено (IPO 2024)', value: `${stats.raisedBn.toFixed(0)} млрд`, sub: 'рублей' },
            { label: 'Средний объём IPO', value: `${stats.avgBn.toFixed(1)} млрд`, sub: 'руб за сделку' },
            { label: 'В пайплайне 2025', value: String(stats.upcoming), sub: 'размещений (план/ожид.)' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-surface-2 border border-border-subtle rounded-xl p-4">
              <div className="text-text-muted text-xs mb-1">{kpi.label}</div>
              <div className="text-text-primary text-2xl font-mono font-semibold">{kpi.value}</div>
              <div className="text-text-muted text-xs mt-0.5">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-accent" />
              <span className="text-text-primary font-semibold text-sm">
                Объём размещений {yearFilter === 'Все' ? 'по годам' : `по месяцам ${yearFilter}`}, млрд руб
              </span>
              <div className="ml-auto flex items-center gap-3">
                {(['IPO', 'SPO', 'Pre-IPO'] as const).map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: BAR_COLORS[t] }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#94a3b8' }}
                  formatter={(v: number) => [`${v.toFixed(1)} млрд`, '']}
                />
                <Bar dataKey="IPO"     stackId="a" fill={BAR_COLORS.IPO}       radius={[0, 0, 0, 0]} />
                <Bar dataKey="SPO"     stackId="a" fill={BAR_COLORS.SPO}       radius={[0, 0, 0, 0]} />
                <Bar dataKey="Pre-IPO" stackId="a" fill={BAR_COLORS['Pre-IPO']} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск компании..."
              className="bg-surface-2 border border-border-subtle rounded-lg pl-8 pr-8 py-1.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors w-48"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                <X size={12} />
              </button>
            )}
          </div>

          <div className="h-5 w-px bg-border-subtle" />

          <div className="flex items-center gap-1">
            {YEAR_OPTIONS.map(y => (
              <button key={y} onClick={() => setYearFilter(y)}
                className={clsx('text-xs px-2.5 py-1 rounded-full border transition-colors',
                  yearFilter === y ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
                )}>
                {y}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border-subtle" />

          <div className="flex items-center gap-1">
            {TYPE_OPTIONS.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={clsx('text-xs px-2.5 py-1 rounded-full border transition-colors',
                  typeFilter === t ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
                )}>
                {t}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border-subtle" />

          <div className="flex flex-wrap items-center gap-1">
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={clsx('text-xs px-2.5 py-1 rounded-full border transition-colors',
                  statusFilter === s ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-text-muted text-xs">
          Показано <span className="text-text-primary font-medium">{filtered.length}</span> из {ipoEvents.length} размещений
        </div>

        {/* Table */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-3">
                  <th className="text-left px-4 py-3 text-text-muted font-medium text-xs">Компания</th>
                  <th className="text-left px-3 py-3 text-text-muted font-medium text-xs">Тикер</th>
                  <th className="text-left px-3 py-3 text-text-muted font-medium text-xs">Тип</th>
                  <th className="text-left px-3 py-3 text-text-muted font-medium text-xs">Сектор</th>
                  <th className="text-left px-3 py-3 text-text-muted font-medium text-xs">Дата</th>
                  <th className="text-right px-3 py-3 text-text-muted font-medium text-xs">Объём, млрд</th>
                  <th className="text-right px-3 py-3 text-text-muted font-medium text-xs">Оценка, млрд</th>
                  <th className="text-right px-3 py-3 text-text-muted font-medium text-xs">Float</th>
                  <th className="text-center px-3 py-3 text-text-muted font-medium text-xs">Статус</th>
                  <th className="text-center px-3 py-3 text-text-muted font-medium text-xs">Источник</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-surface-3 transition-colors">
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="text-text-primary font-semibold text-sm leading-snug">{e.company}</div>
                      <div className="text-text-muted text-xs mt-0.5 line-clamp-1 leading-snug">{e.description}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {e.ticker
                        ? <span className="text-xs font-mono px-1.5 py-0.5 bg-success/10 text-success border border-success/30 rounded">{e.ticker}</span>
                        : <span className="text-text-muted text-xs">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className={clsx('text-xs px-2 py-0.5 rounded border font-medium', TYPE_STYLE[e.type])}>
                        {e.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-text-secondary text-xs max-w-[110px] truncate">{e.sector}</td>
                    <td className="px-3 py-3 text-text-secondary text-xs whitespace-nowrap">{fmtDate(e.date, e.dateApprox)}</td>
                    <td className="px-3 py-3 text-right font-mono text-sm">
                      {e.raiseMn != null && e.raiseMn > 0
                        ? <span className="text-text-primary">{(e.raiseMn / 1000).toFixed(1)}</span>
                        : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-sm">
                      {e.valuationBn != null
                        ? <span className="text-text-secondary">{e.valuationBn.toFixed(0)}</span>
                        : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-text-secondary">
                      {e.freefloat != null ? `${e.freefloat}%` : '—'}
                    </td>
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full border', STATUS_STYLE[e.status])}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <a
                        href={e.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent text-xs hover:text-accent-hover whitespace-nowrap"
                      >
                        {e.sourceName} <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-text-muted">Не найдено</div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 bg-surface-2 border border-border-subtle rounded-lg p-3">
          <AlertCircle size={14} className="text-text-muted shrink-0 mt-0.5" />
          <div className="text-text-muted text-xs leading-relaxed">
            Данные собраны из открытых источников: MOEX ISS, пресс-релизы эмитентов, РБК, Ведомости, Коммерсантъ, Forbes Russia, Интерфакс.
            Объёмы и оценки — на дату размещения. Данные о планируемых IPO носят индикативный характер и могут измениться.
          </div>
        </div>
      </div>
    </div>
  )
}
