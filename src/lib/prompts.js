import { CHARACTER_IDS, CHAR_NAMES, displayName } from './characters';

export const OPENING_VARIANTS = [
  {
    present: ['player', 'cloud', 'tifa'],
    zh: '在第七天堂打烊后的吧台旁，Cloud 沉默地擦着剑，Tifa 把一份被烧焦的 Shinra 文件推到你面前。',
    en: 'After closing time at Seventh Heaven, Cloud silently cleans his sword while Tifa slides a scorched Shinra file toward you.',
  },
  {
    present: ['player', 'aerith', 'zack'],
    zh: '在一座临时花棚里，Aerith 听见生命之流的低语，Zack 却带来了与她感知完全相反的线索。',
    en: 'Inside a makeshift flower shelter, Aerith hears the Lifestream whisper while Zack brings a clue that contradicts what she senses.',
  },
  {
    present: ['player', 'cloud', 'barrett'],
    zh: '在一栋高楼屋顶上，Cloud 和 Barret 观察巡逻路线，而你发现远处的魔晄灯正在以异常节奏闪烁。',
    en: 'On a high rooftop, Cloud and Barret watch the patrol routes while you notice the mako lights flickering in an unnatural rhythm.',
  },
];

export function chooseOpeningVariant() {
  return OPENING_VARIANTS[Math.floor(Math.random() * OPENING_VARIANTS.length)];
}

export function buildStoryPrompt({ lang, playerName, opening, previousScene, playerText, isOpening }) {
  const present = isOpening ? opening.present : previousScene?.present || ['player', 'cloud', 'tifa'];
  const cast = present.map((id) => displayName(id, lang, playerName)).join(', ');
  const speakerChoices = ['cloud', 'zack', 'tifa', 'aerith', 'barrett', 'sephiroth']
    .filter((id) => present.includes(id))
    .join('|') || 'cloud|tifa';

  if (lang === 'zh') {
    return `你是互动文字游戏叙事引擎。请用中文生成下一幕。
当前玩家名：${playerName}
当前在场：${cast}
${isOpening ? `本次开局：${opening.zh}` : `玩家刚才的行动：${playerText}`}

要求：
- 玩家只能控制自己的话和行动。
- 角色出现在 present 里时，narration 或 dialogue 必须体现 TA 的动作、信息、反应或立场。
- 保留一个自由输入选项，target 必须是 "free"。
- 输出必须是严格 JSON object，不要 markdown，不要解释。

格式：
{"location":"地点","narration":"旁白2-4句","speaker":"${speakerChoices}","dialogue":"一句角色台词","present":[${present.map((id) => `"${id}"`).join(',')}],"options":[{"text":"具体行动1","target":"joy_action"},{"text":"具体行动2","target":"joy_action"},{"text":"具体行动3","target":"joy_action"},{"text":"直接说出自己的想法或行动","target":"free"}],"readyForFinale":false,"finaleChoiceText":""}`;
  }

  return `You are an interactive narrative engine. Continue in English.
Player name: ${playerName}
Current cast: ${cast}
${isOpening ? `Opening: ${opening.en}` : `Player action: ${playerText}`}

Requirements:
- The player only controls their own words and actions.
- If a character appears in present, narration or dialogue must show their action, information, reaction, or stance.
- Always keep one free-input option with target "free".
- Return one strict JSON object only. No markdown, no explanation.

Format:
{"location":"place","narration":"2-4 narration sentences","speaker":"${speakerChoices}","dialogue":"one character line","present":[${present.map((id) => `"${id}"`).join(',')}],"options":[{"text":"specific action 1","target":"joy_action"},{"text":"specific action 2","target":"joy_action"},{"text":"specific action 3","target":"joy_action"},{"text":"Say exactly what you want to do or say","target":"free"}],"readyForFinale":false,"finaleChoiceText":""}`;
}

// 完全对齐 web 版的关系描述（影响 AI 对话风格）
const RELATIONSHIP_TEXT = {
  zh: {
    friend: '朋友：可以自然聊天、开玩笑、关心玩家，但不要过度亲密。',
    lover: '恋人：可以有明显亲密和在意，但保持角色性格，不要油腻。',
    stranger: '陌生人：不熟，先试探、保持距离，不要一上来像认识多年。',
    partner: '伙伴：有共同目标和信任基础，偏战友 / 同行关系。',
    enemy: '敌人 / 宿敌：互相警惕、带有冲突和张力，但不要无脑攻击。',
  },
  en: {
    friend: 'Friend: Natural conversation, occasional jokes, genuine care, but not overly intimate.',
    lover: 'Lover: Visible warmth and affection, while staying true to character personality.',
    stranger: 'Stranger: Unfamiliar, cautious, keeps distance, does not act like old friends.',
    partner: 'Partner: Shared goals and trust, more like allies or comrades.',
    enemy: 'Enemy/Rival: Mutual wariness, tension and friction, but not mindless hostility.',
  },
};

export const RELATIONSHIP_OPTIONS = {
  zh: [
    { value: 'stranger', label: '陌生人' },
    { value: 'friend', label: '朋友' },
    { value: 'partner', label: '伙伴' },
    { value: 'lover', label: '恋人' },
    { value: 'enemy', label: '敌人' },
  ],
  en: [
    { value: 'stranger', label: 'Stranger' },
    { value: 'friend', label: 'Friend' },
    { value: 'partner', label: 'Partner' },
    { value: 'lover', label: 'Lover' },
    { value: 'enemy', label: 'Enemy' },
  ],
};

export function makeDefaultRelationships() {
  return Object.fromEntries(CHARACTER_IDS.map((id) => [id, 'stranger']));
}

export function buildGroupPrompt({ lang, playerName, messages, memory, relationships }) {
  const recent = messages.slice(-12).map((m) => `${displayName(m.speaker, lang, playerName)}: ${m.text}`).join('\n');

  const relGuide = relationships
    ? CHARACTER_IDS.map((id) => {
        const rel = relationships[id] || 'stranger';
        const desc = RELATIONSHIP_TEXT[lang][rel] || RELATIONSHIP_TEXT[lang].stranger;
        return `- ${playerName} ↔ ${CHAR_NAMES[lang][id]}: ${desc}`;
      }).join('\n')
    : '';

  if (lang === 'zh') {
    return `你是现代群聊模拟器。群聊成员：${playerName}, Cloud, Zack, Tifa, Aerith, Barret, Sephiroth。
长期记忆：${memory || '暂无'}
${relGuide ? `\n玩家与各角色的关系（仅用于群聊）：\n${relGuide}\n` : ''}
最近聊天：
${recent || '暂无'}

规则：
- 像微信/Discord 群聊，一条消息 1-2 句。
- 只返回 1-4 行聊天消息，不要 JSON，不要 markdown。
- 格式：Tifa: 在呢，怎么了？
- 不需要每个人都回，选择最自然的角色。`;
  }

  return `You are a modern group chat simulator. Members: ${playerName}, Cloud, Zack, Tifa, Aerith, Barret, Sephiroth.
Memory: ${memory || 'None'}
${relGuide ? `\nPlayer relationships (group chat only):\n${relGuide}\n` : ''}
Recent chat:
${recent || 'None'}

Rules:
- Like a real casual chat. 1-2 sentences each.
- Return 1-4 chat lines only. No JSON, no markdown.
- Format: Tifa: I'm here. What's up?
- Not everyone needs to reply. Choose the natural responders.`;
}
