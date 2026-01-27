import React from 'react'
import { View, StyleSheet } from 'react-native'
import { PORTFOLIO_COLORS } from '@/constants/portfolioTheme'

/**
 * Cute anime-style mascot for the login screen
 * Features a simple character with colorful circular background
 */
export function LoginMascot() {
    return (
        <View style={styles.container}>
            {/* Colorful circular background */}
            <View style={styles.circleContainer}>
                {/* Top-left purple blob */}
                <View style={[styles.colorBlob, styles.purpleBlob]} />
                {/* Top-right cyan blob */}
                <View style={[styles.colorBlob, styles.cyanBlob]} />
                {/* Bottom-left yellow blob */}
                <View style={[styles.colorBlob, styles.yellowBlob]} />
                {/* Bottom-right pink blob */}
                <View style={[styles.colorBlob, styles.pinkBlob]} />

                {/* Character container */}
                <View style={styles.characterContainer}>
                    {/* Character body */}
                    <View style={styles.characterBody}>
                        {/* Eyes */}
                        <View style={styles.eyesContainer}>
                            <View style={styles.eye} />
                            <View style={styles.eye} />
                        </View>
                        {/* Smile */}
                        <View style={styles.smile} />
                    </View>
                    {/* Character legs */}
                    <View style={styles.legsContainer}>
                        <View style={styles.leg} />
                        <View style={styles.leg} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    circleContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#f0f0f0',
        borderWidth: 3,
        borderColor: '#000',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    colorBlob: {
        position: 'absolute',
        borderRadius: 100,
    },
    purpleBlob: {
        width: 100,
        height: 100,
        backgroundColor: PORTFOLIO_COLORS['anime-purple'],
        top: -20,
        left: -10,
    },
    cyanBlob: {
        width: 90,
        height: 90,
        backgroundColor: PORTFOLIO_COLORS['anime-mint'],
        top: -15,
        right: -15,
    },
    yellowBlob: {
        width: 80,
        height: 80,
        backgroundColor: PORTFOLIO_COLORS['anime-yellow'],
        bottom: 20,
        left: -10,
    },
    pinkBlob: {
        width: 95,
        height: 95,
        backgroundColor: PORTFOLIO_COLORS['anime-pink'],
        bottom: -10,
        right: -20,
    },
    characterContainer: {
        alignItems: 'center',
        zIndex: 10,
    },
    characterBody: {
        width: 90,
        height: 90,
        backgroundColor: '#e0f7ff',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    eyesContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 10,
    },
    eye: {
        width: 8,
        height: 8,
        backgroundColor: '#000',
        borderRadius: 4,
    },
    smile: {
        width: 30,
        height: 3,
        backgroundColor: '#000',
        marginTop: 12,
    },
    legsContainer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: -3,
    },
    leg: {
        width: 12,
        height: 18,
        backgroundColor: '#000',
        borderRadius: 6,
    },
})
