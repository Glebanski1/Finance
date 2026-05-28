import { useState } from 'react'
import clsx from 'clsx'
import type { SectorMultiple } from '../../types'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

type SortField = 'sector' | 'evEbitda' | 'pe' | 'evRevenue' | 'pb' | 'marketCapBn'
type SortDir = 'asc' | 'desc'

interface Props {
  data: SectorMultiple[]
  onSelect?: (id: string) => void
  selectedId?: string
}

function ChangeCell({ value }: { value: number }) {
  if (value === 0) return <span className="text-text-muted">—</span>
  return (
    <span className={clsx('text-xs', value > 0 ? 'text-success' : 'text-danger')}>
      {value > 0 ? '+' : ''}{value.toFixed(1)}x
    </span>
  )
}

function formatNum(v: number, decimals = 1): string {
  if (v === 0) return '—'
  return v.toFixed(decimals) + 'x'
}

function formatBn(v: number): string {
  if (v >= 1000) return (v / 1000).toFixed(1) + ' трлн'
  return v.toFixed(0) + ' млрд'
}

export default function MultiplesTable({ data, onSelect, selectedId }: Props) {
  const [sortField, setSortField] = useState<SortField>('evEbitda')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    let va: string | number = a[sortField]
    let vb: string | number = b[sortField]
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
    if ((va as number) === 0) va = Infinity
    if ((vb as number) === 0) vb = Infinity
    return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
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
        <span className="flex items-center gap-1">
          {label} <SortIcon field={field} />
        </span>
      </th>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border-subtle">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-surface-2 border-b border-border-subtle">
            <Th field="sector" label="Сектор" className="min-w-[200px]" />
            <Th field="evEbitda" label="EV/EBITDA" />
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">ΔYoY</th>
            <Th field="pe" label="P/E" />
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">ΔYoY</th>
            <Th field="evRevenue" label="EV/Rev" />
            <Th field="pb" label="P/B" />
            <Th field="marketCapBn" label="Кап. (₽)" />
            <th className="px-4 py-3 text-left text-text-muted text-xs font-medium">Компаний</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr
              key={row.id}
              onClick={() => onSelect?.(row.id)}
              className={clsx(
                'border-b border-border-subtle/50 transition-colors cursor-pointer',
                selectedId === row.id
                  ? 'bg-accent-muted'
                  : 'hover:bg-surface-3'
              )}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{row.icon}</span>
                  <div>
                    <div className="text-text-primary font-medium">{row.sector}</div>
                    <div className="text-text-muted text-xs">{row.sectorEn}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-mono text-text-primary font-medium">
                {formatNum(row.evEbitda)}
              </td>
              <td className="px-4 py-3">
                <ChangeCell value={row.evEbitdaYoY} />
              </td>
              <td className="px-4 py-3 text-mono text-text-primary font-medium">
                {formatNum(row.pe)}
              </td>
              <td className="px-4 py-3">
                <ChangeCell value={row.peYoY} />
              </td>
              <td className="px-4 py-3 text-mono text-text-secondary">
                {formatNum(row.evRevenue)}
              </td>
              <td className="px-4 py-3 text-mono text-text-secondary">
                {formatNum(row.pb)}
              </td>
              <td className="px-4 py-3 text-mono text-text-secondary">
                ₽{formatBn(row.marketCapBn)}
              </td>
              <td className="px-4 py-3 text-text-muted text-center">
                {row.companiesCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
