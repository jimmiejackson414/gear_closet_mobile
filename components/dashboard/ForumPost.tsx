import { A } from '@expo/html-elements';
import dayjs from 'dayjs';
// import { Box, Text } from '../ui';
import { Text } from 'react-native-paper';
import useAppStore from '@/stores/appStore';
import { truncate } from '@/helpers';
import type { ForumPost as ForumPostType } from '@/services/dashboard/types';

interface Props {
  post: ForumPostType;
}

const ForumPost: React.FC<Props> = ({ post }) => {
  const isPaidMember = useAppStore(state => state.isPaidMember());
  const forumsUrl = process.env.EXPO_PUBLIC_FORUMS_URL;

  return (
    <Text>Forum Post</Text>
    // <A
    //   className="w-full"
    //   href={isPaidMember ? `${forumsUrl}/${post.topic_slug}` : undefined}>
    //   <Box className="flex flex-row items-start gap-4 w-full">
    //     <Box
    //       className="h-3 rounded-full w-3 mt-2"
    //       style={{ backgroundColor: `#${post.category_color}` }} />
    //     <Box className="flex flex-col">
    //       <Text
    //         bold
    //         className="text-gray-700">
    //         {truncate(post.topic_title, 40)}
    //       </Text>
    //       <Text>
    //         {truncate(post.raw, 50)}
    //       </Text>
    //       <Box className="flex flex-row items-center justify-between">
    //         <Text
    //           className="text-gray-400"
    //           size="sm">
    //           {dayjs(post.created_at)
    //             .format('MMM DD, YYYY')}
    //         </Text>
    //         <Text
    //           className="text-gray-400"
    //           size="sm">
    //           {post.reply_count}
    //           {' '}
    //           replies
    //         </Text>
    //       </Box>
    //     </Box>
    //   </Box>
    // </A>
  );
};

export default ForumPost;