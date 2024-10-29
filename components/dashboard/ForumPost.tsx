import { View } from 'react-native';
import { A } from '@expo/html-elements';
import dayjs from 'dayjs';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeProvider';
import { makeStyles, truncate } from '@/helpers';
import { useIsPaidMember } from '@/services/profile';
import type { ForumPost as ForumPostType } from '@/services/dashboard';

interface Props {
  post: ForumPostType;
}

const ForumPost: React.FC<Props> = ({ post }) => {
  const { data: isPaidMember } = useIsPaidMember();
  const forumsUrl = process.env.EXPO_PUBLIC_FORUMS_URL;

  const { theme } = useAppTheme();
  const styles = useStyles();
  return (
    <A
      href={isPaidMember ? `${forumsUrl}/${post.topic_slug}` : undefined}
      style={{ width: '100%' }}>
      <View style={styles.content}>
        <View style={[ styles.categoryColor, { backgroundColor: `#${post.category_color}` } ]} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ fontWeight: 'bold', color: theme.colors.onSurfaceVariant }}>
            {truncate(post.topic_title, 40)}
          </Text>
          <Text>
            {truncate(post.raw, 50)}
          </Text>
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Text
              style={{ color: theme.colors.outline }}
              variant="bodySmall">
              {dayjs(post.created_at)
                .format('MMM DD, YYYY')}
            </Text>
            <Text
              style={{ color: theme.colors.outline }}
              variant="bodySmall">
              {post.reply_count}
              {' '}
              replies
            </Text>
          </View>
        </View>
      </View>
    </A>
  );
};

const useStyles = makeStyles(() => ({
  categoryColor: {
    height: 12,
    borderRadius: 24,
    width: 12,
    marginTop: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    width: '100%',
  },
}));

export default ForumPost;