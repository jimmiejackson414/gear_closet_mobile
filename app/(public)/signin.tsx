import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Animated, ImageBackground, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Button, Card, Text } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import FormInput from '@/components/ui/FormInput';
import { useAuthLayout } from '@/hooks';
import theme from '@/lib/theme';
import { useSupabase } from '@/context/SupabaseProvider';

type FormData = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Please enter at least 8 characters.')
    .max(64, 'Please enter fewer than 64 characters.'),
});

const SignIn = () => {
  const [submitting, setSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const {
    backgroundImage, loading,
  } = useAuthLayout();

  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [imageLoaded, opacity]);

  const { signInWithPassword } = useSupabase();
  const router = useRouter();

  const {
    control, handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setSubmitting(true);
      await signInWithPassword(data.email, data.password);
      router.replace('/home');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.content}>
        <Text>Loading...</Text>
      </ScreenWrapper>
    );
  }

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <Animated.View style={[styles.background, { opacity }]}>
      <ImageBackground
        onLoad={() => setImageLoaded(true)}
        source={{ uri: backgroundImage }}
        style={styles.background}>
        <ScreenWrapper contentContainerStyle={styles.content}>
          <Card
            elevation={5}
            style={styles.card}>
            <View style={styles.title}>
              <Image
                contentFit="contain"
                placeholder={blurhash}
                source={require('../../assets/gear-closet-icon.png')}
                style={styles.icon} />
            </View>
            <View style={styles.form}>
              <FormInput
                control={control}
                disabled={submitting}
                label="Email"
                name="email"
                placeholder={'john@gearcloset.com'}
                rules={{ required: true }}
                textContentType={'emailAddress'} />
              <FormInput
                control={control}
                disabled={submitting}
                label="Password"
                name="password"
                placeholder={'password123'}
                rules={{ required: true }}
                secureTextEntry={true}
                textContentType={'password'} />
              <Button
                disabled={submitting}
                mode="contained"
                onPress={handleSubmit(onSubmit)}>
                Sign In
              </Button>
            </View>
          </Card>
        </ScreenWrapper>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  form: { gap: 16 },
  card: {
    padding: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    borderTopWidth: 5,
    borderTopColor: theme.colors!.primary,
  },
  content: {
    padding: 8,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  title: {
    alignItems: 'center',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default SignIn;