import AsyncStorage from '@react-native-async-storage/async-storage';
import { Business } from '../types/business';

const BUSINESSES_KEY = '@edkang/businesses';
const FAVORITES_KEY = '@edkang/favorites';
const THEME_KEY = '@edkang/theme';

export async function loadStoredBusinesses(): Promise<Business[]> {
  try {
    const raw = await AsyncStorage.getItem(BUSINESSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Business[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveStoredBusinesses(businesses: Business[]): Promise<void> {
  const userBusinesses = businesses.filter((business) => business.owner === 'me');
  await AsyncStorage.setItem(BUSINESSES_KEY, JSON.stringify(userBusinesses));
}

export async function loadFavoriteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteIds(favoriteIds: string[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
}

export async function loadThemeMode(): Promise<'light' | 'dark' | null> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
    return null;
  } catch {
    return null;
  }
}

export async function saveThemeMode(mode: 'light' | 'dark'): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, mode);
}
