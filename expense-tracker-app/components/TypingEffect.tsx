/**
 * Typing Effect Component
 * Animates text as if being typed in real-time
 */

import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  View,
} from 'react-native';
import { HackerTheme } from '../theme/colors';

interface TypingEffectProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  autoStart?: boolean;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 50,
  showCursor = true,
  onComplete,
  style,
  textStyle,
  autoStart = true,
}) => {
  const displayText = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const [displayedText, setDisplayedText] = React.useState('');

  useEffect(() => {
    if (!autoStart) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete, autoStart]);

  // Cursor blinking animation
  useEffect(() => {
    if (!showCursor) return;

    const blink = Animated.loop(
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

    blink.start();
    return () => blink.stop();
  }, [showCursor, cursorOpacity]);

  return (
    <View style={style}>
      <Text style={[styles.text, textStyle]}>
        {displayedText}
        {showCursor && (
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
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: HackerTheme.colors.text,
    fontSize: HackerTheme.fontSize.base,
    fontFamily: 'monospace',
    lineHeight: 24,
  },
  cursor: {
    color: HackerTheme.colors.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});

export default TypingEffect;
