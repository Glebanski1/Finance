import { Link } from 'react-router-dom'
import { ExternalLink, Globe, Newspaper, ArrowLeft, Building2 } from 'lucide-react'
import type { Company } from '../../data/companies'
import type { ShareQuote } from '../../lib/moex-shares'
import { formatPct } from '../../lib/format'
import clsx from 'clsx'

interface Props {
  company: Company
  quote: ShareQuote | null
  liveError?: string | null
}

function getInitials(name: string): string {
  return name
    .split(/[\s«»\-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export default function CompanyHeader({ company, quote, liveError }: Props) {
  const change = quote?.changePct
  const trendColor = change === null || change === undefined
    ? 'text-text-muted'
    : change >= 0 ? 'text-success' : 'text-danger'

  return (
    <div className="bg-gradient-to-br from-surface-2 to-surface-1 border border-border-subtle rounded-xl p-6">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-1 text-text-muted hover:text-accent text-xs transition-colors">
          <ArrowLeft size={12} /> К обзору
        </Link>
      </div>

      <div className="flex items-start gap-5 flex-wrap">
        {/* Logo */}
        <div className="w-16 h-16 rounded-xl bg-accent-muted border border-accent/30 flex items-center justify-center shrink-0">
          <span className="text-accent font-bold text-xl tracking-tight">
            {getInitials(company.name)}
          </span>
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-text-primary text-2xl font-bold">{company.name}</h1>
            {company.moexTicker ? (
              <a
                href={`https://www.moex.com/ru/issue.aspx?board=TQBR&code=${company.moexTicker}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/30 font-mono hover:bg-success/20 flex items-center gap-1"
              >
                {company.moexTicker} <ExternalLink size={10} />
              </a>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-md bg-warn/10 text-warn border border-warn/30">
                Непубличная
              </span>
            )}
          </div>
          <div className="text-text-muted text-sm mt-1">{company.fullName}</div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            <Link
              to={`/multiples?sector=${company.sectorId}`}
              className="flex items-center gap-1 text-text-secondary hover:text-accent transition-colors"
            >
              <Building2 size={12} /> {company.sector}
            </Link>
            {company.founded && (
              <span className="text-text-muted">осн. {company.founded}</span>
            )}
            {company.hq && (
              <span className="text-text-muted">· {company.hq}</span>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent hover:text-accent-hover"
              >
                <Globe size={11} /> Сайт
              </a>
            )}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(company.name + ' новости')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent hover:text-accent-hover"
            >
              <Newspaper size={11} /> Поиск по новостям
            </a>
          </div>
        </div>

        {/* Live quote (если публичная) */}
        {company.isPublic && (
          <div className="text-right shrink-0 min-w-[140px]">
            {quote && quote.last !== null ? (
              <>
                <div className="text-text-muted text-xs">Цена акции</div>
                <div className="text-text-primary text-2xl font-bold font-mono">
                  {quote.last.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽
                </div>
                {change !== null && change !== undefined && (
                  <div className={clsx('text-sm font-mono font-medium', trendColor)}>
                    {formatPct(change)}
                  </div>
                )}
                {quote.updatedAt && (
                  <div className="text-text-muted text-xs mt-1">
                    обновлено {quote.updatedAt}
                  </div>
                )}
              </>
            ) : liveError ? (
              <div className="text-warn text-xs">Котировка недоступна</div>
            ) : (
              <div className="text-text-muted text-xs animate-pulse">Загрузка…</div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-5 text-text-secondary text-sm leading-relaxed">
        {company.description}
      </div>
    </div>
  )
}
