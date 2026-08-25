import { Tabs } from 'expo-router';
import { Icon, type IconName } from '@/ui/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/ui/ThemeProvider';
import { fontFamily, layout } from '@/ui/tokens';

/**
 * Four tabs, because the app has four genuinely distinct daily jobs.
 * Requests is not one of them — Home already surfaces pending requests
 * and links through to the full list.
 */
export default function TabsLayout() {
  const t = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.fg.brand,
        tabBarInactiveTintColor: t.fg.tertiary,
        tabBarStyle: {
          backgroundColor: t.bg.surface,
          borderTopColor: t.line.subtle,
          borderTopWidth: 1,
          height: layout.tabBarHeight + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          maxWidth: layout.maxContentWidth,
          alignSelf: 'center',
          width: '100%',
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.medium,
          fontSize: 11,
          // The label box is flex-shrunk below the glyph height on web, which
          // clips descenders. Pin the height so it can't shrink.
          lineHeight: 15,
          height: 15,
          flexShrink: 0,
          marginTop: 4,
        },
        sceneStyle: { backgroundColor: t.bg.canvas },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? 'home' : 'home-outline'} size={21} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? 'calendar' : 'calendar-outline'} size={21} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? 'wallet' : 'wallet-outline'} size={21} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? 'person' : 'person-outline'} size={21} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
