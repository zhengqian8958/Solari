import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { PORTFOLIO_COLORS } from '@/constants/portfolioTheme'

/**
 * Peeking anime-style mascot for the login screen
 * Matches the app icon design with chart ring and cute character
 */
export function LoginMascot() {
    return (
        <View style={styles.container}>
            <View style={styles.iconCanvas}>
                {/* Colorful Pie Chart Ring */}
                <View style={styles.chartHalo}>
                    <Svg width="220" height="220" viewBox="0 0 100 100" style={{ transform: [{ rotate: '-45deg' }] }}>
                        {/* Black background ring */}
                        <Circle cx="50" cy="50" r="38" stroke="#000" strokeWidth="16" fill="none" />
                        {/* Cyan segment */}
                        <Circle cx="50" cy="50" r="38" stroke={PORTFOLIO_COLORS['anime-mint']} strokeWidth="12" strokeDasharray="80 238.7" strokeLinecap="butt" fill="none" />
                        {/* Pink segment */}
                        <Circle cx="50" cy="50" r="38" stroke={PORTFOLIO_COLORS['anime-pink']} strokeWidth="12" strokeDasharray="60 238.7" strokeDashoffset="-80" strokeLinecap="butt" fill="none" />
                        {/* Yellow segment */}
                        <Circle cx="50" cy="50" r="38" stroke={PORTFOLIO_COLORS['anime-yellow']} strokeWidth="12" strokeDasharray="50 238.7" strokeDashoffset="-140" strokeLinecap="butt" fill="none" />
                        {/* Purple segment */}
                        <Circle cx="50" cy="50" r="38" stroke={PORTFOLIO_COLORS['anime-purple']} strokeWidth="12" strokeDasharray="48.7 238.7" strokeDashoffset="-190" strokeLinecap="butt" fill="none" />
                    </Svg>
                </View>

                {/* Peeking Mascot */}
                <View style={styles.mascotContainer}>
                    {/* Character Head */}
                    <View style={styles.characterHead}>
                        {/* Top cyan highlight */}
                        <View style={styles.headHighlight} />

                        {/* Face features */}
                        <View style={styles.faceContainer}>
                            {/* Eyes */}
                            <View style={styles.eyesContainer}>
                                <View style={styles.eye} />
                                <View style={styles.eye} />
                            </View>
                            {/* Mouth */}
                            <View style={styles.mouth} />
                        </View>

                        {/* Left ear */}
                        <View style={[styles.ear, styles.leftEar]} />
                        {/* Right ear */}
                        <View style={[styles.ear, styles.rightEar]} />

                        {/* Blush marks */}
                        <View style={[styles.blush, styles.leftBlush]} />
                        <View style={[styles.blush, styles.rightBlush]} />
                    </View>

                    {/* Feet peeking at bottom */}
                    <View style={styles.feetContainer}>
                        <View style={styles.foot} />
                        <View style={styles.foot} />
                    </View>
                </View>

                {/* Floor line */}
                <View style={styles.floorLine} />

                {/* Wall panel below */}
                <View style={styles.wallBottom} />
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
    iconCanvas: {
        width: 220,
        height: 220,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'visible',
    },
    chartHalo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mascotContainer: {
        position: 'relative',
        zIndex: 30,
        alignItems: 'center',
        transform: [{ translateY: -36 }, { rotate: '-8deg' }],
    },
    characterHead: {
        width: 115,
        height: 115,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 3,
        borderColor: '#000',
        position: 'relative',
        alignItems: 'center',
        paddingTop: 20,
        overflow: 'hidden',
        // Cel-shaded shadow
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    headHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(129, 230, 217, 0.05)', // anime-mint with low opacity
    },
    faceContainer: {
        alignItems: 'center',
        gap: 8,
        zIndex: 10,
    },
    eyesContainer: {
        flexDirection: 'row',
        gap: 18,
        marginTop: 10,
    },
    eye: {
        width: 12,
        height: 12,
        backgroundColor: '#000',
        borderRadius: 12,
    },
    mouth: {
        width: 22,
        height: 4,
        backgroundColor: '#000',
        borderRadius: 2,
        marginTop: 4,
    },
    ear: {
        position: 'absolute',
        width: 22,
        height: 22,
        backgroundColor: PORTFOLIO_COLORS['anime-pink'],
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 8,
    },
    leftEar: {
        top: -3,
        left: -3,
        transform: [{ rotate: '-15deg' }],
    },
    rightEar: {
        top: -3,
        right: -3,
        transform: [{ rotate: '15deg' }],
    },
    blush: {
        position: 'absolute',
        width: 12,
        height: 4,
        backgroundColor: 'rgba(255, 133, 162, 0.4)', // anime-pink with opacity
        borderRadius: 2,
    },
    leftBlush: {
        top: 54,
        left: 10,
    },
    rightBlush: {
        top: 54,
        right: 10,
    },
    feetContainer: {
        flexDirection: 'row',
        gap: 55,
        position: 'absolute',
        bottom: -12,
        zIndex: 50,
    },
    foot: {
        width: 25,
        height: 25,
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 25,
    },
    floorLine: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#000',
        zIndex: 45,
    },
    wallBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#ecc8ed', // pink color matching login background gradient
        zIndex: 40,
    },
})
