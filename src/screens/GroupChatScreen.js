import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Image,
  Platform, Modal, TouchableOpacity,
  ActivityIndicator, Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FFButton } from '../components/FFButton';
import { FFPanel } from '../components/FFPanel';
import { CHARACTER_IDS, CHAR_NAMES, CHAR_COLORS, CHAR_INITIALS, displayName } from '../lib/characters';
import { callChatAPI } from '../lib/api';
import { colors } from '../theme/theme';

// ── Portraits ────────────────────────────────────────────────────────────────
const PORTRAITS = {
  cloud:     require('../assets/portraits/cloud.jpg'),
  zack:      require('../assets/portraits/zack.jpg'),
  tifa:      require('../assets/portraits/tifa.jpg'),
  aerith:    require('../assets/portraits/aerith.jpg'),
  barrett:   require('../assets/portraits/barrett.jpg'),
  sephiroth: require('../assets/portraits/sephiroth.jpg'),
};

// Small rounded-square avatar used next to chat bubbles
function MsgAvatar({ id, playerName }) {
  const color  = CHAR_COLORS[id] || '#7ec3ff';
  const source = PORTRAITS[id];
  const initial = id === 'player'
    ? (playerName || 'P').slice(0, 1).toUpperCase()
    : (CHAR_INITIALS[id] || id.slice(0, 2).toUpperCase());

  return (
    <View style={[avatarStyles.wrap, { borderColor: color }]}>
      {source
        ? <Image source={source} style={avatarStyles.img} />
        : <Text style={[avatarStyles.initial, { color }]}>{initial}</Text>}
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  wrap:    { width: 40, height: 40, borderRadius: 10, borderWidth: 1.5, overflow: 'hidden', backgroundColor: '#050e22', alignItems: 'center', justifyContent: 'center' },
  img:     { width: '100%', height: '100%', resizeMode: 'cover' },
  initial: { fontSize: 14, fontWeight: '800' },
});

// ── Prompt helpers ────────────────────────────────────────────────────────────
const RELATIONSHIP_TEXT = {
  zh: {
    friend:   '朋友：可以自然聊天、开玩笑、关心玩家，但不要过度亲密。',
    lover:    '恋人：可以有明显亲密和在意，但保持角色性格，不要油腻。',
    stranger: '陌生人：不熟，先试探、保持距离，不要一上来像认识多年。',
    partner:  '伙伴：有共同目标和信任基础，偏战友/同行关系。',
    enemy:    '敌人 / 宿敌：互相警惕、带有冲突和张力，不要无意义辱骂。',
  },
  en: {
    friend:   'Friend: casual, caring, and lightly teasing, but not overly intimate.',
    lover:    'Lover: clearly close and emotionally invested, but still in-character.',
    stranger: 'Stranger: unfamiliar, cautious, and not instantly intimate.',
    partner:  'Partner: shared goal and trust, more like comrades or teammates.',
    enemy:    'Enemy / Rival: tense, guarded, and conflict-driven.',
  },
};

const MEMORY_SUBJECTS = ['group', 'player', ...CHARACTER_IDS];

function buildSystemPrompt({ lang, playerName, messages, memory, memoryItems, relationships, isRandomEvent }) {
  const memberNames = CHARACTER_IDS.map(id => CHAR_NAMES[lang][id]).join(', ');
  const recent = messages.filter(m => m.speaker !== 'system').slice(-12).map(m => {
    const who = m.speaker === 'player' ? playerName : CHAR_NAMES[lang][m.speaker] || m.speaker;
    return `${who}: ${m.text}`;
  }).join('\n');

  const relGuide = CHARACTER_IDS.map(id => {
    const rel = relationships?.[id] || 'stranger';
    return `- ${playerName} ↔ ${CHAR_NAMES[lang][id]}: ${RELATIONSHIP_TEXT[lang][rel]}`;
  }).join('\n');

  const memContext = [
    memory ? `[全局群聊] ${memory}` : '',
    ...(memoryItems || []).slice(-20).filter(i => i?.text).map(i => {
      const subj = i.subject === 'group' ? (lang === 'zh' ? '全局群聊' : 'Global') : i.subject === 'player' ? playerName : (CHAR_NAMES[lang][i.subject] || i.subject);
      return `[${subj}] ${i.text}`;
    }),
  ].filter(Boolean).join('\n') || (lang === 'zh' ? '暂无。' : 'None.');

  if (lang === 'zh') {
    return `你是现代聊天软件里的群聊模拟器。群成员：${memberNames}，以及玩家 ${playerName}。
核心规则：
- 像微信/Discord 群聊，一条消息 1-2 句，只有对话文字。
- 严格禁止任何非对话内容：不能有动作描写、旁白、括号说明、星号动作。
- 错误示例（绝对不能出现）：Cloud: （叹气）我知道了。/ Tifa: *看向远处* 也许吧。
- 正确示例：Cloud: 我知道了。/ Tifa: 也许吧。
- 只输出角色说的话，不输出角色做的事，不加任何括号或星号。
- 根据语境选择 1-4 个最应该回应的人。
- Sephiroth 可以偶尔出现，但不要变成热情群友。
- 当前模式：${isRandomEvent ? '随机事件，让较少发言的人主动开启话题' : '回应玩家刚才的话'}

玩家与各角色的关系（仅影响群聊）：
${relGuide}

长期记忆：
${memContext}

最近聊天：
${recent || '暂无'}

返回格式：每行一条消息，格式 "角色名: 内容"，不要 JSON，不要 markdown。`;
  }

  return `You are a group chat simulator. Members: ${memberNames}, and player ${playerName}.
Rules:
- Like Discord/WhatsApp. 1-2 sentences per message. Dialogue only.
- Absolutely forbidden: action descriptions, narration, asterisk actions (*like this*), parenthetical notes. Only spoken words.
- Choose 1-4 most natural responders.
- Sephiroth may appear occasionally but must not be cheerful.
- Mode: ${isRandomEvent ? 'random event — let a quieter member start a topic' : 'respond to the player'}

Player relationships (group chat only):
${relGuide}

Long-term memory:
${memContext}

Recent chat:
${recent || 'None'}

Return format: one message per line as "Name: content". No JSON, no markdown.`;
}

function buildMemoryPrompt({ lang, playerName, messages, memory }) {
  const transcript = messages.filter(m => m.speaker !== 'system').slice(-24).map(m => {
    const who = m.speaker === 'player' ? playerName : CHAR_NAMES[lang][m.speaker] || m.speaker;
    return `${who}: ${m.text}`;
  }).join('\n');

  if (lang === 'zh') {
    return `你是群聊长期记忆整理器。把聊天内容压缩成后续角色可用的长期记忆。
旧记忆：${memory || '暂无'}
最近聊天：\n${transcript}
输出 1-6 行，每行一条记忆，格式：subject: 内容
subject 只能是 group, player, cloud, zack, tifa, aerith, barrett, sephiroth。不要 markdown。`;
  }

  return `You are a long-term memory summarizer for a group chat.
Old memory: ${memory || 'None'}
Recent chat:\n${transcript}
Output 1-6 lines, each: subject: memory text
subject must be one of group, player, cloud, zack, tifa, aerith, barrett, sephiroth. No markdown.`;
}

function parseMemoryLines(raw) {
  const lines = String(raw || '').split('\n').map(x => x.trim()).filter(Boolean);
  const items = [];
  const subjects = ['group', 'player', ...CHARACTER_IDS];
  const aliases = { '全局群聊': 'group', '群聊': 'group', 'global': 'group', 'chat': 'group', '玩家': 'player', '克劳德': 'cloud', '扎克斯': 'zack', '蒂法': 'tifa', '爱丽丝': 'aerith', 'aeris': 'aerith', 'barret': 'barrett', '巴雷特': 'barrett', '萨菲罗斯': 'sephiroth' };
  for (const line of lines) {
    const m = line.match(/^([^:：]+)[：:]\s*(.+)$/);
    if (!m) continue;
    const rawSubj = m[1].trim().toLowerCase();
    const subject = aliases[rawSubj] || subjects.find(s => rawSubj.includes(s)) || 'group';
    items.push({ subject, text: m[2].trim() });
  }
  return items.slice(0, 8);
}

function normalizeGroupSpeaker(raw) {
  const s = String(raw || '').trim().toLowerCase();
  const map = { cloud: 'cloud', '克劳德': 'cloud', zack: 'zack', '扎克斯': 'zack', tifa: 'tifa', '蒂法': 'tifa', aerith: 'aerith', aeris: 'aerith', '爱丽丝': 'aerith', barrett: 'barrett', barret: 'barrett', '巴雷特': 'barrett', sephiroth: 'sephiroth', '萨菲罗斯': 'sephiroth' };
  for (const [k, v] of Object.entries(map)) { if (s.includes(k.toLowerCase())) return v; }
  return null;
}

function stripActions(text) {
  return text
    .replace(/\*[^*\n]+\*/g, '')
    .replace(/[（(][^）)\n]{1,30}[）)]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function parseReplies(raw) {
  const lines = String(raw || '').split('\n').map(x => x.trim()).filter(Boolean);
  const replies = [];
  for (const line of lines) {
    const m = line.match(/^\[?([^\]:：]+)\]?[：:]\s*(.+)$/);
    if (!m) continue;
    const speaker = normalizeGroupSpeaker(m[1]);
    const text = stripActions(m[2].trim());
    if (speaker && text && !text.includes('{') && !text.includes('speaker')) replies.push({ speaker, text });
  }
  return replies.slice(0, 4);
}

function subjectLabel(subject, lang, playerName) {
  if (subject === 'group') return lang === 'zh' ? '全局群聊' : 'Global';
  if (subject === 'player') return playerName;
  return CHAR_NAMES[lang][subject] || subject;
}

// ── Main component ────────────────────────────────────────────────────────────
export function GroupChatScreen({ lang, playerName, messages, setMessages, memory, setMemory, memoryItems, setMemoryItems, relationships, onBack }) {
  const insets = useSafeAreaInsets();
  const [input, setInput]             = useState('');
  const [busy, setBusy]               = useState(false);
  const [memBusy, setMemBusy]         = useState(false);
  const [errorMsg, setErrorMsg]       = useState('');
  const [showMemory, setShowMemory]   = useState(false);
  const [memDraftSubject, setMemDraftSubject] = useState('group');
  const [memDraftText, setMemDraftText]       = useState('');
  const [keyboardPad, setKeyboardPad] = useState(0);
  const [showMembers, setShowMembers] = useState(false);
  const scrollRef = useRef(null);

  // Keyboard: manually track height so input bar is never covered
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e) => {
      // Subtract bottom safe area because SafeAreaView already accounts for it
      setKeyboardPad(e.endCoordinates.height - insets.bottom);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    });
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardPad(0));
    return () => { show.remove(); hide.remove(); };
  }, [insets.bottom]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(timer);
  }, [messages, busy]);

  async function send(text, isRandomEvent = false) {
    const t = (text || input).trim();
    if (!t && !isRandomEvent) return;
    if (busy) return;

    let nextMessages = messages;
    if (!isRandomEvent) {
      const playerMsg = { id: `p-${Date.now()}`, speaker: 'player', text: t, ts: new Date().toISOString() };
      nextMessages = [...messages, playerMsg];
      setMessages(nextMessages);
      setInput('');
    }
    setBusy(true);
    setErrorMsg('');

    try {
      const prompt = buildSystemPrompt({ lang, playerName, messages: nextMessages, memory, memoryItems, relationships, isRandomEvent });
      const userContent = isRandomEvent ? (lang === 'zh' ? '(随机事件触发)' : '(random event)') : t;
      const raw = await callChatAPI(prompt, [{ role: 'user', content: userContent }]);
      const replies = parseReplies(raw);
      const safeReplies = replies.length ? replies : [{ speaker: 'tifa', text: lang === 'zh' ? '我在。刚才可能卡了一下，再说一遍？' : "I'm here. Say that again?" }];

      for (let i = 0; i < safeReplies.length; i++) {
        const delay = 550 + Math.floor(Math.random() * 400) + i * 200;
        await new Promise(r => setTimeout(r, delay));
        setMessages(prev => [...prev, { id: `r-${Date.now()}-${i}`, speaker: safeReplies[i].speaker, text: safeReplies[i].text, ts: new Date().toISOString() }]);
      }

      const meaningful = nextMessages.filter(m => m.speaker !== 'system').length;
      if (meaningful > 0 && meaningful % 6 === 0) refreshMemory(false);
    } catch (err) {
      setErrorMsg(err.message || (lang === 'zh' ? '发送失败，请重试' : 'Send failed'));
    } finally {
      setBusy(false);
    }
  }

  async function refreshMemory(force = true) {
    if (memBusy) return;
    const meaningful = messages.filter(m => m.speaker !== 'system');
    if (!force && meaningful.length < 10) return;
    setMemBusy(true);
    try {
      const prompt = buildMemoryPrompt({ lang, playerName, messages, memory });
      const raw = await callChatAPI(prompt, [{ role: 'user', content: lang === 'zh' ? '整理长期记忆' : 'Summarize long-term memory' }]);
      const items = parseMemoryLines(raw);
      if (items.length) {
        setMemoryItems(prev => {
          const manual = prev.filter(i => i.source !== 'auto');
          const newAuto = items.map(i => ({ ...i, id: `auto-${Date.now()}-${Math.random().toString(16).slice(2)}`, source: 'auto', createdAt: new Date().toISOString() }));
          return [...manual, ...newAuto].slice(-40);
        });
        const summary = items.map(i => `[${subjectLabel(i.subject, lang, playerName)}] ${i.text}`).join(' / ').slice(0, 400);
        setMemory(summary);
        if (force) setMessages(prev => [...prev, { id: `mem-${Date.now()}`, speaker: 'system', text: lang === 'zh' ? '群聊记忆已更新。' : 'Memory updated.' }]);
      }
    } catch {} finally { setMemBusy(false); }
  }

  function addManualMemory() {
    if (!memDraftText.trim()) return;
    setMemoryItems(prev => [...prev, { id: `manual-${Date.now()}`, subject: memDraftSubject, text: memDraftText.trim().slice(0, 220), source: 'manual', createdAt: new Date().toISOString() }].slice(-40));
    setMemDraftText('');
  }

  function deleteMemory(id) { setMemoryItems(prev => prev.filter(i => i.id !== id)); }

  function clearMemory() {
    setMemory('');
    setMemoryItems([]);
    setMessages(prev => [...prev, { id: `mem-clr-${Date.now()}`, speaker: 'system', text: lang === 'zh' ? '记忆已清空。' : 'Memory cleared.' }]);
  }

  return (
    <View style={[styles.wrap, { paddingBottom: keyboardPad }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <FFButton onPress={onBack} style={styles.topBtn}>{lang === 'zh' ? '返回' : 'Back'}</FFButton>
        <TouchableOpacity onPress={() => setShowMembers(v => !v)} style={styles.topTitleBtn}>
          <Text style={styles.topTitle}>{lang === 'zh' ? '第七天堂群聊' : 'Seventh Heaven'}</Text>
          <Text style={styles.topTitleArrow}>{showMembers ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        <FFButton onPress={() => setShowMemory(true)} style={styles.topBtn}>🧠</FFButton>
      </View>

      {/* Member avatar rail — floats over chat, does not shift layout */}
      {showMembers && (
        <TouchableOpacity activeOpacity={1} onPress={() => setShowMembers(false)} style={styles.memberOverlay}>
          <View style={styles.memberDropdown}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberRailContent}>
              {CHARACTER_IDS.map(id => {
                const color = CHAR_COLORS[id] || colors.subtext;
                const source = PORTRAITS[id];
                return (
                  <View key={id} style={styles.memberItem}>
                    <View style={[styles.memberAvatarWrap, { borderColor: color }]}>
                      {source
                        ? <Image source={source} style={styles.memberAvatarImg} />
                        : <Text style={[styles.memberAvatarInitial, { color }]}>{CHAR_INITIALS[id] || id.slice(0,2).toUpperCase()}</Text>}
                    </View>
                    <Text style={[styles.memberName, { color }]} numberOfLines={1}>{CHAR_NAMES[lang][id]}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}

      {/* Message list */}
      <ScrollView
        ref={scrollRef}
        style={styles.msgList}
        contentContainerStyle={styles.msgContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg, idx) => {
          const isPlayer = msg.speaker === 'player';
          const isSystem = msg.speaker === 'system';
          const key = msg.id || `${idx}-${msg.text?.slice(0, 10)}`;

          if (isSystem) {
            return (
              <View key={key} style={styles.sysRow}>
                <Text style={styles.sysText}>{msg.text}</Text>
              </View>
            );
          }

          const name = isPlayer ? playerName : displayName(msg.speaker, lang, playerName);
          const nameColor = isPlayer ? colors.blue : (CHAR_COLORS[msg.speaker] || colors.subtext);

          if (isPlayer) {
            return (
              <View key={key} style={styles.rowRight}>
                <View style={styles.colRight}>
                  <View style={styles.playerBubble}>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                  </View>
                </View>
                <MsgAvatar id="player" playerName={playerName} />
              </View>
            );
          }

          return (
            <View key={key} style={styles.rowLeft}>
              <MsgAvatar id={msg.speaker} playerName={playerName} />
              <View style={styles.colLeft}>
                <Text style={[styles.msgName, { color: nameColor }]}>{name}</Text>
                <View style={styles.charBubble}>
                  <Text style={styles.bubbleText}>{msg.text}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {busy && (
          <View style={styles.rowLeft}>
            <View style={[avatarStyles.wrap, { borderColor: 'transparent', backgroundColor: 'transparent' }]} />
            <View style={styles.typingBubble}>
              <Text style={styles.typingDots}>• • •</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Error bar */}
      {errorMsg ? (
        <View style={styles.errorBar}>
          <Text style={styles.errorText} numberOfLines={2}>{errorMsg}</Text>
          <TouchableOpacity onPress={() => setErrorMsg('')}><Text style={styles.errorX}>×</Text></TouchableOpacity>
        </View>
      ) : null}

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.diceBtn} onPress={() => send('', true)} disabled={busy}>
          <Text style={styles.diceBtnText}>🎲</Text>
        </TouchableOpacity>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={lang === 'zh' ? '说点什么…' : 'Message…'}
          placeholderTextColor="rgba(203,222,247,0.35)"
          style={styles.textInput}
          onSubmitEditing={() => send()}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || busy) && styles.sendBtnDisabled]}
          onPress={() => send()}
          disabled={busy || !input.trim()}
        >
          <Text style={styles.sendBtnText}>{lang === 'zh' ? '发送' : 'Send'}</Text>
        </TouchableOpacity>
      </View>

      {/* Memory modal (no keyboard pad needed — modal sits above everything) */}
      <Modal visible={showMemory} transparent animationType="slide" onRequestClose={() => setShowMemory(false)}>
        <View style={styles.modalOverlay}>
          <FFPanel style={styles.modalPanel}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{lang === 'zh' ? '记忆管理' : 'Memory'}</Text>
              <View style={styles.modalHeaderBtns}>
                {memBusy
                  ? <ActivityIndicator color={colors.cyan} size="small" />
                  : <FFButton onPress={() => refreshMemory(true)} style={styles.memBtn}>{lang === 'zh' ? '刷新' : 'Refresh'}</FFButton>}
                <FFButton onPress={clearMemory} style={styles.memBtn}>{lang === 'zh' ? '清空' : 'Clear'}</FFButton>
                <FFButton variant="primary" onPress={() => setShowMemory(false)}>{lang === 'zh' ? '关闭' : 'Close'}</FFButton>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectRow}>
              {MEMORY_SUBJECTS.map(s => (
                <TouchableOpacity key={s} style={[styles.subjectChip, memDraftSubject === s && styles.subjectChipActive]} onPress={() => setMemDraftSubject(s)}>
                  <Text style={[styles.subjectChipText, memDraftSubject === s && { color: colors.cyan }]}>{subjectLabel(s, lang, playerName)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.addMemRow}>
              <TextInput value={memDraftText} onChangeText={setMemDraftText} placeholder={lang === 'zh' ? '手动添加记忆…' : 'Add a memory manually…'} placeholderTextColor="rgba(203,222,247,0.3)" style={styles.memInput} multiline />
              <FFButton variant="primary" disabled={!memDraftText.trim()} onPress={addManualMemory}>{lang === 'zh' ? '添加' : 'Add'}</FFButton>
            </View>

            <ScrollView style={styles.memList} showsVerticalScrollIndicator={false}>
              {memoryItems.length === 0 && (
                <Text style={styles.noMemText}>{lang === 'zh' ? '暂无记忆。聊天后刷新，或手动添加。' : 'No memories. Chat then refresh, or add manually.'}</Text>
              )}
              {memoryItems.map(item => (
                <View key={item.id} style={styles.memItem}>
                  <View style={[styles.memDot, item.source === 'manual' && { backgroundColor: '#ffe482' }]} />
                  <View style={styles.memBody}>
                    <Text style={styles.memSubject}>{subjectLabel(item.subject, lang, playerName)}</Text>
                    <Text style={styles.memText}>{item.text}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteMemory(item.id)} style={styles.memDelBtn}>
                    <Text style={styles.memDelText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </FFPanel>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#02050b' },

  // Top bar
  topBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(140,190,255,0.1)' },
  topTitleBtn:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  topTitle:     { color: colors.text, fontWeight: '800', fontSize: 15 },
  topTitleArrow:{ color: colors.subtext, fontSize: 10 },
  topBtn:       { paddingVertical: 6, paddingHorizontal: 10 },

  // Member dropdown (floats over chat)
  memberOverlay:       { position: 'absolute', top: 48, left: 0, right: 0, zIndex: 20 },
  memberDropdown:      { backgroundColor: 'rgba(4,10,26,0.96)', borderBottomWidth: 1, borderBottomColor: 'rgba(140,190,255,0.15)', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  memberRailContent:   { paddingHorizontal: 16, paddingVertical: 12, gap: 18, flexDirection: 'row', alignItems: 'center' },
  memberItem:          { alignItems: 'center', gap: 5 },
  memberAvatarWrap:    { width: 36, height: 36, borderRadius: 9, borderWidth: 1.5, overflow: 'hidden', backgroundColor: '#050e22', alignItems: 'center', justifyContent: 'center' },
  memberAvatarImg:     { width: '100%', height: '100%', resizeMode: 'cover' },
  memberAvatarInitial: { fontSize: 11, fontWeight: '800' },
  memberName:          { fontSize: 10, maxWidth: 42, textAlign: 'center' },

  // Message list
  msgList:    { flex: 1 },
  msgContent: { paddingHorizontal: 12, paddingVertical: 14, gap: 4 },

  // Character message row (left)
  rowLeft:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  colLeft:   { flex: 1, gap: 4 },
  msgName:   { fontSize: 12, fontWeight: '600', marginLeft: 2 },
  charBubble: {
    alignSelf: 'flex-start',
    maxWidth: '82%',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },

  // Player message row (right)
  rowRight:    { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 10, marginBottom: 10 },
  colRight:    { alignItems: 'flex-end', maxWidth: '82%' },
  playerBubble: {
    backgroundColor: 'rgba(78,130,255,0.45)',
    borderRadius: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },

  bubbleText: { color: '#e8f0ff', fontSize: 15, lineHeight: 22 },

  // Typing indicator
  typingBubble: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 },
  typingDots:   { color: colors.subtext, fontSize: 14, letterSpacing: 3 },

  // System message
  sysRow:  { alignItems: 'center', marginVertical: 8 },
  sysText: { color: 'rgba(160,180,210,0.5)', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 },

  // Error bar
  errorBar:  { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,60,60,0.15)', marginHorizontal: 12, marginBottom: 6, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  errorText: { color: colors.danger, fontSize: 12, flex: 1 },
  errorX:    { color: colors.danger, fontSize: 18, paddingLeft: 8 },

  // Input bar — WeChat style
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(140,190,255,0.1)',
    backgroundColor: '#020812',
  },
  diceBtn:     { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  diceBtnText: { fontSize: 18 },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 9,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  sendBtn:         { height: 40, paddingHorizontal: 16, borderRadius: 20, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: 'rgba(91,145,255,0.25)' },
  sendBtnText:     { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Memory modal
  modalOverlay:    { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' },
  modalPanel:      { padding: 18, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, gap: 12, maxHeight: '85%' },
  modalHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle:      { color: colors.text, fontSize: 16, fontWeight: '800' },
  modalHeaderBtns: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  memBtn:          { paddingVertical: 7, paddingHorizontal: 12 },
  subjectRow:      { flexDirection: 'row', gap: 8 },
  subjectChip:     { paddingVertical: 5, paddingHorizontal: 11, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(140,190,255,0.2)' },
  subjectChipActive: { borderColor: colors.cyan, backgroundColor: 'rgba(119,232,241,0.12)' },
  subjectChipText: { color: colors.subtext, fontSize: 12 },
  addMemRow:       { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  memInput:        { flex: 1, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, fontSize: 13, maxHeight: 80, textAlignVertical: 'top' },
  memList:         { maxHeight: 280 },
  noMemText:       { color: colors.subtext, fontSize: 12, lineHeight: 20, textAlign: 'center', paddingVertical: 20 },
  memItem:         { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(140,190,255,0.08)' },
  memDot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan, marginTop: 5 },
  memBody:         { flex: 1, gap: 2 },
  memSubject:      { color: colors.cyan, fontSize: 11, fontWeight: '700' },
  memText:         { color: colors.text, fontSize: 13, lineHeight: 20 },
  memDelBtn:       { padding: 4 },
  memDelText:      { color: colors.subtext, fontSize: 16 },
});
