export interface SectorMultiple {
  id: string
  sector: string
  sectorEn: string
  icon: string
  evEbitda: number
  evEbitdaYoY: number
  pe: number
  peYoY: number
  evRevenue: number
  evRevenueYoY: number
  pb: number
  pbYoY: number
  companiesCount: number
  marketCapBn: number
  updatedAt: string
}

export type DealType =
  | 'LBO'
  | 'Growth'
  | 'Minority'
  | 'Strategic M&A'
  | 'Add-on'
  | 'Buyout'
  | 'IPO'
  | 'Secondary'

export type DealStatus = 'Закрыта' | 'В процессе' | 'Анонсирована'

export interface Deal {
  id: string
  date: string
  target: string
  sector: string
  sectorId: string
  buyer: string
  seller: string
  dealType: DealType
  status: DealStatus
  evMn: number | null
  evEbitdaMultiple: number | null
  stakePercent: number | null
  description: string
  isPublic: boolean
  source: string
}

export type SortField = 'date' | 'evMn' | 'evEbitdaMultiple' | 'target'
export type SortDir = 'asc' | 'desc'

export interface MultipleHistoryPoint {
  quarter: string
  evEbitda: number
  pe: number
}
