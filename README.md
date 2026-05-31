# FF7 Chronicle — Mobile

> *"The Lifestream is speaking. Can you hear it?"*
> *— Aerith*

An AI-driven interactive text game set in the Final Fantasy VII universe. You step into Midgar as yourself, make choices that shape the story, and chat in real-time with Cloud, Tifa, Aerith, Zack, Barret, and Sephiroth — all powered by a large language model that knows the lore.

**Two ways to play:**
- 📖 **Main Story** — an AI narrator generates each scene as a branching cinematic, up to 9 acts, with a personalized finale
- 💬 **Group Chat** — a simulated WeChat/Discord group where the characters actually talk back to you, remember your relationship, and stay in character

Available as a **web app** and an **Android APK**.

---

## Screenshots

**Getting started**

<table>
  <tr>
    <td align="center" width="33%">
      <img src="demo%20pictures/choose%20name.jpg" width="195"/><br/>
      <sub><b>Enter your name</b><br/>Pick a language, type your name, and step into Midgar as yourself</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/start%20the%20game.jpg" width="195"/><br/>
      <sub><b>Choose your path</b><br/>Launch the main story or jump straight into the group chat</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/connecting%20to%20lifestream.jpg" width="195"/><br/>
      <sub><b>Connecting to the Lifestream…</b><br/>AI is generating your unique opening scene — every run is different</sub>
    </td>
  </tr>
</table>

**Main Story — Gold Saucer**

<table>
  <tr>
    <td align="center" width="50%">
      <img src="demo%20pictures/main%20story%20plot.jpg" width="240"/><br/>
      <sub><b>Cinematic narration</b><br/>The narrator sets the scene with typewriter text. Character portraits show who's present.</sub>
    </td>
    <td align="center" width="50%">
      <img src="demo%20pictures/main%20story%20choice.jpg" width="240"/><br/>
      <sub><b>Choose your action</b><br/>3 AI-generated options that fit the moment, plus one free-text slot for anything you want to say or do</sub>
    </td>
  </tr>
</table>

**Group Chat — Seventh Heaven**

<table>
  <tr>
    <td align="center" width="33%">
      <img src="demo%20pictures/chat%201.jpg" width="195"/><br/>
      <sub><b>Daily life</b><br/>Each character replies in their own voice — Tifa's wiping the bar, Cloud's watching the sunset, Barret's fixing his arm</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/chat%203.jpg" width="195"/><br/>
      <sub><b>Relationship-aware replies</b><br/>Set Cloud as your lover and watch the whole group react — Cloud: "I'd let you if you were here." Barret: "Damn it, now I gotta hug somebody too."</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/chat%202.jpg" width="195"/><br/>
      <sub><b>They remember you</b><br/>Tell them you just graduated from Cornell — Cloud keeps it brief, Aerith picks flowers, Barret puts drinks on the table</sub>
    </td>
  </tr>
</table>

---

## Features

### 📖 Main Story Mode
- AI generates each scene as structured JSON: location, narration, character dialogue, and 4 action choices
- Up to 9 acts per run; the AI tracks narrative arc (early → mid → late → climax)
- Canon character relationships are enforced — Cloud won't suddenly confess his feelings in Act 1
- Free-text input option on every scene, so you're never locked into the preset choices
- Story Review screen to read back your full playthrough
- Graceful error handling: if a scene fails to load, the game shows a clear message and lets you retry

### 💬 Group Chat Mode
- Simulates a group chat with all 6 characters simultaneously
- You set the relationship type for each character before entering: stranger, friend, partner, lover, or enemy
- The AI picks 1–4 characters to respond naturally per message — not everyone talks at once
- Long-term memory system: the app summarizes key events and uses them in future sessions
- Chat history is saved locally and persists across sessions
- "Continue last chat" or "Clear and restart" from the setup screen
- No action descriptions or asterisk roleplay — dialogue only, like real messaging

### 🌏 Bilingual
- Full Chinese (zh) and English (en) support throughout the UI and AI prompts
- Language toggle on the start screen

### 📱 Android APK
- Standalone installable APK — no Expo Go required for end users
- Built with EAS (Expo Application Services)
- Works in mainland China (AI calls go to DeepSeek's servers directly)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile framework | Expo SDK 54 / React Native 0.81 |
| Build system | EAS Build (cloud APK) |
| AI model | DeepSeek V3 (`deepseek-chat`) |
| AI API | DeepSeek API — `api.deepseek.com` |
| Local storage | AsyncStorage |
| Web preview | Expo Web (`react-native-web`) |
| Backend (web version) | Next.js 16 on Vercel |

---

## Project Structure

```
ff7-chronicle-mobile-starter/
├── App.js                    # Root: state management, screen routing, persistence
├── app.json                  # Expo config, splash screen, bundle IDs
├── eas.json                  # EAS build profiles + baked-in env vars
├── .env                      # Local dev env (not committed)
├── .env.example              # Template
│
├── src/
│   ├── screens/
│   │   ├── StartScreen.js        # Name entry, language toggle
│   │   ├── StoryScreen.js        # Main story engine (AI scene generation)
│   │   ├── StoryReviewScreen.js  # Full playthrough review
│   │   ├── GroupSetupScreen.js   # Relationship config before group chat
│   │   └── GroupChatScreen.js    # Live group chat with all characters
│   │
│   ├── components/
│   │   ├── CharacterAvatar.js    # Portrait / initial avatar per character
│   │   ├── FFButton.js           # Styled button (primary / default variants)
│   │   ├── FFPanel.js            # Card panel with FF7 dark-blue aesthetic
│   │   └── LifestreamLoader.js   # Loading animation ("Connecting to the Lifestream…")
│   │
│   ├── lib/
│   │   ├── api.js          # All AI calls — DeepSeek API, mock fallback
│   │   ├── characters.js   # Character IDs, names (zh/en), colors, initials
│   │   ├── json.js         # safeJsonObject() — robust JSON parser for AI output
│   │   ├── prompts.js      # System prompt builders for story and group chat
│   │   └── storage.js      # AsyncStorage wrappers (loadText, saveJSON, etc.)
│   │
│   ├── assets/
│   │   ├── icon.png
│   │   └── portraits/      # Character portrait JPGs
│   │
│   └── theme/
│       └── theme.js        # Color palette, dark blue FF7 aesthetic
│
└── docs/
    └── MOBILE_MIGRATION_PLAN.md   # Phase 1–4 roadmap
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- An [Expo account](https://expo.dev) (free)
- A [DeepSeek API account](https://platform.deepseek.com) with credits

### 1. Clone and install

```bash
git clone https://github.com/js3888-shunshun/ff7-chronicle-mobile
cd ff7-chronicle-mobile
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_DEEPSEEK_API_KEY=sk-your-deepseek-key-here
EXPO_PUBLIC_USE_MOCK=false
```

> Set `EXPO_PUBLIC_USE_MOCK=true` to run offline with pre-scripted responses — no API cost.

### 3. Run on web (quickest way to test)

```bash
npx expo start --web
```

Opens in your browser at `http://localhost:8081`. Plays the full game including AI calls.

### 4. Run on your phone (Expo Go)

```bash
npx expo start --tunnel
```

Install **Expo Go** on your Android/iOS device, scan the QR code. The `--tunnel` flag means you don't need to be on the same Wi-Fi.

---

## Building the Android APK

The APK is a standalone installer — your users don't need Expo Go.

### 1. Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Configure environment variables for the build

Open `eas.json` and make sure your key is in the `preview` env block:

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "env": {
        "EXPO_PUBLIC_DEEPSEEK_API_KEY": "sk-your-key",
        "EXPO_PUBLIC_USE_MOCK": "false"
      }
    }
  }
}
```

> **Important:** EAS cloud builds do NOT read your local `.env` file. The key must be in `eas.json` or the EAS dashboard — otherwise the APK will silently fall back to mock mode.

### 3. Build

```bash
eas build -p android --profile preview
```

This takes about 10–15 minutes on EAS cloud servers. When done, you get a download link for the `.apk` file.

### 4. Install on Android

Send the `.apk` link to your user. They tap it, allow "Install from unknown sources" in Android settings, and install. Done — no Play Store required.

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_DEEPSEEK_API_KEY` | Your DeepSeek API key (`sk-...`) |
| `EXPO_PUBLIC_USE_MOCK` | `true` = offline mock mode, `false` = live AI |

---

## Characters

| ID | Chinese | English | Color |
|----|---------|---------|-------|
| `cloud` | 克劳德 | Cloud | `#7ec3ff` |
| `zack` | 扎克斯 | Zack | `#ffe482` |
| `tifa` | 蒂法 | Tifa | `#8fdfff` |
| `aerith` | 爱丽丝 | Aerith | `#ffb0de` |
| `barrett` | 巴雷特 | Barret | `#ff9c6d` |
| `sephiroth` | 萨菲罗斯 | Sephiroth | `#c3a0ff` |

---

## The Backend Journey (or: How We Got Here)

Getting this to work reliably — especially for players in mainland China — was not a straight line.

**Phase 1: Vercel + Claude**
The web version (`ff7-chronicle`) runs on Vercel and calls the Anthropic API (Claude Sonnet). This works great from anywhere outside China. For the mobile app, we pointed the APK at the same Vercel endpoint.

**Problem:** Vercel's infrastructure is blocked by the Great Firewall. Players in China got `Network request failed` immediately.

**Phase 2: Cloudflare Workers**
We rewrote the API proxy as a Cloudflare Worker (`ff7-chronicle-api.js3888.workers.dev`). Cloudflare has global edge nodes, so — in theory — better China reach.

**Problem:** `*.workers.dev` subdomains are also frequently blocked in China. Same error.

**Phase 3: DeepSeek API directly from the app**
The key insight: instead of proxying through any foreign server, call a Chinese AI API directly from the mobile app. DeepSeek is a Chinese company (Hangzhou), their API at `api.deepseek.com` is hosted in China and is always accessible from Chinese networks.

We rewrote `api.js` to call DeepSeek's OpenAI-compatible endpoint directly, skipping the backend entirely:

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

**Model quality:** DeepSeek V3 is competitive with Claude Sonnet, especially for Chinese-language tasks. The game prompts in Chinese work at least as well — possibly better.

**The `eas.json` gotcha:** The first APK built this way still showed mock responses. Why? EAS cloud builds don't read your local `.env` file (it's in `.gitignore`). The API key has to be declared in the `env` block of `eas.json`. This cost us one build cycle to figure out.

---

## How the AI Story Engine Works

Each story scene is a single AI call with a structured system prompt. The model is required to return a strict JSON object:

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

The `safeJsonObject()` parser in `src/lib/json.js` handles messy AI output — it strips markdown fences, finds the outermost `{...}`, and can even close truncated JSON by counting open brackets. The story never hard-crashes on a bad API response.

**A key bug we fixed:** Early builds passed the full conversation history (scene narrations + character dialogue) into subsequent API calls. After 2–3 scenes, DeepSeek got confused by the growing `Scene: ...` / `[cloud]: ...` pattern and started returning non-JSON. The fix: the system prompt already contains all context; subsequent calls now send just a simple `"Continue"` user message instead of the full history.

---

## Group Chat Memory System

The group chat stores two levels of memory:

1. **Short-term:** The last 12 messages, formatted as `Character: text` and included in every prompt
2. **Long-term:** After every 10 user messages, a separate AI call summarizes the conversation into per-character memory items (e.g., `cloud: Cloud knows the player is wary of Shinra`). These persist in AsyncStorage and survive app restarts.

The relationship system (stranger / friend / partner / lover / enemy) adjusts how each character responds to you in the prompt — it only affects the group chat, not the main story.

---

## Roadmap

| Phase | Status | What's included |
|-------|--------|----------------|
| Phase 1: MVP | ✅ Done | Main story + group chat, Android APK, DeepSeek API |
| Phase 2: Feature parity | 🔄 Planned | Story review, memory manager UI, richer endings |
| Phase 3: Performance | 🔄 Planned | Streaming responses, pre-generation, shorter prompts |
| Phase 4: Accounts | 🔄 Planned | Cloud saves, usage tracking, in-app credits |

---

## Notes on Security

The DeepSeek API key is embedded in the APK as an `EXPO_PUBLIC_*` variable, which means it's visible to anyone who decompiles the binary. This is an acceptable trade-off for a small personal project shared among friends.

For a public release, the recommended architecture is to keep the API key server-side (e.g., on a Vercel or Cloudflare Worker backend) and have the app call your own endpoint. The original Vercel backend (`ff7-chronicle`) still exists and works for players outside China — it calls Anthropic Claude and the key stays on the server.

---

## License

This is a fan project. Final Fantasy VII is the intellectual property of Square Enix. This project is not affiliated with or endorsed by Square Enix.
