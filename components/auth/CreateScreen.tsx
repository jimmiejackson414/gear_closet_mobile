import { useState } from 'react';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Text, TextInput } from 'react-native-paper';
import { toast } from 'sonner-native';
import { z } from 'zod';
import FormInput from '@/components/common/FormInput';
import { useAuthScreenContext } from '@/context/AuthScreenProvider';
import { useSupabase } from '@/context/SupabaseProvider';
import { makeStyles } from '@/helpers';

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
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useSupabase();
  const {
    setSubmitting, storedEmail, submitting,
  } = useAuthScreenContext();

  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: { password: '', passwordConfirm: '' },
  });

  const { control, handleSubmit } = form;

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

  const styles = useStyles();
  return (
    <FormProvider {...form}>
      <View style={styles.center}>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <Text style={{ marginVertical: 8 }}>Create your password</Text>
        <View style={{ width: '100%' }}>
          <FormInput
            autoComplete="password"
            autoFocus
            control={control}
            disabled={submitting}
            label="Password"
            name="password"
            placeholder="Enter your password"
            right={
              <TextInput.Icon icon={({ size }) =>
                !showPassword ? (
                  <EyeIcon
                    height={size}
                    onPress={() => setShowPassword(prev => !prev)}
                    width={size} />
                ) : (
                  <EyeOffIcon
                    height={size}
                    onPress={() => setShowPassword(prev => !prev)}
                    width={size} />
                )
              } />
            }
            secureTextEntry={!showPassword}
            type="password" />
          <FormInput
            autoComplete="password"
            control={control}
            disabled={submitting}
            label="Confirm Password"
            name="passwordConfirm"
            placeholder="Confirm your password"
            right={
              <TextInput.Icon icon={({ size }) =>
                !showPassword ? (
                  <EyeIcon
                    height={size}
                    onPress={() => setShowPassword(prev => !prev)}
                    width={size} />
                ) : (
                  <EyeOffIcon
                    height={size}
                    onPress={() => setShowPassword(prev => !prev)}
                    width={size} />
                )
              } />
            }
            secureTextEntry={!showPassword}
            type="password" />
          <Button
            disabled={submitting}
            loading={submitting}
            mode="contained"
            onPress={handleSubmit(onSignUp)}
            style={{ marginTop: 8 }}>
            Create Account
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

export default CreateScreen;