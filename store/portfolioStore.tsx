import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PublicKey } from '@solana/web3.js'
import { useAuth } from '../components/auth/auth-provider' // Assuming this exposes the current account/publicKey
import { useWalletAssets, WalletAsset } from '../hooks/useWalletAssets'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import type { Portfolio, InvestmentType, Asset } from '../types/portfolio.types'
import {
    SYSTEM_INVESTMENT_TYPES,
    DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS,
    ACTIVE_INVESTMENT_TYPES_KEY,
} from '../constants/systemInvestmentTypes'
// import { generateMockPortfolio } from '../data/mockPortfolioData' // No longer needed for main flow, but kept if we want fallback? No, we want real data.

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
    const { user } = useAuth() as any

    const [activeInvestmentTypeIds, setActiveInvestmentTypeIds] = useState<string[]>([])
    const [selectedInvestmentTypeId, setSelectedInvestmentTypeId] = useState<string | null>(null)
    const [removedAssets, setRemovedAssets] = useState<Record<string, string[]>>({}) // investmentTypeId -> assetIds[]
    const [customAssets, setCustomAssets] = useState<Record<string, Asset[]>>({}) // investmentTypeId -> Asset[]

    // Get Real Assets
    const { accounts } = useMobileWallet()

    const publicKey = useMemo(() => {
        if (accounts && accounts.length > 0) {
            return new PublicKey(accounts[0].address)
        }
        return null
    }, [accounts])

    const { data: realAssets, isLoading: isAssetsLoading, refetch: refetchAssets } = useWalletAssets(publicKey)

    console.log(`PortfolioStore Render: PK=${publicKey?.toBase58().substring(0, 6)}.., realAssets=${realAssets?.length}, loading=${isAssetsLoading}`)

    const [portfolio, setPortfolio] = useState<Portfolio>({
        totalValue: 0,
        totalChange: 0,
        totalChangePercentage: 0,
        investmentTypes: [],
    })
    const [isLoadingStorage, setIsLoadingStorage] = useState(true)

    // Load data from AsyncStorage on mount
    useEffect(() => {
        loadAllData()
    }, [])

    // Regenerate portfolio when data changes
    useEffect(() => {
        if (!isLoadingStorage) {
            regeneratePortfolio()
        }
    }, [activeInvestmentTypeIds, removedAssets, customAssets, isLoadingStorage, realAssets])

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
            setIsLoadingStorage(false)
        }
    }

    const regeneratePortfolio = () => {
        // 1. Group Real Assets by Category
        const assetsByCategory: Record<string, Asset[]> = {};

        // Initialize with real assets
        if (realAssets) {
            console.log('PortfolioStore: processing realAssets:', realAssets.length);
            realAssets.forEach(walletAsset => {
                const categoryId = walletAsset.categoryId;
                if (!assetsByCategory[categoryId]) {
                    assetsByCategory[categoryId] = [];
                }

                // Convert WalletAsset to Asset
                const asset: Asset = {
                    id: walletAsset.id,
                    name: walletAsset.name,
                    symbol: walletAsset.symbol,
                    value: walletAsset.value,
                    percentage: 0, // Recalculated later
                    change: walletAsset.change,
                    changePercentage: walletAsset.changePercentage,
                    investmentTypeId: categoryId,
                    isCustom: false,
                    icon: '',
                    amount: walletAsset.uiAmount,
                } as any;

                assetsByCategory[categoryId].push(asset);
            });
            console.log('PortfolioStore: assetsByCategory keys:', Object.keys(assetsByCategory));
            if (assetsByCategory['crypto']) {
                console.log('PortfolioStore: crypto assets count:', assetsByCategory['crypto'].length);
            }
        } else {
            console.log('PortfolioStore: realAssets is null/undefined');
        }

        // 2. Mix with Custom Assets & Filter Removed
        // We iterate over *Active* Investment Types to build the final list
        // However, if we identify new categories from the Wallet that aren't in Active, 
        // should we auto-add them? 
        // For now, let's respect `activeInvestmentTypeIds` but maybe we should ensure we don't hide real money.
        // Let's auto-add categories found in wallet to available list, or just show everything found.
        // Current requirement: "Use real data".

        // Let's iterate over ALL system types + any dynamic ones?
        // For simplicity, let's stick to the structure: We iterate over activeInvestmentTypeIds.
        // If the user has 'commodities' enabled, we look for commodities assets.

        const calculatedInvestmentTypes = activeInvestmentTypeIds.map(typeId => {
            const systemType = SYSTEM_INVESTMENT_TYPES.find(t => t.id === typeId);

            // Get assets for this category from Real Data
            const realAssetsForType = assetsByCategory[typeId] || [];

            // Get custom assets
            const customAssetsForType = customAssets[typeId] || [];

            // Get removed IDs
            const removedIds = removedAssets[typeId] || [];

            // Merge
            let allAssets = [...realAssetsForType, ...customAssetsForType];

            // Filter removed
            allAssets = allAssets.filter(a => !removedIds.includes(a.id));

            // Filter zero value if desired, but maybe show 0 balance if it's a custom tracked asset?
            // Real assets are already filtered > 0 in hook usually, unless we changed that.

            // Calculate totals for this Type
            const totalValue = allAssets.reduce((sum, a) => sum + a.value, 0);
            const totalChange = allAssets.reduce((sum, a) => sum + a.change, 0); // Mock change for now
            const changePercentage = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

            // Calculate percentages within the type
            const assetsWithPercentages = allAssets.map(asset => ({
                ...asset,
                percentage: totalValue > 0 ? (asset.value / totalValue) * 100 : 0
            }));

            return {
                id: typeId,
                name: systemType?.name || typeId,
                icon: systemType?.icon || 'help-circle', // Fallback icon
                color: systemType?.color || '#000000', // Fallback color
                totalValue,
                change: totalChange,
                changePercentage,
                percentage: 0, // Recalculated at portfolio level
                assets: assetsWithPercentages
            };
        });

        // 3. Filter out types with 0 value? 
        // Maybe we want to keep them if they are explicitly active, to show "Empty".
        // The existing logic kept them.

        // 4. Calculate Portfolio Totals
        const portfolioTotalValue = calculatedInvestmentTypes.reduce((sum, t) => sum + t.totalValue, 0);
        const portfolioTotalChange = calculatedInvestmentTypes.reduce((sum, t) => sum + t.change, 0);
        const portfolioChangePercentage = portfolioTotalValue > 0 ? (portfolioTotalChange / (portfolioTotalValue - portfolioTotalChange)) * 100 : 0;

        // 5. Calculate Type Percentages
        const finalInvestmentTypes = calculatedInvestmentTypes.map(t => ({
            ...t,
            percentage: portfolioTotalValue > 0 ? (t.totalValue / portfolioTotalValue) * 100 : 0
        }));

        setPortfolio({
            totalValue: portfolioTotalValue,
            totalChange: portfolioTotalChange,
            totalChangePercentage: portfolioChangePercentage,
            investmentTypes: finalInvestmentTypes,
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
        // Custom asset addition (manual)
        // For real assets, prices might need to be fetched or manually entered.
        // For now, keeping mock logic for Manual Entry but treating it as "Custom".

        const randomMultiplier = 0.8 + Math.random() * 0.4
        const value = Math.round(amount * randomMultiplier)
        const change = Math.round(value * (Math.random() * 0.1 - 0.05))
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
        } as any

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
        // Trigger refetch to get fresh prices when switching views
        refetchAssets()
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
                isLoading: isLoadingStorage || isAssetsLoading,
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
