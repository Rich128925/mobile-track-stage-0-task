import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Colors } from '../../constants/Colors';
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Category = 'Length' | 'Weight' | 'Temperature' | 'Currency';

const UNIT_DATA = {
  Length: [
    { label: 'Meters (m)', value: 'm' },
    { label: 'Kilometers (km)', value: 'km' },
    { label: 'Centimeters (cm)', value: 'cm' },
    { label: 'Millimeters (mm)', value: 'mm' },
    { label: 'Miles (mi)', value: 'mi' },
    { label: 'Yards (yd)', value: 'yd' },
    { label: 'Feet (ft)', value: 'ft' },
    { label: 'Inches (in)', value: 'in' },
  ],
  Weight: [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Grams (g)', value: 'g' },
    { label: 'Milligrams (mg)', value: 'mg' },
    { label: 'Pounds (lbs)', value: 'lbs' },
    { label: 'Ounces (oz)', value: 'oz' },
  ],
  Temperature: [
    { label: 'Celsius (°C)', value: 'C' },
    { label: 'Fahrenheit (°F)', value: 'F' },
    { label: 'Kelvin (K)', value: 'K' },
  ],
  Currency: [
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'Japanese Yen (JPY)', value: 'JPY' },
    { label: 'Nigerian Naira (NGN)', value: 'NGN' },
  ],
};

// Conversion logic
function convertUnits(value: number, from: string, to: string, category: Category): string {
  if (from === to) return value.toString();

  let tempVal = value;
  
  if (category === 'Temperature') {
    // Temp to Celsius first
    let c = value;
    if (from === 'F') c = (value - 32) * 5/9;
    if (from === 'K') c = value - 273.15;

    // Celsius to target
    if (to === 'C') return c.toFixed(2);
    if (to === 'F') return ((c * 9/5) + 32).toFixed(2);
    if (to === 'K') return (c + 273.15).toFixed(2);
  } else if (category === 'Length') {
    // Base unit: meters
    const toMeters: Record<string, number> = {
      m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254
    };
    const meters = value * toMeters[from];
    return (meters / toMeters[to]).toPrecision(6).replace(/\.?0+$/, '');
  } else if (category === 'Weight') {
    // Base unit: kilograms
    const toKg: Record<string, number> = {
      kg: 1, g: 0.001, mg: 0.000001, lbs: 0.453592, oz: 0.0283495
    };
    const kg = value * toKg[from];
    return (kg / toKg[to]).toPrecision(6).replace(/\.?0+$/, '');
  } else if (category === 'Currency') {
    // Base unit: USD (demo rates)
    const toUSD: Record<string, number> = {
      USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150, NGN: 1600
    };
    const usd = value / toUSD[from];
    return (usd * toUSD[to]).toFixed(2);
  }

  return '0';
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('Length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [result, setResult] = useState('');

  // Reset units when category changes
  useEffect(() => {
    setFromUnit(UNIT_DATA[category][0].value);
    setToUnit(UNIT_DATA[category][1].value);
  }, [category]);

  // Perform calculation
  useEffect(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) {
      setResult('');
      return;
    }
    setResult(convertUnits(num, fromUnit, toUnit, category));
  }, [inputValue, fromUnit, toUnit, category]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Category Selector */}
        <View style={styles.categoryScrollWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
            {(Object.keys(UNIT_DATA) as Category[]).map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[
                  styles.categoryChip, 
                  category === cat && styles.categoryChipActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Card style={styles.card}>
          <Input 
            label="Value to Convert"
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter value..."
          />
          
          <Select 
            label="From Unit"
            value={fromUnit}
            options={UNIT_DATA[category]}
            onChange={setFromUnit}
          />

          <View style={styles.swapContainer}>
            <TouchableOpacity style={styles.swapButton} onPress={swapUnits}>
              <FontAwesome name="exchange" size={18} color={Colors.text} style={{ transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
          </View>

          <Select 
            label="To Unit"
            value={toUnit}
            options={UNIT_DATA[category]}
            onChange={setToUnit}
          />
        </Card>

        {/* Result Area */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Converted Value</Text>
          <Text style={styles.resultValue}>{result || '0'}</Text>
          <Text style={styles.resultUnit}>{UNIT_DATA[category].find(u => u.value === toUnit)?.label}</Text>
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
  categoryScrollWrapper: {
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  categoryChipActive: {
    backgroundColor: Colors.border,
  },
  categoryText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  card: {
    marginBottom: 24,
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: -8, // pull into the selectors
    zIndex: 10,
  },
  swapButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.card,
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
  },
  resultLabel: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 8,
  },
  resultValue: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultUnit: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '500',
  },
});
