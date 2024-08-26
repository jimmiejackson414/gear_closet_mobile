import React from 'react';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';

const WelcomeScreen = () => (
  <SafeAreaView>
    <View>
      <Text>Welcome to Gear Closet</Text>
    </View>
    <View>
      <Link
        href={'/signin'}
        asChild>
        <Button mode="contained">
          Log In
        </Button>
      </Link>
      <Link
        href={'/signup'}
        asChild>
        <Button mode="outlined">
          Register
        </Button>
      </Link>
    </View>
  </SafeAreaView>
);

export default WelcomeScreen;