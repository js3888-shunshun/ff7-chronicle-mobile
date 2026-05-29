import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { FFButton } from '../components/FFButton';
import { FFPanel } from '../components/FFPanel';
import { colors } from '../theme/theme';

export function StartScreen({ lang, setLang, initialName, onStart }) {
  const [name, setName] = useState(initialName || 'Joy');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
      <FFPanel style={styles.panel}>
        <Text style={styles.kicker}>FINAL FANTASY VII</Text>
        <Text style={styles.title}>TEXT CHRONICLE</Text>
        <Text style={styles.subtitle}>Mobile starter build. 输入名字，然后开始主线。</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={lang === 'zh' ? '输入你的名字' : 'Enter your name'}
          placeholderTextColor="rgba(203,222,247,0.5)"
          style={styles.input}
        />

        <View style={styles.row}>
          <FFButton onPress={() => setLang(lang === 'zh' ? 'en' : 'zh')}>{lang === 'zh' ? '中文' : 'EN'}</FFButton>
          <FFButton variant="primary" onPress={() => onStart(name.trim() || 'Joy')}>{lang === 'zh' ? '开始故事' : 'Start Story'}</FFButton>
        </View>
      </FFPanel>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  panel: {
    padding: 22,
  },
  kicker: {
    color: colors.cyan,
    fontSize: 12,
    letterSpacing: 2.2,
    marginBottom: 6,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.subtext,
    lineHeight: 21,
    marginBottom: 20,
  },
  input: {
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.panel2,
    padding: 13,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
