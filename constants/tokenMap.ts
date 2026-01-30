export const TOKEN_CATEGORY_MAP: Record<string, string> = {
    // Cash (Stablecoins)
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'cash', // USDC
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'cash', // USDT

    // Crypto (Default fallbacks or specific majors like SOL)
    'So11111111111111111111111111111111111111112': 'crypto', // SOL

    // Commodities (gold and silver)
    'Xsv9hRk1z5ystj9MhnA7Lq4vjSsLwzL2nxrwmwtD3re': 'commodities', // Gold
    '7C56WnJ94iEP7YeH2iKiYpvsS5zkcpP9rJBBEBoUGdzj': 'commodities', // Silver
}

export const FALLBACK_CATEGORY = 'crypto'
