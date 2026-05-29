const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export async function callChatAPI(systemPrompt, messages) {
  if (USE_MOCK || !API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 700));
    return mockModelResponse(systemPrompt, messages);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, messages }),
      signal: controller.signal,
    });

    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
    return data.content || '';
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('连接超时，请检查网络或后端是否在运行');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

const MOCK_SCENES = [
  {
    location: '第七天堂外的雨夜',
    narration: 'Cloud 沉默地擦着剑，霓虹灯的光在雨水中晕开。Tifa 把一份烧焦的 Shinra 文件推到你面前，没有说话。远处的魔晄灯忽明忽暗。',
    speaker: 'tifa',
    dialogue: '如果我们现在不决定，Shinra 会替我们决定。',
    present: ['player', 'cloud', 'tifa'],
  },
  {
    location: '迷宫铁路废弃站台',
    narration: '破旧的路灯勉强维持着昏黄的光。Cloud 靠在柱子上，目光扫过月台的每个角落。你察觉到他在刻意回避某件事。',
    speaker: 'cloud',
    dialogue: '这里不安全。我们不能在这里待太久。',
    present: ['player', 'cloud', 'aerith'],
  },
  {
    location: '第五区教堂花圃',
    narration: 'Aerith 蹲在花圃前，轻轻触碰着花瓣。她抬起头看向你，神情里有一丝你说不清的东西——像是预感，又像是宽慰。',
    speaker: 'aerith',
    dialogue: '生命之流在说话。你听得到吗？只有一点点，但已经够了。',
    present: ['player', 'aerith', 'zack'],
  },
];

function mockModelResponse(systemPrompt, messages) {
  if (systemPrompt.includes('群聊') || systemPrompt.includes('group chat')) {
    const replies = [
      'Tifa: 我在。刚才那句我听到了。\nCloud: 先别急，讲重点。\nAerith: 嗯，我也想知道你下一步想怎么做。',
      'Cloud: 说。\nTifa: 有什么事直说，我们都听着。\nZack: 放松点，大家都在这儿。',
      'Aerith: 生命之流有时候会给我一些感觉……你说的这件事，也许比你想的更重要。\nTifa: 爱丽丝，你是认真的？',
      'Barret: 废话少说，要干就干！\nCloud: 冷静。先想清楚再动。\nTifa: 两个人都有道理。',
    ];
    const idx = (messages[0]?.content?.length || 0) % replies.length;
    return replies[idx];
  }

  const sceneIdx = Math.floor(Math.random() * MOCK_SCENES.length);
  const base = MOCK_SCENES[sceneIdx];
  return JSON.stringify({
    ...base,
    options: [
      { text: '直接说出你观察到的异常', target: 'joy_action' },
      { text: '先确认同伴的状态', target: 'joy_action' },
      { text: '保持沉默，继续观察', target: 'joy_action' },
      { text: '直接说出自己的想法或行动', target: 'free' },
    ],
    readyForFinale: false,
    finaleChoiceText: '',
  });
}
