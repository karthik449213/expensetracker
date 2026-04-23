import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HackerTheme } from '@/theme/colors';
import { TypingEffect } from '@/components/TypingEffect';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ExpenseCard } from '@/components/ExpenseCard';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components/Loader';
import { GlowButton } from '@/components/GlowButton';
import { useExpense } from '@/context/ExpenseContext';
import {useAuth } from '@/context/AuthContext';
import { formatCurrency, getGreeting } from '@/utils/formatting';
import { useState } from 'react';

export default function DashboardScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const { expenses, summary, isLoading, fetchExpenses, fetchSummary, deleteExpense } = useExpense();
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      // Screen entrance animation on focus
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
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
  };

  const topCategories = summary?.topCategories || [];
  const totalExpense = summary?.totalExpense || 0;
  const thisMonth = summary?.thisMonth || 0;
  const thisWeek = summary?.thisWeek || 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <TypingEffect
            text={user?.firstName || 'Hacker'}
            speed={50}
            showCursor={true}
            textStyle={styles.userName}
          />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>⊗</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={[
          styles.scrollView,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={HackerTheme.colors.primary}
          />
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !expenses.length ? (
          <View style={styles.loaderContainer}>
            <Loader message="Scanning database..." />
          </View>
        ) : (
          <View style={styles.content}>
            {/* Summary Cards - Animated Counter */}
            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>TOTAL_EXPENSES</Text>
                <AnimatedCounter
                  value={totalExpense}
                  duration={1500}
                  prefix="$"
                  decimals={2}
                  textStyle={styles.summaryValue}
                />
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>THIS_MONTH</Text>
                <AnimatedCounter
                  value={thisMonth}
                  duration={1200}
                  prefix="$"
                  decimals={2}
                  textStyle={styles.summaryValue}
                />
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>THIS_WEEK</Text>
                <AnimatedCounter
                  value={thisWeek}
                  duration={1000}
                  prefix="$"
                  decimals={2}
                  textStyle={styles.summaryValue}
                />
              </View>
            </View>

            {/* Top Categories */}
            {topCategories.length > 0 && (
              <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>TOP_CATEGORIES</Text>
                <View style={styles.categoriesList}>
                  {topCategories.slice(0, 5).map((cat, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.categoryRow,
                        {
                          opacity: fadeAnim,
                          transform: [
                            {
                              translateX: Animated.multiply(
                                slideAnim,
                                index % 2 === 0 ? 1 : -1
                              ),
                            },
                          ],
                        },
                      ]}
                    >
                      <View style={styles.categoryInfo}>
                        <View
                          style={[
                            styles.categoryDot,
                            {
                              backgroundColor:
                                HackerTheme.categoryColors[cat.category as keyof typeof HackerTheme.categoryColors] ||
                                HackerTheme.colors.primary,
                            },
                          ]}
                        />
                        <Text style={styles.categoryName}>{cat.category}</Text>
                      </View>
                      <Text style={styles.categoryAmount}>
                        {formatCurrency(cat.amount)}
                      </Text>
                    </Animated.View>
                  ))}
                </View>
              </View>
            )}

            {/* Recent Transactions */}
            <View style={styles.transactionsSection}>
              <Text style={styles.sectionTitle}>RECENT_TRANSACTIONS</Text>

              {expenses.length > 0 ? (
                <View>
                  {expenses.slice(0, 5).map((expense, index) => (
                    <Animated.View
                      key={expense._id}
                      style={{
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateY: Animated.multiply(slideAnim, 1 - index * 0.1),
                          },
                        ],
                      }}
                    >
                      <ExpenseCard
                        expense={expense}
                        onDelete={deleteExpense}
                      />
                    </Animated.View>
                  ))}
                </View>
              ) : (
                <EmptyState
                  title="NO_TRANSACTIONS"
                  message="Start tracking your expenses to see them here"
                />
              )}
            </View>

            {/* Footer Actions */}
            <View style={styles.footerActions}>
              <GlowButton
                title="VIEW_ALL"
                onPress={() => {}}
                variant="secondary"
                size="md"
                fullWidth
              />
            </View>

            {/* System Info */}
            <View style={styles.systemInfo}>
              <Text style={styles.infoText}>[SYS] Transactions encrypted and synced</Text>
              <Text style={styles.infoText}>[SYS] Last sync: {new Date().toLocaleTimeString()}</Text>
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HackerTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.border,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '600',
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
    marginBottom: 4,
    letterSpacing: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
    letterSpacing: 1,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: HackerTheme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HackerTheme.colors.surfaceLight,
    shadowColor: HackerTheme.colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: {
    fontSize: 18,
    color: HackerTheme.colors.danger,
    fontWeight: '900',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  summarySection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: HackerTheme.colors.primary,
    borderRadius: 4,
    backgroundColor: HackerTheme.colors.surfaceLight,
    shadowColor: HackerTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: HackerTheme.colors.secondary,
    fontFamily: 'Courier New',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
  },
  categoriesSection: {
    marginBottom: 28,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: HackerTheme.colors.border,
    borderRadius: 4,
    backgroundColor: HackerTheme.colors.surfaceLight,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: HackerTheme.colors.secondary,
    fontFamily: 'Courier New',
    marginBottom: 12,
    letterSpacing: 1.5,
  },
  categoriesList: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderLeftWidth: 2,
    borderLeftColor: HackerTheme.colors.primary,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: HackerTheme.colors.text,
    fontFamily: 'Courier New',
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
  },
  transactionsSection: {
    marginBottom: 24,
  },
  footerActions: {
    marginVertical: 20,
  },
  systemInfo: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: HackerTheme.colors.border,
    marginTop: 20,
  },
  infoText: {
    fontSize: 10,
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
    marginVertical: 3,
    letterSpacing: 0.5,
  },
});
