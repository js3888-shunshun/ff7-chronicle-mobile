# FF7 Chronicle — 手机版

> *"生命之流在说话。你听得到吗？"*
> *— 爱丽丝*

一款以《最终幻想 VII》为背景的 AI 驱动互动文字游戏。你以自己的身份踏入米德加，做出影响故事走向的选择，与克劳德、蒂法、爱丽丝、扎克斯、巴雷特、萨菲罗斯实时对话——一切都由真正懂 FF7 世界观的大语言模型驱动。

**两种玩法：**
- 📖 **主线剧情** — AI 叙事引擎为每一幕生成独一无二的场景，最多 9 幕，以专属结局收尾
- 💬 **群聊模式** — 模拟微信 / Discord 风格的群聊，角色会主动回复你、记住你们的关系、始终保持角色性格

支持 **网页版** 和 **安卓 APK** 两种运行方式。

---

## 截图展示

**开始游戏**

<table>
  <tr>
    <td align="center" width="33%">
      <img src="demo%20pictures/choose%20name.jpg" width="195"/><br/>
      <sub><b>输入你的名字</b><br/>选择语言，输入名字，以自己的身份踏入米德加</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/start%20the%20game.jpg" width="195"/><br/>
      <sub><b>选择你的路</b><br/>开启主线剧情，或直接进入群聊</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/connecting%20to%20lifestream.jpg" width="195"/><br/>
      <sub><b>连接生命之流……</b><br/>AI 正在生成你的专属开场——每局都不一样</sub>
    </td>
  </tr>
</table>

**主线剧情 — 黄金碟游乐场**

<table>
  <tr>
    <td align="center" width="50%">
      <img src="demo%20pictures/main%20story%20plot.jpg" width="240"/><br/>
      <sub><b>电影感旁白</b><br/>打字机效果逐字呈现旁白，角色立绘显示当前在场的人物</sub>
    </td>
    <td align="center" width="50%">
      <img src="demo%20pictures/main%20story%20choice.jpg" width="240"/><br/>
      <sub><b>选择你的行动</b><br/>3 个 AI 生成的情境选项 + 1 个自由输入格，想说什么都可以</sub>
    </td>
  </tr>
</table>

**群聊模式 — 第七天堂**

<table>
  <tr>
    <td align="center" width="33%">
      <img src="demo%20pictures/chat%201.jpg" width="195"/><br/>
      <sub><b>日常闲聊</b><br/>每个角色用自己的口吻回应——蒂法刚收摊，克劳德在看夕阳，巴雷特在修义肢</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/chat%203.jpg" width="195"/><br/>
      <sub><b>关系影响回复</b><br/>把克劳德设成恋人，全群都有反应——克劳德："如果你在这里我会让你的。" 巴雷特："行吧，把我也算进去。"</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/chat%202.jpg" width="195"/><br/>
      <sub><b>他们记得你</b><br/>说你刚从康奈尔毕业——克劳德言简意赅，爱丽丝要摘最漂亮的花，巴雷特请你喝酒</sub>
    </td>
  </tr>
</table>

---

## 功能介绍

### 📖 主线剧情模式
- AI 将每一幕生成为结构化 JSON：地点、旁白、角色台词、4 个行动选项
- 每局最多 9 幕，AI 自动跟踪叙事弧线（早期 → 中期 → 后期 → 高潮）
- 严格遵守原作角色关系——克劳德不会在第一幕就突然表白
- 每幕都有自由输入选项，永远不会被预设选项锁死
- 故事回顾界面，可以重读完整的游戏记录
- 完善的错误处理：场景加载失败时显示提示，可直接点击重试

### 💬 群聊模式
- 同时模拟 6 位角色的群聊
- 进入前可为每位角色设定关系类型：陌生人、朋友、伙伴、恋人或敌人
- AI 根据语境选择 1–4 名最适合回应的角色，不会所有人同时开口
- 长期记忆系统：每 10 条消息后自动总结关键事件，下次进入时仍然记得
- 聊天记录保存在本地，重启 APP 后可继续上次
- 支持"继续上次聊天"或"清空重来"
- 严格禁止括号动作描写和星号旁白，只输出对话文字，像真正的聊天软件

### 🌏 中英双语
- UI 界面和 AI 提示词全面支持中文和英文
- 首页一键切换语言

### 📱 安卓 APK
- 独立安装包，用户无需安装 Expo Go
- 通过 EAS（Expo Application Services）云端构建
- 国内可直接使用（AI 请求直连 DeepSeek 国内服务器）

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 移动端框架 | Expo SDK 54 / React Native 0.81 |
| 构建系统 | EAS Build（云端打包 APK）|
| AI 模型 | DeepSeek V3（`deepseek-chat`）|
| AI 接口 | DeepSeek API — `api.deepseek.com` |
| 本地存储 | AsyncStorage |
| 网页预览 | Expo Web（`react-native-web`）|
| 后端（网页版）| Next.js 16 部署在 Vercel |

---

## 项目结构

```
ff7-chronicle-mobile-starter/
├── App.js                    # 根组件：状态管理、页面路由、数据持久化
├── app.json                  # Expo 配置、启动图、Bundle ID
├── eas.json                  # EAS 构建配置 + 环境变量（含 API Key）
├── .env                      # 本地开发环境变量（不提交 Git）
├── .env.example              # 环境变量模板
│
├── src/
│   ├── screens/
│   │   ├── StartScreen.js        # 输入名字、切换语言
│   │   ├── StoryScreen.js        # 主线剧情引擎（AI 场景生成）
│   │   ├── StoryReviewScreen.js  # 完整游戏记录回顾
│   │   ├── GroupSetupScreen.js   # 进入群聊前的关系设定
│   │   └── GroupChatScreen.js    # 实时群聊界面
│   │
│   ├── components/
│   │   ├── CharacterAvatar.js    # 角色立绘 / 文字头像
│   │   ├── FFButton.js           # 样式按钮（主要 / 默认两种变体）
│   │   ├── FFPanel.js            # FF7 深蓝风格卡片面板
│   │   └── LifestreamLoader.js   # 加载动画（"连接生命之流……"）
│   │
│   ├── lib/
│   │   ├── api.js          # 所有 AI 调用——DeepSeek API + Mock 回退
│   │   ├── characters.js   # 角色 ID、中英文名、颜色、缩写
│   │   ├── json.js         # safeJsonObject()——鲁棒的 AI 输出 JSON 解析器
│   │   ├── prompts.js      # 主线和群聊的系统提示词构建函数
│   │   └── storage.js      # AsyncStorage 封装（loadText、saveJSON 等）
│   │
│   ├── assets/
│   │   ├── icon.png
│   │   └── portraits/      # 角色立绘 JPG
│   │
│   └── theme/
│       └── theme.js        # 配色方案，FF7 深蓝暗色风格
│
└── docs/
    └── MOBILE_MIGRATION_PLAN.md   # 第 1–4 阶段开发路线图
```

---

## 快速开始

### 前置条件
- Node.js 18+
- [Expo 账号](https://expo.dev)（免费）
- [DeepSeek 开发者账号](https://platform.deepseek.com)（需充值，费用极低）

### 1. 克隆并安装依赖

```bash
git clone https://github.com/js3888-shunshun/ff7-chronicle-mobile
cd ff7-chronicle-mobile
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```env
EXPO_PUBLIC_DEEPSEEK_API_KEY=sk-你的-deepseek-key
EXPO_PUBLIC_USE_MOCK=false
```

> 将 `EXPO_PUBLIC_USE_MOCK` 设为 `true` 可离线运行，使用预设的 Mock 回复，不消耗任何 API 费用。

### 3. 在浏览器里运行（最快的测试方式）

```bash
npx expo start --web
```

浏览器打开 `http://localhost:8081`，包含完整的 AI 对话功能。

### 4. 在手机上运行（Expo Go）

```bash
npx expo start --tunnel
```

手机安装 **Expo Go**（安卓 / iOS 均可），扫描二维码即可运行。`--tunnel` 模式无需与电脑在同一 Wi-Fi 下。

---

## 打包安卓 APK

APK 是独立安装包，用户无需安装 Expo Go。

### 1. 安装 EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. 在 eas.json 里配置环境变量

打开 `eas.json`，确认 `preview` 配置里有你的 Key：

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "env": {
        "EXPO_PUBLIC_DEEPSEEK_API_KEY": "sk-你的-key",
        "EXPO_PUBLIC_USE_MOCK": "false"
      }
    }
  }
}
```

> **重要：** EAS 云端构建不会读取本地的 `.env` 文件（它在 `.gitignore` 里）。Key 必须写在 `eas.json` 或 EAS 控制台里——否则 APK 会静默回退到 Mock 模式，看起来能用但全是假数据。这是我们踩过的坑。

### 3. 开始构建

```bash
eas build -p android --profile preview
```

EAS 云端服务器构建大约需要 10–15 分钟，完成后给你一个 `.apk` 下载链接。

### 4. 安装到安卓手机

把 `.apk` 链接发给用户，点击下载，在安卓设置里允许"安装未知来源应用"，安装完成——无需上架 Play Store。

---

## 环境变量说明

| 变量名 | 说明 |
|--------|------|
| `EXPO_PUBLIC_DEEPSEEK_API_KEY` | 你的 DeepSeek API Key（`sk-...`）|
| `EXPO_PUBLIC_USE_MOCK` | `true` = 离线 Mock 模式，`false` = 真实 AI |

---

## 角色一览

| ID | 中文名 | 英文名 | 专属颜色 |
|----|--------|--------|----------|
| `cloud` | 克劳德 | Cloud | `#7ec3ff` |
| `zack` | 扎克斯 | Zack | `#ffe482` |
| `tifa` | 蒂法 | Tifa | `#8fdfff` |
| `aerith` | 爱丽丝 | Aerith | `#ffb0de` |
| `barrett` | 巴雷特 | Barret | `#ff9c6d` |
| `sephiroth` | 萨菲罗斯 | Sephiroth | `#c3a0ff` |

---

## 后端选型历程（我们踩过的每一个坑）

要让国内玩家能正常使用，我们走了不少弯路。

**第一阶段：Vercel + Claude**
网页版（`ff7-chronicle`）部署在 Vercel，调用 Anthropic 的 Claude Sonnet。国外访问完全正常，手机 APP 最初也指向这个接口。

**问题：** Vercel 的服务器被防火长城封锁，国内玩家直接收到 `Network request failed`。

**第二阶段：Cloudflare Workers**
把 API 代理重写为 Cloudflare Worker（`ff7-chronicle-api.js3888.workers.dev`），理论上 Cloudflare 全球节点对国内更友好。

**问题：** `*.workers.dev` 子域名同样频繁被封。同样的报错。

**第三阶段：直接调用 DeepSeek API**
核心思路：不走任何境外服务器，直接在手机 APP 里调用国内 AI 接口。DeepSeek 是中国公司（杭州），`api.deepseek.com` 托管在国内，国内网络永远可达。

把 `api.js` 改写为直接调用 DeepSeek 的 OpenAI 兼容接口，完全跳过后端：

```js
fetch('https://api.deepseek.com/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: 2000
  })
})
```

**模型质量：** DeepSeek V3 与 Claude Sonnet 旗鼓相当，中文任务上甚至更有优势，游戏体验没有明显差异。

**`eas.json` 的坑：** 用这套方案构建的第一个 APK 还是显示假数据。原因是 EAS 云端构建不会上传本地 `.env` 文件（它在 `.gitignore` 里），所以 API Key 根本没有被烤进 APK，APP 默默回退到了 Mock 模式。Key 必须写在 `eas.json` 的 `env` 块里才能生效——这一个坑让我们多打了一次包。

---

## AI 剧情引擎原理

每一幕是一次 AI 调用，系统提示词要求模型返回严格的 JSON 对象：

```json
{
  "location": "第七天堂酒吧",
  "narration": "Cloud 沉默地擦着剑，霓虹灯的光在雨水中晕开。",
  "speaker": "tifa",
  "dialogue": "如果我们现在不决定，Shinra 会替我们决定。",
  "present": ["player", "cloud", "tifa"],
  "options": [
    { "text": "逼问Cloud的真相", "target": "joy_action" },
    { "text": "转向安慰Tifa", "target": "joy_action" },
    { "text": "指出酒吧里的电子设备异常", "target": "joy_action" },
    { "text": "直接说出自己的想法或行动", "target": "free" }
  ],
  "readyForFinale": false,
  "finaleChoiceText": ""
}
```

`src/lib/json.js` 里的 `safeJsonObject()` 负责解析 AI 的输出——它会剥除 Markdown 代码块，找到最外层的 `{...}`，甚至能通过数括号的方式补全被截断的 JSON。场景加载从不会直接崩溃。

**我们修过的关键 Bug：** 早期版本把完整的对话历史（`Scene: 旁白...` / `[cloud]: 台词...`）传给后续 API 调用。走到第 2–3 幕时，DeepSeek 被这些奇怪格式的历史记录搞混，开始输出非 JSON 内容。修复方案：系统提示词里已经包含了所有上下文，后续调用只需要发送简单的 `"继续"` 用户消息，不需要传历史。

---

## 群聊记忆系统

群聊维护两个层级的记忆：

1. **短期记忆：** 最近 12 条消息，格式化为 `角色名: 内容` 后拼入每次的提示词
2. **长期记忆：** 每发送 10 条消息后，单独发起一次 AI 调用，将对话总结为按角色分类的记忆条目（例：`cloud: 克劳德知道玩家对 Shinra 有戒心`）。这些条目保存在 AsyncStorage 里，重启 APP 后依然有效。

关系系统（陌生人 / 朋友 / 伙伴 / 恋人 / 敌人）会调整每个角色在提示词里对你的回应方式——只影响群聊，不影响主线剧情。

---

## 开发路线图

| 阶段 | 状态 | 内容 |
|------|------|------|
| 第一阶段：MVP | ✅ 已完成 | 主线剧情 + 群聊、安卓 APK、DeepSeek API 直连 |
| 第二阶段：功能对齐 | 🔄 计划中 | 故事回顾、记忆管理界面、更丰富的结局画面 |
| 第三阶段：性能优化 | 🔄 计划中 | 流式响应、预生成下一幕、更短的提示词 |
| 第四阶段：账号体系 | 🔄 计划中 | 云端存档、用量统计、应用内购买 |

---

## 安全说明

DeepSeek API Key 以 `EXPO_PUBLIC_*` 变量的形式烤入 APK，理论上可以通过反编译获取。对于朋友间分享的小型个人项目，这个风险是可接受的权衡。

如果要公开发布，建议将 Key 保留在服务端（Vercel 或 Cloudflare Worker），手机 APP 只调用你自己的接口。原来的 Vercel 后端（`ff7-chronicle`）仍在运行，供国外用户通过网页版使用——Key 在服务器上，不会暴露。

---

## 版权声明

本项目为同人作品。《最终幻想 VII》的知识产权归 Square Enix 所有，本项目与 Square Enix 无任何关联，亦未获其授权。
