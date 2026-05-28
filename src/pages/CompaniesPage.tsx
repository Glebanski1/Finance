import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Layout/Header'
import { companies } from '../data/companies'
import { Search, X, Building2 } from 'lucide-react'
import clsx from 'clsx'

const SECTORS = Array.from(new Set(companies.map(c => c.sectorId))).map(id => {
  const c = companies.find(x => x.sectorId === id)!
  return { id, label: c.sector }
})

export default function CompaniesPage() {
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState<string | null>(null)
  const [type, setType] = useState<'all' | 'public' | 'private'>('all')

  const filtered = useMemo(() => {
    return companies.filter(c => {
      if (search) {
        const q = search.toLowerCase()
        const haystack = [c.name, c.fullName, ...c.aliases, c.sector].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (sector && c.sectorId !== sector) return false
      if (type === 'public' && !c.isPublic) return false
      if (type === 'private' && c.isPublic) return false
      return true
    }).sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }, [search, sector, type])

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Компании"
        subtitle={`${companies.length} компаний в справочнике — публичные эмитенты MOEX и крупные непубличные`}
      />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию, тикеру, алиасу..."
            className="w-full bg-surface-2 border border-border-subtle rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5">
            {(['all', 'public', 'private'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={clsx('text-xs px-3 py-1.5 rounded-full border transition-colors',
                  type === t ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
                )}
              >
                {t === 'all' ? 'Все' : t === 'public' ? 'Публичные' : 'Непубличные'}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-border-subtle" />
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSector(null)}
              className={clsx('text-xs px-2.5 py-1 rounded-full border transition-colors',
                !sector ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
              )}
            >
              Все сектора
            </button>
            {SECTORS.map(s => (
              <button
                key={s.id}
                onClick={() => setSector(s.id)}
                className={clsx('text-xs px-2.5 py-1 rounded-full border transition-colors',
                  sector === s.id ? 'bg-accent text-white border-accent' : 'bg-surface-2 text-text-secondary border-border-subtle hover:border-accent/40'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-text-muted text-xs">
          Показано <span className="text-text-primary font-medium">{filtered.length}</span> из {companies.length}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(c => (
            <Link
              key={c.id}
              to={`/company/${c.id}`}
              className="bg-surface-2 border border-border-subtle rounded-xl p-4 hover:border-accent/40 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <Building2 size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                {c.moexTicker ? (
                  <span className="text-xs font-mono px-1.5 py-0.5 bg-success/10 text-success border border-success/30 rounded">
                    {c.moexTicker}
                  </span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 bg-warn/10 text-warn border border-warn/30 rounded">
                    private
                  </span>
                )}
              </div>
              <div className="text-text-primary font-semibold text-sm group-hover:text-accent transition-colors line-clamp-1">{c.name}</div>
              <div className="text-text-muted text-xs mt-0.5 line-clamp-1">{c.sector}</div>
              {c.hq && <div className="text-text-muted text-xs mt-1">{c.hq}</div>}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">Не найдено</div>
        )}
      </div>
    </div>
  )
}
