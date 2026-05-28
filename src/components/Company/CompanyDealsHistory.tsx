import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ExternalLink, ArrowDown, ArrowUp, RefreshCw } from 'lucide-react'
import type { Deal } from '../../types'
import { formatMoney, formatDateShort } from '../../lib/format'
import { getCompanyHref } from '../../data/companies'

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

interface Props {
  asTarget: Deal[]
  asBuyer: Deal[]
  asSeller: Deal[]
}

function DealRow({ deal, role }: { deal: Deal; role: 'target' | 'buyer' | 'seller' }) {
  const counterparty = role === 'target' ? deal.buyer : deal.target

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle/40 last:border-b-0 hover:bg-surface-3 transition-colors">
      <div className="text-text-muted text-xs font-mono w-20 shrink-0">{formatDateShort(deal.date)}</div>
      <span className={clsx('text-xs px-2 py-0.5 rounded-full border font-medium shrink-0', dealTypeColors[deal.dealType] ?? 'bg-surface-3 border-border-subtle text-text-secondary')}>
        {deal.dealType}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-text-secondary text-sm truncate">
          {role === 'target'
            ? <>Покупатель: <span className="text-text-primary">{counterparty}</span></>
            : role === 'buyer'
              ? <>Купили: <Link to={getCompanyHref(counterparty)} className="text-accent hover:text-accent-hover">{counterparty}</Link></>
              : <>Продали: <Link to={getCompanyHref(counterparty)} className="text-accent hover:text-accent-hover">{counterparty}</Link></>
          }
        </div>
        <div className="text-text-muted text-xs truncate">{deal.description}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-text-primary font-mono text-sm font-medium">{formatMoney(deal.evMn)}</div>
        {deal.evEbitdaMultiple !== null && deal.evEbitdaMultiple > 0 && (
          <div className="text-text-muted text-xs font-mono">{deal.evEbitdaMultiple.toFixed(1)}x EV/EBITDA</div>
        )}
      </div>
      <a
        href={deal.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-text-muted hover:text-accent transition-colors p-1.5"
        title={`Источник: ${deal.source}`}
      >
        <ExternalLink size={13} />
      </a>
    </div>
  )
}

export default function CompanyDealsHistory({ asTarget, asBuyer, asSeller }: Props) {
  if (asTarget.length === 0 && asBuyer.length === 0 && asSeller.length === 0) {
    return (
      <div className="bg-surface-2 border border-border-subtle rounded-xl p-8 text-center">
        <div className="text-text-muted text-sm">
          В нашей базе нет публичных сделок с участием этой компании
        </div>
      </div>
    )
  }

  const sections = [
    { key: 'target', label: 'Как объект сделки', icon: ArrowDown, color: 'text-warn', deals: asTarget },
    { key: 'buyer', label: 'Как покупатель', icon: ArrowUp, color: 'text-success', deals: asBuyer },
    { key: 'seller', label: 'Как продавец', icon: RefreshCw, color: 'text-accent', deals: asSeller },
  ] as const

  return (
    <div className="space-y-4">
      {sections.map(({ key, label, icon: Icon, color, deals }) => (
        deals.length > 0 && (
          <div key={key} className="bg-surface-2 border border-border-subtle rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border-subtle flex items-center gap-2">
              <Icon size={14} className={color} />
              <span className="text-text-primary font-semibold text-sm">{label}</span>
              <span className="text-text-muted text-xs">({deals.length})</span>
            </div>
            <div>
              {deals.map(d => <DealRow key={d.id} deal={d} role={key} />)}
            </div>
          </div>
        )
      ))}
    </div>
  )
}
