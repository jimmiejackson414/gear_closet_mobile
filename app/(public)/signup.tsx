import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';

const SignUp = () => {
  return (
    <ScreenWrapper>
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
    </ScreenWrapper>
  );
};

export default SignUp;