/**
 * Empty State Component
 * Displays when no data is available
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { HackerTheme } from '../theme/colors';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = '⚠',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: HackerTheme.spacing.xl,
    borderRadius: HackerTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    backgroundColor: HackerTheme.colors.surface,
    minHeight: 200,
  },
  icon: {
    fontSize: 48,
    marginBottom: HackerTheme.spacing.md,
  },
  title: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: HackerTheme.spacing.sm,
    fontFamily: 'monospace',
  },
  message: {
    color: HackerTheme.colors.textTertiary,
    fontSize: HackerTheme.fontSize.base,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default EmptyState;
