import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  playerName: 'ff7_mobile_player_name_v1',
  storySession: 'ff7_mobile_story_session_v1',
  groupMessages: 'ff7_mobile_group_messages_v1',
  groupMemory: 'ff7_mobile_group_memory_v1',
  groupRelations: 'ff7_group_player_relations_v1',
};

export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function loadText(key, fallback = '') {
  try {
    return (await AsyncStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export async function saveText(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {}
}
