import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Portfolio, InvestmentType, Asset } from '../types/portfolio.types'
import {
    SYSTEM_INVESTMENT_TYPES,
    DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS,
    ACTIVE_INVESTMENT_TYPES_KEY,
} from '../constants/systemInvestmentTypes'
import { generateMockPortfolio } from '../data/mockPortfolioData'

// AsyncStorage keys
const REMOVED_ASSETS_KEY = '@removed_assets'
const CUSTOM_ASSETS_KEY = '@custom_assets'

interface PortfolioContextType {
    portfolio: Portfolio
    selectedInvestmentTypeId: string | null
    activeInvestmentTypeIds: string[]
    setSelectedInvestmentType: (id: string | null) => void
    addInvestmentType: (id: string) => Promise<void>
    removeInvestmentType: (id: string) => Promise<void>
    getInvestmentType: (id: string) => InvestmentType | undefined
    getAssetsByInvestmentType: (investmentTypeId: string) => Asset[]
    removeAsset: (investmentTypeId: string, assetId: string) => Promise<void>
    addAsset: (investmentTypeId: string, name: string, amount: number) => Promise<void>
    isLoading: boolean
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
    const [activeInvestmentTypeIds, setActiveInvestmentTypeIds] = useState<string[]>([])
    const [selectedInvestmentTypeId, setSelectedInvestmentTypeId] = useState<string | null>(null)
    const [removedAssets, setRemovedAssets] = useState<Record<string, string[]>>({}) // investmentTypeId -> assetIds[]
    const [customAssets, setCustomAssets] = useState<Record<string, Asset[]>>({}) // investmentTypeId -> Asset[]
    const [portfolio, setPortfolio] = useState<Portfolio>({
        totalValue: 0,
        totalChange: 0,
        totalChangePercentage: 0,
        investmentTypes: [],
    })
    const [isLoading, setIsLoading] = useState(true)

    // Load data from AsyncStorage on mount
    useEffect(() => {
        loadAllData()
    }, [])

    // Regenerate portfolio when data changes
    useEffect(() => {
        if (!isLoading) {
            regeneratePortfolio()
        }
    }, [activeInvestmentTypeIds, removedAssets, customAssets, isLoading])

    const loadAllData = async () => {
        try {
            const [storedActive, storedRemoved, storedCustom] = await Promise.all([
                AsyncStorage.getItem(ACTIVE_INVESTMENT_TYPES_KEY),
                AsyncStorage.getItem(REMOVED_ASSETS_KEY),
                AsyncStorage.getItem(CUSTOM_ASSETS_KEY),
            ])

            // Load active investment types
            if (storedActive) {
                setActiveInvestmentTypeIds(JSON.parse(storedActive))
            } else {
                setActiveInvestmentTypeIds(DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS)
                await AsyncStorage.setItem(
                    ACTIVE_INVESTMENT_TYPES_KEY,
                    JSON.stringify(DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS)
                )
            }

            // Load removed assets
            if (storedRemoved) {
                setRemovedAssets(JSON.parse(storedRemoved))
            }

            // Load custom assets
            if (storedCustom) {
                setCustomAssets(JSON.parse(storedCustom))
            }
        } catch (error) {
            console.error('Error loading portfolio data:', error)
            setActiveInvestmentTypeIds(DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS)
        } finally {
            setIsLoading(false)
        }
    }

    const regeneratePortfolio = () => {
        if (activeInvestmentTypeIds.length === 0) {
            // Empty portfolio
            setPortfolio({
                totalValue: 0,
                totalChange: 0,
                totalChangePercentage: 0,
                investmentTypes: [],
            })
            return
        }

        // Generate base portfolio from mock data
        const basePortfolio = generateMockPortfolio(activeInvestmentTypeIds)

        // Apply removals and additions
        const modifiedInvestmentTypes = basePortfolio.investmentTypes.map((type) => {
            const removed = removedAssets[type.id] || []
            const custom = customAssets[type.id] || []

            // Filter out removed assets
            const filteredAssets = type.assets.filter((asset) => !removed.includes(asset.id))

            // Add custom assets
            const allAssets = [...filteredAssets, ...custom]

            // Recalculate percentages
            const totalValue = allAssets.reduce((sum, asset) => sum + asset.value, 0)
            const assetsWithPercentages = allAssets.map((asset) => ({
                ...asset,
                percentage: totalValue > 0 ? (asset.value / totalValue) * 100 : 0,
            }))

            const totalChange = allAssets.reduce((sum, asset) => sum + asset.change, 0)
            const changePercentage = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0

            return {
                ...type,
                assets: assetsWithPercentages,
                totalValue,
                change: totalChange,
                changePercentage,
                percentage: 0, // Will be recalculated below
            }
        })

        // Recalculate investment type percentages
        const totalValue = modifiedInvestmentTypes.reduce((sum, type) => sum + type.totalValue, 0)
        const typesWithPercentages = modifiedInvestmentTypes.map((type) => ({
            ...type,
            percentage: totalValue > 0 ? (type.totalValue / totalValue) * 100 : 0,
        }))

        const totalChange = typesWithPercentages.reduce((sum, type) => sum + type.change, 0)
        const totalChangePercentage = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0

        setPortfolio({
            totalValue,
            totalChange,
            totalChangePercentage,
            investmentTypes: typesWithPercentages,
        })
    }

    const addInvestmentType = async (id: string) => {
        const systemType = SYSTEM_INVESTMENT_TYPES.find((t) => t.id === id)
        if (!systemType) {
            console.error('Invalid investment type id:', id)
            return
        }

        if (activeInvestmentTypeIds.includes(id)) {
            console.log('Investment type already added:', id)
            return
        }

        const newActiveIds = [...activeInvestmentTypeIds, id]
        setActiveInvestmentTypeIds(newActiveIds)

        try {
            await AsyncStorage.setItem(ACTIVE_INVESTMENT_TYPES_KEY, JSON.stringify(newActiveIds))
        } catch (error) {
            console.error('Error saving investment type:', error)
        }
    }

    const removeInvestmentType = async (id: string) => {
        const newActiveIds = activeInvestmentTypeIds.filter((typeId) => typeId !== id)
        setActiveInvestmentTypeIds(newActiveIds)

        if (selectedInvestmentTypeId === id) {
            setSelectedInvestmentType(null)
        }

        try {
            await AsyncStorage.setItem(ACTIVE_INVESTMENT_TYPES_KEY, JSON.stringify(newActiveIds))
        } catch (error) {
            console.error('Error removing investment type:', error)
        }
    }

    const removeAsset = async (investmentTypeId: string, assetId: string) => {
        const newRemovedAssets = {
            ...removedAssets,
            [investmentTypeId]: [...(removedAssets[investmentTypeId] || []), assetId],
        }
        setRemovedAssets(newRemovedAssets)

        try {
            await AsyncStorage.setItem(REMOVED_ASSETS_KEY, JSON.stringify(newRemovedAssets))
        } catch (error) {
            console.error('Error saving removed asset:', error)
        }
    }

    const addAsset = async (investmentTypeId: string, name: string, amount: number) => {
        // Generate mock asset
        const randomMultiplier = 0.8 + Math.random() * 0.4 // Random between 0.8 and 1.2
        const value = Math.round(amount * randomMultiplier)
        const change = Math.round(value * (Math.random() * 0.1 - 0.05)) // -5% to +5%
        const changePercentage = value > 0 ? (change / (value - change)) * 100 : 0

        const newAsset: Asset = {
            id: `custom_${investmentTypeId}_${Date.now()}`,
            name,
            symbol: name.substring(0, 4).toUpperCase(),
            value,
            percentage: 0, // Will be recalculated
            change,
            changePercentage,
            investmentTypeId,
            isCustom: true,
            createdAt: Date.now(),
        }

        const newCustomAssets = {
            ...customAssets,
            [investmentTypeId]: [...(customAssets[investmentTypeId] || []), newAsset],
        }
        setCustomAssets(newCustomAssets)

        try {
            await AsyncStorage.setItem(CUSTOM_ASSETS_KEY, JSON.stringify(newCustomAssets))
        } catch (error) {
            console.error('Error saving custom asset:', error)
        }
    }

    const setSelectedInvestmentType = (id: string | null) => {
        setSelectedInvestmentTypeId(id)
    }

    const getInvestmentType = (id: string): InvestmentType | undefined => {
        return portfolio.investmentTypes.find((type) => type.id === id)
    }

    const getAssetsByInvestmentType = (investmentTypeId: string): Asset[] => {
        const investmentType = getInvestmentType(investmentTypeId)
        return investmentType?.assets || []
    }

    return (
        <PortfolioContext.Provider
            value={{
                portfolio,
                selectedInvestmentTypeId,
                activeInvestmentTypeIds,
                setSelectedInvestmentType,
                addInvestmentType,
                removeInvestmentType,
                getInvestmentType,
                getAssetsByInvestmentType,
                removeAsset,
                addAsset,
                isLoading,
            }}
        >
            {children}
        </PortfolioContext.Provider>
    )
}

export function usePortfolio() {
    const context = useContext(PortfolioContext)
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider')
    }
    return context
}
