import type { Company } from '../../data/companies'
import type { ShareQuote } from '../../lib/moex-shares'
import type { Deal } from '../../types'
import { formatMoney } from '../../lib/format'

interface Props {
  company: Company
  quote: ShareQuote | null
  dealsAsTarget: Deal[]
}

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-5 py-4 border-r border-border-subtle last:border-r-0">
      <div className="text-text-muted text-xs mb-1">{label}</div>
      <div className="text-text-primary text-xl font-mono font-semibold">{value}</div>
      {sub && <div className="text-text-muted text-xs mt-1">{sub}</div>}
    </div>
  )
}

export default function CompanyKPIs({ company, quote, dealsAsTarget }: Props) {
  // Для публичных — данные с MOEX
  if (company.isPublic && quote) {
    const day = quote.high !== null && quote.low !== null
      ? `${quote.low.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} – ${quote.high.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}`
      : '—'

    const volume = quote.volume !== null
      ? quote.volume >= 1_000_000
        ? `${(quote.volume / 1_000_000).toFixed(1)} млн шт`
        : `${(quote.volume / 1_000).toFixed(0)} тыс шт`
      : '—'

    return (
      <div className="bg-surface-2 border border-border-subtle rounded-xl flex flex-wrap divide-x divide-border-subtle">
        <StatBox
          label="Открытие"
          value={quote.open !== null ? `${quote.open.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽` : '—'}
        />
        <StatBox label="Дневной диапазон" value={day} />
        <StatBox label="Объём за день" value={volume} />
        <StatBox
          label="Капитализация"
          value={quote.marketCapRub !== null && quote.marketCapRub > 0
            ? formatMoney(quote.marketCapRub / 1_000_000)
            : '—'
          }
        />
        <StatBox label="Сделок в базе" value={`${dealsAsTarget.length}`} sub="как объект сделки" />
      </div>
    )
  }

  // Для непубличных — данные из PE-сделок
  const lastDeal = dealsAsTarget[0]
  const valuation = company.privateValuation
  return (
    <div className="bg-surface-2 border border-border-subtle rounded-xl flex flex-wrap divide-x divide-border-subtle">
      <StatBox
        label="Последняя оценка EV"
        value={valuation ? formatMoney(valuation.evMn) : (lastDeal?.evMn ? formatMoney(lastDeal.evMn) : '—')}
        sub={valuation ? new Date(valuation.asOfDate).toLocaleDateString('ru-RU') : (lastDeal ? new Date(lastDeal.date).toLocaleDateString('ru-RU') : 'нет данных')}
      />
      <StatBox
        label="Тип последней сделки"
        value={lastDeal?.dealType ?? '—'}
      />
      <StatBox
        label="EV/EBITDA (сделка)"
        value={lastDeal?.evEbitdaMultiple ? `${lastDeal.evEbitdaMultiple.toFixed(1)}x` : '—'}
      />
      <StatBox label="Сделок в базе" value={`${dealsAsTarget.length}`} sub="как объект сделки" />
    </div>
  )
}
