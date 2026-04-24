/**
 * Expense Card Component
 * Displays individual expense items with swipe actions
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Expense } from '../services/api';
import { HackerTheme } from '../theme/colors';
import { formatCurrency, formatDate } from '../utils/formatting';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  onPress?: (expense: Expense) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
  onPress,
}) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const handleSwipe = () => {
    if (isSwiped) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSwiped(false);
    } else {
      Animated.timing(slideAnim, {
        toValue: -140,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSwiped(true);
    }
  };

  const categoryColor = HackerTheme.categoryColors[expense.category as keyof typeof HackerTheme.categoryColors] || HackerTheme.colors.secondary;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.actionButtons,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => {
            onEdit?.(expense);
            handleSwipe();
          }}
        >
          <Text style={styles.actionText}>✎ Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => {
            onDelete?.(expense._id);
            handleSwipe();
          }}
        >
          <Text style={styles.actionText}>✕ Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={[styles.card, isSwiped && styles.cardSwiped]}
        onPress={() => onPress?.(expense)}
        onLongPress={handleSwipe}
      >
        <View style={styles.cardContent}>
          {/* Category Badge */}
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: `${categoryColor}20`, borderColor: categoryColor },
            ]}
          >
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {expense.category}
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.note} numberOfLines={1}>
              {expense.note || 'No description'}
            </Text>
            <Text style={styles.date}>{formatDate(expense.date)}</Text>
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color: categoryColor }]}>
              {formatCurrency(expense.amount)}
            </Text>
            {expense.isRecurring && (
              <Text style={styles.recurring}>↻ Recurring</Text>
            )}
          </View>
        </View>

        {/* Glow Border */}
        <View
          style={[
            styles.glowBorder,
            { borderColor: categoryColor },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: HackerTheme.spacing.sm,
    overflow: 'hidden',
    borderRadius: HackerTheme.borderRadius.md,
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  actionBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  editBtn: {
    backgroundColor: HackerTheme.colors.secondary,
  },
  deleteBtn: {
    backgroundColor: HackerTheme.colors.danger,
  },
  actionText: {
    color: HackerTheme.colors.background,
    fontWeight: '600',
    fontSize: 12,
  },
  card: {
    backgroundColor: HackerTheme.colors.surface,
    borderRadius: HackerTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    padding: HackerTheme.spacing.md,
    overflow: 'hidden',
  },
  cardSwiped: {
    opacity: 0.8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HackerTheme.spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: HackerTheme.spacing.sm,
    paddingVertical: HackerTheme.spacing.xs,
    borderRadius: HackerTheme.borderRadius.sm,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: HackerTheme.fontSize.xs,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  mainContent: {
    flex: 1,
  },
  note: {
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontWeight: '600',
    marginBottom: HackerTheme.spacing.xs,
  },
  date: {
    color: HackerTheme.colors.textTertiary,
    fontSize: HackerTheme.fontSize.xs,
    fontFamily: 'monospace',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  recurring: {
    color: HackerTheme.colors.warning,
    fontSize: HackerTheme.fontSize.xs,
    marginTop: 4,
    fontWeight: '600',
  },
  glowBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: HackerTheme.borderRadius.md,
    pointerEvents: 'none',
  },
});

export default ExpenseCard;
