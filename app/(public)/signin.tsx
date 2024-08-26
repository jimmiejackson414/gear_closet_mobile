import React from 'react';
import { View, Text } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from 'react-native-paper';

const SignIn = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Sign In Page</Text>
      <Link
        href="/signup"
        asChild>
        <Button mode="outlined">
          Register
        </Button>
      </Link>
    </View>
  );
};

export default SignIn;