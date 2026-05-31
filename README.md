# FF7 Chronicle Mobile

> *"The Lifestream is speaking. Can you hear it?"*
> *Aerith*

A text-based interactive game set in the Final Fantasy VII universe. You play as yourself, step into Midgar, and make choices that shape the story, while Cloud, Tifa, Aerith, Zack, Barret, and Sephiroth react to everything you do.

There are two modes. The main story runs up to 9 acts, with an AI narrator writing each scene from scratch and a personalized finale at the end. The group chat puts you in a simulated messaging group with all six characters, who reply in their own voices, remember what you've talked about, and respond differently depending on your relationship with each of them.

Runs as a web app and as a standalone Android APK.

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
      <sub><b>Choose your path</b><br/>Start the main story or go straight to the group chat</sub>
    </td>
    <td align="center" width="33%">
      <img src="demo%20pictures/connecting%20to%20lifestream.jpg" width="195"/><br/>
      <sub><b>Connecting to the Lifestream</b><br/>The opening scene is being written. Every run starts differently.</sub>
    </td>
  </tr>
</table>

**Main Story: Gold Saucer**

<table>
  <tr>
    <td align="center" width="50%">
      <img src="demo%20pictures/main%20story%20plot.jpg" width="240"/><br/>
      <sub><b>Narration</b><br/>Each scene opens with a typewriter narration. Character portraits show who's in the room.</sub>
    </td>
    <td align="center" width="50%">
      <img src="demo%20pictures/main%20story%20choice.jpg" width="240"/><br/>
      <sub><b>Choose your action</b><br/>Three options written for the moment, plus a free-text slot if you want to say or do something else</sub>
    </td>
  </tr>
</table>

**Story Finale & Review**

<table>
  <tr>
    <td align="center" width="25%">
      <img src="demo%20pictures/main%20story%20ending.png" width="160"/><br/>
      <sub><b>Finale</b><br/>A closing passage written around the choices you made throughout the run</sub>
    </td>
    <td align="center" width="25%">
      <img src="demo%20pictures/ending%20choices.jpg" width="160"/><br/>
      <sub><b>Choices log</b><br/>Every decision you made, in order</sub>
    </td>
    <td align="center" width="25%">
      <img src="demo%20pictures/ending%20novel.png" width="160"/><br/>
      <sub><b>Novel view</b><br/>The full scene-by-scene transcript: narration, dialogue, and what you did</sub>
    </td>
    <td align="center" width="25%">
      <img src="demo%20pictures/ending%20dimensions.png" width="160"/><br/>
      <sub><b>Character dimensions</b><br/>A personality read based on your choices: MBTI tendency, alignment, decision style, risk tolerance</sub>
    </td>
  </tr>
</table>

**Group Chat: Seventh Heaven**

<table>
  <tr>
    <td align="center" width="25%">
      <img src="demo%20pictures/chat%201.jpg" width="160"/><br/>
      <sub><b>Daily life</b><br/>Each character has their own thing going on. Tifa just closed the bar, Cloud is watching the sunset, Barret is fixing his arm.</sub>
    </td>
    <td align="center" width="25%">
      <img src="demo%20pictures/chat%203.jpg" width="160"/><br/>
      <sub><b>Relationship matters</b><br/>Set Cloud as your lover and the whole group picks up on it. Cloud: "I'd let you if you were here." Barret: "Damn it, now I gotta hug somebody too."</sub>
    </td>
    <td align="center" width="25%">
      <img src="demo%20pictures/chat%202.jpg" width="160"/><br/>
      <sub><b>They remember you</b><br/>Tell them you just graduated from Cornell. Cloud keeps it short, Aerith wants to bring flowers, Barret puts drinks on the table.</sub>
    </td>
    <td align="center" width="25%">
      <img src="demo%20pictures/memory%20system.jpg" width="160"/><br/>
      <sub><b>Memory panel</b><br/>Tap the brain icon to see what the AI is keeping track of, add something manually, or clear it</sub>
    </td>
  </tr>
</table>

---

## Features

### Main Story

Each scene is generated fresh every run. The AI writes narration, picks which characters are present, gives one of them a line, and offers you four options: three written for the moment and one open slot where you can type anything. Your choices are remembered across scenes and shape the finale.

The story runs up to 9 acts. The AI tracks where you are in the arc and adjusts the tone accordingly. Early scenes set things up, later ones raise the stakes. Canon relationships are respected throughout; Cloud doesn't suddenly confess his feelings in act one.

After the finale, the Story Review screen shows a full log of your playthrough broken into three views: a transcript, a numbered list of every choice you made, and a personality read on your character based on how you played.

### Group Chat

Before entering the chat, you set a relationship type for each character: stranger, friend, partner, lover, or enemy. That setting stays in the prompt and affects how each character talks to you for the whole session.

Not everyone responds to every message. The AI picks whoever would naturally reply and writes 1–4 responses. The chat history is saved locally, so you can come back to the same conversation later. There's also a long-term memory system: every 10 messages or so, the app summarizes what's been discussed and stores it per character. The brain icon in the top corner opens the memory panel, where you can see what's been saved, add something manually, or clear it.

Responses are dialogue only. No asterisk actions, no parenthetical stage directions.

### Bilingual

The UI and AI prompts support both Chinese and English. Language can be toggled on the start screen.

### Android APK

Builds as a standalone APK via EAS. No Expo Go needed on the user's end. Works in mainland China since the AI calls go directly to DeepSeek's servers.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile framework | Expo SDK 54 / React Native 0.81 |
| Build system | EAS Build (cloud APK) |
| AI model | DeepSeek V3 (`deepseek-chat`) |
| AI API | DeepSeek API (`api.deepseek.com`) |
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
│   │   └── LifestreamLoader.js   # Loading animation
│   │
│   ├── lib/
│   │   ├── api.js          # All AI calls: DeepSeek API, mock fallback
│   │   ├── characters.js   # Character IDs, names (zh/en), colors, initials
│   │   ├── json.js         # safeJsonObject(): JSON parser for AI output
│   │   ├── prompts.js      # System prompt builders for story and group chat
│   │   └── storage.js      # AsyncStorage wrappers
│   │
│   ├── assets/
│   │   ├── icon.png
│   │   └── portraits/      # Character portrait JPGs
│   │
│   └── theme/
│       └── theme.js        # Color palette, FF7 dark-blue aesthetic
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

Setting `EXPO_PUBLIC_USE_MOCK=true` runs the app with pre-scripted responses, no API calls needed.

### 3. Run on web

```bash
npx expo start --web
```

Opens at `http://localhost:8081`. Good for quickly testing changes without a device.

### 4. Run on your phone

```bash
npx expo start --tunnel
```

Install **Expo Go** on your phone and scan the QR code. The `--tunnel` flag works across different networks, so your phone doesn't need to be on the same Wi-Fi as your computer.

---

## Building the Android APK

### 1. Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Add your key to eas.json

EAS cloud builds don't read your local `.env` file, so the API key needs to live in `eas.json` directly:

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

If you skip this step, the APK will build fine but silently fall back to mock mode.

### 3. Build

```bash
eas build -p android --profile preview
```

Takes about 10–15 minutes. You'll get a download link for the `.apk` when it's done.

### 4. Install on Android

Send the link to whoever needs it. They download the file, allow installs from unknown sources in their Android settings, and tap to install. No Play Store involved.

---

## Environment Variables

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

## The Backend Journey

Getting this working for players in mainland China took a few tries.

The web version runs on Vercel and calls Anthropic's Claude API. That works fine outside China. For the mobile app, we initially pointed the APK at the same Vercel endpoint, but Vercel is blocked by the Great Firewall, so Chinese users got an immediate connection error.

We moved the API proxy to a Cloudflare Worker, thinking Cloudflare's global edge network would help. It didn't. The `*.workers.dev` subdomain is also commonly blocked.

The fix that actually worked: skip the proxy entirely and call DeepSeek's API directly from the app. DeepSeek is based in Hangzhou, their API runs on Chinese infrastructure, and it's always reachable from Chinese networks. We rewrote `api.js` to hit their OpenAI-compatible endpoint:

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

DeepSeek V3 handles the Chinese game prompts well, on par with Claude Sonnet.

One thing that caught us: the first APK built this way still showed mock responses. The issue was that EAS cloud builds don't upload your local `.env` file (it's in `.gitignore`), so the API key never made it into the bundle. It has to be declared in the `env` block of `eas.json`.

---

## How the Story Engine Works

Each scene is one API call. The prompt asks the model to return a JSON object with a fixed schema: location, narration, speaker, dialogue, the characters present, and four options.

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

The `safeJsonObject()` function in `src/lib/json.js` handles cases where the model adds markdown fences or returns slightly malformed JSON. It strips the fences, finds the outermost braces, and can close truncated objects by counting open brackets. If parsing fails entirely, the screen shows an error and lets you retry the same choice.

One bug we hit: early builds passed the full conversation history into each continuation call. After 2–3 scenes, the model got confused by the accumulating `Scene: ...` / `[cloud]: ...` format and started returning plain text instead of JSON. The fix was simple: the system prompt already has all the context it needs, so continuation calls now just send a bare `"Continue"` message rather than the whole history.

---

## Group Chat Memory

The chat keeps two kinds of memory. Short-term is just the last 12 messages, formatted and included in every prompt. Long-term kicks in every 10 messages: a separate call summarizes what's been said into per-character notes, which get stored in AsyncStorage and loaded back the next time you open the chat.

The memory panel (brain icon, top right) shows all current entries grouped by character. You can add a note manually, delete individual entries, or clear everything.

---

## Roadmap

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: MVP | Done | Main story, group chat, Android APK, DeepSeek API |
| Phase 2: Feature parity | Planned | Memory manager UI, richer ending screens |
| Phase 3: Performance | Planned | Streaming responses, pre-generation |
| Phase 4: Accounts | Planned | Cloud saves, usage tracking, in-app credits |

---

## Security Note

The DeepSeek API key is baked into the APK as an `EXPO_PUBLIC_*` variable, which means it's technically extractable from the binary. For a small app shared with a few friends, that's a fine trade-off. For anything public, the key should stay on a server and the app should call your own endpoint instead. The original Vercel backend still runs and handles the web version that way.

---

## License

Fan project. Final Fantasy VII belongs to Square Enix. Not affiliated with or endorsed by Square Enix.
