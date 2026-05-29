import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CHAR_COLORS, CHAR_INITIALS, displayName } from '../lib/characters';

// SVG 不被 React Native Image 支持，player 用彩色字母代替
const PORTRAITS = {
  cloud: require('../assets/portraits/cloud.jpg'),
  zack: require('../assets/portraits/zack.jpg'),
  tifa: require('../assets/portraits/tifa.jpg'),
  aerith: require('../assets/portraits/aerith.jpg'),
  barrett: require('../assets/portraits/barrett.jpg'),
  sephiroth: require('../assets/portraits/sephiroth.jpg'),
};

export function CharacterAvatar({ id, lang, playerName, active }) {
  const color = CHAR_COLORS[id] || '#7ec3ff';
  const portrait = PORTRAITS[id];

  return (
    <View style={styles.wrap}>
      <View style={[styles.frame, { borderColor: color }, active && { shadowColor: color, shadowOpacity: 0.8 }]}>
        {portrait ? (
          <Image source={portrait} style={styles.image} />
        ) : (
          <Text style={[styles.initials, { color }]}>{CHAR_INITIALS[id] || id.slice(0, 3).toUpperCase()}</Text>
        )}
      </View>
      <Text numberOfLines={1} style={styles.name}>{displayName(id, lang, playerName)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 74,
    alignItems: 'center',
    gap: 6,
  },
  frame: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: 'rgba(5,14,34,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  initials: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  name: {
    color: '#9bb7de',
    fontSize: 11,
  },
});
