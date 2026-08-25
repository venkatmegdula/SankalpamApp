import { router } from 'expo-router';
import { Screen } from '@/ui/layout';
import { Button, EmptyState } from '@/ui/primitives';

export default function NotFound() {
  return (
    <Screen contentStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <EmptyState
        icon="compass-outline"
        title="This screen doesn't exist"
        body="Let's get you back to where you were."
      />
      <Button label="Go to Home" onPress={() => router.replace('/(tabs)')} />
    </Screen>
  );
}
