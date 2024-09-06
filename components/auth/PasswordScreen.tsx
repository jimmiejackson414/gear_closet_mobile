import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { LockKeyhole } from 'lucide-react-native';
import { Button, ButtonSpinner, ButtonText, Center, Text, VStack } from '@/components/ui';
import FormInput from '@/components/common/FormInput';
import theme from '@/lib/theme';

interface Props {
  onSubmit: (data: { password: string }) => void;
  onForgotPassword: () => void;
  submitting: boolean;
  errors: { [key: string]: { [key: string]: string } }
}

const passwordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters.'),
});

const PasswordScreen: React.FC<Props> = ({
  onSubmit, onForgotPassword, submitting, errors,
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const { handleSubmit } = form;

  const handleFormSubmit = () => {
    const { password } = form.getValues();
    onSubmit({ password });
  };

  useEffect(() => {
    if (errors.password?.message === 'Invalid password') {
      setShowForgotPassword(true);
      form.setError('password', { type: 'manual', message: 'Invalid password' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return (
    <FormProvider {...form}>
      <Center>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <Text className="mb-8">Enter your password</Text>
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
          <Button
            action="primary"
            className="mt-6"
            isDisabled={submitting}
            onPress={handleSubmit(handleFormSubmit)}
            size="lg"
            variant="solid">
            {submitting && <ButtonSpinner color={theme.colors.gray[400]} />}
            <ButtonText>Continue</ButtonText>
          </Button>
          {showForgotPassword && (
            <Button
              action="primary"
              onPress={onForgotPassword}
              size="md"
              variant="link">
              <ButtonText>Forgot password?</ButtonText>
            </Button>
          )}
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

export default PasswordScreen;