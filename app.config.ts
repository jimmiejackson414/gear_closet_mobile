import { ConfigContext, ExpoConfig } from '@expo/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'gear_closet_mobile',
  slug: 'gear-closet-mobile',
  plugins: [
    [
      'react-native-fbsdk-next',
      {
        'appID': process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
        'clientToken': process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN,
        'displayName': 'Gear Closet',
        'isAutoInitEnabled': true,
      },
    ],
    [
      'expo-router',
      { 'origin': process.env.EXPO_PUBLIC_FORUMS_URL },
    ],
  ],
});