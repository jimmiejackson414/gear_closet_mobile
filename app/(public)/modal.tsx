import { useEffect } from 'react';
import { View } from 'react-native';
import { X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { IconButton, ProgressBar, useTheme } from 'react-native-paper';
import { AuthScreenProvider, useAuthScreenContext } from '@/context/AuthScreenProvider';
import EmailScreen from '@/components/auth/EmailScreen';
import PasswordScreen from '@/components/auth/PasswordScreen';
import CreateScreen from '@/components/auth/CreateScreen';
import ForgotPasswordScreen from '@/components/auth/ForgotPasswordScreen';
import PasswordRecoveryScreen from '@/components/auth/PasswordRecovery';
import PasswordResetScreen from '@/components/auth/PasswordResetScreen';
import makeStyles from '@/helpers/makeStyles';

const ModalContent = () => {
  const navigation = useNavigation();
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const theme = useTheme();
  const styles = useStyles();

  const { screen } = useAuthScreenContext();

  useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 500 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <View style={styles.modal}>
      <IconButton
        icon={({ size }) => <X size={size} />}
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.closeButton} />
      <Animated.View style={animatedStyle}>
        {screen === 'email' && <EmailScreen />}
        {screen === 'password' && <PasswordScreen />}
        {screen === 'create' && <CreateScreen />}
        {screen === 'forgotPassword' && <ForgotPasswordScreen />}
        {screen === 'passwordRecovery' && <PasswordRecoveryScreen />}
        {screen === 'passwordReset' && <PasswordResetScreen />}
      </Animated.View>
      {(screen === 'email' || screen === 'password') && (
        <ProgressBar
          color={theme.colors.primary}
          progress={screen === 'email' ? 0.5 : 1}
          style={{ marginTop: 32 }} />
      )}
    </View>
  );
};

const Modal = () => (
  <AuthScreenProvider>
    <ModalContent />
  </AuthScreenProvider>
);

const useStyles = makeStyles(() => ({
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
}));

export default Modal;