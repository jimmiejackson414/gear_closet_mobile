import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LockKeyhole, Mail, X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  Text,
  VStack } from '@/components/ui';
import FormInput from '@/components/common/FormInput';
import { useSupabase } from '@/context/SupabaseProvider';

const formSchema = z.object({ email: z.string().email('Please enter a valid email address.') });

const Modal = () => {
  const [submitting, setSubmitting] = useState(false);

  const navigation = useNavigation();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });
  const { signInWithPassword } = useSupabase();

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const { email } = form.getValues();
      // await signInWithPassword(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
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
        <Center>
          <Image
            contentFit="contain"
            placeholder={blurhash}
            source={require('../../assets/gear-closet-icon.png')}
            style={styles.icon} />
          <Text className="mb-8">Let's start with email</Text>
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
              placeholder="Enter your email"
              rules={{ required: 'Email is required' }} />
            {/* <FormInput
              autoComplete="password"
              icon={LockKeyhole}
              isDisabled={submitting}
              isRequired
              keyboardType="default"
              label="Password"
              name="password"
              placeholder="Enter your password"
              rules={{ required: 'Email is required' }}  /> */}
            <Button
              action="primary"
              className="mt-6"
              isDisabled={submitting}
              onPress={form.handleSubmit(onSubmit)}
              size="lg"
              variant="solid">
              <ButtonText>Continue</ButtonText>
            </Button>
          </VStack>
        </Center>
      </Box>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  icon: {
    height: 64,
    marginBottom: 8,
    marginTop: 64,
    width: 64,
  },
  modal: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 120,
  },
});

export default Modal;