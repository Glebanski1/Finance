import { useState, useMemo } from 'react'
import Header from '../components/Layout/Header'
import DealsTable from '../components/Deals/DealsTable'
import DealFilters from '../components/Deals/DealFilters'
import { deals } from '../data/deals'
import type { DealType } from '../types'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

function formatMn(v: number): string {
  if (v >= 1_000_000) return `₽${(v / 1_000_000).toFixed(2)} трлн`
  if (v >= 100_000) return `₽${(v / 1_000).toFixed(0)} млрд`
  return `₽${(v / 1_000).toFixed(1)} млрд`
}

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b', '#f97316']

export default function DealsPage() {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<DealType[]>([])
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])

  function toggleType(t: DealType) {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  function toggleSector(id: string) {
    setSelectedSectors(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filtered = useMemo(() => {
    return deals.filter(d => {
      if (search) {
        const q = search.toLowerCase()
        if (!d.target.toLowerCase().includes(q) && !d.buyer.toLowerCase().includes(q) && !d.sector.toLowerCase().includes(q)) return false
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(d.dealType)) return false
      if (selectedSectors.length > 0 && !selectedSectors.includes(d.sectorId)) return false
      return true
    })
  }, [search, selectedTypes, selectedSectors])

  const byType = useMemo(() => {
    const counts: Record<string, number> = {}
    deals.forEach(d => { counts[d.dealType] = (counts[d.dealType] ?? 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [])

  const bySector = useMemo(() => {
    const totals: Record<string, number> = {}
    deals.forEach(d => {
      if (d.evMn) totals[d.sector] = (totals[d.sector] ?? 0) + d.evMn
    })
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([name, value]) => ({ name: name.replace(' и ', '\nи ').replace('АПК и пищевая промышленность', 'АПК'), value }))
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Сделки"
        subtitle={`${deals.length} сделок M&A и PE в российском рынке`}
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* By type */}
          <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="text-text-primary font-semibold mb-4">Структура сделок по типу</div>
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
                {byType.map((entry, i) => (
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

          {/* By sector volume */}
          <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="text-text-primary font-semibold mb-4">Объём сделок по секторам (EV)</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={bySector} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#1e2d4a" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatMn(v)} />
                <YAxis dataKey="name" type="category" width={72} tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#141c30', border: '1px solid #2d4270', borderRadius: 8 }}
                  formatter={(v: number) => [formatMn(v), 'EV']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
          <DealFilters
            search={search}
            onSearch={setSearch}
            selectedTypes={selectedTypes}
            onTypeToggle={toggleType}
            selectedSectors={selectedSectors}
            onSectorToggle={toggleSector}
            totalCount={deals.length}
            filteredCount={filtered.length}
          />
        </div>

        {/* Table */}
        <DealsTable data={filtered} />
      </div>
    </div>
  )
}
