import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useResponsive } from '../utils/useResponsive';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
};

export function ScreenContainer({ children, style, maxWidth }: ScreenContainerProps) {
  const { maxContentWidth } = useResponsive();
  const resolvedMaxWidth = maxWidth ?? maxContentWidth;

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { maxWidth: resolvedMaxWidth }, style]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { minHeight: '100vh' as unknown as number } : {}),
  },
  inner: {
    flex: 1,
    width: '100%',
  },
});
