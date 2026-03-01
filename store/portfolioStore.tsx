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
import {
    savePortfolioSnapshot,
    loadPreviousSnapshot,
    calculateChange,
    getSnapshotValues,
    type PortfolioSnapshot
} from '../utils/portfolioSnapshot'
// import { generateMockPortfolio } from '../data/mockPortfolioData' // No longer needed for main flow, but kept if we want fallback? No, we want real data.

// AsyncStorage keys
const REMOVED_ASSETS_KEY = '@removed_assets'
const CUSTOM_ASSETS_KEY = '@custom_assets'
const LATEST_PORTFOLIO_KEY = '@latest_portfolio'

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
    refreshPortfolio: () => Promise<void>
    isLoading: boolean
    isRefreshing: boolean
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth() as any

    const [activeInvestmentTypeIds, setActiveInvestmentTypeIds] = useState<string[]>([])
    const [selectedInvestmentTypeId, setSelectedInvestmentTypeId] = useState<string | null>(null)
    const [removedAssets, setRemovedAssets] = useState<Record<string, string[]>>({}) // investmentTypeId -> assetIds[]
    const [customAssets, setCustomAssets] = useState<Record<string, Asset[]>>({}) // investmentTypeId -> Asset[]
    const [previousSnapshot, setPreviousSnapshot] = useState<PortfolioSnapshot | null>(null)

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
    const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Load data from AsyncStorage on mount
    useEffect(() => {
        loadAllData()
        // Load snapshot in background - will trigger re-render when complete
        loadSnapshotAsync()
    }, [])

    // Regenerate portfolio when data changes
    useEffect(() => {
        // Critical: Only regenerate when we have ACTUAL DATA ready
        // Don't regenerate on empty/null states
        if (publicKey && realAssets && realAssets.length > 0) {
            console.log('Triggering portfolio regeneration')
            regeneratePortfolio()
        }
    }, [activeInvestmentTypeIds, removedAssets, customAssets, isLoadingStorage, isLoadingSnapshot, isAssetsLoading, realAssets, previousSnapshot, publicKey])

    const loadAllData = async () => {
        try {
            // Load only CRITICAL data that's needed for display
            // Also load cached portfolio for Optimistic UI
            const [storedActive, storedRemoved, storedCustom, storedPortfolio] = await Promise.all([
                AsyncStorage.getItem(ACTIVE_INVESTMENT_TYPES_KEY),
                AsyncStorage.getItem(REMOVED_ASSETS_KEY),
                AsyncStorage.getItem(CUSTOM_ASSETS_KEY),
                AsyncStorage.getItem(LATEST_PORTFOLIO_KEY),
            ])

            // Load properties
            if (storedActive) {
                setActiveInvestmentTypeIds(JSON.parse(storedActive))
            } else {
                setActiveInvestmentTypeIds(DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS)
                await AsyncStorage.setItem(
                    ACTIVE_INVESTMENT_TYPES_KEY,
                    JSON.stringify(DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS)
                )
            }

            if (storedRemoved) setRemovedAssets(JSON.parse(storedRemoved))
            if (storedCustom) setCustomAssets(JSON.parse(storedCustom))

            // OPTIMISTIC UI: Load cached portfolio immediately
            if (storedPortfolio) {
                console.log('Loaded cached portfolio for immediate display')
                setPortfolio(JSON.parse(storedPortfolio))
            }

        } catch (error) {
            console.error('Error loading portfolio data:', error)
            setActiveInvestmentTypeIds(DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS)
        } finally {
            setIsLoadingStorage(false)
        }
    }

    // Load snapshot asynchronously - must complete before portfolio regeneration
    const loadSnapshotAsync = async () => {
        try {
            const snapshot = await loadPreviousSnapshot()
            setPreviousSnapshot(snapshot)
        } catch (error) {
            console.error('Error loading previous snapshot:', error)
        } finally {
            setIsLoadingSnapshot(false)
        }
    }

    const regeneratePortfolio = async () => {
        // Get previous values for change calculation
        const prevValues = getSnapshotValues(previousSnapshot)

        // 1. Group Real Assets by Category
        const assetsByCategory: Record<string, Asset[]> = {};
        const currentAssetValues: Record<string, number> = {} // Track current values for snapshot

        // Initialize with real assets
        if (realAssets) {
            console.log('PortfolioStore: processing realAssets:', realAssets.length);
            realAssets.forEach(walletAsset => {
                const categoryId = walletAsset.categoryId;
                if (!assetsByCategory[categoryId]) {
                    assetsByCategory[categoryId] = [];
                }

                // Calculate real change based on previous snapshot
                const { change, changePercentage } = calculateChange(
                    walletAsset.value,
                    prevValues[walletAsset.id]
                )

                // Track current value for new snapshot
                currentAssetValues[walletAsset.id] = walletAsset.value

                // Convert WalletAsset to Asset
                const asset: Asset = {
                    id: walletAsset.id,
                    mint: walletAsset.mint, // Keep mint address for category matching
                    name: walletAsset.name,
                    symbol: walletAsset.symbol,
                    value: walletAsset.value,
                    percentage: 0, // Recalculated later
                    change, // Real change from snapshot
                    changePercentage, // Real percentage from snapshot
                    investmentTypeId: categoryId,
                    isCustom: false,
                    icon: '',
                    amount: walletAsset.uiAmount,
                    previousValue: prevValues[walletAsset.id],
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
        const calculatedInvestmentTypes = activeInvestmentTypeIds.map(typeId => {
            const systemType = SYSTEM_INVESTMENT_TYPES.find(t => t.id === typeId);

            // Get assets for this category from Real Data
            const realAssetsForType = assetsByCategory[typeId] || [];

            // Get custom assets
            const customAssetsForType = (customAssets[typeId] || []).map(customAsset => {
                // Calculate change for custom assets too
                const { change, changePercentage } = calculateChange(
                    customAsset.value,
                    prevValues[customAsset.id]
                )

                // Track current value for snapshot
                currentAssetValues[customAsset.id] = customAsset.value

                return {
                    ...customAsset,
                    change,
                    changePercentage,
                    previousValue: prevValues[customAsset.id],
                }
            });

            // Get removed IDs
            const removedIds = removedAssets[typeId] || [];

            // Merge
            let allAssets = [...realAssetsForType, ...customAssetsForType];

            // Filter removed
            allAssets = allAssets.filter(a => !removedIds.includes(a.id));

            // Calculate totals for this Type (aggregate from assets)
            const totalValue = allAssets.reduce((sum, a) => sum + a.value, 0);
            const totalChange = allAssets.reduce((sum, a) => sum + a.change, 0);
            const changePercentage = totalValue > 0 && (totalValue - totalChange) > 0
                ? (totalChange / (totalValue - totalChange)) * 100
                : 0;

            // Calculate percentages within the type
            const assetsWithPercentages = allAssets.map(asset => ({
                ...asset,
                percentage: totalValue > 0 ? (asset.value / totalValue) * 100 : 0
            }));

            return {
                id: typeId,
                name: systemType?.name || typeId,
                icon: systemType?.icon || 'help-circle',
                color: systemType?.color || '#000000',
                totalValue,
                change: totalChange,
                changePercentage,
                percentage: 0, // Recalculated at portfolio level
                assets: assetsWithPercentages
            };
        });

        // 3. Calculate Portfolio Totals
        const portfolioTotalValue = calculatedInvestmentTypes.reduce((sum, t) => sum + t.totalValue, 0);
        const portfolioTotalChange = calculatedInvestmentTypes.reduce((sum, t) => sum + t.change, 0);
        const portfolioChangePercentage = portfolioTotalValue > 0 && (portfolioTotalValue - portfolioTotalChange) > 0
            ? (portfolioTotalChange / (portfolioTotalValue - portfolioTotalChange)) * 100
            : 0;

        // 4. Calculate Type Percentages
        const finalInvestmentTypes = calculatedInvestmentTypes.map(t => ({
            ...t,
            percentage: portfolioTotalValue > 0 ? (t.totalValue / portfolioTotalValue) * 100 : 0
        }));

        const newPortfolio = {
            totalValue: portfolioTotalValue,
            totalChange: portfolioTotalChange,
            totalChangePercentage: portfolioChangePercentage,
            investmentTypes: finalInvestmentTypes,
        }

        setPortfolio(newPortfolio)

        // 5. CACHE PORTFOLIO for next session (Optimistic UI)
        await AsyncStorage.setItem(LATEST_PORTFOLIO_KEY, JSON.stringify(newPortfolio))

        // 6. Save snapshot for next session (only if we have assets to track)
        if (Object.keys(currentAssetValues).length > 0) {
            await savePortfolioSnapshot(currentAssetValues)
        }
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

    const refreshPortfolio = async () => {
        setIsRefreshing(true)
        try {
            await refetchAssets()
            // Wait a moment for the refetch to complete and trigger regeneration
            await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
            console.error('Error refreshing portfolio:', error)
        } finally {
            setIsRefreshing(false)
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

    // Determine if we should show loading state
    // If we have portfolio data (totalValue > 0 or investmentTypes > 0), we assume we have cached data and show it
    // isLoading only stays true if we have INITIAL empty state AND we are loading critical things
    const hasPortfolioData = portfolio.totalValue > 0 || portfolio.investmentTypes.length > 0;

    // We are loading if:
    // 1. Storage is loading (critical for removed assets/custom assets)
    // 2. We don't have ANY portfolio data AND (we don't have publicKey OR assets are loading)
    // If we have portfolio data (cached), we are technically NOT "loading" in the UI sense (we show stale data)
    const shouldShowLoading = isLoadingStorage || (!hasPortfolioData && (!publicKey || isAssetsLoading));

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
                refreshPortfolio,
                isLoading: shouldShowLoading,
                isRefreshing,
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
