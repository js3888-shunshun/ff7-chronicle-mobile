import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FFButton } from '../components/FFButton';
import { FFPanel } from '../components/FFPanel';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { CHARACTER_IDS, CHAR_NAMES, CHAR_COLORS } from '../lib/characters';
import { RELATIONSHIP_OPTIONS } from '../lib/prompts';
import { colors } from '../theme/theme';

const REL_COLOR = {
  stranger: 'rgba(160,160,180,0.25)',
  friend: 'rgba(100,190,255,0.28)',
  partner: 'rgba(100,255,180,0.28)',
  lover: 'rgba(255,140,190,0.32)',
  enemy: 'rgba(255,90,90,0.28)',
};
const REL_ACTIVE = {
  stranger: '#aab0c0',
  friend: '#7ec3ff',
  partner: '#8ff3d1',
  lover: '#ffb0de',
  enemy: '#ff9090',
};

export function GroupSetupScreen({ lang, playerName, relationships, setRelationships, onEnterChat, onBack, hasSavedChat, onContinueSaved, onClearSaved }) {
  const relOptions = RELATIONSHIP_OPTIONS[lang];

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <FFButton onPress={onBack}>{lang === 'zh' ? '返回主线' : 'Back to Story'}</FFButton>
        <Text style={styles.title}>💬 {lang === 'zh' ? '群聊' : 'Group Chat'}</Text>
      </View>

      <Text style={styles.hint}>
        {lang === 'zh' ? '进入群聊前，先设定你和每个人的关系。这个设定只影响群聊，不影响主线。' : 'Set your relationship with each character before entering. This only affects the group chat.'}
      </Text>

      {hasSavedChat && (
        <FFPanel style={styles.savedCard}>
          <Text style={styles.savedNotice}>{lang === 'zh' ? '已保存上次群聊，可继续上一次记录。' : 'You have a saved group chat.'}</Text>
          <View style={styles.savedBtns}>
            <FFButton onPress={onClearSaved} style={styles.savedBtn}>{lang === 'zh' ? '清空记录' : 'Clear'}</FFButton>
            <FFButton variant="primary" onPress={onContinueSaved} style={styles.savedBtn}>{lang === 'zh' ? '继续上次' : 'Continue'}</FFButton>
          </View>
        </FFPanel>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {CHARACTER_IDS.map(id => {
          const current = relationships[id] || 'stranger';
          return (
            <FFPanel key={id} style={styles.charCard}>
              <View style={styles.charRow}>
                <CharacterAvatar id={id} lang={lang} playerName={playerName} />
                <View style={styles.charInfo}>
                  <Text style={[styles.charName, { color: CHAR_COLORS[id] }]}>{CHAR_NAMES[lang][id]}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relBtns}>
                    {relOptions.map(opt => {
                      const active = current === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.relBtn, { backgroundColor: REL_COLOR[opt.value] }, active && { borderColor: REL_ACTIVE[opt.value], borderWidth: 1.5 }]}
                          onPress={() => setRelationships(prev => ({ ...prev, [id]: opt.value }))}
                        >
                          <Text style={[styles.relBtnText, active && { color: REL_ACTIVE[opt.value], fontWeight: '700' }]}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </FFPanel>
          );
        })}
      </ScrollView>

      <FFButton variant="primary" onPress={onEnterChat} style={styles.enterBtn}>
        {lang === 'zh' ? '进入群聊' : 'Enter Chat'}
      </FFButton>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14, gap: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontWeight: '800', fontSize: 16 },
  hint: { color: colors.subtext, fontSize: 12, lineHeight: 18 },
  scroll: { flex: 1 },
  charCard: { padding: 14, marginBottom: 10 },
  charRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  charInfo: { flex: 1, gap: 10 },
  charName: { fontSize: 14, fontWeight: '700' },
  relBtns: { flexDirection: 'row', gap: 8 },
  relBtn: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
  relBtnText: { color: colors.text, fontSize: 12 },
  savedCard: { padding: 14, gap: 10, marginBottom: 10 },
  savedNotice: { color: colors.cyan, fontSize: 13, lineHeight: 20 },
  savedBtns: { flexDirection: 'row', gap: 10 },
  savedBtn: { flex: 1 },
  enterBtn: { marginTop: 4 },
});
