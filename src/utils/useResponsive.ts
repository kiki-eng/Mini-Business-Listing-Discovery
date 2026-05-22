import { Platform, useWindowDimensions } from 'react-native';

const WIDE_WEB_BREAKPOINT = 1024;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWideWeb = isWeb && width >= WIDE_WEB_BREAKPOINT;

  return {
    width,
    height,
    isWeb,
    isWideWeb,
    sidebarWidth: 280,
    maxContentWidth: isWideWeb ? 960 : 430,
  };
}
