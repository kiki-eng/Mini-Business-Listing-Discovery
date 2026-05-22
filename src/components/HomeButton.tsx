import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { radius } from '../theme/spacing';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeButton() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => navigation.navigate('Home')}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surfaceSecondary,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons name="home-outline" size={18} color={colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
