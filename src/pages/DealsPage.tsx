import { useState, useMemo } from 'react'
import Header from '../components/Layout/Header'
import DealsTable from '../components/Deals/DealsTable'
import DealFilters from '../components/Deals/DealFilters'
import { deals } from '../data/deals'
import type { DealType } from '../types'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { formatMoney } from '../lib/format'
import { Database } from 'lucide-react'

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b', '#f97316', '#ec4899', '#84cc16']

export default function DealsPage() {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<DealType[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [yearFilter, setYearFilter] = useState<string | null>(null)

  function toggleType(t: DealType) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  function toggleSector(id: string) {
    setSelectedSectors(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function reset() {
    setSearch('')
    setSelectedTypes([])
    setSelectedSectors([])
    setYearFilter(null)
  }

  const availableYears = useMemo(() => {
    const s = new Set(deals.map(d => d.date.slice(0, 4)))
    return Array.from(s).sort().reverse()
  }, [])

  const filtered = useMemo(() => {
    return deals.filter(d => {
      if (search) {
        const q = search.toLowerCase()
        if (
          !d.target.toLowerCase().includes(q) &&
          !d.buyer.toLowerCase().includes(q) &&
          !d.sector.toLowerCase().includes(q) &&
          !(d.seller ?? '').toLowerCase().includes(q)
        ) return false
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(d.dealType)) return false
      if (selectedSectors.length > 0 && !selectedSectors.includes(d.sectorId)) return false
      if (yearFilter && !d.date.startsWith(yearFilter)) return false
      return true
    })
  }, [search, selectedTypes, selectedSectors, yearFilter])

  const byType = useMemo(() => {
    const counts: Record<string, number> = {}
    filtered.forEach(d => { counts[d.dealType] = (counts[d.dealType] ?? 0) + 1 })
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }))
  }, [filtered])

  const bySector = useMemo(() => {
    const totals: Record<string, number> = {}
    filtered.forEach(d => {
      if (d.evMn) totals[d.sector] = (totals[d.sector] ?? 0) + d.evMn
    })
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name: name.replace('АПК и пищевая промышленность', 'АПК').replace(' и горнодобыча', '').replace(' и фарма', '').replace(' и логистика', '').replace(' и девелопмент', '').replace(' и нефтехимия', ''), value }))
  }, [filtered])

  const totalVolume = useMemo(() => filtered.reduce((s, d) => s + (d.evMn ?? 0), 0), [filtered])

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Сделки M&A и Private Equity"
        subtitle={`База: ${deals.length} сделок за 2022–2025 · покрытие: РБК, Коммерсантъ, Ведомости, Forbes, Interfax, MOEX`}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Summary banner */}
        <div className="flex items-center gap-3 bg-accent-muted border border-accent/30 rounded-xl px-4 py-3">
          <Database size={16} className="text-accent" />
          <div className="text-sm">
            <span className="text-text-primary font-semibold">{filtered.length}</span>
            <span className="text-text-secondary"> сделок отфильтровано · суммарный EV: </span>
            <span className="text-text-primary font-mono font-semibold">{formatMoney(totalVolume)}</span>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="text-text-primary font-semibold mb-4">Структура по типу</div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={byType} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                    {byType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#141c30', border: '1px solid #2d4270', borderRadius: 8 }}
                    formatter={(v: number) => [v, 'сделок']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {byType.slice(0, 8).map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-text-secondary text-xs">{entry.name}</span>
                    </div>
                    <span className="text-text-primary text-xs font-mono font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="text-text-primary font-semibold mb-4">Объём по секторам (EV)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bySector} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#1e2d4a" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatMoney(v)} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#141c30', border: '1px solid #2d4270', borderRadius: 8 }}
                  formatter={(v: number) => [formatMoney(v), 'EV']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
          <DealFilters
            search={search}
            onSearch={setSearch}
            selectedTypes={selectedTypes}
            onTypeToggle={toggleType}
            selectedSectors={selectedSectors}
            onSectorToggle={toggleSector}
            yearFilter={yearFilter}
            onYearChange={setYearFilter}
            availableYears={availableYears}
            totalCount={deals.length}
            filteredCount={filtered.length}
            onReset={reset}
          />
        </div>

        <DealsTable data={filtered} />
      </div>
    </div>
  )
}
