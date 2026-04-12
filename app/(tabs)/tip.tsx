import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/Colors';
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [splitCount, setSplitCount] = useState(1);

  // Results
  const [tipAmount, setTipAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [perPerson, setPerPerson] = useState(0);

  const predefinedTips = [10, 15, 20, 25];

  useEffect(() => {
    const bill = parseFloat(billAmount) || 0;
    const split = Math.max(1, splitCount);

    const tip = bill * (tipPercentage / 100);
    const total = bill + tip;
    const person = total / split;

    setTipAmount(tip);
    setTotalAmount(total);
    setPerPerson(person);
  }, [billAmount, tipPercentage, splitCount]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Card style={styles.card}>
          <Input 
            label="Bill Amount"
            keyboardType="numeric"
            value={billAmount}
            onChangeText={setBillAmount}
            placeholder="e.g. 50.00"
          />

          <Text style={styles.sectionTitle}>Tip Percentage: {tipPercentage}%</Text>
          <View style={styles.chipRow}>
            {predefinedTips.map(tip => (
              <TouchableOpacity 
                key={tip} 
                style={[
                  styles.chip, 
                  tipPercentage === tip && styles.chipActive
                ]}
                onPress={() => setTipPercentage(tip)}
              >
                <Text style={[
                  styles.chipText,
                  tipPercentage === tip && styles.chipTextActive
                ]}>
                  {tip}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.splitRow}>
            <Text style={styles.sectionTitleSplit}>Split with</Text>
            <View style={styles.stepper}>
              <TouchableOpacity 
                style={styles.stepButton} 
                onPress={() => setSplitCount(s => Math.max(1, s - 1))}
              >
                <FontAwesome name="minus" size={16} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{splitCount}</Text>
              <TouchableOpacity 
                style={styles.stepButton} 
                onPress={() => setSplitCount(s => Math.min(20, s + 1))}
              >
                <FontAwesome name="plus" size={16} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Results Area */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Total per person</Text>
          <Text style={styles.resultValuePrimary}>${perPerson.toFixed(2)}</Text>
          
          <View style={styles.resultGrid}>
            <View style={styles.resultGridItem}>
              <Text style={styles.resultGridLabel}>Bill</Text>
              <Text style={styles.resultGridValue}>${(parseFloat(billAmount) || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.resultGridItem}>
              <Text style={styles.resultGridLabel}>Tip</Text>
              <Text style={styles.resultGridValue}>${tipAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.resultGridItem}>
              <Text style={styles.resultGridLabel}>Total Amount</Text>
              <Text style={styles.resultGridValue}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitleSplit: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 32,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)', // subtle secondary color
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  resultLabel: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 8,
  },
  resultValuePrimary: {
    color: Colors.text,
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  resultGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  resultGridItem: {
    alignItems: 'center',
  },
  resultGridLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  resultGridValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
