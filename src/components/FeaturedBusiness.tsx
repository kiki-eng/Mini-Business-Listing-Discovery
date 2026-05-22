import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getCategoryByLabel } from '../data/categories';
import { Business } from '../types/business';
import { radius, spacing, typography } from '../theme/spacing';

type FeaturedBusinessProps = {
  businesses: Business[];
  onPressBusiness: (business: Business) => void;
  onFavoritePress: (business: Business) => void;
};

export function FeaturedBusiness({
  businesses,
  onPressBusiness,
  onFavoritePress,
}: FeaturedBusinessProps) {
  const { colors, isDark } = useTheme();

  if (businesses.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Featured</Text>
        <View style={[styles.pill, { backgroundColor: colors.accentLight }]}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text style={[styles.pillText, { color: colors.accent }]}>Curated</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {businesses.map((business) => {
          const category = getCategoryByLabel(business.category);

          return (
            <Pressable
              key={business.id}
              onPress={() => onPressBusiness(business)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                  opacity: pressed ? 0.92 : 1,
                },
                isDark ? styles.cardDark : styles.cardLight,
              ]}
            >
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor:
                        category?.backgroundColor ?? colors.accentLight,
                    },
                  ]}
                >
                  <Text style={styles.emoji}>{category?.emoji ?? '🏢'}</Text>
                </View>
                <Pressable
                  onPress={() => onFavoritePress(business)}
                  hitSlop={8}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Ionicons
                    name={business.isFavorite ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={business.isFavorite ? colors.accent : colors.textMuted}
                  />
                </Pressable>
              </View>

              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {business.name}
              </Text>
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {business.description}
              </Text>
              <View style={styles.footer}>
                <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                <Text style={[styles.location, { color: colors.textMuted }]}>
                  {business.location ?? 'Canada'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '700',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  pillText: {
    fontSize: typography.small,
    fontWeight: '600',
  },
  scrollContent: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: 240,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  name: {
    fontSize: typography.subheading,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.caption,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: typography.small,
  },
});
