import { Fragment } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { Button, Card, CardContent, CardHeader, CardTitle, Separator, Text } from '@/components/ui';
import { ChevronRightIcon, MailsIcon } from '@/lib/icons';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'trip_friends'>[];
}

const InvitationsWidget: React.FC<Props> = ({ data }) => (
  <Card className="w-full">
    <CardHeader className="flex-row items-center gap-6">
      <MailsIcon className="stroke-primary" />
      <CardTitle className="font-bold">Invitations</CardTitle>
    </CardHeader>
      
    <CardContent>
      {!data.length ? (
        <View>
          <Text style={{ textAlign: 'center' }}>
            You don't have any pending invitations
          </Text>
        </View>
      ) : (
        <View>
          {data.map(( invitation, index ) => (
            <Fragment key={invitation.id}>
              <Link
                asChild
                href="/(protected)/(drawer)/planning"
                push>
                <Button
                  className="!px-0"
                  variant="ghost">
                  <View className="flex-row justify-between items-center w-full">
                    <View className="flex-row items-center gap-3">
                      <ChevronRightIcon size={16} />
                      <Text>
                        { `You've been invited by ${invitation.id} to join the ${invitation.trip_id} trip` }
                      </Text>
                    </View>
                  </View>
                </Button>
              </Link>
              {index < data.length - 1 && <Separator className="my-2" />}
            </Fragment>
          ))}
        </View>
      )}
    </CardContent>
  </Card>
);

export default InvitationsWidget;