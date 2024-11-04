import { createElement } from 'react';
import { View } from 'react-native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Image } from 'expo-image';
import AmexIcon from '@/assets/cards/amex.svg';
import DinersIcon from '@/assets/cards/diners.svg';
import DiscoverIcon from '@/assets/cards/discover.svg';
import JcbIcon from '@/assets/cards/jcb.svg';
import MastercardIcon from '@/assets/cards/mastercard.svg';
import VisaIcon from '@/assets/cards/visa.svg';
import ScreenWrapper from '@/components/common/ScreenWrapper';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Button, Large, List, ListItem, Muted, P, Text } from '@/components/ui';
import { capitalize, formatDisplayText, makeStyles } from '@/helpers';
import { useErrorHandling, useLoading } from '@/hooks';
import { BADGE_COLOR_MAP } from '@/lib/constants';
import { CreditCardIcon } from '@/lib/icons';
import { useProfile, useSubscription } from '@/services/profile';
import type { SubscriptionLevel } from '@/types';
import type { SvgProps } from 'react-native-svg';

dayjs.extend(utc);

const cardBrandIcons: { [key: string]: React.FC<SvgProps> } = {
  american_express: AmexIcon,
  cartes_bancaires: CreditCardIcon,
  diners_club: DinersIcon,
  discover: DiscoverIcon,
  eftpos_australia: CreditCardIcon,
  interac: CreditCardIcon,
  jcb: JcbIcon,
  mastercard: MastercardIcon,
  union_pay: CreditCardIcon,
  visa: VisaIcon,
  other: CreditCardIcon,
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
              <Large className="mb-2 font-bold">
                Current Subscription
              </Large>
              {subscriptionData ? (
                <Badge
                  className="mb-4 flex-start"
                  variant={BADGE_COLOR_MAP[data?.subscriptions[0]?.prices?.identifier as SubscriptionLevel]}>
                  <Text>
                    {` ${capitalize(subscriptionData?.subscriptions[0]?.items?.data[0]?.price?.nickname)}`}
                  </Text>
                </Badge>
              ) : (
                null
              )}
              
            </View>
            <Button
              onPress={handleManageSubscription}
              variant="outline">
              Manage Subscription
            </Button>
          </View>
          <View>
            <Large className="mb-2 font-bold">
              Payment Methods
            </Large>
            <List>
              {subscriptionData?.paymentMethods.map(method => (
                <View
                  key={method.id}
                  style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16,
                  }}>
                  <ListItem
                    icon={createElement(cardBrandIcons[method.card?.brand || 'other'])}
                    subText={`Ending in ${method.card?.last4}`}
                    text={formatDisplayText(method.card?.display_brand)} />
                  {method.id === subscriptionData?.customer?.invoice_settings.default_payment_method ? (
                    <Badge variant="secondary">
                      <Muted>
                        Default
                      </Muted>
                    </Badge>
                  ) : null}
                </View>
              ))}
            </List>
          </View>
          <View>
            <Large className="mb-2 font-bold">
              Next Bililng Date
            </Large>
            <P>
              {subscriptionData?.nextBillingDate ? dayjs.utc(subscriptionData.nextBillingDate * 1000)
                .format('MMM DD, YYYY') : 'N/A'}
            </P>
          </View>
          <View>
            <Accordion
              className="w-full"
              collapsible
              defaultValue={'billing-history'}
              type="single">
              <AccordionItem value="billing-history">
                <AccordionTrigger>
                  <Large className="font-bold">Billing History</Large>
                </AccordionTrigger>
                <AccordionContent>
                  <List>
                    {subscriptionData?.invoices.map(invoice => (
                      <ListItem
                        hasBorder={false}
                        key={invoice.id}
                        subText={dayjs.utc(invoice.created * 1000)
                          .format('MMM DD, YYYY')}
                        text={`$${(invoice.amount_paid / 100).toFixed(2)} (${invoice.lines.data[0].plan?.nickname || '--'} Plan)`} />
                    ))}
                  </List>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* <Button
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
            )} */}
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