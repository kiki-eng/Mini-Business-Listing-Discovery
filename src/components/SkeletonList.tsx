import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme/spacing';

type SkeletonCardProps = {
  count?: number;
};

export function SkeletonList({ count = 3 }: SkeletonCardProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.row}>
            <View
              style={[styles.avatar, { backgroundColor: colors.border }]}
            />
            <View style={styles.content}>
              <View
                style={[styles.lineShort, { backgroundColor: colors.border }]}
              />
              <View
                style={[styles.lineTiny, { backgroundColor: colors.border }]}
              />
            </View>
          </View>
          <View
            style={[styles.lineLong, { backgroundColor: colors.border }]}
          />
          <View
            style={[styles.lineMedium, { backgroundColor: colors.border }]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
  },
  content: {
    flex: 1,
    gap: spacing.sm,
  },
  lineShort: {
    height: 16,
    width: '60%',
    borderRadius: radius.sm,
  },
  lineTiny: {
    height: 12,
    width: '35%',
    borderRadius: radius.sm,
  },
  lineLong: {
    height: 14,
    width: '100%',
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  lineMedium: {
    height: 14,
    width: '75%',
    borderRadius: radius.sm,
  },
});
