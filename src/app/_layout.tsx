import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

SplashScreen.hideAsync().catch(() => {});

function TabLayout() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.cardBorder,
          height: Platform.OS === 'web' ? 56 : 64,
          paddingBottom: Platform.OS === 'web' ? 6 : 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Temario DAG',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/images/tabIcons/home.png')}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Biblioteca & Notas',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/images/tabIcons/explore.png')}
              style={[styles.tabIcon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 22,
    height: 22,
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TabLayout />
    </ThemeProvider>
  );
}
