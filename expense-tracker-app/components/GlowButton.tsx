/**
 * Animated Glow Button Component
 * A futuristic button with pulsing glow and ripple effects
 */

import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { HackerTheme } from '../theme/colors';

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing glow effect
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    
    return () => pulse.stop();
  }, [glowOpacity]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: HackerTheme.colors.secondary,
          glow: HackerTheme.colors.glowSecondary,
          shadow: HackerTheme.shadows.secondary,
        };
      case 'danger':
        return {
          bg: HackerTheme.colors.danger,
          glow: HackerTheme.colors.danger,
          shadow: HackerTheme.shadows.danger,
        };
      default:
        return {
          bg: HackerTheme.colors.primary,
          glow: HackerTheme.colors.glow,
          shadow: HackerTheme.shadows.medium,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { height: 36, paddingHorizontal: 16, fontSize: 12 };
      case 'lg':
        return { height: 56, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { height: 48, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const colors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.glowLayer,
          {
            backgroundColor: colors.glow,
            opacity: glowOpacity,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: disabled ? HackerTheme.colors.textMuted : colors.bg,
              height: sizeStyles.height,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              transform: [{ scale: scaleAnim }],
              shadowColor: colors.glow,
              shadowOpacity: 0.7,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}
            
            {isLoading ? (
              <Text style={[styles.text, { fontSize: sizeStyles.fontSize }, textStyle]}>
                ▌▌ Processing...
              </Text>
            ) : (
              <Text style={[styles.text, { fontSize: sizeStyles.fontSize }, textStyle]}>
                {title}
              </Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: HackerTheme.spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  glowLayer: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: HackerTheme.borderRadius.md,
    zIndex: -1,
  },
  button: {
    borderRadius: HackerTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 156, 0.5)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: HackerTheme.colors.background,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
  icon: {
    marginRight: HackerTheme.spacing.sm,
  },
});

export default GlowButton;
