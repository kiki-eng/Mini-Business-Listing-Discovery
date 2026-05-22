import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { AddBusinessScreen } from '../screens/AddBusinessScreen';
import { AllListingsScreen } from '../screens/AllListingsScreen';
import { BusinessDetailsScreen } from '../screens/BusinessDetailsScreen';
import { EditBusinessScreen } from '../screens/EditBusinessScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MyListingsScreen } from '../screens/MyListingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { useResponsive } from '../utils/useResponsive';
import { SidebarTabBar } from './SidebarTabBar';
import { MainTabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const { colors } = useTheme();
  const { isWideWeb } = useResponsive();

  return (
    <Tab.Navigator
      initialRouteName="AllListings"
      tabBar={isWideWeb ? (props) => <SidebarTabBar {...props} /> : undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarPosition: isWideWeb ? 'left' : 'bottom',
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: isWideWeb
          ? undefined
          : {
              backgroundColor: colors.tabBar,
              borderTopColor: colors.border,
              height: Platform.OS === 'ios' ? 88 : 68,
              paddingTop: 8,
              paddingBottom: Platform.OS === 'ios' ? 24 : 12,
            },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> =
            {
              AddBusiness: focused ? 'add-circle' : 'add-circle-outline',
              MyListings: focused ? 'briefcase' : 'briefcase-outline',
              AllListings: focused ? 'compass' : 'compass-outline',
              Favorites: focused ? 'bookmark' : 'bookmark-outline',
            };

          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="AddBusiness"
        component={AddBusinessScreen}
        options={{ tabBarLabel: 'Add' }}
      />
      <Tab.Screen
        name="MyListings"
        component={MyListingsScreen}
        options={{ tabBarLabel: 'My Listings' }}
      />
      <Tab.Screen
        name="AllListings"
        component={AllListingsScreen}
        options={{ tabBarLabel: 'Discover' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: 'Favorites' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { colors, isDark } = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
        <Stack.Screen name="EditBusiness" component={EditBusinessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
