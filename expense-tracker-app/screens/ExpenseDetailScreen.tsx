/**
 * Expense Detail Screen
 * View, edit, and delete individual expenses
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { HackerTheme } from '../theme/colors';
import { Expense } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/formatting';
import { GlowButton } from '../components/GlowButton';
import { TerminalInput } from '../components/TerminalInput';
import { useExpense } from '../context/ExpenseContext';

interface ExpenseDetailScreenProps {
  navigation: any;
  route: any;
}

export const ExpenseDetailScreen: React.FC<ExpenseDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { expense: initialExpense } = route.params;
  const { updateExpense, deleteExpense } = useExpense();

  const [editMode, setEditMode] = useState(false);
  const [editedAmount, setEditedAmount] = useState(
    initialExpense.amount.toString()
  );
  const [editedNote, setEditedNote] = useState(initialExpense.note);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveEdit = async () => {
    try {
      if (!editedAmount || isNaN(Number(editedAmount))) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount');
        return;
      }

      await updateExpense(initialExpense._id, {
        amount: Number(editedAmount),
        note: editedNote,
      });

      setEditMode(false);
      Alert.alert('Success', 'Expense updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update expense');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExpense(initialExpense._id);
      setShowDeleteConfirm(false);
      navigation.goBack();
      Alert.alert('Success', 'Expense deleted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete expense');
    }
  };

  const categoryColor =
    HackerTheme.categoryColors[
      initialExpense.category as keyof typeof HackerTheme.categoryColors
    ] || HackerTheme.colors.secondary;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>EXPENSE DETAILS</Text>
        <TouchableOpacity onPress={() => setEditMode(!editMode)}>
          <Text style={styles.editButton}>{editMode ? '✕' : '✎'} EDIT</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Amount Card */}
        <View style={[styles.card, styles.amountCard]}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          {editMode ? (
            <TerminalInput
              value={editedAmount}
              onChangeText={setEditedAmount}
              keyboardType="decimal-pad"
              icon="$"
            />
          ) : (
            <Text
              style={[styles.amount, { color: categoryColor }]}
            >
              {formatCurrency(Number(editedAmount))}
            </Text>
          )}
        </View>

        {/* Details Cards */}
        <View style={styles.card}>
          <Text style={styles.detailLabel}>Category</Text>
          <Text style={styles.detailValue}>{initialExpense.category}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {formatDateTime(initialExpense.date)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>{initialExpense.paymentMethod}</Text>
        </View>

        {initialExpense.isRecurring && (
          <View style={[styles.card, styles.recurringCard]}>
            <Text style={styles.recurringBadge}>↻ RECURRING EXPENSE</Text>
          </View>
        )}

        {/* Note */}
        <View style={styles.card}>
          <Text style={styles.detailLabel}>Description</Text>
          {editMode ? (
            <TerminalInput
              value={editedNote}
              onChangeText={setEditedNote}
              multiline
              icon="📝"
            />
          ) : (
            <Text style={styles.detailValue}>{editedNote}</Text>
          )}
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Created: {formatDateTime(initialExpense.createdAt)}
          </Text>
          <Text style={styles.metadataText}>
            Updated: {formatDateTime(initialExpense.updatedAt)}
          </Text>
        </View>

        {/* Action Buttons */}
        {editMode ? (
          <View style={styles.actionButtons}>
            <GlowButton
              title="SAVE"
              onPress={handleSaveEdit}
              variant="primary"
              fullWidth
              style={styles.button}
            />
            <GlowButton
              title="CANCEL"
              onPress={() => setEditMode(false)}
              variant="secondary"
              fullWidth
              style={styles.button}
            />
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <GlowButton
              title="DELETE"
              onPress={() => setShowDeleteConfirm(true)}
              variant="danger"
              fullWidth
              style={styles.button}
            />
          </View>
        )}
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>DELETE EXPENSE?</Text>
            <Text style={styles.confirmMessage}>
              This action cannot be undone. The expense record will be permanently deleted.
            </Text>

            <View style={styles.confirmButtons}>
              <GlowButton
                title="CANCEL"
                onPress={() => setShowDeleteConfirm(false)}
                variant="secondary"
                fullWidth
              />
              <GlowButton
                title="DELETE"
                onPress={handleDelete}
                variant="danger"
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HackerTheme.colors.background,
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
  editButton: {
    color: HackerTheme.colors.warning,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: HackerTheme.spacing.lg,
  },
  card: {
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    borderRadius: HackerTheme.borderRadius.md,
    padding: HackerTheme.spacing.md,
    marginBottom: HackerTheme.spacing.md,
  },
  amountCard: {
    borderColor: HackerTheme.colors.primary,
    alignItems: 'center',
  },
  amountLabel: {
    color: HackerTheme.colors.textTertiary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    marginBottom: HackerTheme.spacing.md,
    letterSpacing: 1,
  },
  amount: {
    fontSize: HackerTheme.fontSize['4xl'],
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  detailLabel: {
    color: HackerTheme.colors.secondary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    marginBottom: HackerTheme.spacing.sm,
    letterSpacing: 0.5,
  },
  detailValue: {
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
  },
  recurringCard: {
    borderColor: HackerTheme.colors.warning,
  },
  recurringBadge: {
    color: HackerTheme.colors.warning,
    fontSize: HackerTheme.fontSize.sm,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  metadata: {
    marginVertical: HackerTheme.spacing.lg,
    paddingVertical: HackerTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: HackerTheme.colors.borderLight,
  },
  metadataText: {
    color: HackerTheme.colors.textTertiary,
    fontSize: HackerTheme.fontSize.xs,
    fontFamily: 'monospace',
    marginVertical: 4,
  },
  actionButtons: {
    gap: HackerTheme.spacing.md,
  },
  button: {
    marginVertical: HackerTheme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 2,
    borderColor: HackerTheme.colors.danger,
    borderRadius: HackerTheme.borderRadius.lg,
    padding: HackerTheme.spacing.lg,
    minWidth: '80%',
  },
  confirmTitle: {
    color: HackerTheme.colors.danger,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: HackerTheme.spacing.md,
    textAlign: 'center',
  },
  confirmMessage: {
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
    marginBottom: HackerTheme.spacing.lg,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmButtons: {
    gap: HackerTheme.spacing.md,
  },
});

export default ExpenseDetailScreen;
