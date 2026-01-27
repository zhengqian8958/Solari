import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { PORTFOLIO_COLORS, INVESTMENT_TYPE_COLORS } from '../../constants/portfolioTheme'

interface AssetCardProps {
    id: string
    name: string
    percentage: number
    value: number
    change: number
    changePercentage: number
    icon: string
    color: string // This should now be a hex color string
    variant: 'clickable' | 'static'
    onPress?: () => void
}

export function AssetCard({
    name,
    percentage,
    value,
    change,
    changePercentage,
    icon,
    color,
    variant,
    onPress,
}: AssetCardProps) {
    const backgroundColor = color // Use color directly as hex color
    const isPositive = change >= 0

    const content = (
        <View style={[styles.card, { backgroundColor }]}>
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconEmoji}>{getIconEmoji(icon)}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.percentage}>{percentage.toFixed(0)}% Contribution</Text>
                </View>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.value}>${value.toLocaleString()}</Text>
                <View
                    style={[
                        styles.changeBadge,
                        {
                            backgroundColor: isPositive
                                ? 'rgba(255, 255, 255, 0.5)'
                                : 'rgba(255, 255, 255, 0.5)',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.changeText,
                            { color: isPositive ? '#065f46' : '#991b1b' },
                        ]}
                    >
                        {isPositive ? '+' : ''}{changePercentage.toFixed(1)}%
                    </Text>
                </View>
            </View>
        </View>
    )

    if (variant === 'clickable' && onPress) {
        return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
    }

    return content
}

// Map icon names to emojis
function getIconEmoji(iconName: string): string {
    const emojiMap: Record<string, string> = {
        monitoring: '📈',
        token: '🪙',
        home_work: '🏢',
        request_quote: '📜',
        agriculture: '🌾',
        account_balance_wallet: '💰',
    }
    return emojiMap[iconName] || '💎'
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
        marginBottom: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    iconEmoji: {
        fontSize: 28,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
        marginBottom: 2,
    },
    percentage: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1e293b',
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    value: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
        marginBottom: 4,
    },
    changeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    changeText: {
        fontSize: 10,
        fontWeight: '900',
    },
})
