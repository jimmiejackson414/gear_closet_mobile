import { StyleSheet } from 'react-native';
import { Users } from 'lucide-react-native';
import { Box, Card, Icon, Text } from '@/components/ui';
import type { Tables } from '@/types';

interface Props {
  data?: Tables<'friends'>[];
}

const FriendsWidget: React.FC<Props> = () => {
  return (
    <Card
      size="lg"
      variant="elevated">
      <Box style={styles.header}>
        <Icon
          as={Users}
          className="mr-4"
          size="xl" />
        <Text
          bold
          size="lg">
          Friends
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

export default FriendsWidget;