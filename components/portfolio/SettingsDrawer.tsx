import React, { useEffect, useRef, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { PORTFOLIO_COLORS } from '../../constants/portfolioTheme'

const SCREEN_WIDTH = Dimensions.get('window').width
const DRAWER_WIDTH = SCREEN_WIDTH * (2 / 3)

interface SettingsDrawerProps {
    visible: boolean
    onClose: () => void
}

export function SettingsDrawer({ visible, onClose }: SettingsDrawerProps) {
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (visible) {
            // Show modal first, then animate in
            setModalVisible(true)
            // Small delay to ensure modal is rendered before animation starts
            setTimeout(() => {
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 65,
                    friction: 11,
                }).start()
            }, 50)
        } else if (modalVisible) {
            // Animate out first, then hide modal
            Animated.timing(slideAnim, {
                toValue: -DRAWER_WIDTH,
                duration: 250,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setModalVisible(false)
                }
            })
        }
    }, [visible, modalVisible]) // Added modalVisible to dependency array

    const handleClose = () => {
        onClose()
    }

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="none" // Changed from "fade" to "none"
            onRequestClose={handleClose} // Changed from onClose to handleClose
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleClose} // Changed from onClose to handleClose
                />
                <Animated.View
                    style={[
                        styles.drawer,
                        {
                            transform: [{ translateX: slideAnim }],
                        }
                    ]}
                >
                    <Text style={styles.title}>Settings</Text>

                    {/* Points placeholder */}
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <MaterialCommunityIcons name="star" size={24} color="#000" />
                        </View>
                        <Text style={styles.menuText}>Points</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>

                    {/* Settings placeholder */}
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <MaterialCommunityIcons name="cog" size={24} color="#000" />
                        </View>
                        <Text style={styles.menuText}>Settings</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#64748b" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        borderRightWidth: 3,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderColor: '#000',
        paddingTop: 60,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#f1f5f9',
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: PORTFOLIO_COLORS['anime-yellow'],
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        flex: 1,
    },
})
