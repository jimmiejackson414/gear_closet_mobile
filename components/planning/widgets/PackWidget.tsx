import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';
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
        title="Pack"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant="bodyLarge" />
      <Card.Content>
        <View>
          <Text>
            Pack Widget Content
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const useStyles = makeStyles(theme => ({ card: { backgroundColor: theme.colors.onPrimary } }));

export default PackWidget;