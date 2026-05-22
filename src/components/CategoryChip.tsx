import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Category, getCategoryByLabel } from '../data/categories';
import { radius, spacing, typography } from '../theme/spacing';

type CategoryChipProps = {
  category: Category | string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryChip({ category, selected, onPress }: CategoryChipProps) {
  const { colors } = useTheme();
  const categoryData =
    typeof category === 'string'
      ? getCategoryByLabel(category) ?? {
          label: category,
          emoji: '🏷️',
          color: colors.accent,
          backgroundColor: colors.accentLight,
        }
      : category;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : categoryData.backgroundColor,
          borderColor: selected ? colors.accent : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={styles.emoji}>{categoryData.emoji}</Text>
      <Text
        style={[
          styles.label,
          { color: selected ? '#FFFFFF' : categoryData.color },
        ]}
      >
        {categoryData.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  emoji: {
    fontSize: typography.caption,
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
});
