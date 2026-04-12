import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Colors } from '../../constants/Colors';
import FontAwesome from "@expo/vector-icons/FontAwesome";

export interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={styles.selector} 
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>{selectedOption?.label || "Select..."}</Text>
        <FontAwesome name="chevron-down" size={14} color={Colors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select an option'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="close" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    item.value === value && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === value && styles.optionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <FontAwesome name="check" size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selector: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    color: Colors.text,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionItemSelected: {
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
  },
  optionText: {
    color: Colors.text,
    fontSize: 16,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
