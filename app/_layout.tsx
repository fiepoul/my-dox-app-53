import { auth } from '@/firebaseconfig/firebaseconfig';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import 'react-native-url-polyfill/auto';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
      signOut(auth); // ⚠️ Logger ud med det samme hver gang app åbner
    }, []);

  // 1) Lyt på Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      console.log('🛡️ onAuthStateChanged → user is:', u);
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, []);

  // 2) Når init er færdig, gem Splash
  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync();
    }
  }, [initializing]);

  // 3) Indtil init er færdig, vis ingenting
  if (initializing) {
    return null;
  }

  // 4) Herefter returnerer vi ALTID en <Stack> navigator
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="login" options={{ headerShown: false }} />
  <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
  <Stack.Screen name="signup" options={{ headerShown: false }} />
  <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
</Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}