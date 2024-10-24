import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
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
      elevation={0}
      mode="elevated"
      style={styles.card}>
      <Card.Title
        left={() => (
          <Icon
            color={theme.colors.primary}
            size={24}
            source="calendar-check-outline" />
        )}
        leftStyle={{ marginRight: 0 }}
        title="Shopping List"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant="bodyLarge" />
      <Card.Content>
        <View>
          <Text>
            Shopping List Content
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default ShoppingListWidget;

const useStyles = makeStyles(theme => ({ card: { backgroundColor: theme.colors.onPrimary } }));