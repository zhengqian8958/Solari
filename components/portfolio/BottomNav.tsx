import React, { useRef, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { InvestmentType } from '../../types/portfolio.types'
import { INVESTMENT_TYPE_COLORS, PORTFOLIO_COLORS } from '../../constants/portfolioTheme'

interface BottomNavProps {
    investmentTypes: InvestmentType[]
    activeTab: string | null // null = Hub (global view)
    onTabChange: (investmentTypeId: string | null) => void
    onAddType: () => void
}

// Icon mapping for investment types
const ICON_SOURCES: Record<string, any> = {
    'hub': require('../../assets/icons/hub_color.png'),
    'monitoring': require('../../assets/icons/stock_color.png'),
    'token': require('../../assets/icons/crypto_color.png'),
    'home_work': require('../../assets/icons/real_estate_color.png'),
    'request_quote': require('../../assets/icons/bonds_color.png'),
    'agriculture': require('../../assets/icons/commodities_color.png'),
    'account_balance_wallet': require('../../assets/icons/cash_color.png'),
}

const TAB_WIDTH = 80 // Approximate width of each tab including padding

export function BottomNav({ investmentTypes, activeTab, onTabChange, onAddType }: BottomNavProps) {
    const scrollViewRef = useRef<ScrollView>(null)

    const allTabs = [
        { id: null, name: 'Hub', icon: 'hub', color: 'anime-pink' },
        ...investmentTypes.map((type) => ({
            id: type.id,
            name: type.name,
            icon: type.icon,
            color: type.color,
        })),
    ]

    // Auto-scroll to active tab when it changes
    useEffect(() => {
        const activeIndex = allTabs.findIndex(tab => tab.id === activeTab)
        if (activeIndex !== -1 && scrollViewRef.current) {
            // Calculate scroll position to center the active tab
            const scrollX = Math.max(0, (activeIndex * TAB_WIDTH) - (TAB_WIDTH * 1.5))
            scrollViewRef.current.scrollTo({ x: scrollX, animated: true })
        }
    }, [activeTab])

    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {allTabs.map((tab) => {
                        const isActive = tab.id === activeTab
                        const iconSource = ICON_SOURCES[tab.icon] || ICON_SOURCES['hub']

                        return (
                            <TouchableOpacity
                                key={tab.id || 'hub'}
                                style={styles.tab}
                                onPress={() => onTabChange(tab.id)}
                            >
                                <Image
                                    source={iconSource}
                                    style={[
                                        styles.iconImage,
                                        {
                                            width: isActive ? 60 : 36,
                                            height: isActive ? 60 : 36,
                                            opacity: isActive ? 1 : 0.8
                                        }
                                    ]}
                                    resizeMode="contain"
                                />
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
    iconImage: {
        // Dynamic size and opacity are applied inline
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
