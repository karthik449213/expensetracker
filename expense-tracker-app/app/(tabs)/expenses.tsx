import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Animated,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HackerTheme } from '@/theme/colors';
import { TypingEffect } from '@/components/TypingEffect';
import { ExpenseCard } from '@/components/ExpenseCard';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components/Loader';
import { useExpense } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/formatting';

export default function ExpensesScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const { expenses, isLoading, fetchExpenses, deleteExpense } = useExpense();
  const [refreshing, setRefreshing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    // Screen entrance animation
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
    ]).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadExpenses();
    }, [])
  );

  const loadExpenses = async () => {
    try {
      await fetchExpenses();
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadExpenses();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    searchFilter === '' ||
    expense.note.toLowerCase().includes(searchFilter.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const renderExpenseItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: Animated.subtract(slideAnim, new Animated.Value(index * 10)),
          },
        ],
      }}
    >
      <ExpenseCard
        expense={item}
        onDelete={deleteExpense}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TypingEffect
          text="EXPENSES"
          speed={50}
          showCursor={false}
          textStyle={styles.title}
        />
        <Text style={styles.subtitle}>{filteredExpenses.length} transactions</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL</Text>
          <Text style={styles.statValue}>{formatCurrency(totalAmount)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>COUNT</Text>
          <Text style={styles.statValue}>{filteredExpenses.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>AVG</Text>
          <Text style={styles.statValue}>
            {formatCurrency(filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0)}
          </Text>
        </View>
      </View>

      {/* Search Filter */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>FILTER:</Text>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchPrefix}>/</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="category or description"
            placeholderTextColor={HackerTheme.colors.textMuted}
            value={searchFilter}
            onChangeText={setSearchFilter}
          />
        </View>
      </View>

      {/* Expenses List */}
      <Animated.View
        style={[
          styles.listContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {isLoading && !expenses.length ? (
          <View style={styles.loaderContainer}>
            <Loader message="Loading expenses..." />
          </View>
        ) : filteredExpenses.length > 0 ? (
          <FlatList
            data={filteredExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh}
                tintColor={HackerTheme.colors.primary}
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              title="NO EXPENSES FOUND"
              message={searchFilter ? 'No transactions match your filter' : 'Start tracking your expenses'}
            />
          </View>
        )}
      </Animated.View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>[INFO] Swipe to delete • Tap to view details</Text>
        <Text style={styles.footerText}>[INFO] Auto-synced with backend</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HackerTheme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: HackerTheme.colors.secondary,
    borderRadius: 4,
    backgroundColor: HackerTheme.colors.surfaceLight,
    alignItems: 'center',
    shadowColor: HackerTheme.colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: HackerTheme.colors.secondary,
    fontFamily: 'Courier New',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.border,
  },
  searchLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: HackerTheme.colors.secondary,
    fontFamily: 'Courier New',
    marginBottom: 8,
    letterSpacing: 1,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: HackerTheme.colors.secondary,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: HackerTheme.colors.surfaceLight,
  },
  searchPrefix: {
    color: HackerTheme.colors.secondary,
    fontSize: 16,
    marginRight: 4,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 13,
    color: HackerTheme.colors.text,
    fontFamily: 'Courier New',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: HackerTheme.colors.border,
  },
  footerText: {
    fontSize: 10,
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
    marginVertical: 2,
    letterSpacing: 0.5,
  },
});
