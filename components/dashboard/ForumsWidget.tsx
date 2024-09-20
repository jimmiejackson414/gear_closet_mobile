import { LockIcon, MessagesSquareIcon } from 'lucide-react-native';
import { Button, Card, Icon, IconButton, Text, Tooltip, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import ForumPost from './ForumPost';
import { ForumResponse } from '@/services/dashboard/types';
import useAppStore from '@/stores/appStore';

interface Props {
  data?: ForumResponse | null;
}

const ForumsWidget: React.FC<Props> = ({ data }) => {
  const isPaidMember = useAppStore(state => state.isPaidMember());

  const theme = useTheme();
  return (
    <Card
      mode="elevated"
      style={{ marginHorizontal: 1 }}
      theme={{ colors: { elevation: { level1: theme.colors.onPrimary } } }}>
      <Card.Title
        left={props => (
          <Icon
            {...props}
            source={() => (
              <MessagesSquareIcon
                color={theme.colors.primary}
                size={20} />
            )} />
        )}
        right={props => (
          <Tooltip
            {...props}
            enterTouchDelay={100}
            leaveTouchDelay={100}
            title="Upgrade to access the forums">
            <IconButton
              icon={() => <LockIcon
                color={theme.colors.onSurfaceVariant}
                size={18} />}
              size={14} />
          </Tooltip>
        )}
        title="Latest From The Community"
        titleStyle={{ fontWeight: 'bold' }}
        titleVariant="bodyLarge" />
      <Card.Content>
        {!data ? (
          <Text style={{ marginTop: 16, textAlign: 'center' }}>
            An error occurred while fetching from the forums.
          </Text>
        ) : (
          <View style={{ marginTop: 24 }}>
            {data.latest_posts.map(post => (
              <View
                key={post.id}
                style={{ marginBottom: 24, gap: 16 }}>
                <ForumPost post={post} />
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default ForumsWidget;
