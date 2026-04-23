/**
 * Animated Counter Component
 * Displays numbers with a smooth counting animation
 */

import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { HackerTheme } from '../theme/colors';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1500,
  prefix = '$',
  suffix = '',
  style,
  textStyle,
  decimals = 2,
}) => {
  const countAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Reset and start counting
    countAnim.setValue(0);
    
    Animated.timing(countAnim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    // Pulse effect when value changes
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [value, duration, countAnim, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      <Animated.Text
        style={[
          styles.text,
          textStyle,
          {
            color: countAnim.interpolate({
              inputRange: [0, value],
              outputRange: [HackerTheme.colors.secondary, HackerTheme.colors.primary],
            }),
          },
        ]}
      >
        {prefix}
        {countAnim.interpolate({
          inputRange: [0, value],
          outputRange: ['0', value.toString()],
          extrapolate: 'clamp',
        }) as any}
        {suffix}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: HackerTheme.fontSize['3xl'],
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: HackerTheme.colors.primary,
    letterSpacing: 1,
  },
});

export default AnimatedCounter;
