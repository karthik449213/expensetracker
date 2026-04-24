import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import { HackerTheme } from '@/theme/colors';
import { TypingEffect } from '@/components/TypingEffect';
import { GlowButton } from '@/components/GlowButton';
import { useExpense } from '@/context/ExpenseContext';
import { useState } from 'react';

const EXPENSE_CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'];

export default function AddExpenseScreen() {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [isLoading, setIsLoading] = useState(false);
  const { createExpense } = useExpense();

  useEffect(() => {
    // Screen entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleAddExpense = async () => {
    if (!note.trim() || !amount.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await createExpense({
        note: note.trim(),
        amount: parseFloat(amount),
        category: selectedCategory,
        date: new Date().toISOString(),
        paymentMethod: 'cash',
      });
      
      // Reset form
      setNote('');
      setAmount('');
      setSelectedCategory('Food');
      alert('Expense added successfully!');
    } catch (error) {
      alert('Failed to add expense');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={[
          styles.scrollView,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TypingEffect
            text="ADD_EXPENSE"
            speed={50}
            showCursor={true}
            textStyle={styles.title}
          />
          <Text style={styles.subtitle}>Enter transaction details</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>$ AMOUNT</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={HackerTheme.colors.textMuted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{'>'}  DESCRIPTION</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="What did you spend on?"
              placeholderTextColor={HackerTheme.colors.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>/ CATEGORY</Text>
            <View style={styles.categoryGrid}>
              {EXPENSE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.buttonGroup}>
            <GlowButton
              title={isLoading ? 'PROCESSING...' : 'ADD_EXPENSE'}
              onPress={handleAddExpense}
              isLoading={isLoading}
              disabled={isLoading}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>[INFO] All expenses are encrypted and synced securely</Text>
            <Text style={styles.infoText}>[INFO] Real-time updates across all devices</Text>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HackerTheme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
  },
  form: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: HackerTheme.colors.secondary,
    marginBottom: 8,
    fontFamily: 'Courier New',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: HackerTheme.colors.primary,
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: HackerTheme.colors.surfaceLight,
    shadowColor: HackerTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  currencySymbol: {
    color: HackerTheme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: HackerTheme.colors.text,
    fontFamily: 'Courier New',
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 2,
    borderColor: HackerTheme.colors.secondary,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: HackerTheme.colors.text,
    fontFamily: 'Courier New',
    backgroundColor: HackerTheme.colors.surfaceLight,
    textAlignVertical: 'top',
    shadowColor: HackerTheme.colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  categoryButton: {
    flex: 0,
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: HackerTheme.colors.border,
    borderRadius: 4,
    backgroundColor: HackerTheme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderColor: HackerTheme.colors.primary,
    backgroundColor: HackerTheme.colors.primaryLight,
    borderWidth: 2,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: HackerTheme.colors.textTertiary,
    fontFamily: 'Courier New',
  },
  categoryButtonTextActive: {
    color: HackerTheme.colors.primary,
    fontWeight: '700',
  },
  buttonGroup: {
    marginVertical: 24,
  },
  infoSection: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: HackerTheme.colors.border,
    marginTop: 24,
  },
  infoText: {
    fontSize: 11,
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
    marginVertical: 4,
    letterSpacing: 0.5,
  },
});
