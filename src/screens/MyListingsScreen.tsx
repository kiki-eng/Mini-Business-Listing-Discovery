import { Ionicons } from '@expo/vector-icons';
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
import { ConfirmModal } from '../components/ConfirmModal';
import { HomeButton } from '../components/HomeButton';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SearchBar } from '../components/SearchBar';
import { SkeletonList } from '../components/SkeletonList';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { Business } from '../types/business';
import { spacing, typography } from '../theme/spacing';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function MyListingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    businesses,
    searchBusiness,
    deleteBusiness,
    favoriteBusiness,
    isLoading,
    isRefreshing,
    refreshBusinesses,
  } = useBusiness();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);

  const myBusinesses = useMemo(
    () => businesses.filter((business) => business.owner === 'me'),
    [businesses],
  );

  const filteredBusinesses = useMemo(
    () => searchBusiness(query, myBusinesses),
    [myBusinesses, query, searchBusiness],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBusiness(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <ScreenContainer>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>My Listings</Text>
            <HomeButton />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manage the businesses you have added
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search your listings..."
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
                icon="storefront-outline"
                title={query ? 'No results found' : 'No listings yet'}
                message={
                  query
                    ? 'Try a different search term to find your businesses.'
                    : 'Add your first business to start building your presence.'
                }
                actionLabel={query ? undefined : 'Add Business'}
                onAction={
                  query
                    ? undefined
                    : () => navigation.navigate('MainTabs', { screen: 'AddBusiness' })
                }
              />
            }
            renderItem={({ item }) => (
              <BusinessCard
                business={item}
                showActions
                onPress={() =>
                  navigation.navigate('BusinessDetails', { businessId: item.id })
                }
                onFavoritePress={() => favoriteBusiness(item.id)}
                onEditPress={() =>
                  navigation.navigate('EditBusiness', { businessId: item.id })
                }
                onDeletePress={() => setDeleteTarget(item)}
              />
            )}
          />
        )}

        {!isLoading && filteredBusinesses.length > 0 ? (
          <View style={styles.countRow}>
            <Ionicons name="briefcase-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.countText, { color: colors.textMuted }]}>
              {filteredBusinesses.length} listing
              {filteredBusinesses.length === 1 ? '' : 's'}
            </Text>
          </View>
        ) : null}

        <ConfirmModal
          visible={Boolean(deleteTarget)}
          title="Delete business?"
          message="Are you sure you want to delete this business?"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
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
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.lg,
  },
  countText: {
    fontSize: typography.caption,
  },
});
