import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LockKeyhole } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { useSupabase } from '@/context/SupabaseProvider';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { supabase } from '@/lib/supabase';
import { Button, ButtonText, Center, Text, VStack } from '@/components/ui';
import FormInput from '@/components/common/FormInput';
import CodeInput from '@/components/common/CodeInput';

const passwordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters.'),
  passwordConfirm: z.string()
    .min(6, 'Password must be at least 6 characters.'),
})
  .refine((data) => data.password === data.passwordConfirm, {
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

  const { handleSubmit, watch } = form;
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

  return (
    <Center>
      <Image
        contentFit="contain"
        source={require('../../assets/gear-closet-icon.png')}
        style={styles.icon} />
      <Animated.View style={animatedStyle}>
        {step === 1 && (
          <VStack
            className="w-full justify-center"
            space="lg">
            <Text className="mb-4 text-center justify-self-center">Please enter your code</Text>
            <CodeInput
              length={6}
              onChangeCode={setResetCode} />
            <Button onPress={handleVerifyCode}>
              <ButtonText>Verify Code</ButtonText>
            </Button>
          </VStack>
        )}
        {step === 2 && (
          <FormProvider {...form}>
            <VStack
              className="w-full justify-center"
              space="lg">
              <Text className="mb-8">Enter your new password</Text>
              <FormInput
                autoComplete="password-new"
                autoFocus
                icon={LockKeyhole}
                isDisabled={submitting}
                isRequired
                keyboardType="email-address"
                label="New password"
                name="password"
                type="password" />
              <FormInput
                icon={LockKeyhole}
                isDisabled={submitting}
                isRequired
                keyboardType="email-address"
                label="Confirm new password"
                name="passwordConfirm"
                type="password" />
              <Button
                isDisabled={submitting || !watchedFields.password || !watchedFields.passwordConfirm}
                onPress={handleSubmit(handleResetPassword)}>
                <ButtonText>Reset Password</ButtonText>
              </Button>
            </VStack>
          </FormProvider>
        )}
      </Animated.View>
    </Center>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 64,
    marginBottom: 8,
    marginTop: 64,
    width: 64,
  },
});

export default PasswordResetScreen;