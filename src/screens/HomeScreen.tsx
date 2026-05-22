import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { radius, spacing, typography } from '../theme/spacing';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type FeatureRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function FeatureRow({ icon, title, description }: FeatureRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.feature}>
      <View
        style={[styles.featureIcon, { backgroundColor: colors.accentLight }]}
      >
        <Ionicons name={icon} size={22} color={colors.accent} />
      </View>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text
          style={[styles.featureDescription, { color: colors.textSecondary }]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark, toggleTheme } = useTheme();

  const gradientColors = isDark
    ? (['#1A0F2E', '#2A1A4A', '#0F0A1F'] as const)
    : (['#EEE4FF', '#F5EBFF', '#FFE8F4'] as const);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.decorativeBlobOne}>
        <View
          style={[
            styles.blob,
            { backgroundColor: colors.accent, opacity: isDark ? 0.18 : 0.22 },
          ]}
        />
      </View>
      <View style={styles.decorativeBlobTwo}>
        <View
          style={[
            styles.blob,
            { backgroundColor: '#FF6FB5', opacity: isDark ? 0.14 : 0.18 },
          ]}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable
            onPress={toggleTheme}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={isDark ? '#FFFFFF' : colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.contentWrap}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark
                  ? 'rgba(28, 22, 46, 0.85)'
                  : 'rgba(255, 255, 255, 0.92)',
                borderColor: isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(124, 58, 237, 0.08)',
              },
            ]}
          >
            <View style={styles.heroSection}>
              <View style={styles.brandMark}>
                <Ionicons name="location" size={96} color={colors.accent} />
                <View style={styles.storefrontWrap}>
                  <Ionicons name="storefront" size={26} color="#FFFFFF" />
                </View>
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Mini Business
              </Text>
              <Text style={[styles.subtitle, { color: colors.accent }]}>
                Listing & Discovery
              </Text>
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                Discover, support, and showcase Canadian small businesses, all in one place.
              </Text>
            </View>

            <View style={styles.featuresSection}>
              <FeatureRow
                icon="storefront-outline"
                title="List your business"
                description="Share your services with the local community."
              />
              <FeatureRow
                icon="compass-outline"
                title="Discover local gems"
                description="Browse verified Canadian small businesses near you."
              />
              <FeatureRow
                icon="bookmark-outline"
                title="Save your favorites"
                description="Bookmark places you love and come back any time."
              />
            </View>

            <View style={styles.ctaSection}>
              <Pressable
                onPress={() => navigation.navigate('Splash')}
                style={({ pressed }) => [
                  styles.ctaButton,
                  {
                    backgroundColor: colors.accent,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <Text style={styles.ctaText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </Pressable>
              <Text style={[styles.footnote, { color: colors.textMuted }]}>
                Built for Canadian small business owners
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  decorativeBlobOne: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 320,
    height: 320,
  },
  decorativeBlobTwo: {
    position: 'absolute',
    bottom: -160,
    left: -120,
    width: 360,
    height: 360,
  },
  blob: {
    flex: 1,
    borderRadius: 999,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
  },
  contentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
    borderWidth: 1,
    gap: spacing.xxxl,
    ...Platform.select({
      ios: {
        shadowColor: '#5B21B6',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.18,
        shadowRadius: 40,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow:
          '0 24px 60px rgba(91, 33, 182, 0.18), 0 8px 24px rgba(91, 33, 182, 0.08)',
      },
    }),
  },
  heroSection: {
    alignItems: 'center',
  },
  brandMark: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  storefrontWrap: {
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.hero,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.body,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  tagline: {
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  featuresSection: {
    gap: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: typography.caption,
    lineHeight: 20,
  },
  ctaSection: {
    gap: spacing.md,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
  footnote: {
    fontSize: typography.small,
    textAlign: 'center',
  },
});
