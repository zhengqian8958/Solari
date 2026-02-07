import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export function WalletLoadingOverlay() {
    return (
        <View style={styles.container}>
            <LinearGradient colors={['#fdf2f8', '#e0f2fe']} style={styles.gradient}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#8b5cf6" />
                    <Text style={styles.loadingText}>Checking your wallet...</Text>
                    <Text style={styles.subText}>Please wait while we fetch your assets</Text>
                </View>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 8,
    },
    subText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
})
