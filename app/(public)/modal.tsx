import { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from 'expo-router';
// import { IconButton, ProgressBar } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// import CreateScreen from '@/components/auth/CreateScreen';
import EmailScreen from '@/components/auth/EmailScreen';
// import ForgotPasswordScreen from '@/components/auth/ForgotPasswordScreen';
// import PasswordRecoveryScreen from '@/components/auth/PasswordRecovery';
// import PasswordResetScreen from '@/components/auth/PasswordResetScreen';
// import PasswordScreen from '@/components/auth/PasswordScreen';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AuthScreenProvider, useAuthScreenContext } from '@/context/AuthScreenProvider';
import { XIcon } from '@/lib/icons';

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
    <View className="flex-1 px-8 pt-20">
      <Button
        className="absolute top-4 right-4"
        onPress={() => navigation.goBack()}
        size="icon"
        variant="ghost">
        <XIcon className="stroke-muted-foreground" />
      </Button>
      <Animated.View style={animatedStyle}>
        {screen === 'email' && <EmailScreen />}
        {/* {screen === 'password' && <PasswordScreen />}
        {screen === 'create' && <CreateScreen />}
        {screen === 'forgotPassword' && <ForgotPasswordScreen />}
        {screen === 'passwordRecovery' && <PasswordRecoveryScreen />}
        {screen === 'passwordReset' && <PasswordResetScreen />} */}
      </Animated.View>
      {(screen === 'email' || screen === 'password') && (
        <Progress
          indicatorClassName="bg-accent-alt"
          style={{ marginTop: 32 }}
          value={screen === 'email' ? 50 : 100} />
      )}
    </View>
  );
};

const Modal = () => (
  <AuthScreenProvider>
    <ModalContent />
  </AuthScreenProvider>
);

export default Modal;