import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { usePortfolio } from '../../../store/portfolioStore'
import { PieChart } from '../../../components/portfolio/PieChart'
import { PortfolioSummary } from '../../../components/portfolio/PortfolioSummary'
import { AssetCard } from '../../../components/portfolio/AssetCard'
import { PortfolioHeader } from '../../../components/portfolio/PortfolioHeader'
import { BottomNav } from '../../../components/portfolio/BottomNav'
import { INVESTMENT_TYPE_COLORS } from '../../../constants/portfolioTheme'
import { AddInvestmentTypeModal } from '../../../components/portfolio/AddInvestmentTypeModal'
import { SettingsDrawer } from '../../../components/portfolio/SettingsDrawer'
import { SwipeableCard } from '../../../components/portfolio/SwipeableCard'
import { AddAssetDialog } from '../../../components/portfolio/AddAssetDialog'
import { EmptyInvestmentTypeState } from '../../../components/portfolio/EmptyInvestmentTypeState'
import { SwipeableScreen } from '../../../components/portfolio/SwipeableScreen'
import { getInvestmentTypeShades } from '../../../utils/colorUtils'

export default function InvestmentTypeScreen() {
    const router = useRouter()
    const {
        portfolio,
        selectedInvestmentTypeId,
        setSelectedInvestmentType,
        getInvestmentType,
        addInvestmentType,
        removeAsset,
        addAsset,
        activeInvestmentTypeIds,
        refreshPortfolio,
        isRefreshing,
    } = usePortfolio()

    const [showAddTypeModal, setShowAddTypeModal] = useState(false)
    const [showSettingsDrawer, setShowSettingsDrawer] = useState(false)
    const [showAddAssetDialog, setShowAddAssetDialog] = useState(false)

    const investmentType = selectedInvestmentTypeId
        ? getInvestmentType(selectedInvestmentTypeId)
        : null

    // Handle navigation in useEffect to avoid state updates during render
    useEffect(() => {
        if (!investmentType && selectedInvestmentTypeId !== null) {
            router.replace('/(tabs)/portfolio' as any)
        }
    }, [investmentType, selectedInvestmentTypeId, router])

    // Show nothing while redirecting
    if (!investmentType) {
        return null
    }

    const handleTabChange = (investmentTypeId: string | null) => {
        if (investmentTypeId === null) {
            // Go back to Hub
            setSelectedInvestmentType(null)
            router.back()
        } else if (investmentTypeId !== selectedInvestmentTypeId) {
            // Switch to different investment type
            setSelectedInvestmentType(investmentTypeId)
        }
    }

    const handleWalletPress = () => {
        // TODO: Integrate with existing MWA connection
        console.log('Wallet pressed - connect to MWA')
    }

    const handleDeleteAsset = async (assetId: string) => {
        await removeAsset(investmentType.id, assetId)
    }

    const handleAddAsset = async (name: string, amount: number) => {
        await addAsset(investmentType.id, name, amount)
    }

    const handleSwipeLeft = () => {
        // Swipe left navigates to next investment type
        const currentIndex = portfolio.investmentTypes.findIndex(t => t.id === selectedInvestmentTypeId)
        if (currentIndex !== -1 && currentIndex < portfolio.investmentTypes.length - 1) {
            const nextType = portfolio.investmentTypes[currentIndex + 1]
            setSelectedInvestmentType(nextType.id)
        }
    }

    const handleSwipeRight = () => {
        // Swipe right navigates to previous investment type or hub
        const currentIndex = portfolio.investmentTypes.findIndex(t => t.id === selectedInvestmentTypeId)
        if (currentIndex > 0) {
            // Go to previous investment type
            const prevType = portfolio.investmentTypes[currentIndex - 1]
            setSelectedInvestmentType(prevType.id)
        } else if (currentIndex === 0) {
            // Go back to hub
            setSelectedInvestmentType(null)
            router.back()
        }
    }

    // For crypto: group tokens NOT in the 4 featured mints into "Other"
    // Source of truth: the 4 addresses listed as featured in tokenMap.ts
    const FEATURED_CRYPTO_MINTS = new Set([
        'So11111111111111111111111111111111111111112',      // SOL
        '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',  // BTC (wrapped)
        '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',  // ETH (WETH on Solana)
        'SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3',   // SKR
    ])
    const isCrypto = investmentType.id === 'crypto'

    const isFeatured = (a: any) =>
        FEATURED_CRYPTO_MINTS.has(a.mint) || FEATURED_CRYPTO_MINTS.has(a.id)

    // Build the displayed asset list (either all assets or grouped crypto list)
    const displayedAssets = isCrypto
        ? (() => {
            const featured = investmentType.assets.filter(isFeatured)
            const others = investmentType.assets.filter(a => !isFeatured(a))
            if (others.length === 0) return featured
            const otherValue = others.reduce((sum, a) => sum + a.value, 0)
            const otherChange = others.reduce((sum, a) => sum + a.change, 0)
            const otherPercentage = others.reduce((sum, a) => sum + a.percentage, 0)
            const otherChangePercentage =
                otherValue > 0 ? (otherChange / (otherValue - otherChange)) * 100 : 0
            return [
                ...featured,
                {
                    id: 'other',
                    name: 'Other',
                    value: otherValue,
                    change: otherChange,
                    percentage: otherPercentage,
                    changePercentage: otherChangePercentage,
                },
            ]
        })()
        : investmentType.assets

    const pieSegments = displayedAssets.map((asset, index) => ({
        id: asset.id,
        percentage: asset.percentage,
        color: getInvestmentTypeShades(investmentType.id, displayedAssets.length)[index],
    }))

    const hasAssets = investmentType.assets.length > 0

    return (
        <SwipeableScreen
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            canSwipeLeft={portfolio.investmentTypes.findIndex(t => t.id === selectedInvestmentTypeId) < portfolio.investmentTypes.length - 1}
            canSwipeRight={true}
        >
            <View style={styles.container}>
                <LinearGradient colors={['#fdf2f8', '#e0f2fe']} style={styles.gradient}>
                    <PortfolioHeader
                        title={`${investmentType.name} Portfolio`}
                        onMenuPress={() => setShowSettingsDrawer(true)}
                        onWalletPress={handleWalletPress}
                    />

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={refreshPortfolio}
                                tintColor="#000"
                                colors={["#000"]}
                            />
                        }
                    >
                        {/* Portfolio Summary */}
                        <PortfolioSummary
                            totalValue={investmentType.totalValue}
                            change={investmentType.change}
                            changePercentage={investmentType.changePercentage}
                            percentage={investmentType.percentage}
                            icon={investmentType.icon}
                            color={investmentType.color}
                        />

                        {hasAssets ? (
                            <>
                                {/* Pie Chart - Non-interactive for individual assets */}
                                <View style={styles.pieChartSection}>
                                    <View style={styles.pieChartContainer}>
                                        <PieChart segments={pieSegments} size={300} interactive={false} />
                                        {/* Center label - Change info */}
                                        <View style={styles.centerLabel}>
                                            {/* First line: Icon + Percentage */}
                                            <View style={styles.centerRow}>
                                                <Image
                                                    source={investmentType.change >= 0
                                                        ? require('../../../assets/icons/increase.png')
                                                        : require('../../../assets/icons/decrease.png')
                                                    }
                                                    style={styles.changeIcon}
                                                    resizeMode="contain"
                                                />
                                                <Text style={[
                                                    styles.centerPercentage,
                                                    { color: investmentType.change >= 0 ? '#10b981' : '#ef4444' }
                                                ]}>
                                                    {investmentType.changePercentage >= 0 ? '+' : ''}{investmentType.changePercentage.toFixed(2)}%
                                                </Text>
                                            </View>
                                            {/* Separator line */}
                                            <View style={styles.centerSeparator} />
                                            {/* Second line: Value */}
                                            <Text style={[
                                                styles.centerValue,
                                                { color: investmentType.change >= 0 ? '#10b981' : '#ef4444' }
                                            ]}>
                                                {investmentType.change >= 0 ? '+' : ''}${Math.abs(investmentType.change).toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Assets Section */}
                                <View style={styles.assetsSection}>
                                    <Text style={styles.sectionTitle}>
                                        {investmentType.name} Assets
                                    </Text>

                                    <View style={styles.assetsList}>
                                        {displayedAssets.map((asset, index) => {
                                            const isOther = asset.id === 'other'
                                            return isOther ? (
                                                // "Other" entry is not swipe-deletable
                                                <AssetCard
                                                    key="other"
                                                    id="other"
                                                    name="Other"
                                                    percentage={asset.percentage}
                                                    value={asset.value}
                                                    change={asset.change}
                                                    changePercentage={asset.changePercentage}
                                                    icon={investmentType.icon}
                                                    color={pieSegments[index]?.color ?? '#b794f4'}
                                                    variant="static"
                                                />
                                            ) : (
                                                <SwipeableCard
                                                    key={asset.id}
                                                    onDelete={() => handleDeleteAsset(asset.id)}
                                                    enabled
                                                >
                                                    <AssetCard
                                                        id={asset.id}
                                                        name={asset.name}
                                                        percentage={asset.percentage}
                                                        value={asset.value}
                                                        change={asset.change}
                                                        changePercentage={asset.changePercentage}
                                                        icon={investmentType.icon}
                                                        color={pieSegments[index]?.color ?? '#b794f4'}
                                                        variant="static"
                                                    />
                                                </SwipeableCard>
                                            )
                                        })}
                                    </View>
                                </View>
                            </>
                        ) : (
                            <EmptyInvestmentTypeState
                                investmentTypeName={investmentType.name}
                                onAddAsset={() => setShowAddAssetDialog(true)}
                            />
                        )}
                    </ScrollView>

                    {/* Floating Add Asset Button */}
                    {hasAssets && (
                        <TouchableOpacity
                            style={styles.floatingAddButton}
                            onPress={() => setShowAddAssetDialog(true)}
                        >
                            <MaterialCommunityIcons name="plus" size={28} color="#000" />
                        </TouchableOpacity>
                    )}

                    <BottomNav
                        investmentTypes={portfolio.investmentTypes}
                        activeTab={selectedInvestmentTypeId}
                        onTabChange={handleTabChange}
                        onAddType={() => setShowAddTypeModal(true)}
                    />

                    <AddInvestmentTypeModal
                        visible={showAddTypeModal}
                        onClose={() => setShowAddTypeModal(false)}
                        onSelectType={addInvestmentType}
                        existingTypes={activeInvestmentTypeIds}
                    />

                    <AddAssetDialog
                        visible={showAddAssetDialog}
                        onClose={() => setShowAddAssetDialog(false)}
                        onAdd={handleAddAsset}
                        investmentTypeName={investmentType.name}
                    />

                    <SettingsDrawer
                        visible={showSettingsDrawer}
                        onClose={() => setShowSettingsDrawer(false)}
                    />
                </LinearGradient>
            </View>
        </SwipeableScreen>
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
    centerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    changeIcon: {
        width: 24,
        height: 24,
    },
    centerPercentage: {
        fontSize: 28,
        fontWeight: '900',
    },
    centerSeparator: {
        width: 120,
        height: 2,
        backgroundColor: '#000',
        marginVertical: 6,
    },
    centerValue: {
        fontSize: 20,
        fontWeight: '700',
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
    floatingAddButton: {
        position: 'absolute',
        right: 20,
        bottom: 160,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#81e6d9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
})
