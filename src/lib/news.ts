/**
 * Клиент RSS-агрегатора. Использует публичный прокси api.rss2json.com,
 * который превращает RSS-фид в JSON (нужно из-за CORS на ленте источников).
 *
 * Если запрос не проходит — компонент покажет fallback из src/data/news.ts.
 */

export interface NewsItem {
  id: string
  title: string
  description: string
  link: string
  source: string
  pubDate: string
  category?: string
}

const PROXY = 'https://api.rss2json.com/v1/api.json'

export interface RssSource {
  id: string
  source: string
  rssUrl: string
}

export const RSS_SOURCES: RssSource[] = [
  { id: 'rbc-business', source: 'РБК Бизнес',     rssUrl: 'https://rssexport.rbc.ru/rbcnews/news/30/full.rss' },
  { id: 'forbes',       source: 'Forbes Russia',  rssUrl: 'https://www.forbes.ru/newrss.xml' },
  { id: 'smartlab',     source: 'Smart-Lab',      rssUrl: 'https://smart-lab.ru/rss/' },
  { id: 'finam',        source: 'Финам',          rssUrl: 'https://www.finam.ru/analysis/conews/rsspoint/' },
]

interface Rss2JsonResponse {
  status: string
  feed?: { title?: string }
  items?: Array<{
    title: string
    pubDate: string
    link: string
    guid?: string
    description?: string
    categories?: string[]
  }>
}

const MA_KEYWORDS = [
  'm&a', 'm\\u0026a', 'сделк', 'купи', 'покуп', 'продаж', 'выкуп',
  'приобр', 'фонд', 'инвестиц', 'IPO', 'SPO', 'private equity',
  'private', 'мажор', 'миноритар', 'оферт', 'консолидац', 'допэмисси',
  'слияние', 'поглощ', 'байаут', 'buyout',
]

function looksLikeMA(text: string): boolean {
  const lower = text.toLowerCase()
  return MA_KEYWORDS.some(k => lower.includes(k))
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

export async function fetchNewsFromSource(src: RssSource): Promise<NewsItem[]> {
  const url = `${PROXY}?rss_url=${encodeURIComponent(src.rssUrl)}&count=30`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`RSS proxy ${res.status}`)
  const json = (await res.json()) as Rss2JsonResponse
  if (json.status !== 'ok' || !json.items) return []

  return json.items.map((item, idx) => ({
    id: item.guid ?? `${src.id}-${idx}-${item.pubDate}`,
    title: stripHtml(item.title),
    description: stripHtml(item.description ?? '').slice(0, 300),
    link: item.link,
    source: src.source,
    pubDate: item.pubDate,
    category: item.categories?.[0],
  }))
}

export async function fetchAllNews(filterMA = true): Promise<NewsItem[]> {
  const results = await Promise.allSettled(RSS_SOURCES.map(fetchNewsFromSource))
  const items: NewsItem[] = []
  results.forEach(r => { if (r.status === 'fulfilled') items.push(...r.value) })

  let filtered = items
  if (filterMA) {
    filtered = items.filter(i => looksLikeMA(`${i.title} ${i.description}`))
  }

  filtered.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  return filtered
}
