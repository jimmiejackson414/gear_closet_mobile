import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { FormProvider, useForm } from 'react-hook-form';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { toast } from 'sonner-native';
import { z } from 'zod';
import CodeInput from '@/components/common/CodeInput';
import FormInput from '@/components/common/FormInput';
import { Button, Text } from '@/components/ui';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { useSupabase } from '@/context/SupabaseProvider';
import { makeStyles } from '@/helpers';
import { supabase } from '@/lib/supabase';

const passwordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters.'),
  passwordConfirm: z.string()
    .min(6, 'Password must be at least 6 characters.'),
})
  .refine(data => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

const PasswordResetScreen = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { verifyResetCode } = useSupabase();
  const {
    resetCode, storedEmail, setResetCode,
  } = useAuthScreenContext();

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', passwordConfirm: '' },
  });

  const {
    control, handleSubmit, watch,
  } = form;
  const watchedFields = watch();

  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleVerifyCode = async () => {
    if (resetCode?.length !== 6) return;

    try {
      setSubmitting(true);
      await verifyResetCode(storedEmail, resetCode);
      setStep(2);
    } catch (err) {
      toast.error('Invalid code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const router = useRouter();
  const handleResetPassword = async () => {
    const { password } = form.getValues();
    try {
      setSubmitting(true);

      // update the user's password
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      // navigate
      toast.success('Password updated successfully.');
      router.replace('/(protected)/(drawer)/home');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 500 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const styles = useStyles();
  return (
    <View style={styles.center}>
      <Image
        contentFit="contain"
        source={require('../../assets/gear-closet-icon.png')}
        style={styles.icon} />
      <Animated.View style={[ animatedStyle, { width: '100%' } ]}>
        {step === 1 && (
          <View style={{
            width: '100%', justifyContent: 'center', gap: 12,
          }}>
            <Text style={{ marginBottom: 16, textAlign: 'center' }}>Please enter your code</Text>
            <CodeInput
              length={6}
              onChangeCode={setResetCode} />
            <Button onPress={handleVerifyCode}>
              Verify Code
            </Button>
          </View>
        )}
        {step === 2 && (
          <FormProvider {...form}>
            <View style={{
              width: '100%', justifyContent: 'center', gap: 16,
            }}>
              <Text className="text-center mb-8">Enter your new password</Text>
              <FormInput
                autoComplete="password-new"
                autoFocus
                control={control}
                disabled={submitting}
                keyboardType="visible-password"
                label="New password"
                name="password"
                placeholder="Enter your new password"
                secureTextEntry />
              <FormInput
                control={control}
                disabled={submitting}
                keyboardType="visible-password"
                label="Confirm password"
                name="passwordConfirm"
                placeholder="Confirm your new password"
                secureTextEntry />
              <Button
                className="mt-6"
                disabled={submitting || !watchedFields.password || !watchedFields.passwordConfirm}
                onPress={handleSubmit(handleResetPassword)}>
                Reset Password
              </Button>
            </View>
          </FormProvider>
        )}
      </Animated.View>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  center: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    height: 64,
    marginBottom: 8,
    marginTop: 64,
    width: 64,
  },
}));

export default PasswordResetScreen;