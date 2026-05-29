import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

export function FFButton({ children, onPress, variant = 'secondary', disabled, style }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: 'rgba(99,156,255,0.28)',
    borderColor: 'rgba(176,216,255,0.72)',
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(124,178,255,0.25)',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
  text: {
    color: colors.text,
    fontSize: 13,
    letterSpacing: 0.8,
    fontWeight: '600',
  },
});
