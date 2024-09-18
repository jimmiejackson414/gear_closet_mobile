import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react-native';
import { Image } from 'expo-image';
import { toast } from 'sonner-native';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSupabase } from '@/context/SupabaseProvider';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
// import { Button, ButtonSpinner, ButtonText, Center, Text, VStack } from '@/components/ui';
import FormInput from '@/components/common/FormInput';
import { makeStyles } from '@/helpers';
// import theme from '@/lib/theme';

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
        <Text style={{ marginVertical: 8 }}>Let's start with your email</Text>
        <View style={{ width: '100%' }}>
          <FormInput
            autoComplete="email"
            autoFocus
            control={control}
            disabled={submitting}
            icon={Mail}
            keyboardType="email-address"
            label="Email"
            name="email"
            placeholder="Enter your email" />
          <Button
            disabled={submitting}
            loading={submitting}
            mode="contained"
            onPress={handleSubmit(onCheckEmail)}
            style={{ marginTop: 24 }}>
            Continue
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