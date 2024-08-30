import React, { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Box, Button, ButtonIcon, ButtonText, Card, Center, Text, VStack } from '@/components/ui';
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
            <Center>
              <Image
                contentFit="contain"
                placeholder={blurhash}
                source={require('../../assets/gear-closet-icon.png')}
                style={styles.icon} />
              <Text
                size="lg"
                style={styles.tagline}>
                Sign up or log in to get started
              </Text>
              <VStack space="md">
                <Button
                  action="secondary"
                  size="lg"
                  variant="outline">
                  <ButtonIcon
                    as={AppleIcon}
                    className="mr-8" />
                  <ButtonText>Continue with Apple</ButtonText>
                </Button>
                <Button
                  action="secondary"
                  size="lg"
                  variant="outline">
                  <ButtonIcon
                    as={GoogleIcon}
                    className="mr-8"
                    size="lg" />
                  <ButtonText>Continue with Google</ButtonText>
                </Button>
                <Button
                  action="secondary"
                  size="lg"
                  variant="outline">
                  <ButtonIcon
                    as={FacebookIcon}
                    className="mr-8"
                    size="lg" />
                  <ButtonText>Continue with Facebook</ButtonText>
                </Button>
                <Box style={styles.divider}>
                  <Box style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <Box style={styles.dividerLine} />
                </Box>
                <Link
                  asChild
                  href="/modal">
                  <Button
                    action="primary"
                    size="lg"
                    variant="solid">
                    <ButtonText>Continue with email</ButtonText>
                  </Button>
                </Link>
                <Text
                  size="xs"
                  style={styles.smallPrint}>
                  By continuing to use GearCloset, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </VStack>
            </Center>
          </Card>
        </ScreenWrapper>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  card: {
    padding: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    borderTopWidth: 5,
    borderTopColor: theme.colors.primary[400],
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
    backgroundColor: theme.colors.background.dark,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.colors.typography[400],
    fontSize: 16,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  smallPrint: {
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 16,
    color: theme.colors.typography[950],
  },
  tagline: {
    color: theme.colors.typography[700],
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    alignItems: 'center',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;