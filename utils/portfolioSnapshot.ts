import AsyncStorage from '@react-native-async-storage/async-storage'

// AsyncStorage key for portfolio snapshot
const PORTFOLIO_SNAPSHOT_KEY = '@portfolio_snapshot'

export interface PortfolioSnapshot {
    timestamp: number
    assets: Record<string, number> // assetId -> value
}

/**
 * Save current portfolio snapshot to AsyncStorage
 * @param assets - Record of asset IDs to their current values
 */
export async function savePortfolioSnapshot(assets: Record<string, number>): Promise<void> {
    try {
        const snapshot: PortfolioSnapshot = {
            timestamp: Date.now(),
            assets,
        }
        await AsyncStorage.setItem(PORTFOLIO_SNAPSHOT_KEY, JSON.stringify(snapshot))
        console.log('Portfolio snapshot saved:', Object.keys(assets).length, 'assets')
    } catch (error) {
        console.error('Error saving portfolio snapshot:', error)
    }
}

/**
 * Load previous portfolio snapshot from AsyncStorage
 * @returns Previous snapshot or null if none exists
 */
export async function loadPreviousSnapshot(): Promise<PortfolioSnapshot | null> {
    try {
        const stored = await AsyncStorage.getItem(PORTFOLIO_SNAPSHOT_KEY)
        if (stored) {
            const snapshot = JSON.parse(stored) as PortfolioSnapshot
            const now = new Date().toISOString().substring(11, 23)
            console.log(`[${now}] Previous snapshot loaded:`, Object.keys(snapshot.assets).length, 'assets')
            return snapshot
        }
        console.log('No previous snapshot found')
        return null
    } catch (error) {
        console.error('Error loading previous snapshot:', error)
        return null
    }
}

/**
 * Calculate change between current and previous value
 * @param currentValue - Current asset value
 * @param previousValue - Previous asset value (or undefined if new asset)
 * @returns Object with absolute change and percentage change
 */
export function calculateChange(
    currentValue: number,
    previousValue: number | undefined
): { change: number; changePercentage: number } {
    // If no previous value exists (new asset), treat as 100% gain
    if (previousValue === undefined || previousValue === 0) {
        return {
            change: currentValue,
            changePercentage: currentValue > 0 ? 100 : 0,
        }
    }

    const change = currentValue - previousValue
    const changePercentage = (change / previousValue) * 100

    return {
        change,
        changePercentage,
    }
}

/**
 * Extract asset values from snapshot for easy lookup
 * @param snapshot - Portfolio snapshot or null
 * @returns Record of asset IDs to values, or empty object if no snapshot
 */
export function getSnapshotValues(snapshot: PortfolioSnapshot | null): Record<string, number> {
    return snapshot?.assets || {}
}
