import { useParams, Link } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import Header from '../components/Layout/Header'
import CompanyHeader from '../components/Company/CompanyHeader'
import CompanyKPIs from '../components/Company/CompanyKPIs'
import CompanyPriceChart from '../components/Company/CompanyPriceChart'
import CompanyDealsHistory from '../components/Company/CompanyDealsHistory'
import CompanyNews from '../components/Company/CompanyNews'
import { findCompanyById, findCompanyInString, type Company } from '../data/companies'
import { deals } from '../data/deals'
import { fetchShareQuote } from '../lib/moex-shares'
import { useLiveData } from '../hooks/useLiveData'
import { sectorMultiples } from '../data/multiples'

/**
 * Если компания не в справочнике — собирает минимальный профиль
 * из её упоминаний в базе сделок.
 */
function buildFallbackCompany(id: string): Company | null {
  const matchingDeals = deals.filter(d => {
    const slug = id.toLowerCase()
    return d.target.toLowerCase().includes(slug) || slug.includes(d.target.toLowerCase().slice(0, 6))
  })
  if (matchingDeals.length === 0) return null

  const first = matchingDeals[0]
  return {
    id,
    name: first.target,
    fullName: first.target,
    aliases: [first.target],
    sectorId: first.sectorId,
    sector: first.sector,
    moexTicker: null,
    isPublic: first.isPublic,
    description: `Профиль компании пока не заполнен. Известно из сделок: ${first.description}`,
  }
}

export default function CompanyPage() {
  const { id } = useParams<{ id: string }>()
  const company = useMemo(() => {
    if (!id) return null
    return findCompanyById(id) ?? buildFallbackCompany(id)
  }, [id])

  const ticker = company?.moexTicker ?? null

  const liveQuote = useLiveData(
    useCallback(async () => (ticker ? fetchShareQuote(ticker) : null), [ticker]),
    { intervalMs: 60_000, enabled: !!ticker },
  )

  const dealLists = useMemo(() => {
    if (!company) return { asTarget: [], asBuyer: [], asSeller: [] }
    const asTarget = deals.filter(d => {
      const found = findCompanyInString(d.target)
      return found?.id === company.id || d.target === company.name
    }).sort((a, b) => b.date.localeCompare(a.date))

    const asBuyer = deals.filter(d => {
      const found = findCompanyInString(d.buyer)
      return found?.id === company.id
    }).sort((a, b) => b.date.localeCompare(a.date))

    const asSeller = deals.filter(d => {
      const found = findCompanyInString(d.seller)
      return found?.id === company.id
    }).sort((a, b) => b.date.localeCompare(a.date))

    return { asTarget, asBuyer, asSeller }
  }, [company])

  const sectorBenchmark = useMemo(() => {
    if (!company) return null
    return sectorMultiples.find(s => s.id === company.sectorId)
  }, [company])

  if (!company) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Профиль компании" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertCircle size={40} className="text-warn mx-auto mb-4" />
            <div className="text-text-primary text-lg font-semibold">Компания не найдена</div>
            <div className="text-text-muted text-sm mt-2">
              По идентификатору <span className="font-mono">{id}</span> ничего не найдено в справочнике
              и нет сделок с похожим названием.
            </div>
            <Link to="/" className="inline-flex items-center gap-1 mt-4 text-accent text-sm hover:text-accent-hover">
              <ArrowLeft size={13} /> Вернуться к обзору
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={company.name}
        subtitle={`Профиль компании · ${company.sector}`}
      />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        <CompanyHeader
          company={company}
          quote={liveQuote.data}
          liveError={liveQuote.error}
        />

        <CompanyKPIs
          company={company}
          quote={liveQuote.data}
          dealsAsTarget={dealLists.asTarget}
        />

        {/* Sector context — куда ткнуть для контекста */}
        {sectorBenchmark && (
          <div className="bg-surface-2 border border-border-subtle rounded-xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-text-primary font-semibold text-sm">Контекст сектора</div>
                <div className="text-text-muted text-xs mt-0.5">
                  Медианные мультипликаторы для «{company.sector}»
                </div>
              </div>
              <Link
                to={`/multiples?sector=${company.sectorId}`}
                className="text-accent text-xs hover:text-accent-hover flex items-center gap-1"
              >
                Подробнее по сектору <ExternalLink size={10} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {sectorBenchmark.evEbitda > 0 && (
                <div>
                  <div className="text-text-muted text-xs">EV/EBITDA сектора</div>
                  <div className="text-text-primary font-mono text-xl font-semibold mt-0.5">{sectorBenchmark.evEbitda.toFixed(1)}x</div>
                </div>
              )}
              <div>
                <div className="text-text-muted text-xs">P/E сектора</div>
                <div className="text-text-primary font-mono text-xl font-semibold mt-0.5">{sectorBenchmark.pe.toFixed(1)}x</div>
              </div>
              <div>
                <div className="text-text-muted text-xs">Капитализация</div>
                <div className="text-text-primary font-mono text-xl font-semibold mt-0.5">
                  ₽{sectorBenchmark.marketCapBn >= 1000
                    ? `${(sectorBenchmark.marketCapBn / 1000).toFixed(1)} трлн`
                    : `${sectorBenchmark.marketCapBn} млрд`}
                </div>
              </div>
              <div>
                <div className="text-text-muted text-xs">Компаний в выборке</div>
                <div className="text-text-primary font-mono text-xl font-semibold mt-0.5">{sectorBenchmark.companiesCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Price chart — для публичных */}
        {ticker && (
          <CompanyPriceChart ticker={ticker} dealsAsTarget={dealLists.asTarget} />
        )}

        {/* Private valuation — для непубличных */}
        {!company.isPublic && company.privateValuation && (
          <div className="bg-surface-2 border border-warn/20 rounded-xl p-5">
            <div className="text-text-primary font-semibold mb-2">Оценка непубличной компании</div>
            <div className="text-text-secondary text-sm mb-3">
              Поскольку компания не торгуется на бирже, мы используем последнюю известную оценку
              из публичной сделки PE / M&A.
            </div>
            <div className="bg-surface-3 border border-border-subtle rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-text-muted text-xs">Оценка EV</div>
                <div className="text-text-primary text-2xl font-mono font-bold">
                  ₽{(company.privateValuation.evMn / 1000).toFixed(1)} млрд
                </div>
              </div>
              <div>
                <div className="text-text-muted text-xs">По состоянию на</div>
                <div className="text-text-secondary text-sm">
                  {new Date(company.privateValuation.asOfDate).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <a
                href={company.privateValuation.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm hover:text-accent-hover flex items-center gap-1"
              >
                {company.privateValuation.source} <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

        {/* Deals history */}
        <div>
          <h2 className="text-text-primary font-semibold mb-3 px-1">История M&A / PE сделок</h2>
          <CompanyDealsHistory
            asTarget={dealLists.asTarget}
            asBuyer={dealLists.asBuyer}
            asSeller={dealLists.asSeller}
          />
        </div>

        {/* News */}
        <CompanyNews company={company} />
      </div>
    </div>
  )
}
