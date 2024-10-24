import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'trip_details'>[];
}

const TripDetailsWidget: React.FC<Props> = ({ data }) => {
  console.log('trip details: ', data);
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <Card
      contentStyle={styles.card}
      mode="outlined">
      <Text>TripDetailsWidget</Text>
    </Card>
  );
};

export default TripDetailsWidget;

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    padding: 24,
  },
}));