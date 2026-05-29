import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { FFButton } from '../components/FFButton';
import { FFPanel } from '../components/FFPanel';
import { callChatAPI } from '../lib/api';
import { safeJsonObject } from '../lib/json';
import { CHAR_NAMES, CHARACTER_IDS } from '../lib/characters';
import { colors } from '../theme/theme';

function inferDimensions(storyLog, lang) {
  const text = storyLog.map(i => `${i.playerChoice || ''} ${i.narration || ''} ${i.dialogue || ''}`).join(' ').toLowerCase();
  const hasAsk = /问|询问|观察|ask|listen|observe|why|how/.test(text);
  const hasAction = /冲|前进|保护|攻击|move|protect|stop|attack|step/.test(text);
  const hasTrust = /信任|一起|帮助|救|trust|together|help|save/.test(text);
  const hasConflict = /拒绝|反抗|宿敌|refuse|challenge|enemy|rival/.test(text);
  const hasFeeling = /担心|害怕|希望|记忆|care|fear|hope|memory|feel/.test(text);

  if (lang === 'zh') return {
    mbtiLike: hasAction && hasTrust ? 'ENFJ / ESFJ 倾向' : hasAsk && hasFeeling ? 'INFJ / INFP 倾向' : hasAction ? 'ESTP / ENTJ 倾向' : 'INFJ 倾向',
    alignment: hasTrust && !hasConflict ? '中立善良' : hasConflict && hasTrust ? '混乱善良' : hasConflict ? '混乱中立' : '守序中立',
    agencyStyle: hasAction ? '主动推进型' : '观察判断型',
    relationshipStyle: hasTrust ? '关系驱动，倾向建立信任' : '边界感较强，先观察再靠近',
    conflictStyle: hasConflict ? '愿意正面质问或对抗' : '倾向先理解局势，再选择介入方式',
    decisionBias: hasFeeling ? '情感与直觉并重' : '情境判断优先',
    riskLevel: hasAction && hasConflict ? '高风险承受' : hasAction ? '中等风险承受' : '谨慎型',
  };
  return {
    mbtiLike: hasAction && hasTrust ? 'ENFJ / ESFJ leaning' : hasAsk && hasFeeling ? 'INFJ / INFP leaning' : 'INFJ leaning',
    alignment: hasTrust && !hasConflict ? 'Neutral Good' : hasConflict && hasTrust ? 'Chaotic Good' : 'Lawful Neutral',
    agencyStyle: hasAction ? 'Proactive driver' : 'Observer and evaluator',
    relationshipStyle: hasTrust ? 'Relationship-driven, trust-building' : 'Boundary-conscious, observes before getting close',
    conflictStyle: hasConflict ? 'Willing to confront directly' : 'Understands the situation before stepping in',
    decisionBias: hasFeeling ? 'Emotion and intuition balanced' : 'Context-first judgment',
    riskLevel: hasAction && hasConflict ? 'High risk tolerance' : hasAction ? 'Moderate risk tolerance' : 'Cautious',
  };
}

function buildPlainLog(log, playerName, lang) {
  return log.map((item, idx) => {
    const loc = item.location ? `[${item.location}]` : '';
    const choice = item.playerChoice ? `${lang === 'zh' ? '玩家' : 'Player'}: ${item.playerChoice}` : '';
    const narr = item.narration ? `${lang === 'zh' ? '旁白' : 'Narration'}: ${item.narration}` : '';
    const dlg = item.dialogue ? `${item.speaker || 'narrator'}: ${item.dialogue}` : '';
    return `${idx + 1}. ${loc}\n${choice}\n${narr}\n${dlg}`.trim();
  }).join('\n\n');
}

function buildReviewPrompt({ lang, playerName, storyLog, endingMeta }) {
  const plainLog = buildPlainLog(storyLog, playerName, lang);
  const choices = storyLog.filter(i => i.playerChoice).map(i => i.playerChoice);

  if (lang === 'zh') {
    return `你是故事分析引擎。根据以下 FF7 互动故事记录，生成故事回顾。
玩家名：${playerName}
故事记录：
${plainLog}
结局：${endingMeta?.endingTitle || '未命名结局'}

返回 ONLY 一个严格 JSON object：
{"novelTitle":"故事标题","novelParagraphs":["段落1","段落2","段落3"],"profileTitle":"${playerName}的人物画像","profileParagraphs":["画像段落1","画像段落2"],"traits":["特质1","特质2","特质3"],"relationshipSummary":"角色关系总结1-2句","choiceSummary":[{"choice":"选择文本","impact":"影响描述"}],"endingReflection":"结局感悟2-3句"}`;
  }

  return `You are a story analysis engine. Generate a story review for this FF7 interactive story.
Player name: ${playerName}
Story log:
${plainLog}
Ending: ${endingMeta?.endingTitle || 'Untitled Ending'}

Return ONLY one strict JSON object:
{"novelTitle":"story title","novelParagraphs":["paragraph 1","paragraph 2","paragraph 3"],"profileTitle":"${playerName}'s Character Profile","profileParagraphs":["profile paragraph 1","profile paragraph 2"],"traits":["trait 1","trait 2","trait 3"],"relationshipSummary":"1-2 sentence relationship summary","choiceSummary":[{"choice":"choice text","impact":"impact description"}],"endingReflection":"2-3 sentence reflection"}`;
}

export function StoryReviewScreen({ lang, playerName, storyLog, endingMeta, onBack }) {
  const [tab, setTab] = useState('novel');
  const [review, setReview] = useState(null);
  const [busy, setBusy] = useState(false);

  const dimensions = inferDimensions(storyLog, lang);
  const choices = storyLog.filter(i => i.playerChoice);

  async function generateReview() {
    if (busy) return;
    setBusy(true);
    try {
      const prompt = buildReviewPrompt({ lang, playerName, storyLog, endingMeta });
      const raw = await callChatAPI(prompt, [{ role: 'user', content: lang === 'zh' ? '生成故事回顾' : 'Generate story review' }]);
      const parsed = safeJsonObject(raw);
      setReview({
        novelTitle: parsed.novelTitle || endingMeta?.endingTitle || (lang === 'zh' ? '未命名旅程' : 'Untitled Journey'),
        novelText: Array.isArray(parsed.novelParagraphs) ? parsed.novelParagraphs.join('\n\n') : (parsed.novelText || ''),
        profileTitle: parsed.profileTitle || `${playerName}${lang === 'zh' ? '的人物画像' : "'s Character Profile"}`,
        playerProfile: Array.isArray(parsed.profileParagraphs) ? parsed.profileParagraphs.join('\n\n') : (parsed.playerProfile || ''),
        traits: Array.isArray(parsed.traits) ? parsed.traits.slice(0, 6) : [],
        relationshipSummary: parsed.relationshipSummary || '',
        choiceSummary: Array.isArray(parsed.choiceSummary) ? parsed.choiceSummary.slice(0, 8) : [],
        endingReflection: parsed.endingReflection || '',
      });
    } catch {
      setReview(null);
    } finally {
      setBusy(false);
    }
  }

  const TABS = [
    { key: 'novel', label: lang === 'zh' ? '小说' : 'Novel' },
    { key: 'choices', label: lang === 'zh' ? '选择' : 'Choices' },
    { key: 'dimensions', label: lang === 'zh' ? '维度' : 'Dimensions' },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <FFButton onPress={onBack}>{lang === 'zh' ? '返回' : 'Back'}</FFButton>
        <Text style={styles.title}>{lang === 'zh' ? '故事回顾' : 'Story Review'}</Text>
        <FFButton onPress={generateReview} disabled={busy}>
          {busy ? '…' : (lang === 'zh' ? '生成总结' : 'Generate')}
        </FFButton>
      </View>

      {endingMeta && (
        <FFPanel style={styles.endingCard}>
          <Text style={styles.endingTitle}>{endingMeta.endingTitle}</Text>
          <Text style={styles.endingSummary}>{endingMeta.endingSummary}</Text>
        </FFPanel>
      )}

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(t => (
          <FFButton key={t.key} variant={tab === t.key ? 'primary' : 'secondary'} onPress={() => setTab(t.key)} style={styles.tabBtn}>
            {t.label}
          </FFButton>
        ))}
      </View>

      <FFPanel style={styles.contentPanel}>
        {busy ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.cyan} />
            <Text style={styles.loadingText}>{lang === 'zh' ? '正在整理旅程…' : 'Reviewing the journey…'}</Text>
          </View>
        ) : (
          <ScrollView style={styles.scroll}>
            {/* Novel tab */}
            {tab === 'novel' && (
              review ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{review.novelTitle}</Text>
                  <Text style={styles.novelText}>{review.novelText}</Text>
                  {review.endingReflection ? <Text style={styles.reflection}>{review.endingReflection}</Text> : null}
                  {review.traits.length > 0 && (
                    <View style={styles.traitRow}>
                      {review.traits.map((t, i) => <View key={i} style={styles.traitChip}><Text style={styles.traitText}>{t}</Text></View>)}
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>{lang === 'zh' ? '点击右上角"生成总结"来获取 AI 故事回顾。' : 'Tap "Generate" in the top right to get an AI story review.'}</Text>
                  <Text style={styles.plainLogLabel}>{lang === 'zh' ? '原始记录：' : 'Raw log:'}</Text>
                  <Text style={styles.plainLog}>{buildPlainLog(storyLog, playerName, lang)}</Text>
                </View>
              )
            )}

            {/* Choices tab */}
            {tab === 'choices' && (
              <View style={styles.section}>
                {(review?.choiceSummary?.length ? review.choiceSummary : choices.map(c => ({ choice: c.playerChoice, impact: '' }))).map((item, idx) => (
                  <View key={idx} style={styles.choiceItem}>
                    <Text style={styles.choiceNum}>{idx + 1}</Text>
                    <View style={styles.choiceContent}>
                      <Text style={styles.choiceText}>{item.choice}</Text>
                      {item.impact ? <Text style={styles.choiceImpact}>{item.impact}</Text> : null}
                    </View>
                  </View>
                ))}
                {choices.length === 0 && <Text style={styles.emptyText}>{lang === 'zh' ? '暂无选择记录。' : 'No choices recorded yet.'}</Text>}
              </View>
            )}

            {/* Dimensions tab */}
            {tab === 'dimensions' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{lang === 'zh' ? `${playerName}的人物维度` : `${playerName}'s Character Dimensions`}</Text>
                {review?.playerProfile ? <Text style={styles.profileText}>{review.playerProfile}</Text> : null}
                {Object.entries(dimensions).map(([key, val]) => (
                  <View key={key} style={styles.dimRow}>
                    <Text style={styles.dimKey}>{key}</Text>
                    <Text style={styles.dimVal}>{val}</Text>
                  </View>
                ))}
                {review?.relationshipSummary ? (
                  <View style={styles.relSummary}>
                    <Text style={styles.relSummaryText}>{review.relationshipSummary}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </ScrollView>
        )}
      </FFPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14, gap: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontWeight: '800', fontSize: 16 },
  endingCard: { padding: 14, gap: 6 },
  endingTitle: { color: colors.cyan, fontSize: 15, fontWeight: '800' },
  endingSummary: { color: colors.text, lineHeight: 22, fontSize: 13 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabBtn: { flex: 1 },
  contentPanel: { flex: 1, padding: 16 },
  scroll: { flex: 1 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 40 },
  loadingText: { color: colors.cyan, fontSize: 13 },
  section: { gap: 14 },
  sectionTitle: { color: colors.cyan, fontSize: 16, fontWeight: '800', marginBottom: 4 },
  novelText: { color: colors.text, lineHeight: 26, fontSize: 15 },
  reflection: { color: colors.subtext, lineHeight: 24, fontStyle: 'italic', marginTop: 8 },
  traitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  traitChip: { backgroundColor: 'rgba(120,200,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(120,200,255,0.3)' },
  traitText: { color: colors.blue, fontSize: 12 },
  emptyBox: { gap: 14 },
  emptyText: { color: colors.subtext, lineHeight: 22 },
  plainLogLabel: { color: colors.cyan, fontSize: 12, marginTop: 8 },
  plainLog: { color: 'rgba(200,220,255,0.5)', fontSize: 12, lineHeight: 20 },
  choiceItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(140,190,255,0.1)' },
  choiceNum: { color: colors.cyan, fontWeight: '800', fontSize: 14, width: 20, marginTop: 2 },
  choiceContent: { flex: 1, gap: 4 },
  choiceText: { color: colors.text, fontSize: 14, lineHeight: 22 },
  choiceImpact: { color: colors.subtext, fontSize: 12, lineHeight: 20, fontStyle: 'italic' },
  profileText: { color: colors.text, lineHeight: 24, marginBottom: 12 },
  dimRow: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(140,190,255,0.08)' },
  dimKey: { color: colors.subtext, fontSize: 12, width: 100 },
  dimVal: { color: colors.text, fontSize: 13, flex: 1 },
  relSummary: { marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: 'rgba(120,200,255,0.08)', borderWidth: 1, borderColor: 'rgba(120,200,255,0.15)' },
  relSummaryText: { color: colors.text, lineHeight: 22, fontStyle: 'italic' },
});
