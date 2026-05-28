import { useCallback } from 'react'
import { Newspaper, ExternalLink } from 'lucide-react'
import { useLiveData } from '../../hooks/useLiveData'
import { fetchAllNews, type NewsItem } from '../../lib/news'
import { fallbackNews } from '../../data/news'
import type { Company } from '../../data/companies'
import NewsCard from '../News/NewsCard'

interface Props {
  company: Company
}

function newsMatchesCompany(item: NewsItem, company: Company): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase()
  if (text.includes(company.name.toLowerCase())) return true
  return company.aliases.some(a => text.includes(a.toLowerCase()))
}

export default function CompanyNews({ company }: Props) {
  const news = useLiveData(useCallback(() => fetchAllNews(false), []), { intervalMs: 5 * 60_000 })

  const allItems = news.data ?? fallbackNews
  const filtered = allItems.filter(i => newsMatchesCompany(i, company))

  const searchLinks = [
    { label: 'Поиск в Google News', url: `https://news.google.com/search?q=${encodeURIComponent(company.name)}&hl=ru` },
    { label: 'РБК', url: `https://www.rbc.ru/search/?query=${encodeURIComponent(company.name)}` },
    { label: 'Коммерсантъ', url: `https://www.kommersant.ru/search/results?search_query=${encodeURIComponent(company.name)}` },
    { label: 'Ведомости', url: `https://www.vedomosti.ru/search?query=${encodeURIComponent(company.name)}` },
  ]

  return (
    <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Newspaper size={16} className="text-accent" />
          <span className="text-text-primary font-semibold">Новости о компании</span>
          {news.lastUpdated && filtered.length > 0 && (
            <span className="text-text-muted text-xs">
              ({filtered.length} {filtered.length === 1 ? 'материал' : 'материалов'})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {searchLinks.map(l => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2.5 py-1 bg-surface-3 border border-border-subtle rounded-md text-text-secondary hover:text-accent hover:border-accent/40 transition-colors flex items-center gap-1"
            >
              {l.label} <ExternalLink size={9} />
            </a>
          ))}
        </div>
      </div>

      {news.isLoading && !news.data && (
        <div className="text-text-muted text-sm text-center py-8">Загрузка ленты…</div>
      )}

      {filtered.length === 0 && !news.isLoading && (
        <div className="text-center py-6 text-text-muted text-sm">
          В live-потоке за последние часы новостей о компании не найдено.<br />
          Используйте ссылки выше для поиска по архивам.
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.slice(0, 6).map(item => (
            <NewsCard key={item.id} item={item} compact />
          ))}
        </div>
      )}
    </div>
  )
}
