import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Briefcase, TrendingUp, ArrowRight, Activity } from 'lucide-react'
import Header from '../components/Layout/Header'
import StatCard from '../components/Dashboard/StatCard'
import { sectorMultiples } from '../data/multiples'
import { deals } from '../data/deals'
import { SectorBarChart } from '../components/Multiples/MultiplesChart'
import clsx from 'clsx'

const dealTypeColors: Record<string, string> = {
  LBO: 'bg-danger/10 text-danger border-danger/20',
  Buyout: 'bg-danger/10 text-danger border-danger/20',
  Growth: 'bg-success/10 text-success border-success/20',
  Minority: 'bg-accent/10 text-accent border-accent/20',
  'Strategic M&A': 'bg-warn/10 text-warn border-warn/20',
  'Add-on': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  IPO: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Secondary: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

const statusColors: Record<string, string> = {
  'Закрыта': 'text-success',
  'В процессе': 'text-warn',
  'Анонсирована': 'text-accent',
}

function formatMn(v: number | null): string {
  if (v === null) return '—'
  if (v >= 1_000_000) return `₽${(v / 1_000_000).toFixed(1)} трлн`
  if (v >= 100_000) return `₽${(v / 1_000).toFixed(0)} млрд`
  if (v >= 1_000) return `₽${(v / 1_000).toFixed(1)} млрд`
  return `₽${v.toFixed(0)} млн`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export default function DashboardPage() {
  const stats = useMemo(() => {
    const medianEvEbitda = [...sectorMultiples]
      .filter(s => s.evEbitda > 0)
      .sort((a, b) => a.evEbitda - b.evEbitda)
    const mid = Math.floor(medianEvEbitda.length / 2)
    const median = medianEvEbitda[mid].evEbitda

    const totalMarketCap = sectorMultiples.reduce((s, r) => s + r.marketCapBn, 0)
    const closedDeals = deals.filter(d => d.status === 'Закрыта').length
    const totalDealVolume = deals.reduce((s, d) => s + (d.evMn ?? 0), 0)

    return { median, totalMarketCap, closedDeals, totalDealVolume }
  }, [])

  const recentDeals = deals.slice(0, 5)

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Обзор рынка PE"
        subtitle="Private Equity в России — сводная аналитика"
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Медианный EV/EBITDA"
            value={`${stats.median.toFixed(1)}x`}
            change={-0.2}
            changeLabel="за год"
            icon={BarChart3}
            accent="blue"
          />
          <StatCard
            label="Объём рынка (кап.)"
            value={`₽${(stats.totalMarketCap / 1000).toFixed(0)} трлн`}
            icon={TrendingUp}
            accent="green"
          />
          <StatCard
            label="Сделок в базе"
            value={`${deals.length}`}
            changeLabel="закрыто"
            icon={Briefcase}
            accent="amber"
          />
          <StatCard
            label="Объём сделок (EV)"
            value={`₽${(stats.totalDealVolume / 1_000_000).toFixed(2)} трлн`}
            icon={Activity}
            accent="blue"
          />
        </div>

        {/* Chart + recent deals */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Bar chart */}
          <div className="xl:col-span-3 bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-text-primary font-semibold">EV/EBITDA по секторам</div>
                <div className="text-text-muted text-xs mt-0.5">Российский рынок, май 2025</div>
              </div>
              <Link to="/multiples" className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover transition-colors">
                Подробнее <ArrowRight size={12} />
              </Link>
            </div>
            <SectorBarChart data={sectorMultiples} metric="evEbitda" />
          </div>

          {/* Recent deals */}
          <div className="xl:col-span-2 bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-text-primary font-semibold">Последние сделки</div>
                <div className="text-text-muted text-xs mt-0.5">Актуально</div>
              </div>
              <Link to="/deals" className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover transition-colors">
                Все <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentDeals.map(deal => (
                <div key={deal.id} className="flex items-start gap-3 p-3 bg-surface-3 rounded-lg border border-border-subtle/50 hover:border-border-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-text-primary text-sm font-medium truncate">{deal.target}</span>
                      <span className={clsx('text-xs px-1.5 py-0.5 rounded-full border font-medium shrink-0', dealTypeColors[deal.dealType])}>
                        {deal.dealType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-text-muted text-xs">{formatDate(deal.date)}</span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-text-secondary text-xs font-mono">{formatMn(deal.evMn)}</span>
                      {deal.evEbitdaMultiple && (
                        <>
                          <span className="text-text-muted text-xs">·</span>
                          <span className="text-text-muted text-xs font-mono">{deal.evEbitdaMultiple.toFixed(1)}x</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={clsx('text-xs font-medium shrink-0', statusColors[deal.status])}>
                    {deal.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sectors overview */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-text-primary font-semibold">Секторы — быстрый обзор</div>
            <Link to="/multiples" className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover transition-colors">
              Полная таблица <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {sectorMultiples.map(s => (
              <Link
                key={s.id}
                to={`/multiples?sector=${s.id}`}
                className="bg-surface-3 border border-border-subtle rounded-lg p-3 hover:border-accent/30 hover:bg-surface-4 transition-colors group"
              >
                <div className="text-xl mb-1.5">{s.icon}</div>
                <div className="text-text-secondary text-xs leading-snug group-hover:text-text-primary transition-colors">{s.sector}</div>
                <div className="mt-2 flex gap-3">
                  {s.evEbitda > 0 && (
                    <div>
                      <div className="text-text-muted text-xs leading-none">EV/EBITDA</div>
                      <div className="text-text-primary font-mono font-semibold text-sm mt-0.5">{s.evEbitda.toFixed(1)}x</div>
                    </div>
                  )}
                  <div>
                    <div className="text-text-muted text-xs leading-none">P/E</div>
                    <div className="text-text-primary font-mono font-semibold text-sm mt-0.5">{s.pe.toFixed(1)}x</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
