import React, { useState } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { PORTFOLIO_COLORS } from '../../constants/portfolioTheme'

interface AddAssetDialogProps {
    visible: boolean
    onClose: () => void
    onAdd: (name: string, amount: number) => void
    investmentTypeName: string
}

export function AddAssetDialog({ visible, onClose, onAdd, investmentTypeName }: AddAssetDialogProps) {
    const [assetName, setAssetName] = useState('')
    const [amount, setAmount] = useState('')

    const handleAdd = () => {
        if (!assetName.trim() || !amount.trim()) {
            return
        }

        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return
        }

        onAdd(assetName.trim(), parsedAmount)

        // Reset form
        setAssetName('')
        setAmount('')
        onClose()
    }

    const handleClose = () => {
        setAssetName('')
        setAmount('')
        onClose()
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Add New Asset</Text>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <MaterialCommunityIcons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.content}>
                                <Text style={styles.subtitle}>Add to {investmentTypeName}</Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Asset Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={assetName}
                                        onChangeText={setAssetName}
                                        placeholder="e.g., Apple Inc."
                                        placeholderTextColor="#94a3b8"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Amount ($)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={amount}
                                        onChangeText={setAmount}
                                        placeholder="e.g., 5000"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="decimal-pad"
                                    />
                                </View>

                                <Text style={styles.hint}>
                                    💡 The asset value will be calculated based on the amount
                                </Text>

                                <TouchableOpacity
                                    style={[
                                        styles.addButton,
                                        (!assetName.trim() || !amount.trim()) && styles.addButtonDisabled,
                                    ]}
                                    onPress={handleAdd}
                                    disabled={!assetName.trim() || !amount.trim()}
                                >
                                    <MaterialCommunityIcons name="plus-circle" size={24} color="#000" />
                                    <Text style={styles.addButtonText}>Add Asset</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
    },
    modalContainer: {
        maxHeight: '75%',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 3,
        borderColor: '#000',
    },
    scrollContent: {
        maxHeight: 400,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 3,
        borderBottomColor: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    hint: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 24,
        padding: 12,
        backgroundColor: '#fef3c7',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#000',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: PORTFOLIO_COLORS['anime-mint'],
        padding: 16,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    addButtonDisabled: {
        backgroundColor: '#e2e8f0',
        opacity: 0.6,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#000',
    },
})
