import { View } from 'react-native';
import { Card, Icon, IconButton, Text, Tooltip } from 'react-native-paper';
import { useAppTheme } from '@/hooks';
import { useIsPaidMember } from '@/services/profile';
import ForumPost from './ForumPost';
import type { ForumResponse } from '@/services/dashboard';

interface Props {
  data?: ForumResponse | null;
}

const ForumsWidget: React.FC<Props> = ({ data }) => {
  const { data: isPaidMember } = useIsPaidMember();

  const theme = useAppTheme();
  return (
    <Card
      mode="elevated"
      style={{ marginHorizontal: 1 }}
      theme={{ colors: { elevation: { level1: theme.colors.onPrimary } } }}>
      <Card.Title
        left={props => (
          <Icon
            {...props}
            color={theme.colors.primary}
            size={20}
            source="forum-outline" />
        )}
        leftStyle={{ marginRight: 0 }}
        right={() => (
          !isPaidMember ? (
            <Tooltip
              enterTouchDelay={100}
              leaveTouchDelay={100}
              title="Upgrade to access the forums">
              <IconButton
                icon="lock"
                iconColor={theme.colors.outline}
                size={20} />
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
