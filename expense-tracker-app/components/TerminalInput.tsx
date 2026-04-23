/**
 * Animated Terminal Input Component
 * A futuristic input field styled like a terminal prompt with typing animation
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import { HackerTheme } from '../theme/colors';

interface TerminalInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  label,
  error,
  icon = '>',
  isFocused: controlledFocused,
  onFocus,
  onBlur,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isActuallyFocused = controlledFocused !== undefined ? controlledFocused : isFocused;
    
    Animated.parallel([
      Animated.timing(borderColor, {
        toValue: isActuallyFocused ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(glowOpacity, {
        toValue: isActuallyFocused ? 0.8 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, controlledFocused, borderColor, glowOpacity]);

  const borderColorInterpolated = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [HackerTheme.colors.borderLight, HackerTheme.colors.primary],
  });

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor: borderColorInterpolated,
            shadowOpacity: glowOpacity,
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
        
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={HackerTheme.colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: HackerTheme.spacing.md,
  },
  label: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.sm,
    marginBottom: HackerTheme.spacing.sm,
    fontWeight: '600',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HackerTheme.colors.surface,
    borderWidth: 1,
    borderColor: HackerTheme.colors.borderLight,
    borderRadius: HackerTheme.borderRadius.md,
    paddingHorizontal: HackerTheme.spacing.md,
    height: 48,
    shadowColor: HackerTheme.colors.glow,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  icon: {
    color: HackerTheme.colors.primary,
    fontSize: HackerTheme.fontSize.lg,
    marginRight: HackerTheme.spacing.sm,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
  },
  error: {
    color: HackerTheme.colors.danger,
    fontSize: HackerTheme.fontSize.xs,
    marginTop: HackerTheme.spacing.sm,
    fontWeight: '600',
  },
});

export default TerminalInput;
