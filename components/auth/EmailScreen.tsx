import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { z } from 'zod';
import FormInput from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { P } from '@/components/ui/typography';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { useSupabase } from '@/context/SupabaseProvider';
import { makeStyles } from '@/helpers';

const emailSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address.'),
});

const EmailScreen: React.FC = () => {
  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const { checkForEmail } = useSupabase();
  const {
    setScreen, setStoredEmail, setSubmitting, submitting,
  } = useAuthScreenContext();

  const onCheckEmail = async () => {
    try {
      setSubmitting(true);
      const { email } = form.getValues();

      // check for existing email
      const emailExists = await checkForEmail(email);
      if (emailExists) {
        setStoredEmail(email);
        setScreen('password');
      } else {
        setScreen('create');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const { control, handleSubmit } = form;

  const styles = useStyles();
  return (
    <FormProvider {...form}>
      <View style={styles.center}>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <P className="py-2">Let's start with your email</P>
        <View style={{ width: '100%' }}>
          <FormInput
            autoComplete="email"
            // autoFocus
            control={control}
            disabled={submitting}
            keyboardType="email-address"
            label="Email"
            name="email"
            placeholder="Enter your email" />
          <Button
            className="mt-6"
            disabled={submitting}
            loading={submitting}
            onPress={handleSubmit(onCheckEmail)}
            variant="default">
            {/* <P className="text-primary-foreground"> */}
            Continue
            {/* </P> */}
          </Button>
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

export default EmailScreen;