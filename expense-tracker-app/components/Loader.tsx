/**
 * Animated Loader Component
 * Terminal-style loading animation with blinking cursor
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { HackerTheme } from '../theme/colors';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  size = 'md',
  style,
}) => {
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Blinking cursor effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Animated dots effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(dotAnim, {
          toValue: 2,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [cursorOpacity, dotAnim]);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { fontSize: 14, barWidth: 30 };
      case 'lg':
        return { fontSize: 20, barWidth: 50 };
      default:
        return { fontSize: 16, barWidth: 40 };
    }
  };

  const sizeStyles = getSizeStyles();

  const dots = dotAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['', '▌', '▌▌'],
  });

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.text,
          { fontSize: sizeStyles.fontSize },
        ]}
      >
        {message}
      </Text>

      <View style={styles.loaderBar}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: dotAnim.interpolate({
                inputRange: [0, 2],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.dotsContainer}>
        <Animated.Text style={styles.dots}>{dots}</Animated.Text>
        <Animated.Text
          style={[
            styles.cursor,
            {
              opacity: cursorOpacity,
            },
          ]}
        >
          █
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: HackerTheme.spacing.lg,
  },
  text: {
    color: HackerTheme.colors.primary,
    fontFamily: 'monospace',
    fontWeight: '600',
    marginBottom: HackerTheme.spacing.lg,
    letterSpacing: 1,
  },
  loaderBar: {
    width: 150,
    height: 4,
    backgroundColor: HackerTheme.colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: HackerTheme.spacing.md,
    borderWidth: 1,
    borderColor: HackerTheme.colors.primary,
  },
  barFill: {
    height: '100%',
    backgroundColor: HackerTheme.colors.primary,
    borderRadius: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dots: {
    color: HackerTheme.colors.secondary,
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  cursor: {
    color: HackerTheme.colors.primary,
    fontSize: 12,
    fontFamily: 'monospace',
    marginLeft: 4,
  },
});

export default Loader;
