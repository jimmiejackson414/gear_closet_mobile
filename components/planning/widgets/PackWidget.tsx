import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import type { ExtendedPack } from '@/types/helpers';

interface Props {
  data?: ExtendedPack;
}

const PackWidget: React.FC<Props> = ({ data }) => {
  console.log('pack: ', data);
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <Card
      contentStyle={styles.card}
      mode="outlined">
      <Text>PackWidget</Text>
    </Card>
  );
};

export default PackWidget;

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    padding: 24,
  },
}));