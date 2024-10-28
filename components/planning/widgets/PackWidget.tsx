import { View } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import PackChart from '@/components/common/PackChart';
import { useAppTheme } from '@/context/ThemeProvider';
import { makeStyles } from '@/helpers';
import type { ExtendedPack } from '@/types/helpers';

interface Props {
  data?: ExtendedPack;
}

const PackWidget: React.FC<Props> = ({ data }) => {
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
        title="Pack"
        titleStyle={{ fontWeight: 'bold', marginBottom: 0 }}
        titleVariant="bodyLarge" />
      <Card.Content>
        <View>
          <PackChart pack={data} />
        </View>
      </Card.Content>
    </Card>
  );
};

const useStyles = makeStyles(theme => ({ card: { backgroundColor: theme.colors.onPrimary } }));

export default PackWidget;