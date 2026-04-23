/**
 * Dashboard Screen
 * Main screen showing expense summary and analytics
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HackerTheme } from '../theme/colors';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ExpenseCard } from '../components/ExpenseCard';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, getGreeting } from '../utils/formatting';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const {
    expenses,
    summary,
    isLoading,
    fetchExpenses,
    fetchSummary,
    deleteExpense,
  } = useExpense();

  const [refreshing, setRefreshing] = useState(false);
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      await Promise.all([fetchExpenses(), fetchSummary()]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Splash');
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        Animated.timing(headerOpacity, {
          toValue: offsetY > 100 ? 0.5 : 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    }
  );

  const topCategories = summary?.topCategories || [];
  const totalExpense = summary?.totalExpense || 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
          },
        ]}
      >
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.firstName || 'Hacker'}</Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>⊗</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !expenses.length ? (
          <View style={styles.loaderContainer}>
            <Loader message="Syncing expenses..." />
          </View>
        ) : (
          <View style={styles.content}>
            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Expenses</Text>
                <AnimatedCounter
                  value={totalExpense}
                  duration={1200}
                  prefix="$"
                  decimals={2}
                  textStyle={styles.summaryValue}
                />
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>This Month</Text>
                <AnimatedCounter
                  value={summary?.thisMonth || 0}
                  duration={1200}
                  prefix="$"
                  decimals={2}
                  textStyle={styles.summaryValue}
                />
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>This Week</Text>
                <AnimatedCounter
                  value={summary?.thisWeek || 0}
                  duration={1200}
                  prefix="$"
                  decimals={2}
                  textStyle={styles.summaryValue}
                />
              </View>
            </View>

            {/* Top Categories */}
            {topCategories.length > 0 && (
              <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>TOP CATEGORIES</Text>
                <View style={styles.categoriesList}>
                  {topCategories.slice(0, 5).map((cat, index) => (
                    <View key={index} style={styles.categoryRow}>
                      <Text style={styles.categoryName}>{cat.category}</Text>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(cat.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Recent Transactions */}
            <View style={styles.transactionsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Expenses')}
                >
                  <Text style={styles.viewAll}>View All →</Text>
                </TouchableOpacity>
              </View>

              {expenses.length > 0 ? (
                <View>
                  {expenses.slice(0, 5).map((expense) => (
                    <ExpenseCard
                      key={expense._id}
                      expense={expense}
                      onDelete={deleteExpense}
                      onPress={() =>
                        navigation.navigate('ExpenseDetail', { expense })
                      }
                    />
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="No expenses yet"
                  message="Start tracking your expenses by adding your first transaction"
                  icon="💰"
                />
              )}
            </View>

            {/* Add Expense CTA */}
            <TouchableOpacity
              style={styles.floatingCTA}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <Text style={styles.ctaText}>+ ADD EXPENSE</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  greeting: {
    color: HackerTheme.colors.secondary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
  },
  userName: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: HackerTheme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: HackerTheme.colors.danger,
  },
  logoutText: {
    color: HackerTheme.colors.danger,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
  },
  content: {
    padding: HackerTheme.spacing.lg,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: HackerTheme.spacing.md,
    marginBottom: HackerTheme.spacing.xl,
    flexWrap: 'wrap',
  },
  summaryCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 1,
    borderColor: HackerTheme.colors.primary,
    borderRadius: HackerTheme.borderRadius.md,
    padding: HackerTheme.spacing.md,
    alignItems: 'center',
    shadowColor: HackerTheme.colors.glow,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  summaryLabel: {
    color: HackerTheme.colors.textTertiary,
    fontSize: HackerTheme.fontSize.xs,
    fontFamily: 'monospace',
    marginBottom: HackerTheme.spacing.sm,
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: HackerTheme.fontSize['2xl'],
  },
  categoriesSection: {
    marginBottom: HackerTheme.spacing.xl,
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    borderRadius: HackerTheme.borderRadius.md,
    padding: HackerTheme.spacing.md,
  },
  categoriesList: {
    marginTop: HackerTheme.spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: HackerTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.borderLight,
  },
  categoryName: {
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
  },
  categoryAmount: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.base,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  transactionsSection: {
    marginBottom: HackerTheme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HackerTheme.spacing.md,
  },
  sectionTitle: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  viewAll: {
    color: HackerTheme.colors.secondary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  floatingCTA: {
    backgroundColor: HackerTheme.colors.primary,
    borderRadius: HackerTheme.borderRadius.md,
    padding: HackerTheme.spacing.lg,
    alignItems: 'center',
    marginVertical: HackerTheme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 156, 0.5)',
    shadowColor: HackerTheme.colors.glow,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  ctaText: {
    color: HackerTheme.colors.background,
    fontSize: HackerTheme.fontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});

export default DashboardScreen;
