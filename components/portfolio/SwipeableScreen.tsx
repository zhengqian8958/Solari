import React, { ReactNode } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3 // 30% of screen width
const VELOCITY_THRESHOLD = 500 // pixels per second

interface SwipeableScreenProps {
    children: ReactNode
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    canSwipeLeft?: boolean
    canSwipeRight?: boolean
}

export function SwipeableScreen({
    children,
    onSwipeLeft,
    onSwipeRight,
    canSwipeLeft = true,
    canSwipeRight = true,
}: SwipeableScreenProps) {
    const panGesture = Gesture.Pan()
        .onEnd((event) => {
            const { translationX, velocityX } = event

            // Detect swipe left (moving finger to the left)
            if (translationX < -SWIPE_THRESHOLD || velocityX < -VELOCITY_THRESHOLD) {
                if (canSwipeLeft && onSwipeLeft) {
                    onSwipeLeft()
                }
            }
            // Detect swipe right (moving finger to the right)
            else if (translationX > SWIPE_THRESHOLD || velocityX > VELOCITY_THRESHOLD) {
                if (canSwipeRight && onSwipeRight) {
                    onSwipeRight()
                }
            }
        })
        .runOnJS(true)

    return (
        <GestureDetector gesture={panGesture}>
            <View style={styles.container}>{children}</View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
