import { View } from 'react-native';
import { Link } from 'expo-router';
import UserAvatar from '@/components/common/UserAvatar';
import { Button, Card, CardContent, CardHeader, CardTitle, Text } from '@/components/ui';
import { UsersIcon } from '@/lib/icons';
import type { ExtendedFriend } from '@/types/helpers';

interface Props {
  data: {
    friends: ExtendedFriend[];
    total: number;
  }
}

const FriendsWidget: React.FC<Props> = ({ data }) => (
  <Card className="w-full">
    <CardHeader className="flex-row items-center gap-6">
      <UsersIcon className="stroke-primary" />
      <CardTitle className="font-bold">
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        Friends ({data.total})
      </CardTitle>
    </CardHeader>
    <CardContent>
      {!data.friends.length ? (
        <View>
          <Text style={{ textAlign: 'center' }}>
            You haven't connected with any friends yet!
          </Text>
          <Link
            asChild
            href="/(protected)/(drawer)/friends"
            push>
            <Button variant="default">
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
              <UserAvatar
                profile={friend.friend}
                size="size-20" />
            </Link>
          ))}
        </View>
      )}
    </CardContent>
  </Card>
);

export default FriendsWidget;