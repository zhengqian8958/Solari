import React from 'react'
import { View, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'

interface PieSegment {
    percentage: number
    color: string
    id: string
}

interface PieChartProps {
    segments: PieSegment[]
    size?: number
    strokeWidth?: number
    onSegmentPress?: (id: string) => void
    interactive?: boolean
}

export function PieChart({
    segments,
    size = 300,
    strokeWidth = 18,
    onSegmentPress,
    interactive = true,
}: PieChartProps) {
    const radius = 35 // Radius for the donut segments
    const circumference = 2 * Math.PI * radius
    const center = 50

    let accumulatedPercentage = 0

    // Add mounting delay to avoid Fabric race condition
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(true)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const handlePress = (event: GestureResponderEvent) => {
        if (!onSegmentPress || segments.length === 0) return

        const { locationX, locationY } = event.nativeEvent

        // Convert touch position to coordinates relative to center of the pie chart
        const centerX = size / 2
        const centerY = size / 2
        const dx = locationX - centerX
        const dy = locationY - centerY

        // Calculate angle in degrees (0° = right, 90° = bottom, 180° = left, 270° = top)
        let angle = Math.atan2(dy, dx) * (180 / Math.PI)

        // Normalize angle to 0-360 range
        angle = (angle + 360) % 360

        // Adjust for SVG rotation (-90deg) - our pie starts at top
        angle = (angle + 90) % 360

        // Find which segment this angle falls into
        let currentAngle = 0
        for (const segment of segments) {
            const segmentAngle = (segment.percentage / 100) * 360
            const endAngle = currentAngle + segmentAngle

            if (angle >= currentAngle && angle < endAngle) {
                onSegmentPress(segment.id)
                return
            }

            currentAngle = endAngle
        }

        // Fallback: if we didn't find a segment (edge case), use the last segment
        if (segments.length > 0) {
            onSegmentPress(segments[segments.length - 1].id)
        }
    }

    // Don't render SVG until component is mounted to avoid Fabric issues
    if (!isMounted) {
        return <View style={[styles.container, { width: size, height: size }]} />
    }

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                style={{ transform: [{ rotate: '-90deg' }] }}
            >
                {/* Outer black border circle */}
                <Circle cx={center} cy={center} r={44} stroke="#000" strokeWidth={12} fill="none" />

                {/* Colored pie segments */}
                <G>
                    {segments.map((segment, index) => {
                        const dashLength = (segment.percentage / 100) * circumference
                        const dashOffset = -accumulatedPercentage * (circumference / 100)

                        accumulatedPercentage += segment.percentage

                        return (
                            <Circle
                                key={segment.id}
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={`${dashLength} ${circumference}`}
                                strokeDashoffset={dashOffset}
                            />
                        )
                    })}
                </G>

                {/* Inner black circle */}
                <Circle cx={center} cy={center} r={26} stroke="#000" strokeWidth={3} fill="none" />
            </Svg>

            {/* Touchable overlay for interaction with proper segment detection */}
            {interactive && onSegmentPress && (
                <TouchableOpacity
                    style={styles.touchableOverlay}
                    onPress={handlePress}
                    activeOpacity={0.8}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    touchableOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
})
