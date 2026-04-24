import React, { useRef, useEffect, useState } from 'react';
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
  const [dots, setDots] = useState(' ');
  const cursorAnimRef = useRef<any>(null);
  const dotAnimRef = useRef<any>(null);

  useEffect(() => {
    // Blinking cursor effect
    cursorAnimRef.current = Animated.loop(
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
    );
    cursorAnimRef.current.start();

    // Animated dots effect
    dotAnimRef.current = Animated.loop(
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
    );
    dotAnimRef.current.start();

    // Listen to dotAnim changes and update dots display
    const listener = dotAnim.addListener(({ value }) => {
      if (value > 1.5) {
        setDots('▌▌');
      } else if (value > 0.5) {
        setDots('▌');
      } else {
        setDots(' ');
      }
    });

    return () => {
      cursorAnimRef.current?.stop();
      dotAnimRef.current?.stop();
      dotAnim.removeListener(listener);
      cursorOpacity.setValue(1);
      dotAnim.setValue(0);
    };
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

  // Use numeric interpolation for width (0-150 pixels)
  const barWidth = dotAnim.interpolate({
    inputRange: [0, 2],
    outputRange: [0, 150],
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
              width: barWidth,
            },
          ]}
        />
      </View>

      <View style={styles.dotsContainer}>
        <Text style={styles.dots}>{dots}</Text>
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
