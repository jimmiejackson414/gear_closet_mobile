import { Stack } from 'expo-router';

const PublicLayout = () => (
  <Stack>
    <Stack.Screen
      name="welcome"
      options={{ headerShown: false }} />
    <Stack.Screen
      name="signup"
      options={{
        headerShown: true,
        headerBackTitle: 'Welcome',
        headerTitle: 'Register',
        headerBlurEffect: 'light',
        headerTransparent: true,
      }} />
    <Stack.Screen
      name="signin"
      options={{
        headerShown: true,
        headerBackTitle: 'Welcome',
        headerTitle: 'Sign In',
        headerBlurEffect: 'light',
        headerTransparent: true,
      }} />
  </Stack>
);

export default PublicLayout;