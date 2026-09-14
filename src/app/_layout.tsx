import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import AppTabs from '@/components/app-tabs';

SplashScreen.hideAsync().catch(() => {});

function InnerTabLayout() {
  const { themeMode } = useAppTheme();
  return (
    <NavigationThemeProvider value={themeMode === 'dark' ? DarkTheme : DefaultTheme}>
      <AppTabs />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerTabLayout />
    </ThemeProvider>
  );
}
