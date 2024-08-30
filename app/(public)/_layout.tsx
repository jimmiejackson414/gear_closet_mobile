import { Stack } from 'expo-router';

const PublicLayout = () => (
  <Stack>
    <Stack.Screen
      name="welcome"
      options={{ headerShown: false }} />
    <Stack.Screen
      name="modal"
      options={{ presentation: 'modal' }} />
  </Stack>
);

export default PublicLayout;