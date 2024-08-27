import React from 'react';
import { Link } from 'expo-router';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Button, Card, Text } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { useAuthLayout } from '@/hooks';
import theme from '@/lib/theme';

const WelcomeScreen = () => {
  const {
    backgroundImage, loading, 
  } = useAuthLayout();

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
    <ImageBackground
      source={{ uri: backgroundImage }}
      style={styles.background}>
      <ScreenWrapper contentContainerStyle={styles.content}>
        <Card
          style={styles.card}
          elevation={5}>
          <View style={styles.title}>
            <Image
              placeholder={blurhash}
              contentFit="contain"
              source={require('../../assets/gear-closet-icon.png')}
              style={styles.icon} />
            <Text variant="headlineSmall">Gear Closet</Text>
            <Text variant="bodyMedium">
              The best place to plan hikes with your friends.
            </Text>
          </View>
          <View style={styles.buttons}>
            <Link
              href={'/signin'}
              asChild>
              <Button mode="contained">
                Log In
              </Button>
            </Link>
            <Link
              href={'/signup'}
              asChild>
              <Button mode="outlined">
                Register
              </Button>
            </Link>
          </View>
        </Card>
      </ScreenWrapper>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {flex: 1},
  buttons: {gap: 16},
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

export default WelcomeScreen;