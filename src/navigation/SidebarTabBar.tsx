import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing, typography } from '../theme/spacing';
import { useResponsive } from '../utils/useResponsive';
import { MainTabParamList } from './types';

type IconPair = {
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
};

const ICON_MAP: Record<keyof MainTabParamList, IconPair> = {
  AddBusiness: { active: 'add-circle', inactive: 'add-circle-outline' },
  MyListings: { active: 'briefcase', inactive: 'briefcase-outline' },
  AllListings: { active: 'compass', inactive: 'compass-outline' },
  Favorites: { active: 'bookmark', inactive: 'bookmark-outline' },
};

const LABEL_MAP: Record<keyof MainTabParamList, string> = {
  AddBusiness: 'Add Business',
  MyListings: 'My Listings',
  AllListings: 'Discover',
  Favorites: 'Favorites',
};

export function SidebarTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { sidebarWidth } = useResponsive();

  const goHome = () => navigation.getParent()?.navigate('Home' as never);

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: sidebarWidth,
          backgroundColor: colors.surface,
          borderRightColor: colors.border,
        },
      ]}
    >
      <Pressable
        onPress={goHome}
        style={({ pressed }) => [
          styles.brandSection,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={styles.brandMark}>
          <Ionicons name="location" size={56} color={colors.accent} />
          <View style={styles.brandStorefront}>
            <Ionicons name="storefront" size={16} color="#FFFFFF" />
          </View>
        </View>
        <Text style={[styles.brandTitle, { color: colors.text }]}>
          Mini Business
        </Text>
        <Text style={[styles.brandSubtitle, { color: colors.accent }]}>
          Listing & Discovery
        </Text>
      </Pressable>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <ScrollView
        contentContainerStyle={styles.navSection}
        showsVerticalScrollIndicator={false}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const routeName = route.name as keyof MainTabParamList;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.navItem,
                {
                  backgroundColor: isFocused ? colors.accentLight : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name={
                  isFocused
                    ? ICON_MAP[routeName].active
                    : ICON_MAP[routeName].inactive
                }
                size={22}
                color={isFocused ? colors.accent : colors.textMuted}
              />
              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isFocused ? colors.accent : colors.text,
                    fontWeight: isFocused ? '700' : '500',
                  },
                ]}
              >
                {LABEL_MAP[routeName]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.navItem,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={20}
            color={colors.textMuted}
          />
          <Text style={[styles.navLabel, { color: colors.textSecondary }]}>
            {isDark ? 'Light mode' : 'Dark mode'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    borderRightWidth: 1,
    paddingTop: spacing.xxxl,
  },
  brandSection: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  brandMark: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandStorefront: {
    position: 'absolute',
    top: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: typography.heading,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  navSection: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  navLabel: {
    fontSize: typography.body,
  },
  footer: {
    borderTopWidth: 1,
    padding: spacing.md,
  },
});
