import React from 'react';
import { Card, Text } from '@/components/ui';
import type { Tables } from '@/types';

interface Props {
  data?: Tables<'trip_friends'>[];
}

const InvitationsWidget: React.FC<Props> = () => {
  return (
    <Card
      size="lg"
      variant="elevated">
      <Text>InvitationsWidget</Text>
    </Card>
  );
};

export default InvitationsWidget;