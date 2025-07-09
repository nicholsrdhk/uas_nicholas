// app/index.tsx

import { Text, StyleSheet, StatusBar, View } from "react-native";
import { router } from 'expo-router';
import React, { useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

const COLORS = {
  background: '#121212',
  accent: '#009B77',
  textTitle: '#F5F5F5',
};

const AnimatedLogo = Animated.createAnimatedComponent(View);

export default function SplashScreen() {
  const opacity = useSharedValue(0); 
  const scale = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    opacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
    scale.value = withDelay(500, withTiming(1, { duration: 1000 }));
    
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.accent, COLORS.background]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <AnimatedLogo style={[styles.logoContainer, animatedStyle]}>
        <Text style={[styles.logoText, styles.logoTextWhite]}>Sin</Text>
        <Text style={[styles.logoText, styles.logoTextGreen]}>é</Text>
        <Text style={[styles.logoText, styles.logoTextWhite]}>Log</Text>
      </AnimatedLogo>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 52,
    fontFamily: 'PlusJakartaSans',
    fontWeight: 'bold',
  },
  logoTextWhite: {
    color: COLORS.textTitle,
  },
  logoTextGreen: {
    color: COLORS.accent,
  },
});