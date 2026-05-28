/**
 * MOEX ISS API — котировки и история цен по отдельным акциям.
 * Документация: https://iss.moex.com/iss/reference/
 */

const ISS_BASE = 'https://iss.moex.com/iss'

export interface ShareQuote {
  ticker: string
  shortName: string
  last: number | null
  changePct: number | null
  open: number | null
  high: number | null
  low: number | null
  volume: number | null
  marketCapRub: number | null
  updatedAt: string | null
}

export interface Candle {
  date: string
  open: number
  close: number
  high: number
  low: number
  volume: number
}

interface MoexResponse {
  securities?: { columns: string[]; data: (string | number | null)[][] }
  marketdata?: { columns: string[]; data: (string | number | null)[][] }
  candles?: { columns: string[]; data: (string | number | null)[][] }
}

function mapRow(columns: string[], row: (string | number | null)[]): Record<string, string | number | null> {
  const obj: Record<string, string | number | null> = {}
  columns.forEach((c, i) => { obj[c] = row[i] })
  return obj
}

function num(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return isNaN(n) ? null : n
}

/**
 * Получает текущую котировку акции с основной торговой доски TQBR.
 */
export async function fetchShareQuote(ticker: string): Promise<ShareQuote | null> {
  const url = `${ISS_BASE}/engines/stock/markets/shares/boards/TQBR/securities/${ticker}.json?iss.meta=off`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`MOEX ISS ${res.status}`)
  const json = (await res.json()) as MoexResponse

  const secRow = json.securities?.data?.[0]
  const mdRow = json.marketdata?.data?.[0]
  if (!secRow && !mdRow) return null

  const sec = secRow ? mapRow(json.securities!.columns, secRow) : {}
  const md = mdRow ? mapRow(json.marketdata!.columns, mdRow) : {}

  return {
    ticker,
    shortName: sec.SHORTNAME ? String(sec.SHORTNAME) : ticker,
    last: num(md.LAST),
    changePct: num(md.LASTTOPREVPRICE),
    open: num(md.OPEN),
    high: num(md.HIGH),
    low: num(md.LOW),
    volume: num(md.VOLTODAY),
    marketCapRub: num(md.ISSUECAPITALIZATION),
    updatedAt: md.UPDATETIME ? String(md.UPDATETIME) : null,
  }
}

/**
 * Получает дневные свечи за заданный период.
 */
export async function fetchShareCandles(ticker: string, daysBack = 180): Promise<Candle[]> {
  const till = new Date()
  const from = new Date(till.getTime() - daysBack * 86400_000)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  const url = `${ISS_BASE}/engines/stock/markets/shares/securities/${ticker}/candles.json?from=${fmt(from)}&till=${fmt(till)}&interval=24&iss.meta=off`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`MOEX ISS ${res.status}`)
  const json = (await res.json()) as MoexResponse

  if (!json.candles) return []
  const cols = json.candles.columns
  return json.candles.data.map(row => {
    const m = mapRow(cols, row)
    return {
      date: String(m.begin ?? '').slice(0, 10),
      open: num(m.open) ?? 0,
      close: num(m.close) ?? 0,
      high: num(m.high) ?? 0,
      low: num(m.low) ?? 0,
      volume: num(m.volume) ?? 0,
    }
  })
}
