import React, { useEffect, useRef } from 'react';
import {
  Image,
  StyleSheet,
  Platform,
  Animated,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useRouter} from 'expo-router';

import { Fonts } from '@/constants/theme';
import { HackerTheme } from '@/theme/colors';
import { ThemedText } from '@/components/themed-text';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { TypingEffect } from '@/components/TypingEffect';
import { GlowButton } from '@/components/GlowButton';
import { useNavigation } from '@react-navigation/native';

export default function ExploreScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
 const router=useRouter();

  useEffect(() => {
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
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TypingEffect
            text="WELCOME"
            speed={50}
            showCursor={true}
            textStyle={styles.headerTitle}
          />
          <Text style={styles.headerSubtitle}>Expense Tracker - Hacker Edition</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <Text style={styles.heroIcon}>💰</Text>
            <Text style={styles.heroTitle}>Track Expenses</Text>
            <Text style={styles.heroText}>Monitor your spending with real-time analytics and insights</Text>
          </View>
        </View>


        {/* Action Section */}
        <View style={styles.actionSection}>
          <Text style={styles.actionTitle}>GET_STARTED</Text>
          <Text style={styles.actionText}>
            Use the tabs below to navigate between Dashboard, Expenses, and Add Expense screens.
          </Text>
          <View style={styles.actionButtons}>
            <GlowButton
              title="VIEW_DASHBOARD"
              onPress={() => {

               router.push('/(tabs)/dashboard');

              }}
              variant="primary"
              size="md"
              fullWidth
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>[INFO] Version 1.0 - Hacker Terminal Edition</Text>
          <Text style={styles.footerText}>[INFO] Real-time expense tracking with advanced analytics</Text>
          <Text style={styles.footerText}>[INFO] Secure JWT authentication</Text>
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
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.border,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
    letterSpacing: 3,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
    letterSpacing: 1,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  heroCard: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: HackerTheme.colors.primary,
    borderRadius: 4,
    backgroundColor: HackerTheme.colors.surfaceLight,
    alignItems: 'center',
    shadowColor: HackerTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroText: {
    fontSize: 12,
    color: HackerTheme.colors.text,
    fontFamily: 'Courier New',
    textAlign: 'center',
    lineHeight: 18,
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: HackerTheme.colors.secondary,
    fontFamily: 'Courier New',
    marginBottom: 16,
    letterSpacing: 2,
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: HackerTheme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: HackerTheme.colors.border,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: HackerTheme.colors.primary,
    fontFamily: 'Courier New',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  actionText: {
    fontSize: 12,
    color: HackerTheme.colors.text,
    fontFamily: 'Courier New',
    marginBottom: 16,
    lineHeight: 18,
  },
  actionButtons: {
    gap: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: HackerTheme.colors.border,
  },
  footerText: {
    fontSize: 10,
    color: HackerTheme.colors.textSecondary,
    fontFamily: 'Courier New',
    marginVertical: 4,
    letterSpacing: 0.5,
  },
}); 