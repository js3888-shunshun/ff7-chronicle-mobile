export const CHARACTER_IDS = ['cloud', 'zack', 'tifa', 'aerith', 'barrett', 'sephiroth'];

export const CHAR_NAMES = {
  zh: {
    player: '玩家',
    cloud: '克劳德',
    zack: '扎克斯',
    tifa: '蒂法',
    aerith: '爱丽丝',
    barrett: '巴雷特',
    sephiroth: '萨菲罗斯',
    narrator: '旁白',
    system: '系统',
  },
  en: {
    player: 'Player',
    cloud: 'Cloud',
    zack: 'Zack',
    tifa: 'Tifa',
    aerith: 'Aerith',
    barrett: 'Barret',
    sephiroth: 'Sephiroth',
    narrator: 'Narrator',
    system: 'System',
  },
};

export const CHAR_COLORS = {
  player: '#8ff3d1',
  cloud: '#7ec3ff',
  zack: '#ffe482',
  tifa: '#8fdfff',
  aerith: '#ffb0de',
  barrett: '#ff9c6d',
  sephiroth: '#c3a0ff',
};

export const CHAR_INITIALS = {
  player: 'YOU',
  cloud: 'CLD',
  zack: 'ZAK',
  tifa: 'TIF',
  aerith: 'AER',
  barrett: 'BAR',
  sephiroth: 'SEP',
};

export function displayName(id, lang = 'zh', playerName = '') {
  if (id === 'player') return playerName || (lang === 'zh' ? '你' : 'You');
  return CHAR_NAMES[lang]?.[id] || id;
}
