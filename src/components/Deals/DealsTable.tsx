import { useState } from 'react'
import clsx from 'clsx'
import type { Deal, SortDir } from '../../types'
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'

type SortField = 'date' | 'evMn' | 'evEbitdaMultiple' | 'target'

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
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  data: Deal[]
}

export default function DealsTable({ data }: Props) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    let va: string | number
    let vb: string | number
    switch (sortField) {
      case 'date': va = a.date; vb = b.date; break
      case 'evMn': va = a.evMn ?? -1; vb = b.evMn ?? -1; break
      case 'evEbitdaMultiple': va = a.evEbitdaMultiple ?? -1; vb = b.evEbitdaMultiple ?? -1; break
      case 'target': va = a.target; vb = b.target; break
    }
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
    return sortDir === 'asc' ? va - (vb as number) : (vb as number) - va
  })

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-text-muted" />
    return sortDir === 'asc' ? <ArrowUp size={12} className="text-accent" /> : <ArrowDown size={12} className="text-accent" />
  }

  function Th({ field, label, className = '' }: { field: SortField; label: string; className?: string }) {
    return (
      <th
        className={clsx('px-4 py-3 text-left text-text-muted text-xs font-medium cursor-pointer hover:text-text-secondary select-none whitespace-nowrap', className)}
        onClick={() => handleSort(field)}
      >
        <span className="flex items-center gap-1">{label} <SortIcon field={field} /></span>
      </th>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-surface-2 border-b border-border-subtle">
            <Th field="date" label="Дата" />
            <Th field="target" label="Компания" className="min-w-[160px]" />
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">Тип</th>
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">Покупатель</th>
            <Th field="evMn" label="Оценка EV" />
            <Th field="evEbitdaMultiple" label="EV/EBITDA" />
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">Доля</th>
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">Статус</th>
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">Источник</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(deal => (
            <>
              <tr
                key={deal.id}
                onClick={() => setExpanded(e => (e === deal.id ? null : deal.id))}
                className={clsx(
                  'border-b border-border-subtle/50 transition-colors cursor-pointer',
                  expanded === deal.id ? 'bg-surface-3' : 'hover:bg-surface-2'
                )}
              >
                <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">{formatDate(deal.date)}</td>
                <td className="px-4 py-3">
                  <div className="text-text-primary font-medium">{deal.target}</div>
                  <div className="text-text-muted text-xs">{deal.sector}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('text-xs px-2 py-0.5 rounded-full border font-medium', dealTypeColors[deal.dealType] ?? 'bg-surface-3 text-text-secondary border-border-subtle')}>
                    {deal.dealType}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs max-w-[160px] truncate">{deal.buyer}</td>
                <td className="px-4 py-3 text-mono text-text-primary font-medium whitespace-nowrap">
                  {formatMn(deal.evMn)}
                </td>
                <td className="px-4 py-3 text-mono text-text-primary">
                  {deal.evEbitdaMultiple !== null ? `${deal.evEbitdaMultiple.toFixed(1)}x` : '—'}
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  {deal.stakePercent !== null ? `${deal.stakePercent}%` : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={clsx('text-xs font-medium', statusColors[deal.status])}>
                    {deal.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-text-muted text-xs hover:text-accent transition-colors">
                    {deal.source} <ExternalLink size={10} />
                  </span>
                </td>
              </tr>
              {expanded === deal.id && (
                <tr key={`${deal.id}-exp`} className="bg-surface-3 border-b border-border-subtle">
                  <td colSpan={9} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <div className="text-text-muted text-xs mb-1">Описание сделки</div>
                        <div className="text-text-primary text-sm leading-relaxed">{deal.description}</div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-text-muted text-xs">Продавец</div>
                          <div className="text-text-secondary text-sm">{deal.seller}</div>
                        </div>
                        <div>
                          <div className="text-text-muted text-xs">Публичная компания</div>
                          <div className={clsx('text-sm', deal.isPublic ? 'text-success' : 'text-text-secondary')}>
                            {deal.isPublic ? 'Да (торгуется на MOEX)' : 'Нет (частная)'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
