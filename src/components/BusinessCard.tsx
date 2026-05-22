import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getCategoryByLabel } from '../data/categories';
import { Business } from '../types/business';
import { formatDate } from '../utils/formatDate';
import { radius, spacing, typography } from '../theme/spacing';

type BusinessCardProps = {
  business: Business;
  onPress: () => void;
  onFavoritePress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  showActions?: boolean;
  compact?: boolean;
};

export function BusinessCard({
  business,
  onPress,
  onFavoritePress,
  onEditPress,
  onDeletePress,
  showActions = false,
  compact = false,
}: BusinessCardProps) {
  const { colors, isDark } = useTheme();
  const category = getCategoryByLabel(business.category);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity: pressed ? 0.96 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        isDark ? styles.cardDark : styles.cardLight,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: category?.backgroundColor ?? colors.accentLight },
          ]}
        >
          <Text style={styles.emoji}>{category?.emoji ?? '🏢'}</Text>
        </View>

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {business.name}
            </Text>
            {business.isVerified ? (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.successLight },
                ]}
              >
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[styles.badgeText, { color: colors.success }]}>
                  Verified
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.category, { color: category?.color ?? colors.accent }]}>
            {business.category}
          </Text>
        </View>

        {onFavoritePress ? (
          <Pressable
            onPress={onFavoritePress}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons
              name={business.isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={business.isFavorite ? colors.accent : colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      <Text
        style={[styles.description, { color: colors.textSecondary }]}
        numberOfLines={compact ? 2 : 3}
      >
        {business.description}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {business.location ?? 'Location unavailable'}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {formatDate(business.createdAt)}
          </Text>
        </View>
      </View>

      {showActions && business.owner === 'me' ? (
        <View style={styles.actions}>
          <Pressable
            onPress={onEditPress}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.accentLight,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="create-outline" size={16} color={colors.accent} />
            <Text style={[styles.actionText, { color: colors.accent }]}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={onDeletePress}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.dangerLight,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardLight: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardDark: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: typography.subheading,
    fontWeight: '700',
    flexShrink: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  category: {
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  description: {
    fontSize: typography.body,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: typography.caption,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  actionText: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
});
