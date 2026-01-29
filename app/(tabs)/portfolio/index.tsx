import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { usePortfolio } from '../../../store/portfolioStore'
import { PieChart } from '../../../components/portfolio/PieChart'
import { PortfolioSummary } from '../../../components/portfolio/PortfolioSummary'
import { AssetCard } from '../../../components/portfolio/AssetCard'
import { PortfolioHeader } from '../../../components/portfolio/PortfolioHeader'
import { BottomNav } from '../../../components/portfolio/BottomNav'
import { AddInvestmentTypeModal } from '../../../components/portfolio/AddInvestmentTypeModal'
import { SettingsDrawer } from '../../../components/portfolio/SettingsDrawer'
import { SwipeableCard } from '../../../components/portfolio/SwipeableCard'
import { EmptyHubState } from '../../../components/portfolio/EmptyHubState'
import { INVESTMENT_TYPE_COLORS } from '../../../constants/portfolioTheme'

export default function PortfolioIndexScreen() {
    const router = useRouter()
    const {
        portfolio,
        setSelectedInvestmentType,
        addInvestmentType,
        removeInvestmentType,
        activeInvestmentTypeIds,
    } = usePortfolio()

    const [showAddTypeModal, setShowAddTypeModal] = useState(false)
    const [showSettingsDrawer, setShowSettingsDrawer] = useState(false)

    const handlePieSegmentPress = (investmentTypeId: string) => {
        setSelectedInvestmentType(investmentTypeId)
        router.push('/(tabs)/portfolio/investment-type' as any)
    }

    const handleAssetCardPress = (investmentTypeId: string) => {
        setSelectedInvestmentType(investmentTypeId)
        router.push('/(tabs)/portfolio/investment-type' as any)
    }

    const handleTabChange = (investmentTypeId: string | null) => {
        if (investmentTypeId === null) {
            // Already on Hub - do nothing
            return
        }
        setSelectedInvestmentType(investmentTypeId)
        router.push('/(tabs)/portfolio/investment-type' as any)
    }

    const handleWalletPress = () => {
        // TODO: Integrate with existing MWA connection
        console.log('Wallet pressed - connect to MWA')
    }

    const handleDeleteInvestmentType = async (typeId: string) => {
        await removeInvestmentType(typeId)
    }

    const handleAddInvestmentType = async (typeId: string) => {
        await addInvestmentType(typeId)
        setShowAddTypeModal(false)
    }

    // Show empty state if no investment types
    if (activeInvestmentTypeIds.length === 0) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#fdf2f8', '#e0f2fe']} style={styles.gradient}>
                    <PortfolioHeader
                        title="My Vault ✨"
                        onMenuPress={() => setShowSettingsDrawer(true)}
                        onWalletPress={handleWalletPress}
                    />

                    <EmptyHubState onSelectType={handleAddInvestmentType} />

                    <SettingsDrawer
                        visible={showSettingsDrawer}
                        onClose={() => setShowSettingsDrawer(false)}
                    />
                </LinearGradient>
            </View>
        )
    }

    const pieSegments = portfolio.investmentTypes.map((type) => ({
        id: type.id,
        percentage: type.percentage,
        color: INVESTMENT_TYPE_COLORS[type.id], // Use type.id to look up color
    }))

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#fdf2f8', '#e0f2fe']} style={styles.gradient}>
                <PortfolioHeader
                    title="My Vault ✨"
                    onMenuPress={() => setShowSettingsDrawer(true)}
                    onWalletPress={handleWalletPress}
                />

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Portfolio Summary */}
                    <PortfolioSummary
                        totalValue={portfolio.totalValue}
                        change={portfolio.totalChange}
                        changePercentage={portfolio.totalChangePercentage}
                    />

                    {/* Pie Chart */}
                    <View style={styles.pieChartSection}>
                        <View style={styles.pieChartContainer}>
                            <PieChart
                                segments={pieSegments}
                                size={300}
                                onSegmentPress={handlePieSegmentPress}
                                interactive
                            />
                            {/* Center label */}
                            <View style={styles.centerLabel}>
                                <Text style={styles.centerLabelSmall}>MASTERY</Text>
                                <Text style={styles.centerLabelLarge}>100%</Text>
                            </View>
                        </View>
                    </View>

                    {/* Asset Squad Section */}
                    <View style={styles.assetsSection}>
                        <Text style={styles.sectionTitle}>✨ Asset Squad</Text>

                        <View style={styles.assetsList}>
                            {portfolio.investmentTypes.map((type, index) => (
                                <SwipeableCard
                                    key={type.id}
                                    onDelete={() => handleDeleteInvestmentType(type.id)}
                                    enabled
                                >
                                    <AssetCard
                                        id={type.id}
                                        name={type.name}
                                        percentage={type.percentage}
                                        value={type.totalValue}
                                        change={type.change}
                                        changePercentage={type.changePercentage}
                                        icon={type.icon}
                                        color={pieSegments[index]?.color || INVESTMENT_TYPE_COLORS[type.id]}
                                        variant="clickable"
                                        onPress={() => handleAssetCardPress(type.id)}
                                    />
                                </SwipeableCard>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <BottomNav
                    investmentTypes={portfolio.investmentTypes}
                    activeTab={null} // Hub is active
                    onTabChange={handleTabChange}
                    onAddType={() => setShowAddTypeModal(true)}
                />

                <AddInvestmentTypeModal
                    visible={showAddTypeModal}
                    onClose={() => setShowAddTypeModal(false)}
                    onSelectType={handleAddInvestmentType}
                    existingTypes={activeInvestmentTypeIds}
                />

                <SettingsDrawer
                    visible={showSettingsDrawer}
                    onClose={() => setShowSettingsDrawer(false)}
                />
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 180, // Space for bottom nav
    },
    pieChartSection: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    pieChartContainer: {
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 35,
    },
    centerLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    centerLabelSmall: {
        fontSize: 12,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 2,
        marginBottom: 4,
    },
    centerLabelLarge: {
        fontSize: 36,
        fontWeight: '900',
        color: '#000',
    },
    assetsSection: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    assetsList: {
        gap: 0,
    },
})
