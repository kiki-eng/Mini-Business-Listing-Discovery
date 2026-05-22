import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MOCK_BUSINESSES } from '../data/mockBusinesses';
import {
  loadFavoriteIds,
  loadStoredBusinesses,
  saveFavoriteIds,
  saveStoredBusinesses,
} from '../storage/businessStorage';
import { Business, BusinessFormData } from '../types/business';
import { getCurrentLocationString } from '../utils/location';

type BusinessContextValue = {
  businesses: Business[];
  favorites: string[];
  isLoading: boolean;
  isRefreshing: boolean;
  addBusiness: (data: BusinessFormData) => Promise<Business>;
  editBusiness: (id: string, data: BusinessFormData) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  favoriteBusiness: (id: string) => Promise<void>;
  searchBusiness: (query: string, source?: Business[]) => Business[];
  loadBusinesses: () => Promise<void>;
  refreshBusinesses: () => Promise<void>;
  getBusinessById: (id: string) => Business | undefined;
  isFavorite: (id: string) => boolean;
};

const BusinessContext = createContext<BusinessContextValue | undefined>(
  undefined,
);

function mergeBusinesses(
  userBusinesses: Business[],
  favoriteIds: string[],
): Business[] {
  const combined = [...MOCK_BUSINESSES, ...userBusinesses];
  return combined.map((business) => ({
    ...business,
    isFavorite: favoriteIds.includes(business.id),
  }));
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadBusinesses = useCallback(async () => {
    const [storedBusinesses, favoriteIds] = await Promise.all([
      loadStoredBusinesses(),
      loadFavoriteIds(),
    ]);
    setFavorites(favoriteIds);
    setBusinesses(mergeBusinesses(storedBusinesses, favoriteIds));
  }, []);

  const refreshBusinesses = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadBusinesses();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadBusinesses]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await loadBusinesses();
      if (mounted) {
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [loadBusinesses]);

  const persistUserBusinesses = useCallback(async (nextBusinesses: Business[]) => {
    setBusinesses(nextBusinesses);
    await saveStoredBusinesses(nextBusinesses);
  }, []);

  const addBusiness = useCallback(
    async (data: BusinessFormData) => {
      const location = await getCurrentLocationString();
      const id = `user-${Date.now()}`;
      const newBusiness: Business = {
        id,
        name: data.name.trim(),
        category: data.category,
        description: data.description.trim(),
        location,
        owner: 'me',
        createdAt: new Date().toISOString(),
        isVerified: false,
        views: 0,
        saves: 0,
        isFavorite: favorites.includes(id),
      };

      const nextBusinesses = mergeBusinesses(
        [
          ...businesses.filter((business) => business.owner === 'me'),
          newBusiness,
        ],
        favorites,
      );

      await persistUserBusinesses(nextBusinesses);
      return newBusiness;
    },
    [businesses, favorites, persistUserBusinesses],
  );

  const editBusiness = useCallback(
    async (id: string, data: BusinessFormData) => {
      const nextBusinesses = businesses.map((business) => {
        if (business.id !== id || business.owner !== 'me') {
          return business;
        }

        return {
          ...business,
          name: data.name.trim(),
          category: data.category,
          description: data.description.trim(),
        };
      });

      await persistUserBusinesses(nextBusinesses);
    },
    [businesses, persistUserBusinesses],
  );

  const deleteBusiness = useCallback(
    async (id: string) => {
      const nextBusinesses = businesses.filter((business) => business.id !== id);
      const nextFavorites = favorites.filter((favoriteId) => favoriteId !== id);

      setFavorites(nextFavorites);
      await Promise.all([
        persistUserBusinesses(nextBusinesses),
        saveFavoriteIds(nextFavorites),
      ]);
    },
    [businesses, favorites, persistUserBusinesses],
  );

  const favoriteBusiness = useCallback(
    async (id: string) => {
      const isCurrentlyFavorite = favorites.includes(id);
      const nextFavorites = isCurrentlyFavorite
        ? favorites.filter((favoriteId) => favoriteId !== id)
        : [...favorites, id];

      setFavorites(nextFavorites);
      setBusinesses((current) =>
        current.map((business) =>
          business.id === id
            ? { ...business, isFavorite: !isCurrentlyFavorite }
            : business,
        ),
      );
      await saveFavoriteIds(nextFavorites);
    },
    [favorites],
  );

  const searchBusiness = useCallback((query: string, source?: Business[]) => {
    const normalizedQuery = query.trim().toLowerCase();
    const list = source ?? businesses;

    if (!normalizedQuery) {
      return list;
    }

    return list.filter((business) =>
      business.name.toLowerCase().includes(normalizedQuery),
    );
  }, [businesses]);

  const getBusinessById = useCallback(
    (id: string) => businesses.find((business) => business.id === id),
    [businesses],
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const value = useMemo(
    () => ({
      businesses,
      favorites,
      isLoading,
      isRefreshing,
      addBusiness,
      editBusiness,
      deleteBusiness,
      favoriteBusiness,
      searchBusiness,
      loadBusinesses,
      refreshBusinesses,
      getBusinessById,
      isFavorite,
    }),
    [
      businesses,
      favorites,
      isLoading,
      isRefreshing,
      addBusiness,
      editBusiness,
      deleteBusiness,
      favoriteBusiness,
      searchBusiness,
      loadBusinesses,
      refreshBusinesses,
      getBusinessById,
      isFavorite,
    ],
  );

  return (
    <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within BusinessProvider');
  }
  return context;
}
