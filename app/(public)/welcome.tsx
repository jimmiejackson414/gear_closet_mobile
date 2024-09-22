import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, View } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { Button, Surface, Text } from 'react-native-paper';
import FacebookIcon from '@/assets/images/facebook.svg';
import GoogleIcon from '@/assets/images/google.svg';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { Colors } from '@/constants/colors';
import { useSupabase } from '@/context/SupabaseProvider';
import makeStyles from '@/helpers/makeStyles';
import { useAuthLayout, useTheme } from '@/hooks';
import type { Provider } from '@supabase/supabase-js';
// import AppleIcon from '@/assets/images/apple.svg';

const WelcomeScreen = () => {
  const { colorScheme } = useTheme();
  const styles = useStyles({ colorScheme });

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
  const { signInWithOAuth } = useSupabase();
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

  const { backgroundImage, loading } = useAuthLayout();
  if (loading) {
    return (
      <ScreenWrapper contentContainerStyle={styles.content}>
        <Text>Loading...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <Animated.View style={[styles.background, { opacity }]}>
      <ImageBackground
        onLoad={() => setImageLoaded(true)}
        source={{ uri: backgroundImage }}
        style={styles.background}>
        <ScreenWrapper
          contentContainerStyle={styles.contentContainer}
          withScrollView={false}>
          <Surface style={styles.card}>
            <View style={styles.content}>
              <Image
                contentFit="contain"
                source={require('../../assets/gear-closet-icon.png')}
                style={styles.icon} />
              <Text
                style={styles.tagline}
                theme={{ colors: { onSurface: Colors.light.onSurface } }}
                variant="titleLarge">
                Sign up or log in to get started
              </Text>
              <View style={{ gap: 12 }}>
                {/* Note: Re-add once purchase of Apple Developer account is complete */}
                {/* <Button
                  action="secondary"
                  isDisabled={submitting}
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
                  dark={false}
                  disabled={submitting}
                  icon={({ size }) => (
                    <GoogleIcon
                      height={size}
                      width={size} />
                  )}
                  loading={submitting}
                  mode="contained"
                  onPress={() => handleOAuthSignin('google')}
                  textColor={Colors.light.onPrimary}>
                  Continue with Google
                </Button>
                <Button
                  dark={false}
                  disabled={submitting}
                  icon={({ size }) => (
                    <FacebookIcon
                      height={size}
                      width={size} />
                  )}
                  loading={submitting}
                  mode="contained"
                  onPress={() => handleOAuthSignin('facebook')}
                  textColor={Colors.light.onPrimary}>
                  Continue with Facebook
                </Button>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>
                <Link
                  asChild
                  href="/modal">
                  <Button
                    dark={true}
                    mode="outlined"
                    textColor={Colors.light.primary}>
                    Continue with email
                  </Button>
                </Link>
                <Text
                  style={styles.smallPrint}
                  theme={{ colors: { onSurface: Colors.light.onSurface } }}
                  variant="bodySmall">
                  By continuing to use GearCloset, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </View>
            </View>
          </Surface>
        </ScreenWrapper>
      </ImageBackground>
    </Animated.View>
  );
};

const useStyles = makeStyles(() => ({
  background: { flex: 1 },
  card: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: 26,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 16,
  },
  dividerLine: {
    backgroundColor: Colors.light.onSurface,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: Colors.light.onSurface,
    fontSize: 16,
    marginHorizontal: 16,
  },
  icon: {
    height: 64,
    marginBottom: 8,
    width: 64,
  },
  smallPrint: {
    fontWeight: '300',
    marginTop: 16,
    textAlign: 'center',
  },
  tagline: {
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    alignItems: 'center',
    marginBottom: 16,
    textAlign: 'center',
  },
}));

export default WelcomeScreen;