/**
 * Portfolio theme configuration
 * Anime/cel-shaded design tokens
 */

export const PORTFOLIO_COLORS = {
    'anime-pink': '#ff85a2',
    'anime-blue': '#72d5ff',
    'anime-purple': '#b794f4',
    'anime-yellow': '#fbd38d',
    'anime-orange': '#ffb37e',
    'anime-mint': '#81e6d9',
    'background-pastel': '#fdf2f8',
    black: '#000000',
    white: '#ffffff',
}

export const INVESTMENT_TYPE_COLORS: Record<string, string> = {
    stock: PORTFOLIO_COLORS['anime-blue'],
    crypto: PORTFOLIO_COLORS['anime-purple'],
    real_estate: PORTFOLIO_COLORS['anime-mint'],
    bonds: PORTFOLIO_COLORS['anime-yellow'],
    commodities: PORTFOLIO_COLORS['anime-orange'],
    cash: PORTFOLIO_COLORS['anime-pink'],
}

export const CEL_SHADE_STYLES = {
    default: {
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        borderWidth: 3,
        borderColor: '#000',
    },
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
        borderWidth: 2,
        borderColor: '#000',
    },
}

export const FONTS = {
    display: 'Fredoka',
    accent: 'Grandstander',
}
