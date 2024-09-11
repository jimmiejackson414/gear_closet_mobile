import { StyleSheet } from 'react-native';
import { MessagesSquare } from 'lucide-react-native';
import { Box, Card, Icon, Text } from '@/components/ui';

const ForumsWidget = () => {
  return (
    <Card
      size="lg"
      variant="elevated">
      <Box style={styles.header}>
        <Icon
          as={MessagesSquare}
          size="xl" />
        <Text
          bold
          size="lg">
          Latest From The Community
        </Text>
      </Box>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
});

export default ForumsWidget;