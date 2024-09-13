import { A } from '@expo/html-elements';
import { useMemo } from 'react';
import { Avatar, AvatarImage, Box, Text } from '../ui';
import useAppStore from '@/stores/appStore';
import type { ForumPost as ForumPostType } from '@/types/helpers';
import { truncate } from '@/helpers';

interface Props {
  post: ForumPostType;
}

const ForumPost: React.FC<Props> = ({ post }) => {
  const isPaidMember = useAppStore(state => state.isPaidMember());

  const avatarSrc = useMemo(() => {
    return post.avatar_template.replace('{size}', '50');
  }, [post.avatar_template]);

  return (
    <A
      className="w-full"
      href={isPaidMember ? `${process.env.EXPO_PUBLIC_FORUMS_URL}/${post.topic_slug}` : undefined}>
      <Box className="flex items-center gap-4 w-full">
        <Box
          className="h-3 rounded-full w-3"
          style={{ backgroundColor: post.categoryColor }} />
        <Avatar className="rounded-full w-12 h-12">
          <AvatarImage source={{ uri: avatarSrc }} />
        </Avatar>
        <Box className="flex grow flex-col">
          <Box className="flex items-center gap-4">
            <Text
              bold
              className="text-gray-700">
              {truncate(post.topic_title, 25)}
            </Text>
          </Box>
        </Box>
      </Box>
    </A>
  );
};

export default ForumPost;