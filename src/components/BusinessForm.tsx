import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BusinessFormData } from '../types/business';
import { radius, spacing, typography } from '../theme/spacing';
import { CategoryPicker } from './CategoryPicker';

type BusinessFormProps = {
  values: BusinessFormData;
  errors: Partial<Record<keyof BusinessFormData, string>>;
  onChange: (field: keyof BusinessFormData, value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
};

export function BusinessForm({
  values,
  errors,
  onChange,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: BusinessFormProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Business Name</Text>
        <TextInput
          value={values.name}
          onChangeText={(text) => onChange('name', text)}
          placeholder="e.g. Maple Leaf Roasters"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: errors.name ? colors.danger : colors.border,
              color: colors.text,
            },
          ]}
        />
        {errors.name ? (
          <Text style={[styles.error, { color: colors.danger }]}>{errors.name}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <CategoryPicker
          value={values.category}
          onChange={(label) => onChange('category', label)}
          error={Boolean(errors.category)}
        />
        {errors.category ? (
          <Text style={[styles.error, { color: colors.danger }]}>
            {errors.category}
          </Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.text }]}>Short Description</Text>
        <TextInput
          value={values.description}
          onChangeText={(text) => onChange('description', text)}
          placeholder="Tell customers what makes your business special..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.inputBackground,
              borderColor: errors.description ? colors.danger : colors.border,
              color: colors.text,
            },
          ]}
        />
        {errors.description ? (
          <Text style={[styles.error, { color: colors.danger }]}>
            {errors.description}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          {
            backgroundColor: colors.accent,
            opacity: pressed || isSubmitting ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.submitText}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxxl,
  },
  field: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
  },
  textArea: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: typography.caption,
  },
  submitButton: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
});
