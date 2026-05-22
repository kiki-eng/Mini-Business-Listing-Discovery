import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessCard } from '../components/BusinessCard';
import { EmptyState } from '../components/EmptyState';
import { HomeButton } from '../components/HomeButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SearchBar } from '../components/SearchBar';
import { SkeletonList } from '../components/SkeletonList';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { spacing, typography } from '../theme/spacing';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    businesses,
    favorites,
    searchBusiness,
    favoriteBusiness,
    isLoading,
    isRefreshing,
    refreshBusinesses,
  } = useBusiness();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');

  const favoriteBusinesses = useMemo(
    () => businesses.filter((business) => favorites.includes(business.id)),
    [businesses, favorites],
  );

  const filteredBusinesses = useMemo(
    () => searchBusiness(query, favoriteBusinesses),
    [favoriteBusinesses, query, searchBusiness],
  );

  return (
    <ScreenContainer>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
            <HomeButton />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your saved businesses in one place
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search favorites..."
          />
        </View>

        {isLoading ? (
          <View style={styles.listContent}>
            <SkeletonList count={3} />
          </View>
        ) : (
          <FlatList
            data={filteredBusinesses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refreshBusinesses}
                tintColor={colors.accent}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="bookmark-outline"
                title={query ? 'No results found' : 'No favorites yet'}
                message={
                  query
                    ? 'Try a different search term in your saved businesses.'
                    : 'Bookmark businesses you love to find them quickly later.'
                }
                actionLabel={query ? undefined : 'Browse Listings'}
                onAction={
                  query
                    ? undefined
                    : () => navigation.navigate('MainTabs', { screen: 'AllListings' })
                }
              />
            }
            renderItem={({ item }) => (
              <BusinessCard
                business={{ ...item, isFavorite: true }}
                onPress={() =>
                  navigation.navigate('BusinessDetails', { businessId: item.id })
                }
                onFavoritePress={() => favoriteBusiness(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  searchWrap: {
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
});
