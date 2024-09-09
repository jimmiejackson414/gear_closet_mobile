import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Box, Button, ButtonIcon, Progress, ProgressFilledTrack } from '@/components/ui';
import { AuthScreenProvider, useAuthScreenContext } from '@/context/AuthScreenProvider';
import EmailScreen from '@/components/auth/EmailScreen';
import PasswordScreen from '@/components/auth/PasswordScreen';
import CreateScreen from '@/components/auth/CreateScreen';
import ForgotPasswordScreen from '@/components/auth/ForgotPasswordScreen';
import PasswordRecoveryScreen from '@/components/auth/PasswordRecovery';
import PasswordResetScreen from '@/components/auth/PasswordResetScreen';

export type TScreenStates = 'email' | 'password' | 'create' | 'forgotPassword' | 'passwordRecovery' | 'passwordReset';

const ModalContent = () => {
  const navigation = useNavigation();
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const { screen } = useAuthScreenContext();

  useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 500 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <Box style={styles.modal}>
      <Button
        action="secondary"
        className="rounded-full p-3.5 w-12 h-12"
        onPress={() => navigation.goBack()}
        size="lg"
        style={styles.closeButton}
        variant="outline">
        <ButtonIcon
          as={X}
          size="lg" />
      </Button>

      <Animated.View style={animatedStyle}>
        {screen === 'email' && <EmailScreen />}
        {screen === 'password' && <PasswordScreen />}
        {screen === 'create' && <CreateScreen />}
        {screen === 'forgotPassword' && <ForgotPasswordScreen />}
        {screen === 'passwordRecovery' && <PasswordRecoveryScreen />}
        {screen === 'passwordReset' && <PasswordResetScreen />}
      </Animated.View>

      {(screen === 'email' || screen === 'password') && (
        <Progress
          className="mt-8"
          size="sm"
          value={screen === 'email' ? 50 : 100}>
          <ProgressFilledTrack />
        </Progress>
      )}
    </Box>
  );
};

const Modal = () => (
  <AuthScreenProvider>
    <ModalContent />
  </AuthScreenProvider>
);

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  modal: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
  },
});

export default Modal;