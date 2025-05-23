import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Text } from 'react-native-paper';
import { z } from 'zod';
import FormInput from '@/components/common/FormInput';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { useSupabase } from '@/context/SupabaseProvider';
import { makeStyles } from '@/helpers';

const passwordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters.'),
});

const PasswordScreen: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signInWithPassword } = useSupabase();
  const {
    errors, setErrors, setScreen, setSubmitting, storedEmail, submitting,
  } = useAuthScreenContext();

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const { control, handleSubmit } = form;

  const onSignIn = async () => {
    try {
      setSubmitting(true);
      const { password } = form.getValues();
      await signInWithPassword(storedEmail, password);
    } catch (err) {
      setErrors({ password: { message: 'Invalid password' } });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (errors.password?.message === 'Invalid password') {
      setShowForgotPassword(true);
      form.setError('password', { type: 'manual', message: 'Invalid password' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const styles = useStyles();
  return (
    <FormProvider {...form}>
      <View style={styles.center}>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <Text style={{ marginVertical: 8 }}>Enter your password</Text>
        <View style={{ width: '100%' }}>
          <FormInput
            autoComplete="password"
            autoFocus
            control={control}
            disabled={submitting}
            keyboardType="default"
            label="Password"
            name="password"
            placeholder="Enter your password"
            secureTextEntry />
          <Button
            disabled={submitting}
            loading={submitting}
            mode="contained"
            onPress={handleSubmit(onSignIn)}
            style={{ marginTop: 24 }}>
            Continue
          </Button>
          {showForgotPassword && (
            <Button
              mode="text"
              onPress={() => setScreen('forgotPassword')}>
              Forgot password?
            </Button>
          )}
        </View>
      </View>
    </FormProvider>
  );
};

const useStyles = makeStyles(() => ({
  center: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  icon: {
    height: 64,
    marginBottom: 8,
    marginTop: 64,
    width: 64,
  },
}));

export default PasswordScreen;