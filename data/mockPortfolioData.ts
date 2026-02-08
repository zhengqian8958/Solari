import type { Portfolio, InvestmentType, Asset } from '../types/portfolio.types'
import { SYSTEM_INVESTMENT_TYPES } from '../constants/systemInvestmentTypes'

/**
 * Generate mock portfolio data for active investment types
 */
export function generateMockPortfolio(activeInvestmentTypeIds: string[]): Portfolio {
    const activeTypes = SYSTEM_INVESTMENT_TYPES.filter((type) =>
        activeInvestmentTypeIds.includes(type.id)
    )

    const investmentTypes: InvestmentType[] = activeTypes.map((systemType) => {
        const assets: Asset[] = systemType.defaultAssets.map((asset, index) => ({
            ...asset,
            id: `${systemType.id}_asset_${index}`,
            investmentTypeId: systemType.id,
        }))

        const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
        const totalChange = assets.reduce((sum, asset) => sum + asset.change, 0)
        const changePercentage = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0

        return {
            id: systemType.id,
            name: systemType.name,
            icon: systemType.icon,
            color: systemType.color,
            totalValue,
            percentage: 0, // Will be calculated below
            change: totalChange,
            changePercentage,
            assets,
        }
    })

    // Calculate total portfolio value and percentages
    const totalValue = investmentTypes.reduce((sum, type) => sum + type.totalValue, 0)
    const totalChange = investmentTypes.reduce((sum, type) => sum + type.change, 0)
    const totalChangePercentage =
        totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0

    // Update percentages for each investment type
    investmentTypes.forEach((type) => {
        type.percentage = totalValue > 0 ? (type.totalValue / totalValue) * 100 : 0
    })

    return {
        totalValue,
        totalChange,
        totalChangePercentage,
        investmentTypes,
    }
}
