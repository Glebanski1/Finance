/**
 * Клиент MOEX ISS API — публичный, без авторизации, поддерживает CORS.
 * Документация: https://iss.moex.com/iss/reference/
 *
 * Используем секторные индексы Мосбиржи как прокси для рыночных оценок
 * по секторам. Индексы пересчитываются в режиме реального времени
 * во время торговой сессии (10:00–18:50 МСК).
 */

export interface MoexIndexQuote {
  ticker: string
  name: string
  last: number | null
  changePct: number | null
  updatedAt: string | null
}

export const MOEX_SECTOR_INDICES: Record<string, { ticker: string; name: string }> = {
  'oil-gas':     { ticker: 'MOEXOG', name: 'MOEX Нефть и газ' },
  'metals':      { ticker: 'MOEXMM', name: 'MOEX Металлы и добыча' },
  'financials':  { ticker: 'MOEXFN', name: 'MOEX Финансы' },
  'retail':      { ticker: 'MOEXCN', name: 'MOEX Потребительский сектор' },
  'telecom':     { ticker: 'MOEXTL', name: 'MOEX Телекоммуникации' },
  'it':          { ticker: 'MOEXIT', name: 'MOEX Информационные технологии' },
  'realestate':  { ticker: 'MOEXRE', name: 'MOEX Строительные компании' },
  'transport':   { ticker: 'MOEXTN', name: 'MOEX Транспорт' },
  'utilities':   { ticker: 'MOEXEU', name: 'MOEX Электроэнергетика' },
  'chemicals':   { ticker: 'MOEXCH', name: 'MOEX Химия и нефтехимия' },
}

export const MOEX_BENCHMARKS = {
  IMOEX: { ticker: 'IMOEX', name: 'Индекс МосБиржи' },
  RTSI:  { ticker: 'RTSI',  name: 'Индекс РТС' },
}

const ISS_BASE = 'https://iss.moex.com/iss'

interface MoexResponse {
  securities?: { columns: string[]; data: (string | number | null)[][] }
  marketdata?: { columns: string[]; data: (string | number | null)[][] }
}

function mapRow(columns: string[], row: (string | number | null)[]): Record<string, string | number | null> {
  const obj: Record<string, string | number | null> = {}
  columns.forEach((c, i) => { obj[c] = row[i] })
  return obj
}

/**
 * Получает котировки всех секторных индексов MOEX одним запросом.
 * Возвращает Map ticker → quote.
 */
export async function fetchSectorIndices(): Promise<Map<string, MoexIndexQuote>> {
  const url = `${ISS_BASE}/engines/stock/markets/index/boards/SNDX/securities.json?iss.meta=off&securities.columns=SECID,SHORTNAME&marketdata.columns=SECID,LASTVALUE,LASTCHANGEPRC,UPDATETIME`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`MOEX ISS ${res.status}`)
  const json = (await res.json()) as MoexResponse

  const result = new Map<string, MoexIndexQuote>()
  if (!json.securities || !json.marketdata) return result

  const secByTicker = new Map<string, Record<string, string | number | null>>()
  json.securities.data.forEach(row => {
    const m = mapRow(json.securities!.columns, row)
    if (m.SECID) secByTicker.set(String(m.SECID), m)
  })

  json.marketdata.data.forEach(row => {
    const m = mapRow(json.marketdata!.columns, row)
    const ticker = String(m.SECID ?? '')
    if (!ticker) return
    const sec = secByTicker.get(ticker)
    result.set(ticker, {
      ticker,
      name: sec ? String(sec.SHORTNAME ?? ticker) : ticker,
      last: m.LASTVALUE !== null && m.LASTVALUE !== undefined ? Number(m.LASTVALUE) : null,
      changePct: m.LASTCHANGEPRC !== null && m.LASTCHANGEPRC !== undefined ? Number(m.LASTCHANGEPRC) : null,
      updatedAt: m.UPDATETIME ? String(m.UPDATETIME) : null,
    })
  })

  return result
}

/**
 * Получает котировку индекса МосБиржи (IMOEX) — главный индикатор рынка.
 */
export async function fetchBenchmark(ticker: string): Promise<MoexIndexQuote | null> {
  const url = `${ISS_BASE}/engines/stock/markets/index/securities/${ticker}.json?iss.meta=off&iss.only=marketdata&marketdata.columns=SECID,LASTVALUE,LASTCHANGEPRC,UPDATETIME`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`MOEX ISS ${res.status}`)
  const json = (await res.json()) as MoexResponse
  const row = json.marketdata?.data?.[0]
  if (!row) return null
  const m = mapRow(json.marketdata!.columns, row)
  return {
    ticker,
    name: ticker,
    last: m.LASTVALUE !== null && m.LASTVALUE !== undefined ? Number(m.LASTVALUE) : null,
    changePct: m.LASTCHANGEPRC !== null && m.LASTCHANGEPRC !== undefined ? Number(m.LASTCHANGEPRC) : null,
    updatedAt: m.UPDATETIME ? String(m.UPDATETIME) : null,
  }
}

/**
 * Возвращает true если сейчас идёт торговая сессия MOEX (10:00–18:50 МСК, Пн–Пт).
 */
export function isMoexTradingNow(): boolean {
  const now = new Date()
  const mskOffsetMin = 3 * 60
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000
  const msk = new Date(utc + mskOffsetMin * 60_000)
  const day = msk.getDay()
  if (day === 0 || day === 6) return false
  const minutes = msk.getHours() * 60 + msk.getMinutes()
  return minutes >= 10 * 60 && minutes <= 18 * 60 + 50
}
