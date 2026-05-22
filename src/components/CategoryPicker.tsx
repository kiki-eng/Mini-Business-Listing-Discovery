import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES, getCategoryByLabel } from '../data/categories';
import { radius, spacing, typography } from '../theme/spacing';

type CategoryPickerProps = {
  value: string;
  onChange: (label: string) => void;
  error?: boolean;
};

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selected = value ? getCategoryByLabel(value) : undefined;

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.danger : colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        {selected ? (
          <View style={styles.selectedRow}>
            <View
              style={[
                styles.selectedIcon,
                { backgroundColor: selected.backgroundColor },
              ]}
            >
              <Text style={styles.emoji}>{selected.emoji}</Text>
            </View>
            <Text style={[styles.selectedLabel, { color: colors.text }]}>
              {selected.label}
            </Text>
          </View>
        ) : (
          <Text style={[styles.placeholder, { color: colors.textMuted }]}>
            Select a category
          </Text>
        )}
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setIsOpen(false)}
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[styles.handle, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              Choose a Category
            </Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(category) => category.id}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}
              renderItem={({ item }) => {
                const isSelected = value === item.label;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.label);
                      setIsOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        backgroundColor: isSelected
                          ? colors.accentLight
                          : 'transparent',
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: item.backgroundColor },
                      ]}
                    >
                      <Text style={styles.emoji}>{item.emoji}</Text>
                    </View>
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? colors.accent : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark" size={20} color={colors.accent} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  selectedIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  selectedLabel: {
    fontSize: typography.body,
    fontWeight: '600',
  },
  placeholder: {
    fontSize: typography.body,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxHeight: '80%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    fontSize: typography.subheading,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  separator: {
    height: 1,
    marginVertical: spacing.xs,
    opacity: 0.4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: typography.body,
  },
});
