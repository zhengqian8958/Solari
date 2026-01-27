import React, { useRef } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { PORTFOLIO_COLORS } from '../../constants/portfolioTheme'

interface SwipeableCardProps {
    children: React.ReactNode
    onDelete: () => void
    enabled?: boolean
}

export function SwipeableCard({ children, onDelete, enabled = true }: SwipeableCardProps) {
    const swipeableRef = useRef<Swipeable>(null)

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-100, -50, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: 'clamp',
        })

        return (
            <View style={styles.deleteContainer}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                        swipeableRef.current?.close()
                        onDelete()
                    }}
                >
                    <Animated.View style={{ transform: [{ scale }] }}>
                        <MaterialCommunityIcons name="delete" size={28} color="#fff" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        )
    }

    if (!enabled) {
        return <>{children}</>
    }

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            overshootRight={false}
            rightThreshold={40}
            friction={2}
        >
            {children}
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    deleteContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginBottom: 20, // Match AssetCard marginBottom
    },
    deleteButton: {
        backgroundColor: '#dc2626',
        width: 70,
        height: '90%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
})
