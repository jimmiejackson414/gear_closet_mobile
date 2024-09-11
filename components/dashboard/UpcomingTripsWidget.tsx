import { StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativePlugin from 'dayjs/plugin/relativeTime';
import { Footprints } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Box, Button, ButtonText, Card, Divider, Icon, Text, VStack } from '@/components/ui';
import type { Tables } from '@/types';

dayjs.extend(durationPlugin);
dayjs.extend(relativePlugin);

interface Props {
  data: Tables<'trips'>[];
}

const UpcomingTripsWidget: React.FC<Props> = ({ data }) => {
  return (
    <Card
      size="lg"
      variant="elevated">
      <Box style={styles.header}>
        <Icon
          as={Footprints}
          className="mr-4"
          size="xl" />
        <Text
          bold
          size="lg">
          Upcoming Trips
        </Text>
      </Box>
      {!data.length ? (
        <VStack
          className="mt-8"
          space="lg">
          <Text className="text-center">
            You don't have any upcoming trips!
          </Text>
          <Button
            action="primary"
            className="mx-auto self-start"
            size="sm"
            variant="solid">
            <ButtonText>
              Get Started
            </ButtonText>
          </Button>
        </VStack>
      ) : (
        <Box style={styles.listContainer}>
          {data.map(( trip, index ) => (
            <Link
              asChild
              href="/(protected)/(drawer)/planning"
              key={trip.id}>
              <Button
                size="xs"
                style={styles.listItem}
                variant="link">
                <Text>
                  {trip.name}
                </Text>
                <Text>
                  {dayjs()
                    .to(dayjs(trip.starting_date))}
                </Text>
                {index < data.length - 1 && <Divider className="my-4" />}
              </Button>
            </Link>
          ))}
        </Box>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  listContainer: { marginTop: 16 },
  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default UpcomingTripsWidget;