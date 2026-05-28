/**
 * Справочник публичных и крупных непубличных компаний российского рынка.
 *
 * Используется для:
 * — построения страницы профиля компании (/company/:id)
 * — матчинга сделок и новостей по алиасам
 * — отображения live-котировок с MOEX для публичных эмитентов
 */

export interface Company {
  id: string
  name: string
  fullName: string
  aliases: string[]
  sectorId: string
  sector: string
  moexTicker: string | null
  isPublic: boolean
  founded?: number
  hq?: string
  website?: string
  description: string
  privateValuation?: {
    evMn: number
    asOfDate: string
    source: string
    sourceUrl: string
  }
}

export const companies: Company[] = [
  // ─── Финансы ─────────────────────────────────────────────────────
  {
    id: 'sber',
    name: 'Сбербанк',
    fullName: 'ПАО «Сбербанк России»',
    aliases: ['Сбер', 'Sberbank', 'SBER', 'Сбербанка'],
    sectorId: 'financials',
    sector: 'Финансовый сектор',
    moexTicker: 'SBER',
    isPublic: true,
    founded: 1841,
    hq: 'Москва',
    website: 'https://www.sberbank.ru',
    description: 'Крупнейший банк России и Восточной Европы. Активы >50 трлн руб. Контролирующий акционер — Минфин РФ (50%+1 акция). Развивает экосистему: маркетплейсы, медиа, финтех.',
  },
  {
    id: 'vtb',
    name: 'ВТБ',
    fullName: 'ПАО «Банк ВТБ»',
    aliases: ['VTB', 'VTBR', 'ВТБ Банк'],
    sectorId: 'financials',
    sector: 'Финансовый сектор',
    moexTicker: 'VTBR',
    isPublic: true,
    founded: 1990,
    hq: 'Санкт-Петербург',
    website: 'https://www.vtb.ru',
    description: 'Второй крупнейший банк России, контролируемый государством. Универсальный финансовый бизнес: банкинг, инвестбанк, страхование, лизинг.',
  },
  {
    id: 'tcs',
    name: 'Т-Технологии (ТКС Холдинг)',
    fullName: 'МКПАО «ТКС Холдинг»',
    aliases: ['Тинькофф', 'TCS', 'TCSG', 'T-Bank', 'Т-Банк', 'ТКС'],
    sectorId: 'financials',
    sector: 'Финансовый сектор',
    moexTicker: 'T',
    isPublic: true,
    founded: 2006,
    hq: 'Москва',
    website: 'https://www.tbank.ru',
    description: 'Цифровой банк № 2 по числу активных клиентов. В 2024 г. объединился с Росбанком. Развивает экосистему мобильных финансовых сервисов.',
  },
  {
    id: 'sovcombank',
    name: 'Совкомбанк',
    fullName: 'ПАО «Совкомбанк»',
    aliases: ['SVCB'],
    sectorId: 'financials',
    sector: 'Финансовый сектор',
    moexTicker: 'SVCB',
    isPublic: true,
    founded: 1990,
    hq: 'Кострома',
    description: 'Универсальный банк с фокусом на розницу. IPO в декабре 2023 г. Контроль у братьев Хотимских.',
  },
  {
    id: 'afk-sistema',
    name: 'АФК «Система»',
    fullName: 'ПАО АФК «Система»',
    aliases: ['Система', 'AFKS', 'Sistema'],
    sectorId: 'financials',
    sector: 'Финансовый сектор',
    moexTicker: 'AFKS',
    isPublic: true,
    founded: 1993,
    hq: 'Москва',
    website: 'https://sistema.ru',
    description: 'Крупнейшая частная инвестиционная компания РФ. Портфель: МТС, Эталон, Сегежа, Медси, Степь, OZON, Биннофарм. Контролирующий акционер — Владимир Евтушенков.',
  },

  // ─── Нефть и газ ─────────────────────────────────────────────────
  {
    id: 'gazprom',
    name: 'Газпром',
    fullName: 'ПАО «Газпром»',
    aliases: ['Gazprom', 'GAZP'],
    sectorId: 'oil-gas',
    sector: 'Нефть и газ',
    moexTicker: 'GAZP',
    isPublic: true,
    founded: 1989,
    hq: 'Санкт-Петербург',
    website: 'https://www.gazprom.ru',
    description: 'Глобальная энергетическая компания, крупнейший в мире производитель природного газа. Доли в Сахалин-2, Газпром нефти, Мосэнерго.',
  },
  {
    id: 'rosneft',
    name: 'Роснефть',
    fullName: 'ПАО НК «Роснефть»',
    aliases: ['Rosneft', 'ROSN'],
    sectorId: 'oil-gas',
    sector: 'Нефть и газ',
    moexTicker: 'ROSN',
    isPublic: true,
    founded: 1993,
    hq: 'Москва',
    description: 'Лидер нефтяной отрасли РФ, крупнейший публичный налогоплательщик. CEO — Игорь Сечин.',
  },
  {
    id: 'lukoil',
    name: 'ЛУКОЙЛ',
    fullName: 'ПАО «ЛУКОЙЛ»',
    aliases: ['Lukoil', 'LKOH', 'Лукойл'],
    sectorId: 'oil-gas',
    sector: 'Нефть и газ',
    moexTicker: 'LKOH',
    isPublic: true,
    founded: 1991,
    hq: 'Москва',
    description: 'Вторая крупнейшая частная нефтяная компания РФ. Вертикально-интегрированная: добыча, переработка, розница. Активно проводит buyback у нерезидентов.',
  },
  {
    id: 'novatek',
    name: 'НОВАТЭК',
    fullName: 'ПАО «НОВАТЭК»',
    aliases: ['Novatek', 'NVTK'],
    sectorId: 'oil-gas',
    sector: 'Нефть и газ',
    moexTicker: 'NVTK',
    isPublic: true,
    founded: 1994,
    hq: 'Москва',
    description: 'Крупнейший независимый производитель газа в России. Контроль у Леонида Михельсона. Ключевой проект — Ямал СПГ.',
  },
  {
    id: 'tatneft',
    name: 'Татнефть',
    fullName: 'ПАО «Татнефть»',
    aliases: ['Tatneft', 'TATN'],
    sectorId: 'oil-gas',
    sector: 'Нефть и газ',
    moexTicker: 'TATN',
    isPublic: true,
    founded: 1950,
    hq: 'Альметьевск',
    description: 'Региональная нефтяная компания, ключевой актив Татарстана. Развивает нефтехимию (ТАНЕКО) и переработку.',
  },

  // ─── Металлургия ─────────────────────────────────────────────────
  {
    id: 'nornickel',
    name: 'Норникель',
    fullName: 'ПАО «ГМК Норильский Никель»',
    aliases: ['Норильский Никель', 'Norilsk', 'GMKN'],
    sectorId: 'metals',
    sector: 'Металлургия и горнодобыча',
    moexTicker: 'GMKN',
    isPublic: true,
    founded: 1935,
    hq: 'Москва / Норильск',
    description: 'Крупнейший в мире производитель палладия и высокосортного никеля. Контроль у Владимира Потанина (Интеррос).',
  },
  {
    id: 'severstal',
    name: 'Северсталь',
    fullName: 'ПАО «Северсталь»',
    aliases: ['Severstal', 'CHMF'],
    sectorId: 'metals',
    sector: 'Металлургия и горнодобыча',
    moexTicker: 'CHMF',
    isPublic: true,
    founded: 1955,
    hq: 'Череповец',
    description: 'Один из крупнейших производителей стали в РФ. Контроль у Алексея Мордашова через Севергрупп.',
  },
  {
    id: 'nlmk',
    name: 'НЛМК',
    fullName: 'ПАО «Новолипецкий металлургический комбинат»',
    aliases: ['Novolipetsk', 'NLMK'],
    sectorId: 'metals',
    sector: 'Металлургия и горнодобыча',
    moexTicker: 'NLMK',
    isPublic: true,
    founded: 1934,
    hq: 'Липецк',
    description: 'Производитель стали с активами в РФ, ЕС и США. Контроль у Владимира Лисина.',
  },
  {
    id: 'mmk',
    name: 'ММК',
    fullName: 'ПАО «Магнитогорский металлургический комбинат»',
    aliases: ['Magnitogorsk', 'MAGN', 'Магнитогорск'],
    sectorId: 'metals',
    sector: 'Металлургия и горнодобыча',
    moexTicker: 'MAGN',
    isPublic: true,
    founded: 1932,
    hq: 'Магнитогорск',
    description: 'Один из крупнейших мировых производителей стальной продукции. Контроль у Виктора Рашникова.',
  },
  {
    id: 'polyus',
    name: 'ПОЛЮС',
    fullName: 'ПАО «Полюс»',
    aliases: ['Polyus', 'PLZL'],
    sectorId: 'metals',
    sector: 'Металлургия и горнодобыча',
    moexTicker: 'PLZL',
    isPublic: true,
    founded: 1980,
    hq: 'Москва',
    description: 'Крупнейший золотодобытчик России и один из крупнейших в мире по запасам. Контроль у структур Саида Керимова.',
  },
  {
    id: 'rusal',
    name: 'РУСАЛ',
    fullName: 'МКПАО «ОК РУСАЛ»',
    aliases: ['Rusal', 'RUAL'],
    sectorId: 'metals',
    sector: 'Металлургия и горнодобыча',
    moexTicker: 'RUAL',
    isPublic: true,
    founded: 2000,
    hq: 'Калининград',
    description: 'Один из крупнейших мировых производителей алюминия. Холдинг с активами в РФ, Африке и Латинской Америке. Часть En+ Group.',
  },

  // ─── Ритейл ──────────────────────────────────────────────────────
  {
    id: 'x5',
    name: 'X5 Group (ИКС 5)',
    fullName: 'ПАО «Корпоративный центр ИКС 5»',
    aliases: ['X5', 'Пятёрочка', 'Перекрёсток', 'Чижик', 'X5 Retail Group'],
    sectorId: 'retail',
    sector: 'Розничная торговля',
    moexTicker: 'X5',
    isPublic: true,
    founded: 2006,
    hq: 'Москва',
    description: 'Крупнейший продуктовый ритейлер РФ. Сети «Пятёрочка», «Перекрёсток», «Чижик». В 2024 г. редомицилирована в РФ через закон об ЭЗО.',
  },
  {
    id: 'magnit',
    name: 'Магнит',
    fullName: 'ПАО «Магнит»',
    aliases: ['Magnit', 'MGNT'],
    sectorId: 'retail',
    sector: 'Розничная торговля',
    moexTicker: 'MGNT',
    isPublic: true,
    founded: 1994,
    hq: 'Краснодар',
    description: 'Второй крупнейший ритейлер РФ. Сети «Магнит», «Магнит Косметик», «Дикси». Контроль у Marathon Group + Александр Винокуров.',
  },
  {
    id: 'lenta',
    name: 'Лента',
    fullName: 'ПАО «Лента»',
    aliases: ['Lenta', 'LENT'],
    sectorId: 'retail',
    sector: 'Розничная торговля',
    moexTicker: 'LENT',
    isPublic: true,
    founded: 1993,
    hq: 'Санкт-Петербург',
    description: 'Сеть гипермаркетов и супермаркетов «Лента» + «Монетка» + «Утконос». Контроль у Севергрупп Алексея Мордашова.',
  },
  {
    id: 'ozon',
    name: 'OZON',
    fullName: 'МКПАО «Озон»',
    aliases: ['Ozon', 'Озон'],
    sectorId: 'retail',
    sector: 'Розничная торговля',
    moexTicker: 'OZON',
    isPublic: true,
    founded: 1998,
    hq: 'Москва',
    description: 'Один из крупнейших e-commerce маркетплейсов РФ, GMV >2 трлн руб. Двойной листинг — MOEX + NASDAQ (приостановлен).',
  },
  {
    id: 'fixprice',
    name: 'Fix Price',
    fullName: 'МКПАО «Фикс Прайс»',
    aliases: ['FIXP', 'Fix-Price'],
    sectorId: 'retail',
    sector: 'Розничная торговля',
    moexTicker: 'FIXP',
    isPublic: true,
    founded: 2007,
    hq: 'Москва',
    description: 'Крупнейшая в РФ сеть магазинов фиксированных низких цен. Активная экспансия в страны СНГ.',
  },
  {
    id: 'vkusvill',
    name: 'ВкусВилл',
    fullName: 'ООО «ВкусВилл»',
    aliases: ['Vkusvill', 'VkusVill', 'Избёнка'],
    sectorId: 'retail',
    sector: 'Розничная торговля',
    moexTicker: null,
    isPublic: false,
    founded: 2009,
    hq: 'Москва',
    description: 'Сеть магазинов натуральных продуктов и онлайн-доставка. Основатель — Андрей Кривенко. Готовила IPO в 2021–2022, отменено.',
    privateValuation: {
      evMn: 48000,
      asOfDate: '2025-05-12',
      source: 'Сделка выкупа доли PE',
      sourceUrl: 'https://www.kommersant.ru/search/results?search_query=' + encodeURIComponent('ВкусВилл выкуп доли'),
    },
  },
  {
    id: 'hoff',
    name: 'Hoff',
    fullName: 'ООО «Домашний интерьер»',
    aliases: ['Хофф'],
    sectorId: 'retail',
    sector: 'Розничная торговля',
    moexTicker: null,
    isPublic: false,
    founded: 2009,
    hq: 'Москва',
    description: 'Сеть мебельных гипермаркетов и e-commerce. Готовится к IPO. Привлекла стратегического инвестора в 2024.',
    privateValuation: {
      evMn: 22000,
      asOfDate: '2024-11-28',
      source: 'PE-сделка (миноритарный пакет 20%)',
      sourceUrl: 'https://www.vedomosti.ru/search?query=' + encodeURIComponent('Hoff инвестор IPO'),
    },
  },

  // ─── IT ──────────────────────────────────────────────────────────
  {
    id: 'yandex',
    name: 'Яндекс',
    fullName: 'МКПАО «Яндекс»',
    aliases: ['Yandex', 'YDEX', 'МКПАО Яндекс'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'YDEX',
    isPublic: true,
    founded: 1997,
    hq: 'Москва',
    website: 'https://yandex.ru',
    description: 'Крупнейшая российская IT-компания. Поиск, такси, e-commerce, доставка, медиа, облако. В 2024 г. российский периметр отделён от Yandex N.V.',
  },
  {
    id: 'vk',
    name: 'VK',
    fullName: 'МКПАО «ВК»',
    aliases: ['Mail.ru', 'ВКонтакте', 'VKCO', 'ВК'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'VKCO',
    isPublic: true,
    founded: 1998,
    hq: 'Москва',
    description: 'Социальные сети «ВКонтакте», «Одноклассники», почта Mail.ru, медиа VK Видео, образование. С 2022 контроль у Согаз (Юрий Ковальчук).',
  },
  {
    id: 'positive',
    name: 'Positive Technologies',
    fullName: 'ПАО «Группа Позитив»',
    aliases: ['Positive', 'POSI', 'Позитив'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'POSI',
    isPublic: true,
    founded: 2002,
    hq: 'Москва',
    description: 'Лидер российского рынка кибербезопасности. Первая публичная российская кибербез-компания. Активный M&A в области ИБ.',
  },
  {
    id: 'astra',
    name: 'Группа Астра',
    fullName: 'ПАО «Группа Астра»',
    aliases: ['Astra', 'ASTR', 'Astra Linux'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'ASTR',
    isPublic: true,
    founded: 2008,
    hq: 'Санкт-Петербург',
    description: 'Разработчик защищённой ОС Astra Linux. Лидер импортозамещения системного ПО. IPO 2023 г. с переподпиской 20x.',
  },
  {
    id: 'diasoft',
    name: 'Диасофт',
    fullName: 'ПАО «Диасофт»',
    aliases: ['Diasoft', 'DIAS'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'DIAS',
    isPublic: true,
    founded: 1991,
    hq: 'Москва',
    description: 'Разработчик банковского и финансового ПО. Платформа Diasoft Framework. IPO 2024 с переподпиской 30x.',
  },
  {
    id: 'iva',
    name: 'IVA Technologies',
    fullName: 'ПАО «ИВА»',
    aliases: ['IVA', 'IVAT'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'IVAT',
    isPublic: true,
    founded: 2016,
    hq: 'Москва',
    description: 'Лидер импортозамещения в корпоративных коммуникациях (видеоконференции, корпоративные мессенджеры). IPO 2024.',
  },
  {
    id: 'arenadata',
    name: 'Группа Аренадата',
    fullName: 'ПАО «Группа Аренадата»',
    aliases: ['Arenadata', 'DATA'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'DATA',
    isPublic: true,
    founded: 2016,
    hq: 'Москва',
    description: 'Разработчик СУБД и решений для хранения данных. Импортозамещение Oracle/Teradata. IPO 2024 с переподпиской 12x.',
  },
  {
    id: 'softline-sonet',
    name: 'Софтлайн (Сонет)',
    fullName: 'ПАО «Софтлайн»',
    aliases: ['Softline', 'SOFL', 'Сонет', 'Sonet'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'SOFL',
    isPublic: true,
    founded: 1993,
    hq: 'Москва',
    description: 'Российская часть IT-холдинга Softline после разделения в 2022 году. ИТ-дистрибуция, ИТ-консалтинг, разработка.',
  },
  {
    id: 'headhunter',
    name: 'HeadHunter',
    fullName: 'МКПАО «Хэдхантер»',
    aliases: ['HH', 'HEAD', 'hh.ru'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: 'HEAD',
    isPublic: true,
    founded: 2000,
    hq: 'Москва',
    description: 'Крупнейшая в РФ платформа онлайн-рекрутинга. >2 млн вакансий ежемесячно. Редомицилирована из Кипра в РФ в 2024.',
  },
  {
    id: 'selectel',
    name: 'Selectel',
    fullName: 'ООО «Селектел»',
    aliases: ['Селектел'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: null,
    isPublic: false,
    founded: 2008,
    hq: 'Санкт-Петербург',
    description: 'Один из крупнейших облачных провайдеров РФ (IaaS), доля рынка ~14%. Готовится к IPO в 2025–2026 гг.',
    privateValuation: {
      evMn: 38500,
      asOfDate: '2025-02-27',
      source: 'Сделка выкупа Газпромбанк PE',
      sourceUrl: 'https://www.rbc.ru/search/?query=' + encodeURIComponent('Selectel Газпромбанк'),
    },
  },
  {
    id: 'ispring',
    name: 'iSpring',
    fullName: 'ООО «АйСпринг»',
    aliases: ['АйСпринг'],
    sectorId: 'it',
    sector: 'IT и технологии',
    moexTicker: null,
    isPublic: false,
    founded: 2001,
    hq: 'Йошкар-Ола',
    description: 'Российский SaaS-разработчик e-learning платформы. Клиенты в 180+ странах, >60% выручки — экспорт.',
    privateValuation: {
      evMn: 18000,
      asOfDate: '2025-02-14',
      source: 'PE-сделка Альфа PE',
      sourceUrl: 'https://www.forbes.ru/search?query=' + encodeURIComponent('iSpring Альфа сделка'),
    },
  },

  // ─── Телеком ─────────────────────────────────────────────────────
  {
    id: 'mts',
    name: 'МТС',
    fullName: 'ПАО «МТС»',
    aliases: ['MTS', 'MTSS', 'МТС Банк'],
    sectorId: 'telecom',
    sector: 'Телекоммуникации',
    moexTicker: 'MTSS',
    isPublic: true,
    founded: 1993,
    hq: 'Москва',
    description: 'Крупнейший российский оператор связи. Развивает экосистему: МТС Банк, KION, Strelka, Букмейт, AdTech. Контроль у АФК «Система».',
  },
  {
    id: 'rostelecom',
    name: 'Ростелеком',
    fullName: 'ПАО «Ростелеком»',
    aliases: ['Rostelecom', 'RTKM'],
    sectorId: 'telecom',
    sector: 'Телекоммуникации',
    moexTicker: 'RTKM',
    isPublic: true,
    founded: 1992,
    hq: 'Москва',
    description: 'Крупнейший провайдер цифровых услуг РФ, госконтроль. Владеет Tele2, РТК-ЦОД, Wink. Лидер в фиксированной связи.',
  },

  // ─── Девелопмент ─────────────────────────────────────────────────
  {
    id: 'pik',
    name: 'ПИК',
    fullName: 'ПАО «Группа Компаний ПИК»',
    aliases: ['PIK', 'PIKK'],
    sectorId: 'realestate',
    sector: 'Недвижимость и девелопмент',
    moexTicker: 'PIKK',
    isPublic: true,
    founded: 1994,
    hq: 'Москва',
    description: 'Крупнейший российский девелопер жилой недвижимости. Контроль у Сергея Гордеева.',
  },
  {
    id: 'samolet',
    name: 'Группа Самолёт',
    fullName: 'ПАО «ГК Самолёт»',
    aliases: ['Samolet', 'SMLT'],
    sectorId: 'realestate',
    sector: 'Недвижимость и девелопмент',
    moexTicker: 'SMLT',
    isPublic: true,
    founded: 2012,
    hq: 'Москва',
    description: 'Один из крупнейших застройщиков по объёму проектирования. Активный рост 2020–2023 сменился долговым давлением в 2024–2025.',
  },
  {
    id: 'etalon',
    name: 'Эталон',
    fullName: 'МКПАО «Эталон Груп»',
    aliases: ['Etalon', 'ETLN'],
    sectorId: 'realestate',
    sector: 'Недвижимость и девелопмент',
    moexTicker: 'ETLN',
    isPublic: true,
    founded: 1987,
    hq: 'Санкт-Петербург',
    description: 'Девелопер премиум и комфорт-класса в Москве и Санкт-Петербурге. Контроль у АФК «Система».',
  },
  {
    id: 'lsr',
    name: 'ЛСР',
    fullName: 'ПАО «Группа ЛСР»',
    aliases: ['LSR', 'LSRG'],
    sectorId: 'realestate',
    sector: 'Недвижимость и девелопмент',
    moexTicker: 'LSRG',
    isPublic: true,
    founded: 1993,
    hq: 'Санкт-Петербург',
    description: 'Один из старейших девелоперов РФ. Полный цикл: от добычи стройматериалов до строительства жилья.',
  },

  // ─── Транспорт ───────────────────────────────────────────────────
  {
    id: 'aeroflot',
    name: 'Аэрофлот',
    fullName: 'ПАО «Аэрофлот»',
    aliases: ['Aeroflot', 'AFLT'],
    sectorId: 'transport',
    sector: 'Транспорт и логистика',
    moexTicker: 'AFLT',
    isPublic: true,
    founded: 1923,
    hq: 'Москва',
    description: 'Крупнейшая российская авиакомпания, госконтроль 73%. Объединяет Аэрофлот, Россию и Победу.',
  },
  {
    id: 'delimobil',
    name: 'Делимобиль',
    fullName: 'ПАО «Каршеринг Руссия»',
    aliases: ['Delimobil', 'DELI'],
    sectorId: 'transport',
    sector: 'Транспорт и логистика',
    moexTicker: 'DELI',
    isPublic: true,
    founded: 2015,
    hq: 'Москва',
    description: 'Крупнейший российский каршеринг (~25 тыс. авто). IPO 2024 г. — первое для индустрии каршеринга в РФ.',
  },
  {
    id: 'whoosh',
    name: 'Whoosh',
    fullName: 'ПАО «ВУШ Холдинг»',
    aliases: ['Вуш', 'WUSH'],
    sectorId: 'transport',
    sector: 'Транспорт и логистика',
    moexTicker: 'WUSH',
    isPublic: true,
    founded: 2018,
    hq: 'Санкт-Петербург',
    description: 'Лидер российского кикшеринга (~200 тыс. самокатов). Первое IPO 2022–2023 на MOEX после паузы.',
  },
  {
    id: 'fesco',
    name: 'ДВМП (FESCO)',
    fullName: 'ПАО «ДВМП»',
    aliases: ['FESCO', 'FESH', 'ДВМП'],
    sectorId: 'transport',
    sector: 'Транспорт и логистика',
    moexTicker: 'FESH',
    isPublic: true,
    founded: 1880,
    hq: 'Владивосток',
    description: 'Крупнейший транспортно-логистический холдинг РФ. Морские перевозки, порты, ж/д логистика. Контроль у Росатома с 2023.',
  },

  // ─── Электроэнергетика ───────────────────────────────────────────
  {
    id: 'inter-rao',
    name: 'Интер РАО',
    fullName: 'ПАО «Интер РАО»',
    aliases: ['Inter RAO', 'IRAO'],
    sectorId: 'utilities',
    sector: 'Электроэнергетика',
    moexTicker: 'IRAO',
    isPublic: true,
    founded: 1997,
    hq: 'Москва',
    description: 'Один из крупнейших производителей электроэнергии в РФ + экспорт энергии. Контроль у Роснефтегаза.',
  },
  {
    id: 'rushydro',
    name: 'РусГидро',
    fullName: 'ПАО «РусГидро»',
    aliases: ['RusHydro', 'HYDR'],
    sectorId: 'utilities',
    sector: 'Электроэнергетика',
    moexTicker: 'HYDR',
    isPublic: true,
    founded: 2004,
    hq: 'Красноярск',
    description: 'Крупнейший российский генератор гидроэнергии и одна из крупнейших мировых гидрогенерирующих компаний.',
  },

  // ─── Химия ───────────────────────────────────────────────────────
  {
    id: 'phosagro',
    name: 'ФосАгро',
    fullName: 'ПАО «ФосАгро»',
    aliases: ['PhosAgro', 'PHOR'],
    sectorId: 'chemicals',
    sector: 'Химия и нефтехимия',
    moexTicker: 'PHOR',
    isPublic: true,
    founded: 2001,
    hq: 'Москва',
    description: 'Лидер мирового рынка фосфорных удобрений. Контроль у Гурьевых.',
  },
  {
    id: 'sibur',
    name: 'СИБУР',
    fullName: 'ПАО «СИБУР Холдинг»',
    aliases: ['Sibur'],
    sectorId: 'chemicals',
    sector: 'Химия и нефтехимия',
    moexTicker: null,
    isPublic: false,
    founded: 1995,
    hq: 'Москва',
    description: 'Крупнейшая нефтехимическая компания РФ. Готовит IPO начиная с 2025. Контроль у Леонида Михельсона и Геннадия Тимченко.',
    privateValuation: {
      evMn: 2500000,
      asOfDate: '2024-12-31',
      source: 'Оценка перед IPO (рыночные данные)',
      sourceUrl: 'https://www.rbc.ru/search/?query=' + encodeURIComponent('СИБУР IPO оценка'),
    },
  },

  // ─── АПК ─────────────────────────────────────────────────────────
  {
    id: 'cherkizovo',
    name: 'Черкизово',
    fullName: 'ПАО «Группа Черкизово»',
    aliases: ['Cherkizovo', 'GCHE'],
    sectorId: 'agro',
    sector: 'АПК и пищевая промышленность',
    moexTicker: 'GCHE',
    isPublic: true,
    founded: 1974,
    hq: 'Москва',
    description: 'Крупнейший производитель мяса и комбикормов в РФ. Бренды «Петелинка», «Куриное царство», «Пава-Пава».',
  },
  {
    id: 'rusagro',
    name: 'РусАгро',
    fullName: 'МКПАО «РусАгро»',
    aliases: ['RusAgro', 'AGRO'],
    sectorId: 'agro',
    sector: 'АПК и пищевая промышленность',
    moexTicker: 'AGRO',
    isPublic: true,
    founded: 1995,
    hq: 'Тамбов',
    description: 'Один из крупнейших агрохолдингов РФ: сахар, масложировой бизнес, мясо, с/х. Бренды «Чайкофский», «Русский Сахар».',
  },
  {
    id: 'inarktika',
    name: 'Инарктика',
    fullName: 'ПАО «Инарктика»',
    aliases: ['Inarctica', 'AQUA', 'Русская аквакультура'],
    sectorId: 'agro',
    sector: 'АПК и пищевая промышленность',
    moexTicker: 'AQUA',
    isPublic: true,
    founded: 1997,
    hq: 'Москва',
    description: 'Лидер российской аквакультуры. Лосось и форель из Баренцева моря. Раньше — «Русская аквакультура».',
  },

  // ─── Здравоохранение ────────────────────────────────────────────
  {
    id: 'mdmg',
    name: 'Мать и Дитя',
    fullName: 'МКПАО «MD Medical Group»',
    aliases: ['MD Medical', 'MDMG'],
    sectorId: 'healthcare',
    sector: 'Здравоохранение и фарма',
    moexTicker: 'MDMG',
    isPublic: true,
    founded: 2006,
    hq: 'Москва',
    description: 'Крупнейшая сеть частных перинатальных центров и многопрофильных клиник. Контроль у Марка Курцера.',
  },
  {
    id: 'ozonpharm',
    name: 'Озон Фармацевтика',
    fullName: 'ПАО «Озон Фармацевтика»',
    aliases: ['Ozon Pharm', 'OZPH'],
    sectorId: 'healthcare',
    sector: 'Здравоохранение и фарма',
    moexTicker: 'OZPH',
    isPublic: true,
    founded: 2001,
    hq: 'Жигулёвск',
    description: 'Один из крупнейших российских производителей дженериков. IPO 2024 г.',
  },
  {
    id: 'medsi',
    name: 'Медси',
    fullName: 'АО «Группа компаний Медси»',
    aliases: ['Medsi'],
    sectorId: 'healthcare',
    sector: 'Здравоохранение и фарма',
    moexTicker: null,
    isPublic: false,
    founded: 1996,
    hq: 'Москва',
    description: 'Крупнейшая частная медицинская сеть РФ. >100 клиник. Контроль у АФК «Система». Готовится продажа контрольного пакета.',
    privateValuation: {
      evMn: 65000,
      asOfDate: '2025-03-18',
      source: 'PE-сделка АФК Система',
      sourceUrl: 'https://www.vedomosti.ru/search?query=' + encodeURIComponent('Медси АФК Система продажа'),
    },
  },
  {
    id: 'ems',
    name: 'Европейский медицинский центр (ЕМС)',
    fullName: 'ПАО «Юнайтед Медикал Груп»',
    aliases: ['EMC', 'GEMC', 'European Medical Center'],
    sectorId: 'healthcare',
    sector: 'Здравоохранение и фарма',
    moexTicker: null,
    isPublic: false,
    founded: 1989,
    hq: 'Москва',
    description: 'Премиальная медицинская сеть в Москве. В 2024–2025 прошла процесс делистинга и приватизации Игорем Шиловым.',
    privateValuation: {
      evMn: 41000,
      asOfDate: '2025-01-15',
      source: 'Buyout-сделка',
      sourceUrl: 'https://www.rbc.ru/search/?query=' + encodeURIComponent('ЕМС European Medical Center выкуп'),
    },
  },
]

export const companiesById = new Map(companies.map(c => [c.id, c]))

export function findCompanyById(id: string): Company | undefined {
  return companiesById.get(id)
}

/**
 * Находит компанию по любой её строковой репрезентации.
 * Используется для матчинга названий в сделках, новостях и т.д.
 */
export function findCompanyByName(query: string): Company | undefined {
  if (!query) return undefined
  const lower = query.toLowerCase()
  return companies.find(c => {
    if (c.name.toLowerCase() === lower) return true
    if (c.fullName.toLowerCase() === lower) return true
    if (c.aliases.some(a => a.toLowerCase() === lower)) return true
    return false
  })
}

/**
 * Менее строгий поиск (содержит подстроку) — для сделок и новостей,
 * где имя может быть с дополнениями: "Группа Самолёт" vs "Группа Самолёт (девелопер)".
 */
export function findCompanyInString(text: string): Company | undefined {
  if (!text) return undefined
  const lower = text.toLowerCase()
  for (const c of companies) {
    if (lower.includes(c.name.toLowerCase())) return c
    for (const a of c.aliases) {
      if (lower.includes(a.toLowerCase())) return c
    }
  }
  return undefined
}

/**
 * Транслитерирует строку в slug для URL.
 * Используется для компаний без записи в справочнике.
 */
const TRANSLIT_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .split('')
    .map(c => TRANSLIT_MAP[c] ?? c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}

/**
 * Возвращает URL профиля компании. Если компания в справочнике —
 * использует её id, иначе слугифицирует имя.
 */
export function getCompanyHref(name: string): string {
  const found = findCompanyInString(name)
  return `/company/${found ? found.id : slugify(name)}`
}
