import { useState } from 'react';
import { Lock, MessagesSquare } from 'lucide-react-native';
import { useClickOutside } from 'react-native-click-outside';
import { Button, Card, Icon, IconButton, Text, Tooltip, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import ForumPost from './ForumPost';
// import { Box, Button, Card, Grid, GridItem, Icon, Text, Tooltip, TooltipContent, TooltipText, VStack, View } from '@/components/ui';
import { ForumResponse } from '@/services/dashboard/types';
import useAppStore from '@/stores/appStore';

interface Props {
  data?: ForumResponse | null;
}

const ForumsWidget: React.FC<Props> = ({ data }) => {
  const [isOpen, setOpen] = useState(false);
  const isPaidMember = useAppStore(state => state.isPaidMember());
  const ref = useClickOutside<View>(() => setOpen(false));

  const theme = useTheme();
  return (
    <Card mode="elevated">
      <View style={{
        alignItems: 'center', flexDirection: 'row', gap: 16,
      }}>
        <Icon
          color={theme.colors.primary}
          size={24}
          source={{ uri: MessagesSquare }} />
        <Text
          style={{ fontWeight: 'bold', flexGrow: 1 }}
          variant="bodyLarge">
          Latest From The Community
        </Text>
        {!isPaidMember && (
          <Tooltip title="Upgrade to access the forums">
            <IconButton
              icon={({ size }) => <Icon
                color={theme.colors.onSurfaceVariant}
                size={size}
                source={{ uri: Lock }} />}
              onPress={() => setOpen(o => !o)}
              selected
              size={24} />
          </Tooltip>
          // <View ref={ref}>
          //   <Tooltip
          //     isOpen={isOpen}
          //     placement="left"
          //     trigger={triggerProps => (
          //       <Button
          //         {...triggerProps}
          //         onPress={() => setOpen(o => !o)}
          //         size="sm"
          //         variant="link">
          //         <Icon
          //           as={Lock}
          //           className="text-gray-600"
          //           size="xl" />
          //       </Button>
          //     )}>
          //     <TooltipContent>
          //       <TooltipText size="lg">
          //         Upgrade to access the forums
          //       </TooltipText>
          //     </TooltipContent>
          //   </Tooltip>
          // </View>
        )}
      </View>
      {!data ? (
        <Text style={{ marginTop: 16, textAlign: 'center' }}>An error occurred while fetching from the forums.</Text>
      ) : (
        <View style={{ marginTop: 24 }}>
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
          {/* <Grid
            _extra={{ className: 'grid-cols-2' }}
            className="gap-4">
            {data.categories.map(category => (
              <GridItem
                _extra={{ className: 'col-span-1' }}
                className="border border-gray-200 gap-4 items-center p-4 rounded-2xl"
                key={category.id}>
                <Grid
                  _extra={{ className: 'grid-cols-[auto,1fr]' }}
                  className="gap-4 items-center">
                  <Box
                    className="h-3 rounded-full w-3"
                    style={{ backgroundColor: `#${category.color}` }} />
                  <Box className="flex justify-center flex-col">
                    <Text bold>
                      {category.name}
                    </Text>
                    <Text className="text-gray-400">
                      {`${category.topic_count} topics`}
                    </Text>
                  </Box>
                </Grid>
              </GridItem>
            ))}
          </Grid> */}
        </View>
      )}
    </Card>
  );
};

export default ForumsWidget;
