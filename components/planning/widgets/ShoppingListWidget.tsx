import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'shopping_list_items'>[];
}

const ShoppingListWidget: React.FC<Props> = ({ data }) => {
  console.log('shopping items: ', data);
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <Card
      contentStyle={styles.card}
      mode="outlined">
      <Text>ShoppingListWidget</Text>
    </Card>
  );
};

export default ShoppingListWidget;

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    padding: 24,
  },
}));