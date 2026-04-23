/**
 * Splash Screen
 * Terminal boot animation with typing effects and loading bar
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HackerTheme } from '../theme/colors';
import { Loader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isSignedIn, isLoading } = useAuth();
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const bootOpacity = useRef(new Animated.Value(0)).current;
  const glitchScale = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    React.useCallback(() => {
      // Fade in title
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Fade in boot sequence
      setTimeout(() => {
        Animated.timing(bootOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 800);

      // Glitch effect
      Animated.sequence([
        Animated.timing(glitchScale, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glitchScale, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glitchScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Navigate after boot sequence
      const timer = setTimeout(() => {
        if (!isLoading) {
          if (isSignedIn) {
            navigation.replace('Dashboard');
          } else {
            navigation.replace('Auth');
          }
        }
      }, 4500);

      return () => clearTimeout(timer);
    }, [isSignedIn, isLoading, navigation, titleOpacity, bootOpacity, glitchScale])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title with Glitch Effect */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ scale: glitchScale }],
            },
          ]}
        >
          <Text style={styles.title}>EXPENSE</Text>
          <Text style={[styles.title, { color: HackerTheme.colors.secondary }]}>
            TRACKER
          </Text>
          <Text style={styles.subtitle}>Terminal Edition</Text>
        </Animated.View>

        {/* Boot Sequence */}
        <Animated.View
          style={[
            styles.bootContainer,
            {
              opacity: bootOpacity,
            },
          ]}
        >
          <Text style={styles.bootText}>$ Initializing system...</Text>
          <Text style={styles.bootText}>$ Loading encryption protocols...</Text>
          <Text style={styles.bootText}>$ Connecting to database...</Text>
          <Text style={styles.bootText}>$ Syncing expense ledger...</Text>
        </Animated.View>

        {/* Loader */}
        <View style={styles.loaderContainer}>
          <Loader message="Ready" size="md" />
        </View>

        {/* Security Footer */}
        <Animated.Text
          style={[
            styles.footer,
            {
              opacity: bootOpacity,
            },
          ]}
        >
          🔒 Secure Terminal Access Enabled
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HackerTheme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: HackerTheme.spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: HackerTheme.spacing['2xl'],
  },
  title: {
    fontSize: HackerTheme.fontSize['5xl'],
    fontWeight: 'bold',
    color: HackerTheme.colors.primary,
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: HackerTheme.fontSize.lg,
    color: HackerTheme.colors.secondary,
    marginTop: HackerTheme.spacing.md,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  bootContainer: {
    width: '100%',
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 1,
    borderColor: HackerTheme.colors.primary,
    borderRadius: HackerTheme.borderRadius.md,
    padding: HackerTheme.spacing.md,
    maxHeight: 150,
  },
  bootText: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    marginVertical: 4,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    marginVertical: HackerTheme.spacing.lg,
  },
  footer: {
    color: HackerTheme.colors.success,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
});

export default SplashScreen;
