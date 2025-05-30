import { Fragment } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativePlugin from 'dayjs/plugin/relativeTime';
import { FootprintsIcon, MoveRightIcon } from 'lucide-react-native';
import { Button, Card, Divider, Icon, Text } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import type { Tables } from '@/types';

dayjs.extend(durationPlugin);
dayjs.extend(relativePlugin);

interface Props {
  data: Tables<'trips'>[];
}

const UpcomingTripsWidget: React.FC<Props> = ({ data }) => {
  const styles = useStyles();
  const theme = useAppTheme();

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
              <FootprintsIcon
                color={theme.colors.primary}
                size={20} />
            )} />
        )}
        leftStyle={{ marginRight: 0 }}
        title="Upcoming Trips"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant="bodyLarge" />
      <Card.Content>
        {!data.length ? (
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center' }}>
              You don't have any upcoming trips!
            </Text>
            <Link
              asChild
              href="/(protected)/(drawer)/planning"
              push>
              <Button mode="contained">
                Get Started
              </Button>
            </Link>
          </View>
        ) : (
          <View>
            {data.map((trip, index) => (
              <Fragment key={trip.id}>
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
                            <MoveRightIcon
                              size={16}
                              style={{ marginTop: 2 }} />
                          )} />
                        <Text>
                          {trip.name}
                        </Text>
                      </View>
                      <Text>
                        {`Begins ${dayjs()
                          .to(dayjs(trip.starting_date))}`}
                      </Text>
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

export default UpcomingTripsWidget;