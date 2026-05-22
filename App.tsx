import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { BusinessProvider } from './src/context/BusinessContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BusinessProvider>
        <AppContent />
      </BusinessProvider>
    </ThemeProvider>
  );
}
