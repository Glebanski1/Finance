import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ExternalLink, BookOpen, Activity, AlertCircle } from 'lucide-react'
import { methodology, formulas } from '../../data/methodology'
import { MOEX_SECTOR_INDICES, type MoexIndexQuote } from '../../lib/moex'
import { getCompanyHref } from '../../data/companies'
import { formatPct } from '../../lib/format'
import clsx from 'clsx'

interface Props {
  sectorId: string
  onClose: () => void
  liveQuote?: MoexIndexQuote | null
}

export default function MethodologyPanel({ sectorId, onClose, liveQuote }: Props) {
  const m = methodology[sectorId]
  const moexCfg = MOEX_SECTOR_INDICES[sectorId]
  const [tab, setTab] = useState<'source' | 'formulas' | 'companies'>('source')

  if (!m) return null

  return (
    <div className="bg-surface-2 border border-accent/30 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-gradient-to-r from-accent-muted to-transparent">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-accent" />
          <span className="text-text-primary font-semibold">Методология расчёта</span>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-secondary p-1">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle">
        {[
          { key: 'source', label: 'Источники и индекс' },
          { key: 'formulas', label: 'Формулы' },
          { key: 'companies', label: 'Состав выборки' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'source' | 'formulas' | 'companies')}
            className={clsx(
              'px-4 py-2.5 text-sm border-b-2 transition-colors',
              tab === t.key
                ? 'text-accent border-accent font-medium'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {tab === 'source' && (
          <>
            <div className="text-text-secondary text-sm leading-relaxed">{m.description}</div>

            {moexCfg ? (
              <div className="bg-surface-3 border border-border-subtle rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-success" />
                    <span className="text-text-primary text-sm font-medium">Индекс MOEX (real-time)</span>
                  </div>
                  <a
                    href={`https://www.moex.com/ru/index/${moexCfg.ticker}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent text-xs hover:text-accent-hover"
                  >
                    {moexCfg.ticker} <ExternalLink size={10} />
                  </a>
                </div>
                <div className="text-text-muted text-xs mb-3">{moexCfg.name}</div>
                {liveQuote ? (
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-text-muted text-xs">Значение</div>
                      <div className="text-text-primary text-lg font-mono font-semibold">
                        {liveQuote.last?.toLocaleString('ru-RU', { maximumFractionDigits: 1 }) ?? '—'}
                      </div>
                    </div>
                    {liveQuote.changePct !== null && (
                      <div>
                        <div className="text-text-muted text-xs">Изм. за день</div>
                        <div className={clsx('text-lg font-mono font-semibold', liveQuote.changePct >= 0 ? 'text-success' : 'text-danger')}>
                          {formatPct(liveQuote.changePct)}
                        </div>
                      </div>
                    )}
                    {liveQuote.updatedAt && (
                      <div>
                        <div className="text-text-muted text-xs">Обновлено</div>
                        <div className="text-text-secondary text-sm font-mono">{liveQuote.updatedAt}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-text-muted text-xs">Котировка MOEX подгружается…</div>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-2 bg-warn/10 border border-warn/30 rounded-lg p-3 text-warn text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <div>
                  Для этого сектора на MOEX нет отдельного индекса.
                  Расчёт ведётся вручную по публичным компаниям, входящим в выборку.
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-3 border border-border-subtle rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">Первоисточник данных</div>
                <a
                  href={m.primarySourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm font-medium hover:text-accent-hover flex items-center gap-1"
                >
                  {m.primarySource} <ExternalLink size={11} />
                </a>
              </div>
              <div className="bg-surface-3 border border-border-subtle rounded-lg p-3">
                <div className="text-text-muted text-xs mb-1">Актуально на</div>
                <div className="text-text-primary text-sm font-mono">{new Date(m.asOfDate).toLocaleDateString('ru-RU')}</div>
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
              <div className="text-text-muted text-xs mb-1">Комментарий аналитика</div>
              <div className="text-text-secondary text-sm">{m.notes}</div>
            </div>
          </>
        )}

        {tab === 'formulas' && (
          <div className="space-y-3">
            {Object.values(formulas).map(f => (
              <div key={f.name} className="bg-surface-3 border border-border-subtle rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-text-primary font-semibold text-sm">{f.name}</span>
                </div>
                <div className="text-text-secondary font-mono text-xs bg-surface-0 px-3 py-2 rounded mb-2">
                  {f.formula}
                </div>
                <div className="text-text-muted text-xs leading-relaxed">{f.note}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'companies' && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-3 border border-border-subtle rounded-lg p-3 text-center">
                <div className="text-text-muted text-xs">В выборке</div>
                <div className="text-text-primary text-xl font-semibold mt-1">{m.sampleSize}</div>
              </div>
              <div className="bg-surface-3 border border-border-subtle rounded-lg p-3 text-center">
                <div className="text-text-muted text-xs">Всего в секторе</div>
                <div className="text-text-primary text-xl font-semibold mt-1">{m.totalUniverse}</div>
              </div>
              <div className="bg-surface-3 border border-border-subtle rounded-lg p-3 text-center">
                <div className="text-text-muted text-xs">Покрытие</div>
                <div className="text-text-primary text-xl font-semibold mt-1">
                  {Math.round((m.sampleSize / m.totalUniverse) * 100)}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-text-secondary text-xs mb-2 font-medium">Топ-компании в выборке</div>
              <div className="flex flex-wrap gap-1.5">
                {m.topConstituents.map(c => (
                  <Link
                    key={c}
                    to={getCompanyHref(c)}
                    className="text-xs px-2 py-1 bg-surface-3 border border-border-subtle rounded-md text-text-secondary hover:text-accent hover:border-accent/40 transition-colors"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            {m.excluded.length > 0 && (
              <div>
                <div className="text-text-secondary text-xs mb-2 font-medium">Исключения из расчёта</div>
                <ul className="space-y-1">
                  {m.excluded.map(e => (
                    <li key={e} className="text-text-muted text-xs flex items-start gap-1.5">
                      <span className="text-warn mt-0.5">·</span> {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
