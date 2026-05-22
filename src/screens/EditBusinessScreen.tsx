import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BusinessForm } from '../components/BusinessForm';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { BusinessFormData } from '../types/business';
import { spacing, typography } from '../theme/spacing';

type RouteProps = RouteProp<RootStackParamList, 'EditBusiness'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

export function EditBusinessScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { getBusinessById, editBusiness } = useBusiness();
  const { colors } = useTheme();
  const business = getBusinessById(route.params.businessId);

  const [values, setValues] = useState<BusinessFormData>({
    name: '',
    category: '',
    description: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (business && business.owner === 'me') {
      setValues({
        name: business.name,
        category: business.category,
        description: business.description,
      });
    }
  }, [business]);

  useEffect(() => {
    if (business && business.owner !== 'me') {
      Alert.alert('Read only', 'You can only edit your own listings.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [business, navigation]);

  const handleChange = (field: keyof BusinessFormData, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!business || business.owner !== 'me') return;

    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await editBusiness(business.id, values);
      navigation.goBack();
    } catch {
      Alert.alert('Unable to save', 'Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!business) {
    return (
      <ScreenContainer>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Business not found</Text>
        </SafeAreaView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: colors.surfaceSecondary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>Edit Business</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Update your listing details
            </Text>
          </View>
        </View>

        <View style={styles.formWrap}>
          <BusinessForm
            values={values}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  formWrap: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
});
