import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import type { SectorMultiple, MultipleHistoryPoint } from '../../types'
import { useState } from 'react'

interface BarProps {
  data: SectorMultiple[]
  metric: 'evEbitda' | 'pe' | 'evRevenue' | 'pb'
}

const metricLabels: Record<string, string> = {
  evEbitda: 'EV/EBITDA',
  pe: 'P/E',
  evRevenue: 'EV/Revenue',
  pb: 'P/B',
}

const ACCENT = '#3b82f6'
const ACCENT_DIM = '#1d4ed8'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-3 border border-border-default rounded-lg px-3 py-2 text-sm shadow-xl">
      <div className="text-text-secondary mb-1 font-medium">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="text-text-primary">
          <span className="text-text-muted mr-1">{p.name}:</span>
          <span className="font-mono font-medium">{p.value.toFixed(1)}x</span>
        </div>
      ))}
    </div>
  )
}

export function SectorBarChart({ data, metric }: BarProps) {
  const [active, setActive] = useState<string | null>(null)

  const chartData = data
    .filter(d => d[metric] > 0)
    .sort((a, b) => a[metric] - b[metric])
    .map(d => ({
      name: d.sector.replace(' и ', '\nи ').replace(' и ', '\nи '),
      shortName: d.sectorEn,
      value: d[metric],
      id: d.id,
    }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#1e2d4a" />
        <XAxis
          type="number"
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}x`}
        />
        <YAxis
          dataKey="shortName"
          type="category"
          width={100}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
        <Bar dataKey="value" name={metricLabels[metric]} radius={[0, 4, 4, 0]} barSize={14}>
          {chartData.map(entry => (
            <Cell
              key={entry.id}
              fill={active === entry.id ? ACCENT : ACCENT_DIM}
              onMouseEnter={() => setActive(entry.id)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface HistoryProps {
  data: MultipleHistoryPoint[]
}

export function HistoryLineChart({ data }: HistoryProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
        <XAxis dataKey="quarter" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}x`} width={36} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
          formatter={v => <span className="text-text-secondary">{v}</span>}
        />
        <Line
          type="monotone"
          dataKey="evEbitda"
          name="EV/EBITDA"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="pe"
          name="P/E"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: '#22c55e', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
