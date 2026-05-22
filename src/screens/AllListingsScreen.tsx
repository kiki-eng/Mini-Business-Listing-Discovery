import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessCard } from '../components/BusinessCard';
import { CategoryChip } from '../components/CategoryChip';
import { EmptyState } from '../components/EmptyState';
import { FeaturedBusiness } from '../components/FeaturedBusiness';
import { HomeButton } from '../components/HomeButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SearchBar } from '../components/SearchBar';
import { SkeletonList } from '../components/SkeletonList';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../data/categories';
import { RootStackParamList } from '../navigation/types';
import { Business } from '../types/business';
import { spacing, typography } from '../theme/spacing';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function AllListingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    businesses,
    searchBusiness,
    favoriteBusiness,
    isLoading,
    isRefreshing,
    refreshBusinesses,
  } = useBusiness();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredBusinesses = useMemo(
    () => businesses.filter((business) => business.isFeatured),
    [businesses],
  );

  const filteredBusinesses = useMemo(() => {
    let result = searchBusiness(query, businesses);
    if (selectedCategory) {
      result = result.filter(
        (business) => business.category === selectedCategory,
      );
    }
    return result;
  }, [businesses, query, searchBusiness, selectedCategory]);

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>Discover</Text>
          <HomeButton />
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Explore Canadian small businesses near you
        </Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      {!query && !selectedCategory ? (
        <FeaturedBusiness
          businesses={featuredBusinesses}
          onPressBusiness={(business: Business) =>
            navigation.navigate('BusinessDetails', { businessId: business.id })
          }
          onFavoritePress={(business: Business) => favoriteBusiness(business.id)}
        />
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        <CategoryChip
          category={{
            id: 'all',
            label: 'All',
            emoji: '✨',
            color: colors.accent,
            backgroundColor: colors.accentLight,
          }}
          selected={selectedCategory === null}
          onPress={() => setSelectedCategory(null)}
        />
        {CATEGORIES.map((category) => (
          <CategoryChip
            key={category.id}
            category={category}
            selected={selectedCategory === category.label}
            onPress={() =>
              setSelectedCategory(
                selectedCategory === category.label ? null : category.label,
              )
            }
          />
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {selectedCategory ?? 'All Listings'}
      </Text>
    </View>
  );

  return (
    <ScreenContainer>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        {isLoading ? (
          <View style={styles.loadingWrap}>
            {renderHeader()}
            <SkeletonList count={4} />
          </View>
        ) : (
          <FlatList
            data={filteredBusinesses}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader()}
            keyboardShouldPersistTaps="handled"
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
                icon="search-outline"
                title="No results found"
                message="Try adjusting your search or browse a different category."
              />
            }
            renderItem={({ item }) => (
              <BusinessCard
                business={item}
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
  chipsRow: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.heading,
    fontWeight: '700',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  loadingWrap: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
});
