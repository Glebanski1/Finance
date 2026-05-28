import clsx from 'clsx'
import type { DealType } from '../../types'
import { Search, X } from 'lucide-react'

const ALL_TYPES: DealType[] = ['LBO', 'Buyout', 'Growth', 'Minority', 'Strategic M&A', 'Secondary', 'IPO', 'Exit (foreign)', 'Restructuring']

const ALL_SECTORS = [
  { id: 'it', label: 'IT' },
  { id: 'retail', label: 'Ритейл' },
  { id: 'realestate', label: 'Недвижимость' },
  { id: 'agro', label: 'АПК' },
  { id: 'transport', label: 'Транспорт' },
  { id: 'telecom', label: 'Телеком' },
  { id: 'healthcare', label: 'Медицина' },
  { id: 'metals', label: 'Металлургия' },
  { id: 'oil-gas', label: 'Нефть и газ' },
  { id: 'financials', label: 'Финансы' },
  { id: 'utilities', label: 'Энергетика' },
  { id: 'chemicals', label: 'Химия' },
]

interface Props {
  search: string
  onSearch: (v: string) => void
  selectedTypes: DealType[]
  onTypeToggle: (t: DealType) => void
  selectedSectors: string[]
  onSectorToggle: (id: string) => void
  yearFilter: string | null
  onYearChange: (y: string | null) => void
  availableYears: string[]
  totalCount: number
  filteredCount: number
  onReset: () => void
}

export default function DealFilters({
  search, onSearch,
  selectedTypes, onTypeToggle,
  selectedSectors, onSectorToggle,
  yearFilter, onYearChange, availableYears,
  totalCount, filteredCount,
  onReset,
}: Props) {
  const hasFilters = !!search || selectedTypes.length > 0 || selectedSectors.length > 0 || !!yearFilter

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Поиск по компании, покупателю, сектору..."
          className="w-full bg-surface-2 border border-border-subtle rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-text-muted text-xs shrink-0">Год:</span>
        <button
          onClick={() => onYearChange(null)}
          className={clsx('text-xs px-2.5 py-1 rounded-full border transition-colors',
            !yearFilter ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
          )}
        >
          Все
        </button>
        {availableYears.map(y => (
          <button
            key={y}
            onClick={() => onYearChange(y)}
            className={clsx('text-xs px-2.5 py-1 rounded-full border transition-colors',
              yearFilter === y ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
            )}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-text-muted text-xs shrink-0">Тип сделки:</span>
        {ALL_TYPES.map(t => (
          <button
            key={t}
            onClick={() => onTypeToggle(t)}
            className={clsx(
              'text-xs px-2.5 py-1 rounded-full border transition-colors',
              selectedTypes.includes(t)
                ? 'bg-accent text-white border-accent'
                : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40 hover:text-text-primary'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-text-muted text-xs shrink-0">Сектор:</span>
        {ALL_SECTORS.map(s => (
          <button
            key={s.id}
            onClick={() => onSectorToggle(s.id)}
            className={clsx(
              'text-xs px-2.5 py-1 rounded-full border transition-colors',
              selectedSectors.includes(s.id)
                ? 'bg-accent text-white border-accent'
                : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40 hover:text-text-primary'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-text-muted text-xs">
          Показано <span className="text-text-primary font-medium">{filteredCount}</span> из <span className="text-text-secondary">{totalCount}</span> сделок
        </span>
        {hasFilters && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors">
            <X size={12} /> Сбросить
          </button>
        )}
      </div>
    </div>
  )
}
