import { CalendarCheck, ChevronRight } from 'lucide-react-native';
import { Fragment } from 'react';
import { Link } from 'expo-router';
// import { Box, Button, Card, Divider, Icon, Text } from '@/components/ui';
import { Text } from 'react-native-paper';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'trip_friends'>[];
}

const InvitationsWidget: React.FC<Props> = ({ data }) => (
  <Text>Invitations Widget</Text>
  // <Card
  //   size="lg"
  //   variant="elevated">
  //   <Box className="items-center flex-row gap-4">
  //     <Icon
  //       as={CalendarCheck}
  //       className="text-primary-500"
  //       size="xl" />
  //     <Text
  //       bold
  //       size="lg">
  //       Invitations
  //     </Text>
  //   </Box>
  //   {!data.length ? (
  //     <Text className="text-center mt-4">
  //       You don't have any pending invitations
  //     </Text>
  //   ) : (
  //     <Box className="mt-4">
  //       {data.map(( invitation, index ) => (
  //         <Fragment key={invitation.id}>
  //           <Link
  //             asChild
  //             href="/(protected)/(drawer)/planning"
  //             push>
  //             <Button
  //               className="items-center flex-row justify-between"
  //               key={invitation.id}
  //               size="xs"
  //               variant="link">
  //               <Box style={{ flexDirection: 'row', gap: 8 }}>
  //                 <Icon
  //                   as={ChevronRight}
  //                   className="mt-0.5" />
  //                 <Text>
  //                   { `You've been invited by ${invitation.id} to join the ${invitation.trip_id} trip` }
  //                 </Text>
  //               </Box>
  //             </Button>
  //           </Link>
  //           {index < data.length - 1 && <Divider className="my-4" />}
  //         </Fragment>
  //       ))}
  //     </Box>
  //   )}
  // </Card>
);

export default InvitationsWidget;