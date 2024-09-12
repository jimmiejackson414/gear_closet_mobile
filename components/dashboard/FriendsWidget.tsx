import { StyleSheet } from 'react-native';
import { Users } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Avatar, AvatarFallbackText, AvatarImage, Box, Button, ButtonText, Card, Icon, Text, VStack } from '@/components/ui';
import type { ExtendedFriend } from '@/types/helpers';
import { buildImageSrc, initials } from '@/helpers';

interface Props {
  data: {
    friends: ExtendedFriend[];
    total: number;
  }
}

const FriendsWidget: React.FC<Props> = ({ data }) => (
  <Card
    size="lg"
    variant="elevated">
    <Box style={styles.header}>
      <Icon
        as={Users}
        size="xl" />
      <Text
        bold
        size="lg">
        {`Friends (${data.total})`}
      </Text>
    </Box>
    {!data.friends.length ? (
      <VStack
        className="mt-8"
        space="lg">
        <Text className="text-center">
          You connected with any friends yet!
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
        {data.friends.map(friend => (
          <Link
            asChild
            href="/(protected)/(drawer)/planning"
            key={friend.id}
            push>
            <Avatar
              className="bg-secondary-500"
              size="lg">
              <AvatarFallbackText className="text-white">
                {initials(friend.friend)}
              </AvatarFallbackText>
              <AvatarImage source={{ uri: buildImageSrc(friend.friend.image) }} />
            </Avatar>
          </Link>
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
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 16,
  },
});

export default FriendsWidget;