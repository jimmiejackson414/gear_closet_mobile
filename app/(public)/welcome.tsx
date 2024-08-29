import React, { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Card, Text } from '@/components/ui';
// import { Button, Card, Text } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useAuthLayout } from '@/hooks';
import theme from '@/lib/theme';
import AppleIcon from '@/assets/images/apple.svg';
import GoogleIcon from '@/assets/images/google.svg';
import FacebookIcon from '@/assets/images/facebook.svg';

const WelcomeScreen = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const {
    backgroundImage, loading,
  } = useAuthLayout();

  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [imageLoaded, opacity]);

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
    <Animated.View
      style={[styles.background, { opacity }]}>
      <ImageBackground
        onLoad={() => setImageLoaded(true)}
        source={{ uri: backgroundImage }}
        style={styles.background}>
        <ScreenWrapper contentContainerStyle={styles.content}>
          <Card
            size="lg"
            variant="glass">
            <Text>Welcome Page</Text>
          </Card>
          {/* <Card
            elevation={5}
            style={styles.card}>
            <View style={styles.title}>
              <Image
                contentFit="contain"
                placeholder={blurhash}
                source={require('../../assets/gear-closet-icon.png')}
                style={styles.icon} />
              <Text
                style={styles.tagline}
                variant="titleMedium">
                Sign up or log in to get started
              </Text>
            </View>
            <View style={styles.buttons}>
              <Button
                icon={() => <AppleIcon
                  fill={'black'}
                  height={18}
                  width={18} />}
                mode="outlined"
                style={styles.button}
                textColor={theme.colors.fontColor}>
                Continue with Apple
              </Button>
              <Button
                icon={() => <GoogleIcon
                  height={18}
                  width={18} />}
                mode="outlined"
                style={styles.button}
                textColor={theme.colors.fontColor}>
                Continue with Google
              </Button>
              <Button
                icon={() => <FacebookIcon
                  height={28}
                  width={28} />}
                mode="outlined"
                style={styles.button}
                textColor={theme.colors.fontColor}>
                Continue with Facebook
              </Button>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
              <Link
                asChild
                href="/signin">
                <Button mode="contained">Continue with email</Button>
              </Link>
              <Text
                style={styles.smallPrint}
                variant="bodySmall">
                By continuing to use GearCloset, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>
          </Card> */}
        </ScreenWrapper>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  button: { borderColor: theme.colors.outline },
  buttons: { gap: 16 },
  card: {
    padding: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    borderTopWidth: 5,
    borderTopColor: theme.colors.primary,
  },
  content: {
    padding: 8,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outline,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.colors.fontColor,
    fontSize: 16,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  smallPrint: {
    fontWeight: '200',
    textAlign: 'center',
    marginTop: 16,
  },
  tagline: {
    maxWidth: '40%',
    textAlign: 'center',
  },
  title: {
    alignItems: 'center',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;