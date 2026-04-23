/**
 * Add Expense Screen
 * Form to create new expenses with validation and animations
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HackerTheme } from '../theme/colors';
import { TerminalInput } from '../components/TerminalInput';
import { GlowButton } from '../components/GlowButton';
import { Loader } from '../components/Loader';
import { useExpense } from '../context/ExpenseContext';
import { formatDate } from '../utils/formatting';

interface AddExpenseScreenProps {
  navigation: any;
}

type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Other';

const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Education',
  'Other',
];

const PAYMENT_METHODS = ['Card', 'Cash', 'Online', 'Check', 'Other'];

export const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ navigation }) => {
  const { createExpense, isLoading } = useExpense();

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [isRecurring, setIsRecurring] = useState(false);

  // UI state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const successAnim = useRef(new Animated.Value(0)).current;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = 'Enter a valid amount';

    if (!category) newErrors.category = 'Category is required';
    if (!paymentMethod) newErrors.paymentMethod = 'Payment method is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createExpense({
        amount: Number(amount),
        category,
        date: date.toISOString(),
        note: note || 'No description',
        paymentMethod,
        isRecurring,
      });

      // Success animation
      Animated.sequence([
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create expense');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← BACK</Text>
            </TouchableOpacity>
            <Text style={styles.title}>ADD EXPENSE</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Amount Input */}
            <TerminalInput
              label="Amount ($)"
              placeholder="0.00"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              error={errors.amount}
              keyboardType="decimal-pad"
              icon="$"
            />

            {/* Category Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCategoryPicker(true)}
              >
                <Text style={styles.pickerButtonIcon}>📦</Text>
                <Text style={styles.pickerButtonText}>{category}</Text>
                <Text style={styles.pickerButtonArrow}>▼</Text>
              </TouchableOpacity>
              {errors.category && (
                <Text style={styles.error}>{errors.category}</Text>
              )}
            </View>

            {/* Date Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.pickerButtonIcon}>📅</Text>
                <Text style={styles.pickerButtonText}>{formatDate(date)}</Text>
              </TouchableOpacity>
            </View>

            {/* Payment Method Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPaymentPicker(true)}
              >
                <Text style={styles.pickerButtonIcon}>💳</Text>
                <Text style={styles.pickerButtonText}>{paymentMethod}</Text>
                <Text style={styles.pickerButtonArrow}>▼</Text>
              </TouchableOpacity>
              {errors.paymentMethod && (
                <Text style={styles.error}>{errors.paymentMethod}</Text>
              )}
            </View>

            {/* Note Input */}
            <TerminalInput
              label="Description (Optional)"
              placeholder="What was this expense for?"
              value={note}
              onChangeText={setNote}
              icon="📝"
              multiline
            />

            {/* Recurring Toggle */}
            <View style={styles.recurringContainer}>
              <Text style={styles.recurringLabel}>Recurring Expense?</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isRecurring && styles.toggleButtonActive,
                ]}
                onPress={() => setIsRecurring(!isRecurring)}
              >
                <Text style={styles.toggleText}>
                  {isRecurring ? '✓ YES' : '✗ NO'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            {isLoading ? (
              <Loader message="Creating expense..." />
            ) : (
              <>
                <GlowButton
                  title="SAVE EXPENSE"
                  onPress={handleSubmit}
                  fullWidth
                  size="lg"
                  variant="primary"
                />

                {/* Success Indicator */}
                <Animated.View
                  style={[
                    styles.successIndicator,
                    {
                      opacity: successAnim,
                      transform: [
                        {
                          scale: successAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.successText}>✓ Expense Saved!</Text>
                </Animated.View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT CATEGORY</Text>
            <ScrollView>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.modalOption,
                    category === cat && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      category === cat && styles.modalOptionTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <GlowButton
              title="CLOSE"
              onPress={() => setShowCategoryPicker(false)}
              fullWidth
            />
          </View>
        </View>
      </Modal>

      {/* Payment Method Picker Modal */}
      <Modal
        visible={showPaymentPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentPicker(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT PAYMENT METHOD</Text>
            <ScrollView>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.modalOption,
                    paymentMethod === method && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    setPaymentMethod(method);
                    setShowPaymentPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      paymentMethod === method && styles.modalOptionTextActive,
                    ]}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <GlowButton
              title="CLOSE"
              onPress={() => setShowPaymentPicker(false)}
              fullWidth
            />
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
          <GlowButton
            title="CONFIRM"
            onPress={() => setShowDatePicker(false)}
            fullWidth
          />
        </View>
      )}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HackerTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: HackerTheme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HackerTheme.spacing.lg,
    paddingVertical: HackerTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.borderLight,
  },
  backButton: {
    color: HackerTheme.colors.secondary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  title: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  form: {
    padding: HackerTheme.spacing.lg,
  },
  formGroup: {
    marginVertical: HackerTheme.spacing.md,
  },
  label: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.sm,
    marginBottom: HackerTheme.spacing.sm,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    borderRadius: HackerTheme.borderRadius.md,
    paddingHorizontal: HackerTheme.spacing.md,
    height: 48,
  },
  pickerButtonIcon: {
    fontSize: HackerTheme.fontSize.lg,
    marginRight: HackerTheme.spacing.sm,
  },
  pickerButtonText: {
    flex: 1,
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
  },
  pickerButtonArrow: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.sm,
  },
  error: {
    color: HackerTheme.colors.danger,
    fontSize: HackerTheme.fontSize.xs,
    marginTop: HackerTheme.spacing.sm,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  recurringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: HackerTheme.spacing.lg,
    paddingHorizontal: HackerTheme.spacing.md,
  },
  recurringLabel: {
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
  },
  toggleButton: {
    paddingHorizontal: HackerTheme.spacing.md,
    paddingVertical: HackerTheme.spacing.sm,
    borderRadius: HackerTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    backgroundColor: HackerTheme.colors.surface,
  },
  toggleButtonActive: {
    borderColor: HackerTheme.colors.success,
    backgroundColor: `${HackerTheme.colors.success}20`,
  },
  toggleText: {
    color: HackerTheme.colors.primary,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  successIndicator: {
    marginTop: HackerTheme.spacing.lg,
    padding: HackerTheme.spacing.lg,
    backgroundColor: `${HackerTheme.colors.success}20`,
    borderRadius: HackerTheme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: HackerTheme.colors.success,
  },
  successText: {
    color: HackerTheme.colors.success,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: HackerTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: HackerTheme.colors.primary,
    borderRadius: HackerTheme.borderRadius.lg,
    maxHeight: '80%',
    paddingTop: HackerTheme.spacing.lg,
  },
  modalTitle: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: HackerTheme.spacing.lg,
    letterSpacing: 1,
  },
  modalOption: {
    paddingVertical: HackerTheme.spacing.md,
    paddingHorizontal: HackerTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.borderLight,
  },
  modalOptionActive: {
    backgroundColor: `${HackerTheme.colors.primary}20`,
  },
  modalOptionText: {
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
  },
  modalOptionTextActive: {
    color: HackerTheme.colors.primary,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    paddingHorizontal: HackerTheme.spacing.lg,
    paddingBottom: HackerTheme.spacing.lg,
  },
});

export default AddExpenseScreen;
