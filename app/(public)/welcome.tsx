import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, View } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import FacebookIcon from '@/assets/images/facebook.svg';
import GoogleIcon from '@/assets/images/google.svg';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Large, Muted, P, Small } from '@/components/ui/typography';
import { useSupabase } from '@/context/SupabaseProvider';
import { useAuthLayout, useLoading } from '@/hooks';
import type { Provider } from '@supabase/supabase-js';
// import AppleIcon from '@/assets/images/apple.svg';

const WelcomeScreen = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(opacity, {
        duration: 500,
        toValue: 1,
        useNativeDriver: true,
      })
        .start();
    }
  }, [imageLoaded, opacity]);

  const [submitting, setSubmitting] = useState(false);
  const { signInWithOAuth, authenticateWithBiometrics } = useSupabase();
  const handleOAuthSignin = async (provider: Provider) => {
    try {
      setSubmitting(true);
      await signInWithOAuth(provider);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // const handleBiometricAuth = useCallback(async () => {
  //   try {
  //     setSubmitting(true);
  //     await authenticateWithBiometrics();
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }, [authenticateWithBiometrics]);

  // useEffect(() => {
  //   handleBiometricAuth();
  // }, [handleBiometricAuth]);

  const { backgroundImage, loading } = useAuthLayout();
  useLoading(loading);

  return (
    <Animated.View style={{ opacity, flex: 1 }}>
      <ImageBackground
        className="flex-1"
        onLoad={() => setImageLoaded(true)}
        source={{ uri: backgroundImage }}>
        <ScreenWrapper
          contentContainerStyle={{
            justifyContent: 'center', flexGrow: 1, padding: 8,
          }}
          withScrollView={false}>
          <Card className="p-6 border-0 w-full max-w-sm rounded-2xl bg-background">
            <CardContent>
              <View className="w-full justify-center items-center">
                <Image
                  contentFit="contain"
                  source={require('../../assets/gear-closet-icon.png')}
                  style={{
                    height: 64, width: 64, marginBottom: 8,
                  }} />
                <Large className="mb-4 text-center">
                  Sign up or log in to get started
                </Large>
                <View className="gap-4">
                  {/* Note: Re-add once purchase of Apple Developer account is complete */}
                  {/* <Button
                  disabled={submitting}
                  onPress={() => handleOAuthSignin('apple')}
                  size="lg"
                  variant="outline">
                  <ButtonIcon
                    as={AppleIcon}
                    className="mr-8" />
                  {submitting && <ButtonSpinner color={theme.colors.gray[400]} />}
                  <ButtonText>Continue with Apple</ButtonText>
                </Button> */}
                  <Button
                    disabled={submitting}
                    loading={submitting}
                    onPress={() => handleOAuthSignin('google')}
                    variant="secondary">
                    <View className="flex gap-4 flex-row items-center">
                      <GoogleIcon
                        height={16}
                        width={16} />
                      <P>Continue with Google</P>
                    </View>
                  </Button>
                  <Button
                    disabled={submitting}
                    loading={submitting}
                    onPress={() => handleOAuthSignin('facebook')}
                    variant="secondary">
                    <View className="flex gap-4 flex-row items-center">
                      <FacebookIcon
                        height={16}
                        width={16} />
                      <P>Continue with Facebook</P>
                    </View>
                  </Button>
                  <View className="items-center flex-row my-4">
                    <View className="bg-muted-foreground flex-1 h-px" />
                    <Small className="mx-4">or</Small>
                    <View className="bg-muted-foreground flex-1 h-px" />
                  </View>
                  <Link
                    asChild
                    href="/modal">
                    <Button variant="outline">
                      <P>Continue with email</P>
                    </Button>
                  </Link>
                  <Muted className="mt-4 text-center">
                    By continuing to use GearCloset, you agree to our Terms of Service and Privacy Policy.
                  </Muted>
                </View>
              </View>
            </CardContent>
          </Card>
        </ScreenWrapper>
      </ImageBackground>
    </Animated.View>
  );
};

export default WelcomeScreen;