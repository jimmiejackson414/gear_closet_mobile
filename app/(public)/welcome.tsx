import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';

export default function WelcomeScreen() {
  const router = useRouter();
  console.log({ router });

  return (
    <SafeAreaView>
      <View>
        <Text>Welcome to Gear Closet</Text>
        <Button
          mode="contained"
          onPress={() => router.push('/(public)/sign-in')}>
          Log In
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push('/(public)/sign-up')}>
          Register
        </Button>
      </View>
    </SafeAreaView>
  );
}