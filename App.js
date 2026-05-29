import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import { StartScreen } from './src/screens/StartScreen';
import { StoryScreen } from './src/screens/StoryScreen';
import { StoryReviewScreen } from './src/screens/StoryReviewScreen';
import { GroupSetupScreen } from './src/screens/GroupSetupScreen';
import { GroupChatScreen } from './src/screens/GroupChatScreen';
import { loadText, loadJSON, saveText, saveJSON, STORAGE_KEYS } from './src/lib/storage';
import { makeDefaultRelationships } from './src/lib/prompts';

SplashScreen.preventAutoHideAsync();

// screen: start | story | review | groupSetup | groupChat
export default function App() {
  const [screen, setScreen] = useState('start');
  const [lang, setLang] = useState('zh');
  const [playerName, setPlayerName] = useState(null);

  // Story state (lifted so story ↔ chat navigation preserves progress)
  const [storyScene, setStoryScene] = useState(null);
  const [storyHistory, setStoryHistory] = useState([]);
  const [storyLog, setStoryLog] = useState([]);
  const [endingMeta, setEndingMeta] = useState(null);

  // Review state
  const [reviewLog, setReviewLog] = useState([]);
  const [reviewEnding, setReviewEnding] = useState(null);

  // Group chat state
  const [relationships, setRelationships] = useState(makeDefaultRelationships());
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupMemory, setGroupMemory] = useState('');
  const [groupMemoryItems, setGroupMemoryItems] = useState([]);
  const [hasSavedChat, setHasSavedChat] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const name = await loadText(STORAGE_KEYS.playerName, 'Joy');
        setPlayerName(name);

        const savedRel = await loadJSON(STORAGE_KEYS.groupRelations, null);
        if (savedRel) setRelationships(prev => ({ ...prev, ...savedRel }));

        const savedMsgs = await loadJSON(STORAGE_KEYS.groupMessages, null);
        if (Array.isArray(savedMsgs) && savedMsgs.length > 0) {
          setGroupMessages(savedMsgs);
          setHasSavedChat(true);
        }

        const savedMem = await loadText(STORAGE_KEYS.groupMemory, '');
        if (savedMem) setGroupMemory(savedMem);

        const savedMemItems = await loadJSON('ff7_group_memory_items_v1', []);
        if (Array.isArray(savedMemItems)) setGroupMemoryItems(savedMemItems);
      } catch {}
      SplashScreen.hideAsync();
    }
    init();
  }, []);

  // Persist group data
  useEffect(() => { if (groupMessages.length > 0) saveJSON(STORAGE_KEYS.groupMessages, groupMessages.slice(-100)); }, [groupMessages]);
  useEffect(() => { if (groupMemory) saveText(STORAGE_KEYS.groupMemory, groupMemory); }, [groupMemory]);
  useEffect(() => { saveJSON('ff7_group_memory_items_v1', groupMemoryItems.slice(-40)); }, [groupMemoryItems]);
  useEffect(() => { saveJSON(STORAGE_KEYS.groupRelations, relationships); }, [relationships]);

  async function start(name) {
    await saveText(STORAGE_KEYS.playerName, name);
    setPlayerName(name);
    setStoryScene(null);
    setStoryHistory([]);
    setStoryLog([]);
    setEndingMeta(null);
    setScreen('story');
  }

  function openGroupSetup() {
    setScreen('groupSetup');
  }

  function enterGroupChat() {
    if (groupMessages.length === 0) {
      setGroupMessages([{
        id: `sys-${Date.now()}`,
        speaker: 'system',
        text: lang === 'zh' ? `${playerName} 加入了群聊。先说句话吧。` : `${playerName} joined the group chat.`,
        ts: new Date().toISOString(),
      }]);
    }
    setScreen('groupChat');
  }

  function continueGroupChat() {
    setScreen('groupChat');
  }

  function clearGroupChat() {
    setGroupMessages([{
      id: `sys-${Date.now()}`,
      speaker: 'system',
      text: lang === 'zh' ? `${playerName} 加入了群聊。` : `${playerName} joined the group chat.`,
      ts: new Date().toISOString(),
    }]);
    setGroupMemory('');
    setGroupMemoryItems([]);
    setHasSavedChat(false);
    setScreen('groupChat');
  }

  function viewReview(log, ending) {
    setReviewLog(log);
    setReviewEnding(ending);
    setScreen('review');
  }

  if (playerName === null) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ExpoStatusBar style="light" />
        <View style={styles.bg}>

          {screen === 'start' && (
            <StartScreen lang={lang} setLang={setLang} initialName={playerName} onStart={start} />
          )}

          {screen === 'story' && (
            <StoryScreen
              lang={lang}
              playerName={playerName}
              scene={storyScene}
              setScene={setStoryScene}
              history={storyHistory}
              setHistory={setStoryHistory}
              storyLog={storyLog}
              setStoryLog={setStoryLog}
              endingMeta={endingMeta}
              setEndingMeta={setEndingMeta}
              onOpenChat={openGroupSetup}
              onBackToStart={() => { setStoryScene(null); setStoryHistory([]); setStoryLog([]); setEndingMeta(null); setScreen('start'); }}
              onViewReview={viewReview}
            />
          )}

          {screen === 'review' && (
            <StoryReviewScreen
              lang={lang}
              playerName={playerName}
              storyLog={reviewLog}
              endingMeta={reviewEnding}
              onBack={() => setScreen('story')}
            />
          )}

          {screen === 'groupSetup' && (
            <GroupSetupScreen
              lang={lang}
              playerName={playerName}
              relationships={relationships}
              setRelationships={setRelationships}
              onEnterChat={enterGroupChat}
              onBack={() => setScreen('story')}
              hasSavedChat={hasSavedChat}
              onContinueSaved={continueGroupChat}
              onClearSaved={clearGroupChat}
            />
          )}

          {screen === 'groupChat' && (
            <GroupChatScreen
              lang={lang}
              playerName={playerName}
              messages={groupMessages}
              setMessages={setGroupMessages}
              memory={groupMemory}
              setMemory={setGroupMemory}
              memoryItems={groupMemoryItems}
              setMemoryItems={setGroupMemoryItems}
              relationships={relationships}
              onBack={() => setScreen('story')}
            />
          )}

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#02050b' },
  bg: { flex: 1, backgroundColor: '#02050b' },
});
