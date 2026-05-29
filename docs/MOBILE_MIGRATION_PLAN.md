# Mobile Migration Plan

## Phase 1: Runnable mobile MVP

Goal: make the game playable on a phone.

Included in this starter:

- Expo React Native project
- mobile screens:
  - Start
  - Main Story
  - Group Chat
- API client that calls your existing Next.js `/api/chat`
- mock mode to test without API cost

## Phase 2: Feature parity with web demo

Move these from the current single-file web version:

- story review panel
- memory manager
- relationship setup
- richer ending screen
- better character portraits
- saved sessions

## Phase 3: Performance

Main changes:

- streaming responses
- shorter prompts
- separate models for story / chat / memory
- background memory update
- pre-generation for next story scenes

## Phase 4: Accounts and credits

Add:

- Supabase Auth or Firebase Auth
- user sessions
- cloud saves
- usage logs
- credit wallet
- Apple In-App Purchase / Google Play Billing later

Do not put your OpenAI API key inside the mobile app.
The phone app should call your backend. Your backend calls the model provider.
