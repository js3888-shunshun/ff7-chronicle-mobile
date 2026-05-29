import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '../theme/theme';

export function FFPanel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    ...shadow,
  },
});
