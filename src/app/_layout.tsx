import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display/400Regular';
import { KantumruyPro_400Regular } from '@expo-google-fonts/kantumruy-pro/400Regular';
import { KantumruyPro_500Medium } from '@expo-google-fonts/kantumruy-pro/500Medium';
import { KantumruyPro_600SemiBold } from '@expo-google-fonts/kantumruy-pro/600SemiBold';
import { KantumruyPro_700Bold } from '@expo-google-fonts/kantumruy-pro/700Bold';
import { AnekTelugu_400Regular } from '@expo-google-fonts/anek-telugu/400Regular';
import { AnekTelugu_500Medium } from '@expo-google-fonts/anek-telugu/500Medium';
import { AnekTelugu_600SemiBold } from '@expo-google-fonts/anek-telugu/600SemiBold';
import { AnekDevanagari_400Regular } from '@expo-google-fonts/anek-devanagari/400Regular';
import { AnekDevanagari_500Medium } from '@expo-google-fonts/anek-devanagari/500Medium';
import { AnekDevanagari_600SemiBold } from '@expo-google-fonts/anek-devanagari/600SemiBold';

import { ThemeProvider, useTheme } from '@/ui/ThemeProvider';
import { SessionProvider } from '@/store/session';
import { ToastHost } from '@/components/ToastHost';
import { OfflineBanner } from '@/components/OfflineBanner';
import { DemoLauncher } from '@/components/DemoBar';

void SplashScreen.preventAutoHideAsync();

function Shell() {
  const { theme, isDark } = useTheme();

  // On web the app renders as a phone-width column; without this the page behind
  // it keeps the browser default and shows a light surround in dark mode.
  // We also replace the browser's default focus ring with an on-brand one —
  // keyboard users need a visible indicator, it just shouldn't be off-palette.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const root = document.getElementById('root');
    document.body.style.backgroundColor = theme.bg.sunken;
    if (root) root.style.backgroundColor = theme.bg.sunken;

    const id = 'sankalpam-focus-ring';
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = `
      /* Expo's single-page web output doesn't stretch the host document, so the
         app column neither fills the viewport height nor centres horizontally. */
      html, body, #root {
        height: 100%;
        width: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
      }
      #root { flex: 1 1 auto; min-height: 0; }

      :focus { outline: none; }
      :focus-visible {
        outline: 2px solid ${theme.line.focus};
        outline-offset: 2px;
      }
    `;
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg.sunken }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg.canvas },
          animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
        }}>
        <Stack.Screen name="booking/[id]/ceremony" options={{ gestureEnabled: false }} />
      </Stack>
      <OfflineBanner />
      <DemoLauncher />
      <ToastHost />
    </View>
  );
}

export default function RootLayout() {
  const [fontsReady] = useFonts({
    DMSerifDisplay_400Regular,
    KantumruyPro_400Regular,
    KantumruyPro_500Medium,
    KantumruyPro_600SemiBold,
    KantumruyPro_700Bold,
    AnekTelugu_400Regular,
    AnekTelugu_500Medium,
    AnekTelugu_600SemiBold,
    AnekDevanagari_400Regular,
    AnekDevanagari_500Medium,
    AnekDevanagari_600SemiBold,
  });

  useEffect(() => {
    if (fontsReady) void SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SessionProvider>
            <Shell />
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
