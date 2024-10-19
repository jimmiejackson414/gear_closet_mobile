import { useState } from 'react';
import { View } from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Image } from 'expo-image';
import { Button, Chip, List, Text } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { capitalize, formatDisplayText, getBadgeColor, makeStyles } from '@/helpers';
import { useAppTheme, useErrorHandling, useLoading } from '@/hooks';
import { useProfile, useSubscription } from '@/services/profile';
import type { SubscriptionLevel } from '@/types';

dayjs.extend(utc);

const cardBrandIcons: { [key: string]: string } = {
  american_express: 'cc-amex',
  cartes_bancaires: 'credit-card',
  diners_club: 'cc-diners-club',
  discover: 'cc-discover',
  eftpos_australia: 'credit-card',
  interac: 'credit-card',
  jcb: 'cc-jcb',
  mastercard: 'cc-mastercard',
  union_pay: 'credit-card',
  visa: 'cc-visa',
  other: 'credit-card',
};

const SubscriptionContent = () => {
  const {
    data, error, isLoading,
  } = useProfile();

  const {
    data: subscriptionData,
    error: subscriptionError,
    isLoading: subscriptionLoading,
  } = useSubscription();

  useErrorHandling(error || subscriptionError, 'Failed to fetch profile data');
  useLoading(isLoading || subscriptionLoading);

  const handleManageSubscription = () => {
    console.log('Manage Subscription');
  };

  const [expanded, setExpanded] = useState(false);
  const theme = useAppTheme();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ScreenWrapper>
        <Image
          contentFit="contain"
          source={require('../../assets/gear-closet-icon.png')}
          style={styles.icon} />
        <View style={{ gap: 36 }}>
          <View>
            <View style={{
              display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'space-between', alignItems: 'center',
            }}>
              <Text
                style={[ styles.header, { marginBottom: 8 } ]}
                variant="bodyLarge">
                Current Subscription
              </Text>
              {subscriptionData ? (
                <Chip style={{
                  marginBottom: 16, alignSelf: 'flex-start', backgroundColor: getBadgeColor(data?.subscriptions[0]?.prices?.identifier as SubscriptionLevel, theme).background,
                }}>
                  {` ${capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname)}`}
                </Chip>
              ) : (
                null
              )}
              
            </View>
            <Button
              compact
              mode="outlined"
              onPress={handleManageSubscription}>
              Manage Subscription
            </Button>
          </View>
          <View>
            <Text
              style={styles.header}
              variant="bodyLarge">
              Payment Methods
            </Text>
            {subscriptionData?.paymentMethods.map(method => (
              <View
                key={method.id}
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16,
                }}>
                <List.Item
                  description={`Ending in ${method.card?.last4}`}
                  left={({ color, style }) => (
                    <FontAwesome
                      color={color}
                      name={cardBrandIcons[method.card?.brand || 'other']}
                      size={36}
                      style={style} />
                  )}
                  title={formatDisplayText(method.card?.display_brand)} />
                {method.id === subscriptionData?.customer?.invoice_settings.default_payment_method ? (
                  <Chip
                    compact
                    textStyle={{
                      color: 'white', fontSize: 12, marginVertical: 2, marginHorizontal: 2,
                    }}>
                    Default
                  </Chip>
                ) : null}
              </View>
            ))}
          </View>
          <View>
            <Text
              style={styles.header}
              variant="bodyLarge">
              Next Bililng Date
            </Text>
            <Text variant="bodyMedium">
              {subscriptionData?.nextBillingDate ? dayjs.utc(subscriptionData.nextBillingDate * 1000)
                .format('MMM DD, YYYY') : 'N/A'}
            </Text>
          </View>
          <View>
            <Button
              contentStyle={{ flexDirection: 'row-reverse' }}
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              labelStyle={{ marginLeft: 0 }}
              mode="text"
              onPress={() => setExpanded(!expanded)}
              style={{ alignSelf: 'flex-start' }}>
              <Text
                style={styles.header}
                variant="bodyLarge">
                Billing History
              </Text>
            </Button>
            {expanded && (
              <View>
                {subscriptionData?.invoices.map(invoice => (
                  <List.Item
                    contentStyle={{ paddingLeft: 0 }}
                    description={dayjs.utc(invoice.created * 1000)
                      .format('MMM DD, YYYY')}
                    key={invoice.id}
                    title={`$${(invoice.amount_paid / 100).toFixed(2)} (${invoice.lines.data[0].plan?.nickname || '--'} Plan)`} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScreenWrapper>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: { fontWeight: 'bold' },
  icon: {
    height: 64,
    marginBottom: 24,
    marginHorizontal: 'auto',
    width: 64,
  },
}));

export default SubscriptionContent;