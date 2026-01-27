/**
 * Color utility functions for generating color variations
 */

/**
 * Generate an array of color shades from a base color
 * Creates lighter and darker variations for visual hierarchy
 */
export function generateColorShades(baseColor: string, count: number): string[] {
    // Parse hex color
    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    const shades: string[] = []

    // Generate variations by adjusting brightness
    for (let i = 0; i < count; i++) {
        const factor = 1 - (i * 0.15) // Gradually darken: 1.0, 0.85, 0.70, ...
        const newR = Math.max(0, Math.min(255, Math.round(r * factor)))
        const newG = Math.max(0, Math.min(255, Math.round(g * factor)))
        const newB = Math.max(0, Math.min(255, Math.round(b * factor)))

        const shade = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
        shades.push(shade)
    }

    return shades
}

/**
 * Predefined color families for each investment type
 * Each family contains shades of the base color
 */
export const INVESTMENT_COLOR_FAMILIES: Record<string, string[]> = {
    stock: [
        '#72d5ff', // Base blue
        '#5ab8e6', // Darker blue
        '#429bcc', // Even darker blue
        '#3a8ab8', // Deep blue
        '#2a6a8f', // Very deep blue
        '#1a4a6f', // Darkest blue
    ],
    crypto: [
        '#b794f4', // Base purple
        '#9f7ad9', // Darker purple
        '#8760be', // Even darker purple
        '#7550a8', // Deep purple
        '#5c3d85', // Very deep purple
        '#432a62', // Darkest purple
    ],
    real_estate: [
        '#81e6d9', // Base mint
        '#6ac9be', // Darker mint
        '#53aca3', // Even darker mint
        '#3c8f88', // Deep mint
        '#2d6b66', // Very deep mint
        '#1e4744', // Darkest mint
    ],
    bonds: [
        '#fbd38d', // Base yellow
        '#e8ba6f', // Darker yellow
        '#d4a151', // Even darker yellow
        '#c18833', // Deep yellow
        '#a36f15', // Very deep yellow
        '#855600', // Darkest yellow
    ],
    commodities: [
        '#ffb37e', // Base orange
        '#e69760', // Darker orange
        '#cc7b42', // Even darker orange
        '#b35f24', // Deep orange
        '#994306', // Very deep orange
        '#802700', // Darkest orange
    ],
    cash: [
        '#ff85a2', // Base pink
        '#e66884', // Darker pink
        '#cc4b66', // Even darker pink
        '#b32e48', // Deep pink
        '#99112a', // Very deep pink
        '#80000c', // Darkest pink
    ],
}

/**
 * Get color shades for a specific investment type
 */
export function getInvestmentTypeShades(investmentTypeId: string, count: number = 6): string[] {
    const predefinedShades = INVESTMENT_COLOR_FAMILIES[investmentTypeId]

    if (predefinedShades && predefinedShades.length >= count) {
        return predefinedShades.slice(0, count)
    }

    // Fallback: generate shades dynamically if not predefined
    const baseColor = predefinedShades?.[0] || '#72d5ff'
    return generateColorShades(baseColor, count)
}
