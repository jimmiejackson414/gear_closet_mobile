import { Card, Text } from '@/components/ui';
import type { Tables } from '@/types';

interface Props {
  data?: Tables<'friends'>[];
}

const FriendsWidget: React.FC<Props> = () => {
  return (
    <Card
      size="lg"
      variant="elevated">
      <Text>FriendsWidget</Text>
    </Card>
  );
};

export default FriendsWidget;