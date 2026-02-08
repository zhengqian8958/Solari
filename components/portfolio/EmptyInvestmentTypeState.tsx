import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { PORTFOLIO_COLORS } from '../../constants/portfolioTheme'

interface EmptyInvestmentTypeStateProps {
    investmentTypeName: string
    onAddAsset: () => void
}

export function EmptyInvestmentTypeState({
    investmentTypeName,
    onAddAsset,
}: EmptyInvestmentTypeStateProps) {
    return (
        <View style={styles.container}>
            <View style={styles.emptyCircle}>
                <View style={styles.innerCircle} />
            </View>

            <Text style={styles.title}>No Assets Yet</Text>
            <Text style={styles.subtitle}>Add your first asset to {investmentTypeName}</Text>

            <TouchableOpacity style={styles.addButton} onPress={onAddAsset}>
                <MaterialCommunityIcons name="plus-circle" size={32} color="#000" />
                <Text style={styles.addButtonText}>Add Asset</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 12,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#f8fafc',
    },
    innerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#cbd5e1',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 32,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: PORTFOLIO_COLORS['anime-yellow'],
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
    },
})
