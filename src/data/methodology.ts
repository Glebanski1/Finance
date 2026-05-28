/**
 * Методология расчёта мультипликаторов по секторам.
 *
 * EV/EBITDA — Enterprise Value / EBITDA за последние 12 мес. (LTM).
 *   EV = Рыночная капитализация + Чистый долг + Доля меньшинства
 *   Источник EBITDA: консолидированная отчётность МСФО за LTM
 *
 * P/E — Цена / Прибыль на акцию (LTM). Для финсектора используется
 *   как основной мультипликатор вместо EV/EBITDA.
 *
 * EV/Revenue — Enterprise Value / Выручка LTM.
 *
 * P/B — Цена / Балансовая стоимость собственного капитала.
 *
 * Расчёт по сектору — медиана (не среднее), чтобы убрать влияние
 * экстремумов. Включаются только компании с положительной EBITDA
 * (для EV/EBITDA) и прибылью (для P/E).
 */

export interface SectorMethodology {
  sectorId: string
  moexTicker: string | null
  description: string
  topConstituents: string[]
  sampleSize: number
  totalUniverse: number
  excluded: string[]
  primarySource: string
  primarySourceUrl: string
  asOfDate: string
  notes: string
}

export const methodology: Record<string, SectorMethodology> = {
  'oil-gas': {
    sectorId: 'oil-gas',
    moexTicker: 'MOEXOG',
    description: 'Включает добычу, переработку и продажу углеводородов. Расчёт мультипликаторов на основе LTM EBITDA с поправкой на нефтяной цикл (сглаживание ±2 квартала).',
    topConstituents: ['Роснефть', 'Газпром', 'ЛУКОЙЛ', 'НОВАТЭК', 'Татнефть', 'Сургутнефтегаз', 'Газпром нефть', 'Транснефть'],
    sampleSize: 12,
    totalUniverse: 14,
    excluded: ['Башнефть преф (низкая ликвидность)', 'РуссНефть (нерепрезентативна)'],
    primarySource: 'MOEX + отчётность МСФО эмитентов',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXOG',
    asOfDate: '2025-05-15',
    notes: 'Дисконт сектора к глобальным аналогам — 35–45%, что отражает санкционные ограничения, валютный риск и неопределённость нефтяных цен.',
  },
  'metals': {
    sectorId: 'metals',
    moexTicker: 'MOEXMM',
    description: 'Чёрная и цветная металлургия, золотодобыча, удобрения исключены (отнесены к химии).',
    topConstituents: ['Норникель', 'Северсталь', 'НЛМК', 'ММК', 'ПОЛЮС', 'РУСАЛ', 'АЛРОСА', 'Мечел'],
    sampleSize: 14,
    totalUniverse: 18,
    excluded: ['Распадская (вошла в EVRAZ)', 'Petropavlovsk (делистинг)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXMM',
    asOfDate: '2025-05-15',
    notes: 'Высокая чувствительность к мировым ценам на сырьё. Норникель и Полюс — крупнейшие веса в выборке.',
  },
  'financials': {
    sectorId: 'financials',
    moexTicker: 'MOEXFN',
    description: 'Банки, страховые компании, инвестиционные холдинги. Для банков используется P/E и P/B (EBITDA нерелевантна).',
    topConstituents: ['Сбербанк', 'ВТБ', 'Тинькофф (ТКС Холдинг)', 'Совкомбанк', 'МКБ', 'БСПБ', 'Ренессанс Страхование'],
    sampleSize: 18,
    totalUniverse: 22,
    excluded: ['Открытие (нет публичной отчётности)', 'РСХБ (непубличный)'],
    primarySource: 'MOEX + отчётность МСФО банков',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXFN',
    asOfDate: '2025-05-15',
    notes: 'Для оценки банков EV/EBITDA не применяется. Сбер торгуется с P/B = 1.1x, остальные — преимущественно ниже капитала.',
  },
  'retail': {
    sectorId: 'retail',
    moexTicker: 'MOEXCN',
    description: 'Продуктовый и непродуктовый ритейл. Также включает e-commerce.',
    topConstituents: ['X5 Group', 'Магнит', 'Лента', 'OZON', 'Henderson', 'Fix Price', 'ВкусВилл (непубл.)'],
    sampleSize: 7,
    totalUniverse: 8,
    excluded: ['ВкусВилл (оценка по сделкам PE)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXCN',
    asOfDate: '2025-05-15',
    notes: 'EV/EBITDA выше нефтегаза из-за устойчивого роста выручки и низкой капитальной интенсивности.',
  },
  'telecom': {
    sectorId: 'telecom',
    moexTicker: 'MOEXTL',
    description: 'Операторы связи и дата-центры.',
    topConstituents: ['МТС', 'Ростелеком', 'МегаФон (выведен с биржи)', 'ВымпелКом (непубл.)'],
    sampleSize: 4,
    totalUniverse: 6,
    excluded: ['МегаФон (делистинг 2024)', 'ВымпелКом (нет МСФО для рынка)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXTL',
    asOfDate: '2025-05-15',
    notes: 'Зрелый сектор с высокими дивидендами. Драйвер роста — дата-центры и облачные сервисы.',
  },
  'it': {
    sectorId: 'it',
    moexTicker: 'MOEXIT',
    description: 'Российские публичные IT-компании. Сектор сформирован после 2022 года, бурно растёт.',
    topConstituents: ['Yandex (МКПАО)', 'VK', 'Ozon (двойной листинг)', 'Positive Technologies', 'Группа Астра', 'Диасофт', 'IVA Technologies', 'Группа Аренадата', 'Софтлайн (Сонет)', 'Headhunter'],
    sampleSize: 12,
    totalUniverse: 19,
    excluded: ['Часть pre-IPO компаний без МСФО (включены только в сделки)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXIT',
    asOfDate: '2025-05-15',
    notes: 'Самый высокий мультипликатор на рынке. Премия за рост: средний CAGR выручки сектора 30–40%.',
  },
  'realestate': {
    sectorId: 'realestate',
    moexTicker: 'MOEXRE',
    description: 'Девелоперы жилой и коммерческой недвижимости.',
    topConstituents: ['ПИК', 'Группа Самолёт', 'Etalon', 'ЛСР', 'АПРИ Флай', 'Инград'],
    sampleSize: 8,
    totalUniverse: 12,
    excluded: ['Закрытые девелоперы (нет МСФО)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXRE',
    asOfDate: '2025-05-15',
    notes: 'Высокий мультипликатор отражает ожидания смягчения ДКП и снижения ипотечных ставок.',
  },
  'agro': {
    sectorId: 'agro',
    moexTicker: null,
    description: 'АПК и пищевая промышленность. На MOEX нет отдельного индекса — выборка собрана вручную.',
    topConstituents: ['Черкизово', 'РусАгро (МКПАО)', 'Инарктика (АкваКультура)', 'АГК Степь', 'Мираторг (непубл.)', 'ЭкоНива (непубл.)'],
    sampleSize: 10,
    totalUniverse: 16,
    excluded: ['Мираторг, ЭкоНива (оценка по PE-сделкам)', 'Региональные агрохолдинги'],
    primarySource: 'Отчётность МСФО + АКРА Sector Report',
    primarySourceUrl: 'https://www.acra-ratings.ru/',
    asOfDate: '2025-05-15',
    notes: 'Отдельного индекса MOEX по АПК нет. Сектор оценивается через медиану публичных компаний + сделки PE.',
  },
  'transport': {
    sectorId: 'transport',
    moexTicker: 'MOEXTN',
    description: 'Грузовые и пассажирские перевозки, логистика, авиация, каршеринг.',
    topConstituents: ['Аэрофлот', 'НМТП', 'ДВМП (FESCO)', 'Globaltrans', 'Совкомфлот', 'Делимобиль', 'Whoosh'],
    sampleSize: 9,
    totalUniverse: 11,
    excluded: ['РЖД (госмонополия, оценка нерепрезентативна)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXTN',
    asOfDate: '2025-05-15',
    notes: 'Большой разброс по подсегментам: каршеринг торгуется выше 8x, морские перевозки около 4x.',
  },
  'utilities': {
    sectorId: 'utilities',
    moexTicker: 'MOEXEU',
    description: 'Производство и сбыт электроэнергии, генерация, сетевые компании.',
    topConstituents: ['Интер РАО', 'РусГидро', 'Россети', 'Юнипро', 'Энел Россия', 'ОГК-2', 'Мосэнерго'],
    sampleSize: 18,
    totalUniverse: 24,
    excluded: ['Часть региональных сбытов (низкая ликвидность)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXEU',
    asOfDate: '2025-05-15',
    notes: 'Самый низкий P/B на рынке (~0.6x). Регулируемые тарифы ограничивают рост EBITDA.',
  },
  'chemicals': {
    sectorId: 'chemicals',
    moexTicker: 'MOEXCH',
    description: 'Химия, нефтехимия и производство удобрений.',
    topConstituents: ['ФосАгро', 'АкронГрупп', 'Куйбышевазот', 'Нижнекамскнефтехим', 'Казаньоргсинтез', 'СИБУР (непубл.)'],
    sampleSize: 7,
    totalUniverse: 9,
    excluded: ['СИБУР (непубличная компания)'],
    primarySource: 'MOEX + отчётность МСФО',
    primarySourceUrl: 'https://www.moex.com/ru/index/MOEXCH',
    asOfDate: '2025-05-15',
    notes: 'Без учёта непубличного СИБУРа — крупнейшего игрока сектора. ФосАгро и Акрон — основной вес.',
  },
  'healthcare': {
    sectorId: 'healthcare',
    moexTicker: null,
    description: 'Частная медицина, фармацевтика и биотех. Отдельного индекса MOEX нет.',
    topConstituents: ['Мать и Дитя (MD Medical)', 'Озон Фармацевтика', 'ПРОМОМЕД', 'Артген (биотех)', 'Медси (АФК Система)', 'ЕМС', 'Инвитро (непубл.)'],
    sampleSize: 8,
    totalUniverse: 14,
    excluded: ['Инвитро, Гемотест и др. непубличные сети'],
    primarySource: 'Отчётность МСФО + DSM Group Sector Report',
    primarySourceUrl: 'https://dsm.ru/',
    asOfDate: '2025-05-15',
    notes: 'Премиальный сектор — премия за защитный характер выручки и валютный хедж (медтуризм).',
  },
}

/**
 * Формула расчёта каждого мультипликатора.
 */
export const formulas: Record<string, { name: string; formula: string; note: string }> = {
  evEbitda: {
    name: 'EV / EBITDA',
    formula: '(Market Cap + Net Debt + Minority Interest) ÷ EBITDA LTM',
    note: 'Капитал-нейтральная метрика. Сравнима между компаниями с разной структурой долга. Стандарт для PE-оценок.',
  },
  pe: {
    name: 'P / E',
    formula: 'Share Price × Shares Outstanding ÷ Net Income LTM',
    note: 'Чувствителен к структуре капитала и налогам. Для банков и страховщиков — основной мультипликатор.',
  },
  evRevenue: {
    name: 'EV / Revenue',
    formula: '(Market Cap + Net Debt) ÷ Revenue LTM',
    note: 'Применяется для убыточных компаний или сильно растущих бизнесов (SaaS, e-commerce).',
  },
  pb: {
    name: 'P / B',
    formula: 'Market Cap ÷ Book Value of Equity',
    note: 'Основная метрика для финансового сектора. Показывает, сколько рынок платит за рубль капитала.',
  },
}
