import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Box, Button, ButtonIcon, Progress, ProgressFilledTrack } from '@/components/ui';
import { useSupabase } from '@/context/SupabaseProvider';
import EmailScreen from '@/components/auth/EmailScreen';
import PasswordScreen from '@/components/auth/PasswordScreen';
import CreateScreen from '@/components/auth/CreateScreen';

const Modal = () => {
  const [screen, setScreen] = useState<'email' | 'password' | 'create'>('email');
  const [submitting, setSubmitting] = useState(false);

  const navigation = useNavigation();

  const {
    checkForEmail, signInWithPassword, signUp,
  } = useSupabase();

  const emailOpacity = useSharedValue(1);
  const emailAnimatedStyle = useAnimatedStyle(() => ({ opacity: emailOpacity.value }));

  const passwordOpacity = useSharedValue(0);
  const passwordAnimatedStyle = useAnimatedStyle(() => ({ opacity: passwordOpacity.value }));

  const createOpacity = useSharedValue(0);
  const createAnimatedStyle = useAnimatedStyle(() => ({ opacity: createOpacity.value }));

  const [storedEmail, setStoredEmail] = useState('');
  const onCheckEmail = async ({ email }: { email: string }) => {
    try {
      setSubmitting(true);
      // check for existing email
      const emailExists = await checkForEmail(email);
      if (emailExists) {
        emailOpacity.value = withTiming(0, { duration: 300 });
        passwordOpacity.value = withTiming(1, { duration: 300 });
        setScreen('password');
        setStoredEmail(email);
      } else {
        emailOpacity.value = withTiming(0, { duration: 300 });
        createOpacity.value = withTiming(1, { duration: 300 });
        setScreen('create');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const onSignIn = async ({ password }: { password: string }) => {
    try {
      setSubmitting(true);
      await signInWithPassword(storedEmail, password);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const onSignUp = async ({ password }: { password: string }) => {
    try {
      setSubmitting(true);
      await signUp(storedEmail, password);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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
      <Animated.View style={[emailAnimatedStyle]}>
        {screen === 'email' && (
          <EmailScreen
            onSubmit={onCheckEmail}
            submitting={submitting} />
        )}
      </Animated.View>

      <Animated.View style={[passwordAnimatedStyle]}>
        {screen === 'password' && (
          <PasswordScreen
            onSubmit={onSignIn}
            submitting={submitting} />
        )}
      </Animated.View>

      <Animated.View style={[createAnimatedStyle]}>
        {screen === 'create' && (
          <CreateScreen
            onSubmit={onSignUp}
            submitting={submitting} />
        )}
      </Animated.View>
      <Progress
        className="mt-8"
        size="sm"
        value={screen === 'email' ? 50 : 100}>
        <ProgressFilledTrack />
      </Progress>
    </Box>
  );
};

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