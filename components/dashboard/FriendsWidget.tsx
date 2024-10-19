import { View } from 'react-native';
import { Link } from 'expo-router';
import { Button, Card, Icon, Text } from 'react-native-paper';
import UserAvatar from '@/components/common/UserAvatar';
import { useAppTheme } from '@/hooks';
import type { ExtendedFriend } from '@/types/helpers';

interface Props {
  data: {
    friends: ExtendedFriend[];
    total: number;
  }
}

const FriendsWidget: React.FC<Props> = ({ data }) => {
  const theme = useAppTheme();

  return (
    <Card
      mode="elevated"
      style={{ marginHorizontal: 1 }}
      theme={{ colors: { elevation: { level1: theme.colors.onPrimary } } }}>
      <Card.Title
        left={() => (
          <Icon
            color={theme.colors.primary}
            size={24}
            source="account-multiple-outline" />
        )}
        leftStyle={{ marginRight: 0 }}
        title={`Friends (${data.total})`}
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant='bodyLarge' />
      <Card.Content>
        {!data.friends.length ? (
          <View>
            <Text style={{ textAlign: 'center' }}>
              You haven't connected with any friends yet!
            </Text>
            <Link
              asChild
              href="/(protected)/(drawer)/friends"
              push>
              <Button mode="contained">
                Get Started
              </Button>
            </Link>
          </View>
        ) : (
          <View style={{ alignItems: 'flex-start' }}>
            {data.friends.map(friend => (
              <Link
                asChild
                href="/(protected)/(drawer)/friends"
                key={friend.id}
                push>
                <UserAvatar profile={friend.friend} />
              </Link>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default FriendsWidget;