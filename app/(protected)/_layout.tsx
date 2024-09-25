import { Stack } from 'expo-router';
import '@/handlers/gesture-handler';
import { useErrorHandling, useLoading  } from '@/hooks';
import { useProfile } from '@/services/profile/hooks';

const ProtectedLayout = () => {
  const { error, isLoading } = useProfile();

  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch profile data');

  return (
    <Stack>
      <Stack.Screen
        name="(drawer)"
        options={{ headerShown: false }} />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
};

export default ProtectedLayout;