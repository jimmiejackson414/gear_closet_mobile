import { StyleSheet } from 'react-native';
import { CalendarCheck, ChevronRight } from 'lucide-react-native';
import { Fragment } from 'react';
import { Link } from 'expo-router';
import { Box, Button, Card, Divider, Icon, Text } from '@/components/ui';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'trip_friends'>[];
}

const InvitationsWidget: React.FC<Props> = ({ data }) => (
  <Card
    size="lg"
    variant="elevated">
    <Box style={styles.header}>
      <Icon
        as={CalendarCheck}
        size="xl" />
      <Text
        bold
        size="lg">
        Invitations
      </Text>
    </Box>
    {!data.length ? (
      <Text className="text-center">
        You don't have any pending invitations
      </Text>
    ) : (
      <Box style={styles.listContainer}>
        {data.map(( invitation, index ) => (
          <Fragment key={invitation.id}>
            <Link
              asChild
              href="/(protected)/(drawer)/planning"
              push>
              <Button
                key={invitation.id}
                size="xs"
                style={styles.listItem}
                variant="link">
                <Box style={{ flexDirection: 'row', gap: 8 }}>
                  <Icon
                    as={ChevronRight}
                    className="mt-0.5" />
                  <Text>
                    { `You've been invited by ${invitation.id} to join the ${invitation.trip_id} trip` }
                  </Text>
                </Box>
              </Button>
            </Link>
            {index < data.length - 1 && <Divider className="my-4" />}
          </Fragment>
        ))}
      </Box>
    )}
  </Card>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  listContainer: { marginTop: 16 },
  listItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default InvitationsWidget;