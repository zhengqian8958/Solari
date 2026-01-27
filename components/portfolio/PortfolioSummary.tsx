import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { PORTFOLIO_COLORS } from '../../constants/portfolioTheme'

interface PortfolioSummaryProps {
    totalValue: number
    change: number
    changePercentage: number
}

export function PortfolioSummary({ totalValue, change, changePercentage }: PortfolioSummaryProps) {
    const isPositive = change >= 0
    const formattedValue = `$${totalValue.toLocaleString()}`
    const formattedChange = `${isPositive ? '+' : ''}${changePercentage.toFixed(2)}% ($${Math.abs(change).toLocaleString()})`

    return (
        <View style={styles.container}>
            <Text style={styles.totalValue}>{formattedValue}</Text>
            <View
                style={[
                    styles.changeBadge,
                    { backgroundColor: isPositive ? PORTFOLIO_COLORS['anime-mint'] : PORTFOLIO_COLORS['anime-pink'] },
                ]}
            >
                <Text style={styles.changeIcon}>{isPositive ? '📈' : '📉'}</Text>
                <Text style={styles.changeText}>{formattedChange}</Text>
            </View>
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
    changeText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 14,
    },
})
