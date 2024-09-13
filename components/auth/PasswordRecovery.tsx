import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Center, Text } from '@/components/ui';

const PasswordRecoveryScreen = () => (
  <Center>
    <Image
      contentFit="contain"
      source={require('../../assets/gear-closet-icon.png')}
      style={styles.icon} />
    <Text
      bold
      className="mb-4"
      size="lg">
      Password Recovery
    </Text>
    <Text className="mb-4 text-center">
      If an account with this email exists, you will receive an email with a link to reset your password.
    </Text>
    <Text className="text-center">
      Please allow a few minutes for the email to arrive, and be sure to check your spam folder.
    </Text>
  </Center>
);

const styles = StyleSheet.create({
  icon: {
    height: 64,
    marginBottom: 8,
    marginTop: 64,
    width: 64,
  },
});

export default PasswordRecoveryScreen;