import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { InvestmentType } from '../../types/portfolio.types'
import { INVESTMENT_TYPE_COLORS, PORTFOLIO_COLORS } from '../../constants/portfolioTheme'

interface BottomNavProps {
    investmentTypes: InvestmentType[]
    activeTab: string | null // null = Hub (global view)
    onTabChange: (investmentTypeId: string | null) => void
    onAddType: () => void
}

export function BottomNav({ investmentTypes, activeTab, onTabChange, onAddType }: BottomNavProps) {
    const allTabs = [
        { id: null, name: 'Hub', icon: 'home', color: 'anime-pink' },
        ...investmentTypes.map((type) => ({
            id: type.id,
            name: type.name,
            icon: getIconName(type.icon),
            color: type.color,
        })),
    ]

    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {allTabs.map((tab) => {
                        const isActive = tab.id === activeTab
                        const tabColor = INVESTMENT_TYPE_COLORS[tab.color] || PORTFOLIO_COLORS['anime-pink']

                        return (
                            <TouchableOpacity
                                key={tab.id || 'hub'}
                                style={styles.tab}
                                onPress={() => onTabChange(tab.id)}
                            >
                                <MaterialCommunityIcons
                                    name={tab.icon as any}
                                    size={isActive ? 36 : 24}
                                    color={isActive ? tabColor : '#94a3b8'}
                                />
                                <Text
                                    style={[
                                        styles.tabLabel,
                                        { color: isActive ? tabColor : '#94a3b8' },
                                    ]}
                                >
                                    {tab.name.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}

                    {/* Add button */}
                    <TouchableOpacity style={styles.addButton} onPress={onAddType}>
                        <MaterialCommunityIcons name="plus" size={24} color="#000" />
                    </TouchableOpacity>
                </ScrollView>
            </View>
            {/* Bottom safe area - matches design */}
            <View style={styles.bottomSafeArea} />
        </View>
    )
}

function getIconName(systemIcon: string): string {
    const iconMap: Record<string, string> = {
        monitoring: 'chart-line',
        token: 'bitcoin',
        home_work: 'office-building',
        request_quote: 'file-document',
        agriculture: 'barley',
        account_balance_wallet: 'wallet',
    }
    return iconMap[systemIcon] || 'circle'
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 3,
        borderTopColor: '#000',
    },
    navContainer: {
        paddingTop: 16,
        paddingBottom: 32,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
        alignItems: 'center',
    },
    tab: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        minWidth: 64,
        paddingHorizontal: 8,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: PORTFOLIO_COLORS['anime-yellow'],
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    bottomSafeArea: {
        height: 32,
        backgroundColor: '#fff',
    },
})
