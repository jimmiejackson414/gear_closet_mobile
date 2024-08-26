import React from 'react';
import { View, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';

const SignUp = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Sign Up Page</Text>
      <Link
        href="/signin"
        asChild>
        <Button mode="contained">
          Log In
        </Button>
      </Link>
    </View>
  );
};

export default SignUp;