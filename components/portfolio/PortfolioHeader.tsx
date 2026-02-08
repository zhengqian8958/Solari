import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface PortfolioHeaderProps {
    title: string
    onMenuPress: () => void
    onWalletPress: () => void
}

export function PortfolioHeader({ title, onMenuPress, onWalletPress }: PortfolioHeaderProps) {
    const insets = useSafeAreaInsets()

    return (
        <View style={[styles.header, { paddingTop: insets.top }]}>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
                        <MaterialCommunityIcons name="menu" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>{title}</Text>

                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.walletButton} onPress={onWalletPress}>
                        <MaterialCommunityIcons name="wallet" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderBottomWidth: 3,
        borderBottomColor: '#000',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        maxWidth: 448,
        marginHorizontal: 'auto',
    },
    leftSection: {
        width: 48,
        alignItems: 'flex-start',
    },
    rightSection: {
        width: 48,
        alignItems: 'flex-end',
    },
    menuButton: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    walletButton: {
        width: 40,
        height: 40,
        backgroundColor: '#ff85a2',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
        flex: 1,
    },
})
