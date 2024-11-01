import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, CardContent, CardHeader, CardTitle, Text, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { LockIcon, MessageSquareTextIcon } from '@/lib/icons';
import { useIsPaidMember } from '@/services/profile';
import ForumPost from './ForumPost';
import type { ForumResponse } from '@/services/dashboard';

interface Props {
  data?: ForumResponse | null;
}

const ForumsWidget: React.FC<Props> = ({ data }) => {
  const { data: isPaidMember } = useIsPaidMember();
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center gap-6">
        <MessageSquareTextIcon className="stroke-primary" />
        <CardTitle className="font-bold">Latest From The Community</CardTitle>
        {!isPaidMember ? (
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button variant="ghost">
                <LockIcon className="stroke-card-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent insets={contentInsets}>
              <Text>
                This feature is only available to paid members.
              </Text>
            </TooltipContent>
          </Tooltip>
        ) : null }
      </CardHeader>
      <CardContent>
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
                    <Text className="text-bold">
                      {category.name}
                    </Text>
                    <Text>
                      {`${category.topic_count} topics`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
};

export default ForumsWidget;
