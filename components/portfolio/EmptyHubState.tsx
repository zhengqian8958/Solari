import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SYSTEM_INVESTMENT_TYPES } from '../../constants/systemInvestmentTypes'
import { INVESTMENT_TYPE_COLORS } from '../../constants/portfolioTheme'

interface EmptyHubStateProps {
    onSelectType: (typeId: string) => void
}

export function EmptyHubState({ onSelectType }: EmptyHubStateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.emoji}>✨</Text>
                <Text style={styles.title}>Start Your Portfolio</Text>
                <Text style={styles.subtitle}>Pick your first investment type to get started!</Text>
            </View>

            <View style={styles.grid}>
                {SYSTEM_INVESTMENT_TYPES.map((type) => (
                    <TouchableOpacity
                        key={type.id}
                        style={[styles.typeCard, { backgroundColor: INVESTMENT_TYPE_COLORS[type.id] }]}
                        onPress={() => onSelectType(type.id)}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={getIconImage(type.icon)} style={styles.iconImage} />
                        </View>
                        <Text style={styles.typeName}>{type.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

// Map icon names to image sources
function getIconImage(iconName: string) {
    const iconMap: Record<string, any> = {
        monitoring: require('../../assets/icons/stock.png'),
        token: require('../../assets/icons/crypto.png'),
        home_work: require('../../assets/icons/real_estate.png'),
        request_quote: require('../../assets/icons/bonds.png'),
        agriculture: require('../../assets/icons/commodities.png'),
        account_balance_wallet: require('../../assets/icons/cash.png'),
    }
    return iconMap[iconName] || iconMap.monitoring
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },
    typeCard: {
        width: '45%',
        aspectRatio: 1,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#000',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    typeName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
    },
})
