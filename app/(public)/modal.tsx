import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
// import { IconButton, ProgressBar } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// import CreateScreen from '@/components/auth/CreateScreen';
// import EmailScreen from '@/components/auth/EmailScreen';
// import ForgotPasswordScreen from '@/components/auth/ForgotPasswordScreen';
// import PasswordRecoveryScreen from '@/components/auth/PasswordRecovery';
// import PasswordResetScreen from '@/components/auth/PasswordResetScreen';
// import PasswordScreen from '@/components/auth/PasswordScreen';
import { AuthScreenProvider, useAuthScreenContext } from '@/context/AuthScreenProvider';
// import { useAppTheme } from '@/context/ThemeProvider';
import makeStyles from '@/helpers/makeStyles';

const ModalContent = () => {
  const navigation = useNavigation();
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  // const { theme } = useAppTheme();
  const styles = useStyles();

  const { screen } = useAuthScreenContext();

  useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 500 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <View style={styles.modal}>
      {/* <IconButton
        icon="close"
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
      )} */}
      <Text>Public Modal</Text>
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