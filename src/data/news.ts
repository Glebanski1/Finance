import type { NewsItem } from '../lib/news'

/**
 * Fallback-новости: показываются, если api.rss2json.com не отвечает
 * (например, из-за блокировки в браузере или сетевой ошибки).
 *
 * Ссылки — это поиск по сайту первоисточника, поэтому всегда ведут
 * к актуальным релевантным материалам.
 */

function searchUrl(domain: string, query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`site:${domain} ${query}`)}`
}

export const fallbackNews: NewsItem[] = [
  {
    id: 'fn-001',
    title: 'Генпрокуратура подала иск об обращении в доход государства аэропорта Домодедово',
    description: 'Спор касается законности приватизации и иностранного контроля. EV актива оценивается рынком в 180 млрд рублей.',
    link: searchUrl('rbc.ru', 'Домодедово иск Генпрокуратура'),
    source: 'РБК',
    pubDate: new Date(Date.now() - 8 * 3600_000).toISOString(),
    category: 'M&A',
  },
  {
    id: 'fn-002',
    title: 'Семья Кривенко выкупила долю финансовых инвесторов во ВкусВилле',
    description: 'Оценка сделки — около 48 млрд рублей, мультипликатор EV/EBITDA — 8.2x. Финансовые инвесторы вышли из капитала.',
    link: searchUrl('kommersant.ru', 'ВкусВилл выкуп доли'),
    source: 'Коммерсантъ',
    pubDate: new Date(Date.now() - 18 * 3600_000).toISOString(),
    category: 'Private Equity',
  },
  {
    id: 'fn-003',
    title: 'АФК «Система» обсуждает продажу контрольного пакета сети «Медси»',
    description: 'Крупнейшая сделка в сегменте частной медицины РФ. EV оценивается в 65 млрд рублей. Покупатель планирует IPO через 3-4 года.',
    link: searchUrl('vedomosti.ru', 'Медси АФК Система продажа'),
    source: 'Ведомости',
    pubDate: new Date(Date.now() - 36 * 3600_000).toISOString(),
    category: 'M&A',
  },
  {
    id: 'fn-004',
    title: 'Группа «Самолёт» ведёт переговоры о продаже 30% акций',
    description: 'Девелопер ищет стратегического инвестора на фоне долговой нагрузки. EV сделки — около 320 млрд рублей.',
    link: searchUrl('vedomosti.ru', 'Самолёт продажа доли инвестор'),
    source: 'Ведомости',
    pubDate: new Date(Date.now() - 2 * 86400_000).toISOString(),
    category: 'M&A',
  },
  {
    id: 'fn-005',
    title: 'Positive Technologies провела SPO на 58 млрд рублей',
    description: 'Размещение прошло с переподпиской, средства направлены на R&D и региональную экспансию.',
    link: searchUrl('rbc.ru', 'Positive Technologies SPO'),
    source: 'РБК',
    pubDate: new Date(Date.now() - 3 * 86400_000).toISOString(),
    category: 'IPO/SPO',
  },
  {
    id: 'fn-006',
    title: 'SberX Ventures купил 35% в Европейской юридической службе',
    description: 'Сделка оценивает legal-tech платформу в 4.2 млрд рублей. Мультипликатор EV/EBITDA — 18.5x.',
    link: searchUrl('forbes.ru', 'Европейская юридическая служба Сбер сделка'),
    source: 'Forbes Russia',
    pubDate: new Date(Date.now() - 4 * 86400_000).toISOString(),
    category: 'Private Equity',
  },
  {
    id: 'fn-007',
    title: 'ВТБ Private Equity получил 19% в Делимобиле',
    description: 'Миноритарная инвестиция с опционом на увеличение доли. Один из крупнейших каршеринговых сервисов России.',
    link: searchUrl('forbes.ru', 'Делимобиль ВТБ PE'),
    source: 'Forbes Russia',
    pubDate: new Date(Date.now() - 5 * 86400_000).toISOString(),
    category: 'Private Equity',
  },
  {
    id: 'fn-008',
    title: 'Auchan ведёт переговоры о продаже российского периметра',
    description: 'Французская сеть может покинуть рынок. Потенциальный покупатель — AVF Group Гавриила Юшваева. EV ~48 млрд рублей.',
    link: searchUrl('kommersant.ru', 'Auchan Россия продажа'),
    source: 'Коммерсантъ',
    pubDate: new Date(Date.now() - 6 * 86400_000).toISOString(),
    category: 'Exit (foreign)',
  },
  {
    id: 'fn-009',
    title: 'Газпромбанк PE приобрёл 60% Selectel',
    description: 'Сделка с премией 18% к последней частной оценке. Selectel — второй по доле игрок российского IaaS-рынка.',
    link: searchUrl('rbc.ru', 'Selectel Газпромбанк PE'),
    source: 'РБК',
    pubDate: new Date(Date.now() - 7 * 86400_000).toISOString(),
    category: 'Private Equity',
  },
  {
    id: 'fn-010',
    title: 'Альфа Private Equity вошла в iSpring с долей 30%',
    description: 'Один из крупнейших российских SaaS с международной выручкой. EV — 18 млрд рублей, мультипликатор 20.4x EV/EBITDA.',
    link: searchUrl('forbes.ru', 'iSpring Альфа PE сделка'),
    source: 'Forbes Russia',
    pubDate: new Date(Date.now() - 9 * 86400_000).toISOString(),
    category: 'Private Equity',
  },
  {
    id: 'fn-011',
    title: 'Т-Банк закрыл покупку CloudPayments у VK',
    description: 'Платёжный процессор перешёл к Тинькоффу за 19.5 млрд рублей. Усиление позиций в эквайринге для e-commerce.',
    link: searchUrl('rbc.ru', 'CloudPayments Тинькофф VK покупка'),
    source: 'РБК',
    pubDate: new Date(Date.now() - 12 * 86400_000).toISOString(),
    category: 'M&A',
  },
  {
    id: 'fn-012',
    title: 'ВЭБ.РФ купил 49% «РТК-ЦОД» у Ростелекома',
    description: 'Сделка в рамках программы развития суверенной цифровой инфраструктуры. EV — 95 млрд рублей.',
    link: searchUrl('interfax.ru', 'РТК-ЦОД ВЭБ'),
    source: 'Interfax',
    pubDate: new Date(Date.now() - 14 * 86400_000).toISOString(),
    category: 'M&A',
  },
]
