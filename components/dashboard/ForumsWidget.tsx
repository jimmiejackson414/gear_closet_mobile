import { LockIcon, MessagesSquareIcon } from 'lucide-react-native';
import { Card, Icon, IconButton, Text, Tooltip, useTheme } from 'react-native-paper';
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
        leftStyle={{ marginRight: 0 }}
        right={props => (
          !isPaidMember ? (
            <Tooltip
              {...props}
              enterTouchDelay={100}
              leaveTouchDelay={100}
              title="Upgrade to access the forums">
              <IconButton
                icon={() => <LockIcon
                  color={theme.colors.onSurfaceVariant}
                  size={15} />}
                size={15} />
            </Tooltip>
          ) : null
        )}
        title="Latest From The Community"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant="bodyLarge" />
      <Card.Content>
        {!data ? (
          <Text style={{ textAlign: 'center' }}>
            An error occurred while fetching from the forums.
          </Text>
        ) : (
          <View>
            {data.latest_posts.map(post => (
              <View
                key={post.id}
                style={{ marginBottom: 24, gap: 16 }}>
                <ForumPost post={post} />
              </View>
            ))}
            <View style={{ gap: 16, flexDirection: 'row' }}>
              {data.categories.map(category => (
                <View
                  key={category.id}
                  style={{
                    alignItems: 'center', backgroundColor: `#${category.color}`, borderRadius: 24, flexDirection: 'row', gap: 8, padding: 8,
                  }}>
                  <View style={{
                    backgroundColor: `#${category.color}`, borderRadius: 24, height: 12, width: 12,
                  }} />
                  <View>
                    <Text style={{ color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}>
                      {category.name}
                    </Text>
                    <Text style={{ color: theme.colors.onSurfaceVariant }}>
                      {`${category.topic_count} topics`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default ForumsWidget;
