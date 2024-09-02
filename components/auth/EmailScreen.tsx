import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react-native';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { Button, ButtonSpinner, ButtonText, Center, Text, VStack } from '@/components/ui';
import FormInput from '@/components/common/FormInput';
import theme from '@/lib/theme';

interface Props {
  onSubmit: (data: { email: string }) => void;
  submitting: boolean;
}

const emailSchema = z.object({ email: z.string().email('Please enter a valid email address.') });

const EmailScreen: React.FC<Props> = ({
  onSubmit, submitting,
}) => {
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const handleFormSubmit = () => {
    const { email } = form.getValues();
    onSubmit({ email });
  };

  const { handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <Center>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <Text className="mb-8">Let's start with your email</Text>
        <VStack
          className="w-full"
          space="lg">
          <FormInput
            autoComplete="email"
            autoFocus
            icon={Mail}
            isDisabled={submitting}
            isRequired
            keyboardType="email-address"
            label="Email"
            name="email"
            placeholder="Enter your email" />
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

export default EmailScreen;