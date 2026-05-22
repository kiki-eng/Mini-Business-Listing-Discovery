import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ConfirmModal } from '../components/ConfirmModal';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import { getCategoryByLabel } from '../data/categories';
import { RootStackParamList } from '../navigation/types';
import { formatDate, formatRelativeDate } from '../utils/formatDate';
import { radius, spacing, typography } from '../theme/spacing';

type RouteProps = RouteProp<RootStackParamList, 'BusinessDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function BusinessDetailsScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { getBusinessById, deleteBusiness, favoriteBusiness } = useBusiness();
  const { colors, isDark } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const business = getBusinessById(route.params.businessId);

  const category = useMemo(
    () => (business ? getCategoryByLabel(business.category) : undefined),
    [business],
  );

  const isTrending = useMemo(() => {
    if (!business?.views) return false;
    return business.views > 800;
  }, [business?.views]);

  if (!business) {
    return (
      <ScreenContainer>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
          <View style={styles.notFound}>
            <Text style={[styles.notFoundTitle, { color: colors.text }]}>
              Business not found
            </Text>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={{ color: colors.accent, fontWeight: '600' }}>Go back</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  const handleDelete = async () => {
    await deleteBusiness(business.id);
    setShowDeleteModal(false);
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: colors.surfaceSecondary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons name="arrow-back" size={22} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={() => favoriteBusiness(business.id)}
              style={({ pressed }) => [
                styles.iconButton,
                {
                  backgroundColor: colors.surfaceSecondary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons
                name={business.isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={business.isFavorite ? colors.accent : colors.text}
              />
            </Pressable>
          </View>

          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
              isDark ? styles.heroDark : styles.heroLight,
            ]}
          >
            <View
              style={[
                styles.categoryIcon,
                {
                  backgroundColor:
                    category?.backgroundColor ?? colors.accentLight,
                },
              ]}
            >
              <Text style={styles.emoji}>{category?.emoji ?? '🏢'}</Text>
            </View>

            <Text style={[styles.name, { color: colors.text }]}>{business.name}</Text>
            <Text style={[styles.category, { color: category?.color ?? colors.accent }]}>
              {business.category}
            </Text>

            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.ownerBadge,
                  {
                    backgroundColor:
                      business.owner === 'me'
                        ? colors.accentLight
                        : colors.surfaceSecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ownerBadgeText,
                    {
                      color:
                        business.owner === 'me' ? colors.accent : colors.textSecondary,
                    },
                  ]}
                >
                  {business.owner === 'me' ? 'Your Business' : 'Community Listing'}
                </Text>
              </View>

              {business.isVerified ? (
                <View
                  style={[
                    styles.verifiedBadge,
                    { backgroundColor: colors.successLight },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                  <Text style={[styles.verifiedText, { color: colors.success }]}>
                    Verified
                  </Text>
                </View>
              ) : null}

              {isTrending ? (
                <View
                  style={[
                    styles.trendingBadge,
                    { backgroundColor: colors.accentLight },
                  ]}
                >
                  <Ionicons name="trending-up" size={14} color={colors.accent} />
                  <Text style={[styles.trendingText, { color: colors.accent }]}>
                    Trending
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {business.description}
            </Text>
          </View>

          <View style={styles.metaGrid}>
            <View
              style={[
                styles.metaCard,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="location-outline" size={18} color={colors.accent} />
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Location</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {business.location ?? 'Location unavailable'}
              </Text>
            </View>
            <View
              style={[
                styles.metaCard,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="calendar-outline" size={18} color={colors.accent} />
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Listed</Text>
              <Text style={[styles.metaValue, { color: colors.text }]}>
                {formatDate(business.createdAt)}
              </Text>
              <Text style={[styles.metaHint, { color: colors.textMuted }]}>
                {formatRelativeDate(business.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Insights
            </Text>
            <View style={styles.analyticsRow}>
              <View
                style={[
                  styles.analyticsCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.analyticsValue, { color: colors.text }]}>
                  {business.views ?? 0}
                </Text>
                <Text style={[styles.analyticsLabel, { color: colors.textMuted }]}>
                  Views
                </Text>
              </View>
              <View
                style={[
                  styles.analyticsCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.analyticsValue, { color: colors.text }]}>
                  {business.saves ?? 0}
                </Text>
                <Text style={[styles.analyticsLabel, { color: colors.textMuted }]}>
                  Saves
                </Text>
              </View>
            </View>
          </View>

          {business.owner === 'me' ? (
            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  navigation.navigate('EditBusiness', { businessId: business.id })
                }
                style={({ pressed }) => [
                  styles.primaryAction,
                  {
                    backgroundColor: colors.accent,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Edit Business</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowDeleteModal(true)}
                style={({ pressed }) => [
                  styles.secondaryAction,
                  {
                    backgroundColor: colors.dangerLight,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
                <Text style={[styles.secondaryActionText, { color: colors.danger }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        <ConfirmModal
          visible={showDeleteModal}
          title="Delete business?"
          message="Are you sure you want to delete this business?"
          onCancel={() => setShowDeleteModal(false)}
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
  content: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  heroLight: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  heroDark: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emoji: {
    fontSize: 34,
  },
  name: {
    fontSize: typography.title,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: typography.body,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ownerBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  ownerBadgeText: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  verifiedText: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  trendingText: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.subheading,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.body,
    lineHeight: 24,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  metaCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  metaLabel: {
    fontSize: typography.small,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: typography.body,
    fontWeight: '600',
  },
  metaHint: {
    fontSize: typography.small,
  },
  analyticsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  analyticsCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: typography.heading,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  analyticsLabel: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  actions: {
    gap: spacing.md,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
  secondaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
  },
  secondaryActionText: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  notFoundTitle: {
    fontSize: typography.subheading,
    fontWeight: '700',
  },
});
