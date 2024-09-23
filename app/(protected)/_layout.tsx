import { useEffect } from 'react';
import { Stack } from 'expo-router';
import '@/handlers/gesture-handler';
import { useErrorHandling, useLoading  } from '@/hooks';
import { useProfile } from '@/services/user/useProfile';
import useAppStore from '@/stores/appStore';

const ProtectedLayout = () => {
  const {
    data, error, isLoading,
  } = useProfile();
  const setProfile = useAppStore(state => state.setProfile);

  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch profile data');

  useEffect(() => {
    if (data) setProfile(data);
  }, [data, setProfile]);
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