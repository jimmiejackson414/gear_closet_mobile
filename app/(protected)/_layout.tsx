import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import useAppStore from '@/stores/appStore';
import { useProfile } from '@/services/user/useProfile';
import { useErrorHandling, useLoading  } from '@/hooks';
import '@/handlers/gesture-handler';

const ProtectedLayout = () => {
  const {
    data, error, isLoading,
  } = useProfile();
  const setProfile = useAppStore((state) => state.setProfile);

  useLoading(isLoading);
  useErrorHandling(error, 'Failed to fetch profile data');

  useEffect(() => {
    if (data) setProfile(data);
  }, [data, setProfile]);
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: 'white' } }}>
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