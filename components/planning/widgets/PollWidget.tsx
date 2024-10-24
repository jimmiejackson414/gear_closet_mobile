import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import type { ExtendedPoll } from '@/types/helpers';

interface Props {
  data?: ExtendedPoll;
}

const PollWidget: React.FC<Props> = ({ data }) => {
  console.log('poll: ', data);
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <Card
      contentStyle={styles.card}
      mode="outlined">
      <Text>PollWidget</Text>
    </Card>
  );
};

export default PollWidget;

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    padding: 24,
  },
}));