import { Fragment } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativePlugin from 'dayjs/plugin/relativeTime';
import {
  Button, Card, CardContent, CardHeader, CardTitle, Separator, Text,
} from '@/components/ui';
import {
  CalendarIcon, MoveRightIcon,
} from '@/lib/icons';
import type { Tables } from '@/types';

dayjs.extend(durationPlugin);
dayjs.extend(relativePlugin);

interface Props {
  data: Tables<'trips'>[];
}

const UpcomingTripsWidget: React.FC<Props> = ({ data }) => (
  <Card className="w-full">
    <CardHeader className="flex-row items-center gap-6">
      <CalendarIcon className="stroke-primary" />
      <CardTitle className="font-bold">Upcoming Trips</CardTitle>
    </CardHeader>
    <CardContent>
      {!data.length ? (
        <View style={{ justifyContent: 'center' }}>
          <Text className="text-center mb-6">
            You don't have any upcoming trips!
          </Text>
          <Link
            asChild
            href="/(protected)/(drawer)/planning"
            push>
            <Button
              className="mx-auto"
              variant="default">
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
                  className="!px-0"
                  variant="ghost">
                  <View className="flex-row justify-between items-center w-full">
                    <View className="flex-row items-center gap-3">
                      <MoveRightIcon className="stroke-primary" />
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
              {index < data.length - 1 && <Separator className="my-2" />}
            </Fragment>
          ))}
        </View>
      )}
    </CardContent>
  </Card>
);

export default UpcomingTripsWidget;