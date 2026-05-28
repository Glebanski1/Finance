import { useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Briefcase, TrendingUp, ArrowRight, Activity, Newspaper, Info } from 'lucide-react'
import Header from '../components/Layout/Header'
import StatCard from '../components/Dashboard/StatCard'
import LiveIndicator from '../components/Live/LiveIndicator'
import MoexTicker from '../components/Live/MoexTicker'
import NewsCard from '../components/News/NewsCard'
import { sectorMultiples } from '../data/multiples'
import { deals } from '../data/deals'
import { fallbackNews } from '../data/news'
import { getCompanyHref } from '../data/companies'
import { SectorBarChart } from '../components/Multiples/MultiplesChart'
import { fetchSectorIndices, fetchBenchmark, MOEX_SECTOR_INDICES, MOEX_BENCHMARKS } from '../lib/moex'
import { fetchAllNews } from '../lib/news'
import { useLiveData } from '../hooks/useLiveData'
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
  'Exit (foreign)': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Restructuring: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

const statusColors: Record<string, string> = {
  'Закрыта': 'text-success',
  'В процессе': 'text-warn',
  'Анонсирована': 'text-accent',
  'Отменена': 'text-danger',
}

function formatMn(v: number | null): string {
  if (v === null) return '—'
  if (v >= 1_000_000) return `₽${(v / 1_000_000).toFixed(2)} трлн`
  if (v >= 100_000) return `₽${(v / 1_000).toFixed(0)} млрд`
  if (v >= 1_000) return `₽${(v / 1_000).toFixed(1)} млрд`
  return `₽${v.toFixed(0)} млн`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export default function DashboardPage() {
  // Real-time MOEX данные (auto-refresh 60s)
  const fetchAll = useCallback(async () => {
    const [sectors, imoex] = await Promise.all([
      fetchSectorIndices(),
      fetchBenchmark(MOEX_BENCHMARKS.IMOEX.ticker).catch(() => null),
    ])
    return { sectors, imoex }
  }, [])

  const live = useLiveData(fetchAll, { intervalMs: 60_000 })

  // Real-time новости (refresh 5min)
  const news = useLiveData(() => fetchAllNews(true), { intervalMs: 5 * 60_000 })
  const newsItems = news.data && news.data.length > 0 ? news.data.slice(0, 6) : fallbackNews.slice(0, 6)

  const liveTickerQuotes = useMemo(() => {
    if (!live.data) return []
    const arr = []
    if (live.data.imoex) arr.push(live.data.imoex)
    Object.values(MOEX_SECTOR_INDICES).forEach(cfg => {
      const q = live.data!.sectors.get(cfg.ticker)
      if (q && q.last !== null) arr.push(q)
    })
    return arr
  }, [live.data])

  const stats = useMemo(() => {
    const median = [...sectorMultiples]
      .filter(s => s.evEbitda > 0)
      .sort((a, b) => a.evEbitda - b.evEbitda)
    const mid = Math.floor(median.length / 2)
    const medianV = median[mid].evEbitda

    const totalMarketCap = sectorMultiples.reduce((s, r) => s + r.marketCapBn, 0)
    const totalDealVolume = deals.reduce((s, d) => s + (d.evMn ?? 0), 0)

    return { median: medianV, totalMarketCap, totalDealVolume }
  }, [])

  const recentDeals = [...deals].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Обзор рынка PE"
        subtitle="Private Equity и M&A в России — сводная аналитика"
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Live status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <MoexTicker quotes={liveTickerQuotes} loading={live.isLoading && !live.data} />
            {live.error && (
              <div className="mt-2 text-xs text-warn">
                ⚠ Не удалось получить данные MOEX ISS: {live.error}. Показаны последние сохранённые значения.
              </div>
            )}
          </div>
          <LiveIndicator
            lastUpdated={live.lastUpdated}
            isLive={live.isLive}
            isLoading={live.isLoading}
            error={live.error}
            onToggle={() => live.setLive(!live.isLive)}
            onRefresh={live.refetch}
          />
        </div>

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
            changeLabel="2022–2025"
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
          <div className="xl:col-span-3 bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-text-primary font-semibold">EV/EBITDA по секторам</div>
                <div className="text-text-muted text-xs mt-0.5 flex items-center gap-1">
                  Российский рынок · <Link to="/methodology" className="text-accent hover:text-accent-hover flex items-center gap-0.5">
                    методология <Info size={10} />
                  </Link>
                </div>
              </div>
              <Link to="/multiples" className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover transition-colors">
                Подробнее <ArrowRight size={12} />
              </Link>
            </div>
            <SectorBarChart data={sectorMultiples} metric="evEbitda" />
          </div>

          <div className="xl:col-span-2 bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-text-primary font-semibold">Последние сделки</div>
                <div className="text-text-muted text-xs mt-0.5">{deals.length} всего · топ-5</div>
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
                      <Link
                        to={getCompanyHref(deal.target)}
                        className="text-text-primary text-sm font-medium truncate hover:text-accent transition-colors"
                      >
                        {deal.target}
                      </Link>
                      <span className={clsx('text-xs px-1.5 py-0.5 rounded-full border font-medium shrink-0', dealTypeColors[deal.dealType])}>
                        {deal.dealType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-text-muted text-xs">{formatDate(deal.date)}</span>
                      <span className="text-text-muted text-xs">·</span>
                      <span className="text-text-secondary text-xs font-mono">{formatMn(deal.evMn)}</span>
                      {deal.evEbitdaMultiple !== null && deal.evEbitdaMultiple > 0 && (
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

        {/* News feed */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper size={16} className="text-accent" />
              <div>
                <div className="text-text-primary font-semibold">Новостной фон M&A / PE</div>
                <div className="text-text-muted text-xs mt-0.5">
                  {news.data && news.data.length > 0
                    ? `Live-поток · ${news.data.length} новостей по теме · обновление каждые 5 мин`
                    : news.error
                      ? `RSS недоступен (${news.error}) · показаны базовые материалы`
                      : 'Загрузка ленты…'
                  }
                </div>
              </div>
            </div>
            <Link to="/news" className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover transition-colors">
              Все новости <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {newsItems.map(item => <NewsCard key={item.id} item={item} compact />)}
          </div>
        </div>

        {/* Sectors overview */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-text-primary font-semibold">Секторы — быстрый обзор</div>
              <div className="text-text-muted text-xs mt-0.5">Кликните на сектор для деталей</div>
            </div>
            <Link to="/multiples" className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover transition-colors">
              Полная таблица <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {sectorMultiples.map(s => {
              const moexCfg = MOEX_SECTOR_INDICES[s.id]
              const liveQuote = moexCfg ? live.data?.sectors.get(moexCfg.ticker) : undefined
              return (
                <Link
                  key={s.id}
                  to={`/multiples?sector=${s.id}`}
                  className="bg-surface-3 border border-border-subtle rounded-lg p-3 hover:border-accent/30 hover:bg-surface-4 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-xl mb-1.5">{s.icon}</div>
                    {liveQuote?.changePct !== null && liveQuote?.changePct !== undefined && (
                      <span className={clsx(
                        'text-xs font-mono',
                        liveQuote.changePct >= 0 ? 'text-success' : 'text-danger'
                      )}>
                        {liveQuote.changePct > 0 ? '+' : ''}{liveQuote.changePct.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="text-text-secondary text-xs leading-snug group-hover:text-text-primary transition-colors">{s.sector}</div>
                  <div className="mt-2 flex gap-3">
                    {s.evEbitda > 0 && (
                      <div>
                        <div className="text-text-muted text-[10px] leading-none">EV/EBITDA</div>
                        <div className="text-text-primary font-mono font-semibold text-sm mt-0.5">{s.evEbitda.toFixed(1)}x</div>
                      </div>
                    )}
                    <div>
                      <div className="text-text-muted text-[10px] leading-none">P/E</div>
                      <div className="text-text-primary font-mono font-semibold text-sm mt-0.5">{s.pe.toFixed(1)}x</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
