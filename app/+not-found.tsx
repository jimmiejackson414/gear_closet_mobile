import { Text } from 'react-native';
import ScreenWrapper from '@/components/common/ScreenWrapper';

export default function NotFound() {
  return (
    <ScreenWrapper>
      <Text>404</Text>
      <Text>This page could not be found.</Text>
    </ScreenWrapper>
  );
}