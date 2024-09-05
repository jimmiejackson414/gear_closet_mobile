import React from 'react';
import { Stack } from 'expo-router';
import '@/handlers/gesture-handler';

const ProtectedLayout = () => (
  <Stack>
    <Stack.Screen
      name="(drawer)"
      options={{ headerShown: false }} />
    <Stack.Screen
      name="onboarding"
      options={{ headerShown: false }} />
  </Stack>
);

export default ProtectedLayout;