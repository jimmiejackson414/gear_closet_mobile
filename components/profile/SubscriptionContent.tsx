import { View } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { capitalize, makeStyles } from '@/helpers';
import { useAppTheme, useErrorHandling, useLoading } from '@/hooks';
import { useProfile, useSubscription } from '@/services/profile';

const SubscriptionContent = () => {
  const {
    data, error, isLoading,
  } = useProfile();

  const {
    data: subscriptionData,
    error: subscriptionError,
    isLoading: subscriptionLoading,
  } = useSubscription();
  console.log({ subscriptionError });

  useErrorHandling(error || subscriptionError, 'Failed to fetch profile data');
  useLoading(isLoading || subscriptionLoading);

  const theme = useAppTheme();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ScreenWrapper>
        <Text>
          Current Subscription:
          {capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname)}
        </Text>
      </ScreenWrapper>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    position: 'relative',
  },
}));

export default SubscriptionContent;