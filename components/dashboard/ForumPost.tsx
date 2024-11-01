import { View } from 'react-native';
import { A } from '@expo/html-elements';
import dayjs from 'dayjs';
import { Muted, Text } from '@/components/ui';
import { makeStyles, truncate } from '@/helpers';
import { useIsPaidMember } from '@/services/profile';
import type { ForumPost as ForumPostType } from '@/services/dashboard';

interface Props {
  post: ForumPostType;
}

const ForumPost: React.FC<Props> = ({ post }) => {
  const { data: isPaidMember } = useIsPaidMember();
  const forumsUrl = process.env.EXPO_PUBLIC_FORUMS_URL;

  const styles = useStyles();
  return (
    <A
      href={isPaidMember ? `${forumsUrl}/${post.topic_slug}` : undefined}
      style={{ width: '100%' }}>
      <View className="flex-row items-start gap-1 w-full">
        <View style={[ styles.categoryColor, { backgroundColor: `#${post.category_color}` } ]} />
        <View style={{ flexDirection: 'column' }}>
          <Text className="font-bold">
            {truncate(post.topic_title, 40)}
          </Text>
          <Text>
            {truncate(post.raw, 50)}
          </Text>
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Muted>
              {dayjs(post.created_at)
                .format('MMM DD, YYYY')}
            </Muted>
            <Muted>
              {post.reply_count}
              {' '}
              replies
            </Muted>
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
}));

export default ForumPost;