import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { makeStyles } from '@/helpers';
import { useAppTheme } from '@/hooks';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'todos'>[];
}

const TodosWidget: React.FC<Props> = ({ data }) => {
  console.log('todos: ', data);
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return (
    <Card
      contentStyle={styles.card}
      mode="outlined">
      <Text>TodosWidget</Text>
    </Card>
  );
};

export default TodosWidget;

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.colors.surface,
    padding: 24,
  },
}));