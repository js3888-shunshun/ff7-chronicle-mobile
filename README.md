# FF7 Chronicle Mobile Starter

This is the first mobile migration step for your Next.js FF7 text game.

It is **not the final production app yet**. It is a runnable Expo React Native starter that:

- runs on iOS / Android through Expo
- keeps the same core product idea: main story + group chat
- calls your existing Next.js `/api/chat`
- has a mock mode so you can test UI without spending API money
- splits code into a mobile-friendly folder structure

## Folder structure

```txt
ff7-chronicle-mobile-starter/
  App.js
  app.json
  eas.json
  package.json
  .env.example
  src/
    components/
      CharacterAvatar.js
      FFButton.js
      FFPanel.js
    screens/
      StartScreen.js
      StoryScreen.js
      GroupChatScreen.js
    lib/
      api.js
      characters.js
      json.js
      prompts.js
      storage.js
    theme/
      theme.js
  docs/
    MOBILE_MIGRATION_PLAN.md
```

## 1. Install dependencies

```bash
cd ff7-chronicle-mobile-starter
npm install
```

## 2. Create your env file

Copy:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_COMPUTER_IP:3000
EXPO_PUBLIC_USE_MOCK=false
```

Important: your phone cannot call `localhost:3000` on your computer.

Use the Network URL shown by Next.js, for example:

```txt
Network: http://100.110.142.100:3000
```

So your env should be:

```env
EXPO_PUBLIC_API_BASE_URL=http://100.110.142.100:3000
```

## 3. Keep your Next backend running

In your existing web project:

```bash
npm run dev
```

Make sure `/api/chat` works there first.

## 4. Run the mobile app

```bash
npm start
```

Then scan the QR code with Expo Go.

## 5. Test without API cost

Set:

```env
EXPO_PUBLIC_USE_MOCK=true
```

Then restart Expo:

```bash
Ctrl + C
npm start
```

This uses local mock story and group chat replies.

## Current limitations

This first mobile starter intentionally keeps things simple:

- story review is not migrated yet
- memory manager panel is not fully migrated yet
- billing / user accounts are not included yet
- portrait images are represented with initials for now
- production-grade streaming is not included yet

Those are next migration phases, not day-one requirements. One dragon at a time, apparently.
