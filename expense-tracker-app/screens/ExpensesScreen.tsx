/**
 * Expenses List Screen
 * Full list of all expenses with filtering and search
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { HackerTheme } from '../theme/colors';
import { ExpenseCard } from '../components/ExpenseCard';
import { EmptyState } from '../components/EmptyState';
import { Loader } from '../components/Loader';
import { useExpense } from '../context/ExpenseContext';

interface ExpensesScreenProps {
  navigation: any;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ navigation }) => {
  const { expenses, isLoading, fetchExpenses, deleteExpense } = useExpense();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  const categories = Array.from(
    new Set(expenses.map((exp) => exp.category))
  ).sort();

  useEffect(() => {
    let filtered = expenses;

    // Search filter
    if (searchText.trim()) {
      filtered = filtered.filter(
        (exp) =>
          exp.note.toLowerCase().includes(searchText.toLowerCase()) ||
          exp.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((exp) => exp.category === selectedCategory);
    }

    // Sort by date descending
    filtered = filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredExpenses(filtered);
  }, [expenses, searchText, selectedCategory]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ALL EXPENSES</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.addButton}>+ ADD</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          placeholderTextColor={HackerTheme.colors.textMuted}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity
            style={[
              styles.categoryTag,
              !selectedCategory && styles.categoryTagActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryTagText,
                !selectedCategory && styles.categoryTagTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryTag,
                selectedCategory === cat && styles.categoryTagActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryTagText,
                  selectedCategory === cat && styles.categoryTagTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Loader message="Loading expenses..." />
        </View>
      ) : filteredExpenses.length > 0 ? (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ExpenseCard
              expense={item}
              onDelete={deleteExpense}
              onPress={() => navigation.navigate('ExpenseDetail', { expense: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No expenses found"
            message={searchText || selectedCategory
              ? 'Try adjusting your filters'
              : 'No expenses yet. Create one to get started!'}
            icon="📭"
          />
        </View>
      )}
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
  addButton: {
    color: HackerTheme.colors.success,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: HackerTheme.spacing.lg,
    paddingVertical: HackerTheme.spacing.md,
  },
  searchInput: {
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    borderRadius: HackerTheme.borderRadius.md,
    paddingHorizontal: HackerTheme.spacing.md,
    paddingVertical: HackerTheme.spacing.sm,
    color: HackerTheme.colors.text,
    fontFamily: 'monospace',
  },
  categoriesScroll: {
    maxHeight: 50,
  },
  categoriesContainer: {
    paddingHorizontal: HackerTheme.spacing.lg,
    gap: HackerTheme.spacing.sm,
  },
  categoryTag: {
    paddingHorizontal: HackerTheme.spacing.md,
    paddingVertical: HackerTheme.spacing.sm,
    borderRadius: HackerTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    backgroundColor: HackerTheme.colors.surface,
  },
  categoryTagActive: {
    borderColor: HackerTheme.colors.primary,
    backgroundColor: `${HackerTheme.colors.primary}20`,
  },
  categoryTagText: {
    color: HackerTheme.colors.textTertiary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  categoryTagTextActive: {
    color: HackerTheme.colors.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: HackerTheme.spacing.lg,
    gap: HackerTheme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: HackerTheme.spacing.lg,
  },
});

export default ExpensesScreen;
