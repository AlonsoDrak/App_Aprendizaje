import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgressData, TopicStatus, NotebookEntry } from '../types/curriculum';

const STORAGE_KEY = '@app_aprendizaje:progress_v1';

const INITIAL_PROGRESS: UserProgressData = {
  topics: {},
  notebook: {},
  totalFocusedMinutes: 0,
};

export async function loadUserProgress(): Promise<UserProgressData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    return { ...INITIAL_PROGRESS, ...JSON.parse(raw) };
  } catch (error) {
    console.error('Error loading user progress:', error);
    return INITIAL_PROGRESS;
  }
}

export async function saveUserProgress(data: UserProgressData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

export async function setTopicStatus(
  topicId: string, 
  status: TopicStatus, 
  additionalMinutes: number = 0
): Promise<UserProgressData> {
  const current = await loadUserProgress();
  const existing = current.topics[topicId] || {
    status: 'LOCKED',
    minutesSpent: 0,
  };

  const now = new Date().toISOString();
  current.topics[topicId] = {
    ...existing,
    status,
    minutesSpent: existing.minutesSpent + additionalMinutes,
    lastStudiedAt: now,
    validatedAt: status === 'VALIDATED' ? (existing.validatedAt || now) : existing.validatedAt,
    startedAt: existing.startedAt || now,
  };

  current.totalFocusedMinutes += additionalMinutes;
  await saveUserProgress(current);
  return current;
}

export async function saveNotebookEntry(entry: NotebookEntry): Promise<UserProgressData> {
  const current = await loadUserProgress();
  current.notebook[entry.topicId] = entry;
  await saveUserProgress(current);
  return current;
}

export async function resetAllProgress(): Promise<UserProgressData> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return INITIAL_PROGRESS;
}
