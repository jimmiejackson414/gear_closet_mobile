import { Fragment } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { Button, Card, Divider, Icon, Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeProvider';
import { makeStyles } from '@/helpers';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'trip_friends'>[];
}

const InvitationsWidget: React.FC<Props> = ({ data }) => {
  const { theme } = useAppTheme();
  const styles = useStyles();

  return (
    <Card
      elevation={0}
      mode="elevated"
      style={{ backgroundColor: theme.colors.onPrimary }}>
      <Card.Title
        left={() => (
          <Icon
            color={theme.colors.primary}
            size={24}
            source="mailbox-open-outline" />
        )}
        leftStyle={{ marginRight: 0 }}
        title="Invitations"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant="bodyLarge" />
      <Card.Content>
        {!data.length ? (
          <View>
            <Text style={{ textAlign: 'center' }}>
              You don't have any pending invitations
            </Text>
          </View>
        ) : (
          <View>
            {data.map(( invitation, index ) => (
              <Fragment key={invitation.id}>
                <Link
                  asChild
                  href="/(protected)/(drawer)/planning"
                  push>
                  <Button
                    mode="text"
                    style={styles.listItem}>
                    <View style={styles.itemContainer}>
                      <View style={styles.leftContainer}>
                        <Icon
                          size={16}
                          source="chevron-right" />
                        <Text>
                          { `You've been invited by ${invitation.id} to join the ${invitation.trip_id} trip` }
                        </Text>
                      </View>
                    </View>
                  </Button>
                </Link>
                {index < data.length - 1 && <Divider style={{ marginVertical: 8 }} />}
              </Fragment>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
}));

export default InvitationsWidget;