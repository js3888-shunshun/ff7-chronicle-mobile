import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme/theme';

export function LifestreamLoader({ visible, lang }) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (!visible) return;
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.2, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.18, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.85, duration: 900, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.orb, { opacity, transform: [{ scale }] }]} />
      <Text style={styles.label}>
        {lang === 'zh' ? '连接生命之流…' : 'Connecting to the Lifestream…'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,5,11,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 22,
  },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOpacity: 1,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 0 },
  },
  label: {
    color: colors.cyan,
    fontSize: 14,
    letterSpacing: 2.2,
    fontWeight: '600',
  },
});
