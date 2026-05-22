import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BusinessForm } from '../components/BusinessForm';
import { HomeButton } from '../components/HomeButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import {
  MainTabParamList,
  RootStackParamList,
} from '../navigation/types';
import { BusinessFormData } from '../types/business';
import { spacing, typography } from '../theme/spacing';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'AddBusiness'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const initialForm: BusinessFormData = {
  name: '',
  category: '',
  description: '',
};

function validateForm(values: BusinessFormData) {
  const errors: Partial<Record<keyof BusinessFormData, string>> = {};

  if (!values.name.trim()) {
    errors.name = 'Business name is required';
  }
  if (!values.category.trim()) {
    errors.category = 'Please select a category';
  }
  if (!values.description.trim()) {
    errors.description = 'Description is required';
  }

  return errors;
}

export function AddBusinessScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addBusiness } = useBusiness();
  const { colors, toggleTheme, isDark } = useTheme();
  const [values, setValues] = useState<BusinessFormData>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof BusinessFormData, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addBusiness(values);
      setValues(initialForm);
      setErrors({});
      navigation.navigate('MyListings');
    } catch {
      Alert.alert('Unable to save', 'Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>
              Add Business
            </Text>
            <View style={styles.headerActions}>
              <Pressable
                onPress={toggleTheme}
                hitSlop={8}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <Ionicons
                  name={isDark ? 'sunny-outline' : 'moon-outline'}
                  size={22}
                  color={colors.textMuted}
                />
              </Pressable>
              <HomeButton />
            </View>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Share your business with the Canadian community
          </Text>
        </View>

        <View style={styles.formWrap}>
          <BusinessForm
            values={values}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Publish Listing"
            isSubmitting={isSubmitting}
          />
        </View>
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
    paddingBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: typography.body,
    lineHeight: 22,
    maxWidth: 320,
  },
  formWrap: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
});
