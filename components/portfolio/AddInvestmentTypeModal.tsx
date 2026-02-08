import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SYSTEM_INVESTMENT_TYPES } from '../../constants/systemInvestmentTypes'
import { INVESTMENT_TYPE_COLORS } from '../../constants/portfolioTheme'
import type { SystemInvestmentType } from '../../types/portfolio.types'

interface AddInvestmentTypeModalProps {
    visible: boolean
    onClose: () => void
    onSelectType: (typeId: string) => void
    existingTypes: string[]
}

export function AddInvestmentTypeModal({
    visible,
    onClose,
    onSelectType,
    existingTypes,
}: AddInvestmentTypeModalProps) {
    const availableTypes = SYSTEM_INVESTMENT_TYPES.filter(
        (type) => !existingTypes.includes(type.id)
    )

    const handleSelect = (typeId: string) => {
        onSelectType(typeId)
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Investment Type</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {availableTypes.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                All investment types have been added! 🎉
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={availableTypes}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TypeOption type={item} onSelect={handleSelect} />
                            )}
                            contentContainerStyle={styles.list}
                        />
                    )}
                </View>
            </View>
        </Modal>
    )
}

function TypeOption({
    type,
    onSelect,
}: {
    type: SystemInvestmentType
    onSelect: (id: string) => void
}) {
    const bgColor = INVESTMENT_TYPE_COLORS[type.color]

    return (
        <TouchableOpacity
            style={[styles.typeOption, { backgroundColor: bgColor }]}
            onPress={() => onSelect(type.id)}
        >
            <View style={styles.typeIconContainer}>
                <Image source={getIconImage(type.icon)} style={styles.iconImage} />
            </View>
            <Text style={styles.typeName}>{type.name}</Text>
            <MaterialCommunityIcons name="plus-circle" size={28} color="#000" />
        </TouchableOpacity>
    )
}

// Map icon names to image sources
function getIconImage(iconName: string) {
    const iconMap: Record<string, any> = {
        monitoring: require('../../assets/icons/stock_color.png'),
        token: require('../../assets/icons/crypto_color.png'),
        home_work: require('../../assets/icons/real_estate_color.png'),
        request_quote: require('../../assets/icons/bonds_color.png'),
        agriculture: require('../../assets/icons/commodities_color.png'),
        account_balance_wallet: require('../../assets/icons/cash_color.png'),
    }
    return iconMap[iconName] || iconMap.monitoring
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 3,
        borderColor: '#000',
        paddingBottom: 40,
        maxHeight: '70%',
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
    list: {
        padding: 20,
        gap: 16,
    },
    typeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    typeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    typeName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
        flex: 1,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#64748b',
        textAlign: 'center',
    },
})
