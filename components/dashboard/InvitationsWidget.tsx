import { StyleSheet } from 'react-native';
import { CalendarCheck } from 'lucide-react-native';
import { Box, Card, Icon, Text } from '@/components/ui';
import type { Tables } from '@/types';

interface Props {
  data?: Tables<'trip_friends'>[];
}

const InvitationsWidget: React.FC<Props> = () => {
  return (
    <Card
      size="lg"
      variant="elevated">
      <Box style={styles.header}>
        <Icon
          as={CalendarCheck}
          className="mr-4"
          size="xl" />
        <Text
          bold
          size="lg">
          Invitations
        </Text>
      </Box>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default InvitationsWidget;