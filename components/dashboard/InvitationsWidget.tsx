import { Fragment } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { CalendarCheckIcon, ChevronRightIcon } from 'lucide-react-native';
import { Button, Card, Divider, Icon, Text, useTheme } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'trip_friends'>[];
}

const InvitationsWidget: React.FC<Props> = ({ data }) => {
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Card
      mode="elevated"
      style={{ marginHorizontal: 1 }}
      theme={{ colors: { elevation: { level1: theme.colors.onPrimary } } }}>
      <Card.Title
        left={props => (
          <Icon
            {...props}
            source={() => (
              <CalendarCheckIcon
                color={theme.colors.primary}
                size={20} />
            )} />
        )}
        leftStyle={{ marginRight: 0 }}
        title="Invitations"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant='bodyLarge' />
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
                          source={() => (
                            <ChevronRightIcon
                              size={16}
                              style={{ marginTop: 2 }} />
                          )} />
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