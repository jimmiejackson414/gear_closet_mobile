import React from 'react';
import { Card, Text } from '@/components/ui';
import type { Tables } from '@/types';

interface Props {
  data?: Tables<'trips'>[];
}

const UpcomingTripsWidget: React.FC<Props> = () => {
  return (
    <Card
      size="lg"
      variant="elevated">
      <Text>UpcomingTripsWidget</Text>
    </Card>
  );
};

export default UpcomingTripsWidget;