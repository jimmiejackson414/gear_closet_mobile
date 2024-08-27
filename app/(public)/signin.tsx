import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';

const SignIn = () => {
  return (
    <ScreenWrapper>
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
    </ScreenWrapper>
  );
};

export default SignIn;