import Header from '../components/Layout/Header'
import { methodology, formulas } from '../data/methodology'
import { MOEX_SECTOR_INDICES } from '../lib/moex'
import { sectorMultiples } from '../data/multiples'
import { BookOpen, ExternalLink, AlertCircle, Database } from 'lucide-react'

export default function MethodologyPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Методология"
        subtitle="Источники данных, формулы и состав выборки по каждому сектору"
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Intro */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-accent" />
            <h2 className="text-text-primary text-lg font-semibold">Как мы считаем мультипликаторы</h2>
          </div>
          <div className="text-text-secondary text-sm leading-relaxed space-y-2">
            <p>
              Все мультипликаторы по секторам — это <strong className="text-text-primary">медиана</strong> по
              выборке публичных компаний (медиана, а не среднее — чтобы убрать влияние Норникеля, Сбера и других
              «гигантов», искажающих картину сектора).
            </p>
            <p>
              Базовые данные собираются из двух источников: котировки и веса компаний — с MOEX ISS API в режиме
              реального времени; финансовые показатели (EBITDA, выручка, чистая прибыль, чистый долг) — из
              консолидированной отчётности эмитентов по МСФО за последние 12 месяцев (LTM).
            </p>
            <p>
              Для секторов без отдельного индекса MOEX (АПК, Здравоохранение) выборка собирается вручную.
              Непубличные компании оцениваются по сравнительным сделкам PE/M&A из нашей базы.
            </p>
          </div>
        </div>

        {/* Formulas */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-6">
          <h2 className="text-text-primary text-lg font-semibold mb-4">Формулы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(formulas).map(f => (
              <div key={f.name} className="bg-surface-3 border border-border-subtle rounded-lg p-4">
                <div className="text-text-primary font-semibold mb-2">{f.name}</div>
                <div className="text-text-secondary font-mono text-xs bg-surface-0 px-3 py-2 rounded mb-2 leading-relaxed">
                  {f.formula}
                </div>
                <div className="text-text-muted text-xs leading-relaxed">{f.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-sector */}
        <div className="bg-surface-2 border border-border-subtle rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-accent" />
            <h2 className="text-text-primary text-lg font-semibold">По каждому сектору</h2>
          </div>

          <div className="space-y-4">
            {sectorMultiples.map(s => {
              const m = methodology[s.id]
              const moexCfg = MOEX_SECTOR_INDICES[s.id]
              if (!m) return null
              return (
                <div key={s.id} className="border border-border-subtle rounded-lg overflow-hidden">
                  <div className="bg-surface-3 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{s.icon}</span>
                      <div>
                        <div className="text-text-primary font-semibold">{s.sector}</div>
                        <div className="text-text-muted text-xs">{s.companiesCount} компаний в обзоре · покрытие {Math.round((m.sampleSize / m.totalUniverse) * 100)}%</div>
                      </div>
                    </div>
                    {moexCfg ? (
                      <a
                        href={`https://www.moex.com/ru/index/${moexCfg.ticker}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover bg-accent-muted px-2.5 py-1 rounded-md"
                      >
                        {moexCfg.ticker} <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-warn text-xs bg-warn/10 px-2.5 py-1 rounded-md">
                        <AlertCircle size={10} /> нет индекса MOEX
                      </span>
                    )}
                  </div>

                  <div className="px-4 py-3 space-y-3">
                    <div className="text-text-secondary text-sm leading-relaxed">{m.description}</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-text-muted text-xs mb-1.5 font-medium">Топ-компании в выборке</div>
                        <div className="flex flex-wrap gap-1.5">
                          {m.topConstituents.map(c => (
                            <span key={c} className="text-xs px-2 py-0.5 bg-surface-3 border border-border-subtle rounded-md text-text-secondary">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="text-text-muted text-xs mb-0.5">Первоисточник</div>
                          <a
                            href={m.primarySourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent text-sm hover:text-accent-hover flex items-center gap-1"
                          >
                            {m.primarySource} <ExternalLink size={10} />
                          </a>
                        </div>
                        <div>
                          <div className="text-text-muted text-xs">Актуально на</div>
                          <div className="text-text-secondary text-sm">{new Date(m.asOfDate).toLocaleDateString('ru-RU')}</div>
                        </div>
                      </div>
                    </div>

                    {m.excluded.length > 0 && (
                      <div>
                        <div className="text-text-muted text-xs mb-1 font-medium">Исключения из расчёта</div>
                        <ul className="space-y-0.5">
                          {m.excluded.map(e => (
                            <li key={e} className="text-text-muted text-xs flex items-start gap-1.5">
                              <span className="text-warn">·</span> {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-accent/5 border border-accent/20 rounded-md p-2.5">
                      <div className="text-text-secondary text-xs leading-relaxed">
                        <span className="text-accent font-medium">Комментарий:</span> {m.notes}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-warn/5 border border-warn/20 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-warn shrink-0 mt-0.5" />
            <div className="text-text-secondary text-xs leading-relaxed">
              <strong className="text-warn">Дисклеймер.</strong> Все мультипликаторы — оценочные, рассчитываются на
              базе публично доступной информации. Не являются инвестиционной рекомендацией. Данные могут
              отличаться от значений в платных терминалах (Bloomberg, Refinitiv) из-за различий в методике
              расчёта EBITDA (нормализация, единоразовые статьи) и составе выборки.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
