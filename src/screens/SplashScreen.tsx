import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';

const PURPLE = '#7C3AED';
const SPLASH_DURATION_MS = 1600;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('MainTabs', { screen: 'AddBusiness' });
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.brandWrap,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.pinWrap}>
          <Ionicons name="location" size={132} color="#FFFFFF" />
          <View style={styles.storefrontWrap}>
            <Ionicons name="storefront" size={36} color={PURPLE} />
          </View>
        </View>
        <Text style={styles.wordmark}>Mini Business</Text>
        <Text style={styles.tagline}>Listing & Discovery</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandWrap: {
    alignItems: 'center',
  },
  pinWrap: {
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storefrontWrap: {
    position: 'absolute',
    top: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 24,
    letterSpacing: -0.5,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
    letterSpacing: 0.2,
  },
});
