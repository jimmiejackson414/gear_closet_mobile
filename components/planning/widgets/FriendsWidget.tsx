import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
import { useAppTheme } from '@/context/ThemeProvider';
import { makeStyles } from '@/helpers';
import type { Tables } from '@/types';

interface Props {
  data: Tables<'trip_friends'>[];
}

const FriendsWidget: React.FC<Props> = ({ data }) => {
  console.log('friends: ', data);
  const { theme } = useAppTheme();
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
        title="Friends"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant="bodyLarge" />
      <Card.Content>
        <View>
          <Text>
            Friends Content
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

export default FriendsWidget;

const useStyles = makeStyles(theme => ({ card: { backgroundColor: theme.colors.onPrimary } }));