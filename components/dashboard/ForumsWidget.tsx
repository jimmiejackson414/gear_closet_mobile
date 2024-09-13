import { useState } from 'react';
import { Lock, MessagesSquare } from 'lucide-react-native';
import { useClickOutside } from 'react-native-click-outside';
import ForumPost from './ForumPost';
import { Box, Button, Card, Icon, Text, Tooltip, TooltipContent, TooltipText, VStack, View } from '@/components/ui';
import { ForumResponse } from '@/services/dashboard/types';
import useAppStore from '@/stores/appStore';

interface Props {
  data?: ForumResponse | null;
}

const ForumsWidget: React.FC<Props> = ({ data }) => {
  const [isOpen, setOpen] = useState(false);
  const isPaidMember = useAppStore(state => state.isPaidMember());
  const ref = useClickOutside<View>(() => setOpen(false));

  return (
    <Card
      size="lg"
      variant="elevated">
      <Box className="items-center flex-row gap-4">
        <Icon
          as={MessagesSquare}
          className="text-primary-500"
          size="xl" />
        <Text
          bold
          className="flex-grow"
          size="lg">
          Latest From The Community
        </Text>
        {/* <View ref={ref}>
          {!isPaidMember && (
            <Tooltip
              isOpen={isOpen}
              placement="left"
              trigger={triggerProps => (
                <Button
                  {...triggerProps}
                  onPress={() => setOpen(o => !o)}
                  size="sm"
                  variant="link">
                  <Icon
                    as={Lock}
                    className="text-gray-600"
                    size="xl" />
                </Button>
              )}>
              <TooltipContent>
                <TooltipText size="lg">Upgrade to access the forums</TooltipText>
              </TooltipContent>
            </Tooltip>
          )}
        </View> */}
        <View ref={ref}>
          <Tooltip
            isOpen={isOpen}
            placement="left"
            trigger={triggerProps => (
              <Button
                {...triggerProps}
                onPress={() => setOpen(o => !o)}
                size="sm"
                variant="link">
                <Icon
                  as={Lock}
                  className="text-gray-600"
                  size="xl" />
              </Button>
            )}>
            { !isPaidMember && (
              <TooltipContent>
                <TooltipText size="lg">Upgrade to access the forums</TooltipText>
              </TooltipContent>
            )}
          </Tooltip>
        </View>
      </Box>
      {!data ? (
        <VStack
          className="mt-4 items-center"
          space="lg">
          <Text className="text-center">An error occurred while fetching from the forums.</Text>
        </VStack>
      ) : (
        <Box>
          {data.latest_posts.map(post => (
            <VStack
              className="mt-4"
              key={post.id}
              space="lg">
              <ForumPost post={post} />
            </VStack>
          ))}
        </Box>
      )}
    </Card>
  );
};

export default ForumsWidget;
