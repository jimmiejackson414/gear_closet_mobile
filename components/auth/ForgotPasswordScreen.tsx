import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { z } from 'zod';
import FormInput from '@/components/common/FormInput';
import { Button, H4, Text } from '@/components/ui';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { useSupabase } from '@/context/SupabaseProvider';
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
        <H4>
          Forgot Your Password?
        </H4>
        <Text style={{ marginVertical: 8 }}>
          Click submit to continue
        </Text>
        <View style={{ width: '100%' }}>
          <FormInput
            autoComplete="email"
            control={control}
            disabled={true}
            keyboardType="email-address"
            label="Email"
            name="email"
            placeholder="Enter your email" />
          <Button
            className="mt-6"
            disabled={submitting}
            loading={submitting}
            onPress={handleSubmit(onSubmitForgotPassword)}
            variant="default">
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