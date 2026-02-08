/**
 * Portfolio data type definitions for Solana asset management app
 */

export interface Asset {
  id: string
  name: string
  symbol: string
  value: number
  percentage: number
  change: number
  changePercentage: number
  investmentTypeId: string
  icon?: string
  isCustom?: boolean // Flag for user-added assets
  createdAt?: number // Timestamp for custom assets
  previousValue?: number // Previous value for change calculation
}

export interface InvestmentType {
  id: string
  name: string
  icon: string
  color: string
  totalValue: number
  percentage: number
  change: number
  changePercentage: number
  assets: Asset[]
}

export interface Portfolio {
  totalValue: number
  totalChange: number
  totalChangePercentage: number
  investmentTypes: InvestmentType[]
}

export interface SystemInvestmentType {
  id: string
  name: string
  icon: string
  color: string
  defaultAssets: Omit<Asset, 'id' | 'investmentTypeId'>[]
}
