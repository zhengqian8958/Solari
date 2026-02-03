import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { PORTFOLIO_COLORS, INVESTMENT_TYPE_COLORS } from '../../constants/portfolioTheme'

interface PortfolioSummaryProps {
    totalValue: number
    change: number
    changePercentage: number
    percentage?: number // Portfolio percentage
    icon?: string // Investment type icon name
    color?: string // Investment type color key
}

// Icon mapping for investment types
const ICON_SOURCES: Record<string, any> = {
    'monitoring': require('../../assets/icons/stock.png'),
    'token': require('../../assets/icons/crypto.png'),
    'home_work': require('../../assets/icons/real_estate.png'),
    'request_quote': require('../../assets/icons/bonds.png'),
    'agriculture': require('../../assets/icons/commodities.png'),
    'account_balance_wallet': require('../../assets/icons/cash.png'),
}

export function PortfolioSummary({
    totalValue,
    change,
    changePercentage,
    percentage,
    icon,
    color
}: PortfolioSummaryProps) {
    const formattedValue = `$${totalValue.toLocaleString()}`

    // If percentage is provided, show portfolio allocation badge
    const showPercentageBadge = percentage !== undefined && icon && color
    const bgColor = color ? INVESTMENT_TYPE_COLORS[color] : PORTFOLIO_COLORS['anime-pink']

    // For change badge (main hub view)
    const isPositive = change >= 0
    const formattedChange = `${isPositive ? '+' : ''}${changePercentage.toFixed(2)}% ($${Math.abs(change).toLocaleString()})`

    return (
        <View style={styles.container}>
            <Text style={styles.totalValue}>{formattedValue}</Text>
            {showPercentageBadge ? (
                // Investment type view: show percentage badge
                <View
                    style={[
                        styles.changeBadge,
                        { backgroundColor: bgColor },
                    ]}
                >
                    <Image
                        source={ICON_SOURCES[icon] || ICON_SOURCES['monitoring']}
                        style={styles.iconImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.changeText}>
                        {percentage.toFixed(0)}% of Portfolio
                    </Text>
                </View>
            ) : (
                // Main hub view: show change badge
                <View
                    style={[
                        styles.changeBadge,
                        { backgroundColor: isPositive ? PORTFOLIO_COLORS['anime-mint'] : PORTFOLIO_COLORS['anime-pink'] },
                    ]}
                >
                    <Text style={styles.changeIcon}>{isPositive ? '📈' : '📉'}</Text>
                    <Text style={styles.changeText}>{formattedChange}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    totalValue: {
        fontSize: 48,
        fontWeight: '900',
        color: '#000',
        letterSpacing: -1,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
        marginTop: 12,
    },
    changeIcon: {
        fontSize: 16,
    },
    iconImage: {
        width: 28,
        height: 28,
    },
    changeText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 16,
        paddingLeft: 8,
    },
})
