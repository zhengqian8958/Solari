import React, { useMemo } from 'react'
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Clipboard,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useMobileWallet } from '@wallet-ui/react-native-web3js'
import { useAuth } from '@/components/auth/auth-provider'

interface WalletModalProps {
    visible: boolean
    onClose: () => void
}

export function WalletModal({ visible, onClose }: WalletModalProps) {
    const { accounts } = useMobileWallet()
    const { signOut } = useAuth()

    const walletAddress = useMemo(() => {
        if (accounts && accounts.length > 0) {
            // address may be a PublicKey object after reconnect, so always stringify
            return String(accounts[0].address)
        }
        return null
    }, [accounts])

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-6)}`
    }

    const handleDisconnect = async () => {
        onClose()
        await signOut()
    }

    const handleCopyAddress = () => {
        if (walletAddress) {
            Clipboard.setString(walletAddress)
        }
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            <Pressable style={styles.backdrop} onPress={onClose}>
                {/* Dialog - stop propagation so tapping inside doesn't close */}
                <Pressable style={styles.dialog} onPress={() => {}}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.walletIconContainer}>
                            <MaterialCommunityIcons name="wallet" size={24} color="#000" />
                        </View>
                        <Text style={styles.title}>My Wallet</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Status Badge */}
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Connected</Text>
                    </View>

                    {/* Address Section */}
                    {walletAddress ? (
                        <TouchableOpacity
                            style={styles.addressContainer}
                            onPress={handleCopyAddress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.addressLabelRow}>
                                <Text style={styles.addressLabel}>Wallet Address</Text>
                                <MaterialCommunityIcons name="content-copy" size={14} color="#666" />
                            </View>
                            <Text style={styles.addressShort}>{shortenAddress(walletAddress)}</Text>
                            <Text style={styles.tapToCopy}>Tap to copy</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.addressContainer}>
                            <Text style={styles.addressLabel}>No wallet connected</Text>
                        </View>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Disconnect Button */}
                    <TouchableOpacity
                        style={styles.disconnectButton}
                        onPress={handleDisconnect}
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons name="link-off" size={18} color="#fff" />
                        <Text style={styles.disconnectButtonText}>Disconnect Wallet</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    dialog: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    walletIconContainer: {
        width: 36,
        height: 36,
        backgroundColor: '#ff85a2',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
        flex: 1,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#d1fae5',
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: '#000',
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 16,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#065f46',
    },
    addressContainer: {
        backgroundColor: '#fdf2f8',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#000',
        padding: 16,
        marginBottom: 16,
    },
    addressLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    addressLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    addressShort: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 0.5,
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    tapToCopy: {
        fontSize: 11,
        fontWeight: '600',
        color: '#999',
    },
    divider: {
        height: 2,
        backgroundColor: '#000',
        marginBottom: 16,
        borderRadius: 1,
    },
    disconnectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
        paddingVertical: 14,
        gap: 8,
    },
    disconnectButtonText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 0.5,
    },
})
