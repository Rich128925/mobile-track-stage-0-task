import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Colors } from '../../constants/Colors';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to meters
    if (w > 0 && h > 0) {
      const result = w / (h * h);
      setBmi(result);
    } else {
      setBmi(null);
    }
  };

  const getBMICategory = (value: number) => {
    if (value < 18.5) return { category: 'Underweight', color: Colors.secondary, icon: 'arrow-down' };
    if (value >= 18.5 && value < 24.9) return { category: 'Normal Weight', color: Colors.success, icon: 'check-circle' };
    if (value >= 25 && value < 29.9) return { category: 'Overweight', color: '#F59E0B', icon: 'warning' };
    return { category: 'Obesity', color: Colors.danger, icon: 'exclamation-circle' };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      <Card style={styles.card}>
        <Input
          label="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholder="e.g. 70"
        />
        <Input
          label="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          placeholder="e.g. 175"
        />

        <Button
          title="Calculate BMI"
          onPress={calculateBMI}
          style={{ marginTop: 8 }}
        />
      </Card>

      {bmi !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Your BMI</Text>
          <Text style={styles.resultValue}>{bmi.toFixed(1)}</Text>

          <View style={[styles.categoryPill, { backgroundColor: getBMICategory(bmi).color + '20' }]}>
            <FontAwesome name={getBMICategory(bmi).icon as any} size={16} color={getBMICategory(bmi).color} />
            <Text style={[styles.categoryText, { color: getBMICategory(bmi).color }]}>
              {getBMICategory(bmi).category}
            </Text>
          </View>

          <View style={styles.scaleContainer}>
            <View style={[styles.scaleBar, { backgroundColor: Colors.border }]}>
              <View style={[
                styles.scaleIndicator,
                {
                  left: `${Math.min(Math.max((bmi - 10) / 30 * 100, 0), 100)}%`,
                  backgroundColor: getBMICategory(bmi).color
                }
              ]} />
            </View>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabelText}>15</Text>
              <Text style={styles.scaleLabelText}>25</Text>
              <Text style={styles.scaleLabelText}>40+</Text>
            </View>
          </View>

        </View>
      )}
    </ScrollView>
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
  resultContainer: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultLabel: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 8,
  },
  resultValue: {
    color: Colors.text,
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scaleContainer: {
    width: '100%',
  },
  scaleBar: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
    marginBottom: 8,
  },
  scaleIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: -4,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabelText: {
    color: Colors.textMuted,
    fontSize: 12,
  }
});
