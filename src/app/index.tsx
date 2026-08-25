import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/store/session';
import { useColors } from '@/ui/ThemeProvider';
import { BrandLockup } from '@/components/BrandMark';

/**
 * Entry point. Routes to the right place for the pujari's verification stage —
 * a returning applicant is never dead-ended back at the start.
 */
export default function Index() {
  const { profile, loading } = useSession();
  const t = useColors();

  useEffect(() => {
    if (loading) return;
    const id = setTimeout(() => {
      if (!profile || !profile.phone) router.replace('/welcome');
      else if (profile.stage === 'not_started') router.replace('/apply/intro');
      else if (profile.stage === 'active') router.replace('/(tabs)');
      else router.replace('/verification');
    }, 900);
    return () => clearTimeout(id);
  }, [loading, profile]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg.brand, alignItems: 'center', justifyContent: 'center' }}>
      <BrandLockup color="#FFFFFF" size={54} tagline="Pujari" />
    </View>
  );
}
