import { useMemo, useState, useCallback } from 'react'
import Header from '../components/Layout/Header'
import LiveIndicator from '../components/Live/LiveIndicator'
import NewsCard from '../components/News/NewsCard'
import { fetchAllNews, RSS_SOURCES } from '../lib/news'
import { fallbackNews } from '../data/news'
import { useLiveData } from '../hooks/useLiveData'
import { Filter, AlertCircle, Newspaper } from 'lucide-react'
import clsx from 'clsx'

export default function NewsPage() {
  const [maOnly, setMaOnly] = useState(true)
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)

  const news = useLiveData(
    useCallback(() => fetchAllNews(maOnly), [maOnly]),
    { intervalMs: 5 * 60_000 },
  )

  const usingFallback = !news.data || news.data.length === 0
  const items = usingFallback ? fallbackNews : news.data!

  const sources = useMemo(() => {
    const s = new Set(items.map(i => i.source))
    return Array.from(s)
  }, [items])

  const filtered = useMemo(() => {
    if (!sourceFilter) return items
    return items.filter(i => i.source === sourceFilter)
  }, [items, sourceFilter])

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Новости M&A и Private Equity"
        subtitle="Live-агрегатор по российскому рынку"
      />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Live bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-2 border border-border-subtle rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Newspaper size={14} className="text-accent" />
            <span>
              {usingFallback
                ? `RSS-агрегатор недоступен · ${fallbackNews.length} материалов из локальной базы`
                : `${news.data!.length} материалов из ${RSS_SOURCES.length} источников · обновление каждые 5 мин`
              }
            </span>
          </div>
          <LiveIndicator
            lastUpdated={news.lastUpdated}
            isLive={news.isLive}
            isLoading={news.isLoading}
            error={news.error}
            onToggle={() => news.setLive(!news.isLive)}
            onRefresh={news.refetch}
          />
        </div>

        {news.error && (
          <div className="flex items-start gap-2 bg-warn/10 border border-warn/30 rounded-xl p-4 text-warn text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Не удалось получить RSS-поток</div>
              <div className="text-warn/80 text-xs mt-1">
                Проксирование через api.rss2json.com заблокировано или возвращает ошибку: {news.error}.
                Показаны локальные материалы — ссылки на первоисточники работают.
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-text-muted" />
            <button
              onClick={() => setMaOnly(true)}
              className={clsx(
                'text-xs px-3 py-1.5 rounded-full border transition-colors',
                maOnly ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
              )}
            >
              Только M&A / PE
            </button>
            <button
              onClick={() => setMaOnly(false)}
              className={clsx(
                'text-xs px-3 py-1.5 rounded-full border transition-colors',
                !maOnly ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
              )}
            >
              Все новости
            </button>
          </div>
          <div className="h-5 w-px bg-border-subtle" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-text-muted text-xs">Источник:</span>
            <button
              onClick={() => setSourceFilter(null)}
              className={clsx(
                'text-xs px-2.5 py-1 rounded-full border transition-colors',
                !sourceFilter ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
              )}
            >
              Все
            </button>
            {sources.map(s => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={clsx(
                  'text-xs px-2.5 py-1 rounded-full border transition-colors',
                  sourceFilter === s ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-text-muted text-xs">
          Показано <span className="text-text-primary font-medium">{filtered.length}</span> материалов
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            Ничего не найдено по заданным фильтрам
          </div>
        )}
      </div>
    </div>
  )
}
