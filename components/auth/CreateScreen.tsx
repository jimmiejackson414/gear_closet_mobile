import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { LockKeyhole } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { Button, ButtonSpinner, ButtonText, Center, Text, VStack } from '@/components/ui';
import FormInput from '@/components/common/FormInput';
import theme from '@/lib/theme';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { useSupabase } from '@/context/SupabaseProvider';

const createSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters.'),
  passwordConfirm: z.string()
    .min(6, 'Password must be at least 6 characters.'),
})
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

const CreateScreen: React.FC = () => {
  const { signUp } = useSupabase();
  const {
    setSubmitting, storedEmail, submitting,
  } = useAuthScreenContext();

  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: { password: '', passwordConfirm: '' },
  });

  const { handleSubmit } = form;

  const onSignUp = async () => {
    try {
      setSubmitting(true);
      const { password } = form.getValues();
      await signUp(storedEmail, password);
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <Center>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <Text className="mb-8">Create your account</Text>
        <VStack
          className="w-full"
          space="lg">
          <FormInput
            autoComplete="password"
            autoFocus
            icon={LockKeyhole}
            isDisabled={submitting}
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password" />
          <FormInput
            autoComplete="password"
            icon={LockKeyhole}
            isDisabled={submitting}
            isRequired
            label="Confirm Password"
            name="passwordConfirm"
            placeholder="Confirm your password"
            type="password" />
          <Button
            action="primary"
            className="mt-6"
            isDisabled={submitting}
            onPress={handleSubmit(onSignUp)}
            size="lg"
            variant="solid">
            {submitting && <ButtonSpinner color={theme.colors.gray[400]} />}
            <ButtonText>Create Account</ButtonText>
          </Button>
        </VStack>
      </Center>
    </FormProvider>
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

export default CreateScreen;