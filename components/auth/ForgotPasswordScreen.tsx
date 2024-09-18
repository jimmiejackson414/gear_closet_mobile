import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image } from 'expo-image';
import { Mail } from 'lucide-react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { useSupabase } from '@/context/SupabaseProvider';
import FormInput from '@/components/common/FormInput';
import { makeStyles } from '@/helpers';

const emailSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address.'),
});

const ForgotPasswordScreen: React.FC = () => {
  const {
    storedEmail, submitting, setSubmitting, setScreen,
  } = useAuthScreenContext();
  const { sendPasswordReset } = useSupabase();

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: storedEmail },
  });

  const { control, handleSubmit } = form;

  const onSubmitForgotPassword = async () => {
    try {
      setSubmitting(true);
      const { email } = form.getValues();
      await sendPasswordReset(email);
      setScreen('passwordRecovery');

      // temporary
      setTimeout(() => {
        setScreen('passwordReset');
      }, 5000);
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = useStyles();
  return (
    <FormProvider {...form}>
      <View style={styles.center}>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <Text variant="headlineSmall">
          Forgot Your Password?
        </Text>
        <Text style={{ marginVertical: 8 }}>Click submit to continue</Text>
        <View style={{ width: '100%' }}>
          <FormInput
            autoComplete="email"
            control={control}
            disabled={true}
            keyboardType="email-address"
            label="Email"
            left={<TextInput.Icon icon={({ size }) => <Mail size={size} />} />}
            name="email"
            placeholder="Enter your email" />
          <Button
            disabled={submitting}
            loading={submitting}
            mode="contained"
            onPress={handleSubmit(onSubmitForgotPassword)}
            style={{ marginTop: 24 }}>
            Submit
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

export default ForgotPasswordScreen;