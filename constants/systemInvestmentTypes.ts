import type { SystemInvestmentType } from '../types/portfolio.types'

/**
 * Predefined system investment types with fixed icons and colors
 * Users can select from these to add to their portfolio
 */
export const SYSTEM_INVESTMENT_TYPES: SystemInvestmentType[] = [
    {
        id: 'stock',
        name: 'Stock',
        icon: 'monitoring',
        color: 'anime-blue',
        defaultAssets: [
            {
                name: 'Apple Inc.',
                symbol: 'AAPL',
                value: 25000,
                percentage: 40,
                change: 1200,
                changePercentage: 5.04,
            },
            {
                name: 'Tesla',
                symbol: 'TSLA',
                value: 18750,
                percentage: 30,
                change: -450,
                changePercentage: -2.34,
            },
            {
                name: 'Google',
                symbol: 'GOOGL',
                value: 18750,
                percentage: 30,
                change: 890,
                changePercentage: 4.98,
            },
        ],
    },
    {
        id: 'crypto',
        name: 'Crypto',
        icon: 'token',
        color: 'anime-purple',
        defaultAssets: [
            {
                name: 'Solana',
                symbol: 'SOL',
                value: 15000,
                percentage: 50,
                change: 750,
                changePercentage: 5.26,
            },
            {
                name: 'Bitcoin',
                symbol: 'BTC',
                value: 9000,
                percentage: 30,
                change: -200,
                changePercentage: -2.17,
            },
            {
                name: 'Ethereum',
                symbol: 'ETH',
                value: 6000,
                percentage: 20,
                change: 150,
                changePercentage: 2.56,
            },
        ],
    },
    {
        id: 'real_estate',
        name: 'Real Estate',
        icon: 'home_work',
        color: 'anime-mint',
        defaultAssets: [
            {
                name: 'Vanguard REIT',
                symbol: 'VNQ',
                value: 12000,
                percentage: 60,
                change: 240,
                changePercentage: 2.04,
            },
            {
                name: 'Property Token',
                symbol: 'PROP',
                value: 8000,
                percentage: 40,
                change: 120,
                changePercentage: 1.52,
            },
        ],
    },
    {
        id: 'bonds',
        name: 'Bonds',
        icon: 'request_quote',
        color: 'anime-yellow',
        defaultAssets: [
            {
                name: 'US Treasury',
                symbol: 'T-BOND',
                value: 15000,
                percentage: 60,
                change: 75,
                changePercentage: 0.5,
            },
            {
                name: 'Corporate Bonds',
                symbol: 'CORP',
                value: 10000,
                percentage: 40,
                change: 50,
                changePercentage: 0.5,
            },
        ],
    },
    {
        id: 'commodities',
        name: 'Commodities',
        icon: 'agriculture',
        color: 'anime-orange',
        defaultAssets: [
            {
                name: 'Gold',
                symbol: 'GOLD',
                value: 12000,
                percentage: 50,
                change: 360,
                changePercentage: 3.09,
            },
            {
                name: 'Silver',
                symbol: 'SILVER',
                value: 8000,
                percentage: 33.33,
                change: -120,
                changePercentage: -1.48,
            },
            {
                name: 'Oil',
                symbol: 'OIL',
                value: 4000,
                percentage: 16.67,
                change: 80,
                changePercentage: 2.04,
            },
        ],
    },
    {
        id: 'cash',
        name: 'Cash',
        icon: 'account_balance_wallet',
        color: 'anime-pink',
        defaultAssets: [
            {
                name: 'USD Savings',
                symbol: 'USD',
                value: 15000,
                percentage: 75,
                change: 0,
                changePercentage: 0,
            },
            {
                name: 'USDC Stablecoin',
                symbol: 'USDC',
                value: 5000,
                percentage: 25,
                change: 25,
                changePercentage: 0.5,
            },
        ],
    },
]

// Default active investment types for new users
export const DEFAULT_ACTIVE_INVESTMENT_TYPE_IDS = ['stock', 'crypto', 'real_estate']

// AsyncStorage key
export const ACTIVE_INVESTMENT_TYPES_KEY = '@active_investment_types'
