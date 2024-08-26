import { Stack } from 'expo-router';

const PublicLayout = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="welcome" />
    <Stack.Screen name="signup" />
    <Stack.Screen name="signin" />
  </Stack>
);

export default PublicLayout;