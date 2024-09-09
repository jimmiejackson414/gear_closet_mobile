import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { LockKeyhole } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { useSupabase } from '@/context/SupabaseProvider';
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
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { verifyResetCode } = useSupabase();

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { handleSubmit } = form;

  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const handleVerifyCode = async () => {
    setSubmitting(true);
    try {
      await verifyResetCode('', code);
      setStep(2);
    } catch (err) {
      toast.error('Invalid code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const router = useRouter();
  const handleResetPassword = async () => {
    const { password, confirmPassword } = form.getValues();
    try {
      if (password !== confirmPassword) {
        form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
        return;
      }

      setSubmitting(true);

      // update the user's password
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      // automatically log the user in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: '',
        password,
      });
      if (signInError) throw signInError;

      // navigate
      router.replace('/(protected)/(drawer)/home');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  };

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
              onChangeCode={setCode} />
            <Button onPress={handleVerifyCode}>
              <ButtonText>Verify Code</ButtonText>
            </Button>
          </VStack>
        )}
        {step === 2 && (
          <FormProvider {...form}>
            <FormInput
              autoComplete="password-new"
              autoFocus
              icon={LockKeyhole}
              isDisabled={submitting}
              isRequired
              keyboardType="email-address"
              label="New password"
              name="password" />
            <FormInput
              icon={LockKeyhole}
              isDisabled={submitting}
              isRequired
              keyboardType="email-address"
              label="Confirm new password"
              name="confirmPassword" />
            <Button onPress={handleSubmit(handleResetPassword)}>
              <ButtonText>Reset Password</ButtonText>
            </Button>
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