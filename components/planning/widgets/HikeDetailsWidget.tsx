import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import type { Tables } from '@/types';

interface Props {
  data: (Tables<'trip_details'>)[];
}

const HikeDetailsWidget: React.FC<Props> = ({ data }) => {
  console.log('hike details: ', data);
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <Card
      contentStyle={styles.card}
      mode="outlined">
      <Text>HikeDetailsWidget</Text>
    </Card>
  );
};

export default HikeDetailsWidget;

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    padding: 24,
  },
}));