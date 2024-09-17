import { useState } from 'react';
import { Lock, MessagesSquare } from 'lucide-react-native';
import { useClickOutside } from 'react-native-click-outside';
import { Text } from 'react-native-paper';
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
  // const ref = useClickOutside<View>(() => setOpen(false));

  return (
    <Text>Forums Widget</Text>
    // <Card
    //   size="lg"
    //   variant="elevated">
    //   <Box className="items-center flex-row gap-4">
    //     <Icon
    //       as={MessagesSquare}
    //       className="text-primary-500"
    //       size="xl" />
    //     <Text
    //       bold
    //       className="flex-grow"
    //       size="lg">
    //       Latest From The Community
    //     </Text>
    //     {!isPaidMember && (
    //       <View ref={ref}>
    //         <Tooltip
    //           isOpen={isOpen}
    //           placement="left"
    //           trigger={triggerProps => (
    //             <Button
    //               {...triggerProps}
    //               onPress={() => setOpen(o => !o)}
    //               size="sm"
    //               variant="link">
    //               <Icon
    //                 as={Lock}
    //                 className="text-gray-600"
    //                 size="xl" />
    //             </Button>
    //           )}>
    //           <TooltipContent>
    //             <TooltipText size="lg">
    //               Upgrade to access the forums
    //             </TooltipText>
    //           </TooltipContent>
    //         </Tooltip>
    //       </View>
    //     )}
    //   </Box>
    //   {!data ? (
    //     <Text className="mt-4 text-center">An error occurred while fetching from the forums.</Text>
    //   ) : (
    //     <Box className="mt-8">
    //       {data.latest_posts.map(post => (
    //         <VStack
    //           className="mb-8"
    //           key={post.id}
    //           space="lg">
    //           <ForumPost post={post} />
    //         </VStack>
    //       ))}
    //       <Grid
    //         _extra={{ className: 'grid-cols-2' }}
    //         className="gap-4">
    //         {data.categories.map(category => (
    //           <GridItem
    //             _extra={{ className: 'col-span-1' }}
    //             className="border border-gray-200 gap-4 items-center p-4 rounded-2xl"
    //             key={category.id}>
    //             <Grid
    //               _extra={{ className: 'grid-cols-[auto,1fr]' }}
    //               className="gap-4 items-center">
    //               <Box
    //                 className="h-3 rounded-full w-3"
    //                 style={{ backgroundColor: `#${category.color}` }} />
    //               <Box className="flex justify-center flex-col">
    //                 <Text bold>
    //                   {category.name}
    //                 </Text>
    //                 <Text className="text-gray-400">
    //                   {`${category.topic_count} topics`}
    //                 </Text>
    //               </Box>
    //             </Grid>
    //           </GridItem>
    //         ))}
    //       </Grid>
    //     </Box>
    //   )}
    // </Card>
  );
};

export default ForumsWidget;
